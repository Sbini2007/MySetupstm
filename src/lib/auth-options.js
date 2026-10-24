import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { isAdminEmail } from "@/lib/admin-emails";
import {
  authenticateServerUser,
  getServerUserByEmail,
  getServerUsers,
  patchServerUserOAuth,
  upsertServerUser,
} from "@/lib/server-store";

const MAX_SESSION_IMAGE_BYTES = 200 * 1024;
const MAX_SESSION_IMAGE_LENGTH = 4096;

function sanitizeSessionImage(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > MAX_SESSION_IMAGE_LENGTH) return undefined;
  if (trimmed.startsWith("data:image/") && Buffer.byteLength(trimmed, "utf8") > MAX_SESSION_IMAGE_BYTES) {
    return undefined;
  }
  return trimmed;
}

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export const authOptions = {
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "select_account" } },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email e password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = credentials?.password;
        if (!email || typeof password !== "string" || !password || password.length > 128) return null;
        const user = await authenticateServerUser(email, password);
        if (!user) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.name || user.email.split("@")[0],
          image: user.image || user.oauthImage || undefined,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_MAX_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_MAX_AGE,
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (user?.email) {
        try {
          const existing = getServerUserByEmail(user.email);
          if (existing) {
            patchServerUserOAuth(user.email, {
              oauthName: user.name,
              oauthImage: user.image,
              provider: account?.provider,
            });
          } else {
            upsertServerUser({
              email: user.email,
              name: user.name || user.email.split("@")[0],
              image: user.image,
              oauthName: user.name,
              oauthImage: user.image,
              provider: account?.provider,
            });
          }
        } catch (e) {
          console.error("signIn user store", e);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      const safeUserImage = sanitizeSessionImage(user?.image);
      if (user?.email) {
        token.email = user.email;
        token.name = user.name;
        token.picture = safeUserImage || token.picture;
      }
      const email = token.email;
      if (email) {
        const row = getServerUsers().find((u) => String(u.email || "").toLowerCase() === String(email).toLowerCase());
        if (row) {
          token.premium = Boolean(row.premium);
          token.admin = Boolean(row.admin || isAdminEmail(email));
          token.role = row.role || (token.admin ? "admin" : token.premium ? "subscriber" : "user");
          const displayName = row.name && String(row.name).trim() ? String(row.name).trim() : row.oauthName || token.name;
          token.name = displayName || token.name || email.split("@")[0];
          const customPic = sanitizeSessionImage(row.image);
          const oauthPic = sanitizeSessionImage(row.oauthImage);
          const sessionPic = sanitizeSessionImage(token.picture);
          token.picture = customPic || oauthPic || sessionPic || undefined;
        }
      }
      if (token.picture !== undefined) {
        const safePicture = sanitizeSessionImage(token.picture);
        if (safePicture) {
          token.picture = safePicture;
        } else {
          delete token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.premium = Boolean(token.premium);
        session.user.admin = Boolean(token.admin);
        session.user.role = token.role || (token.admin ? "admin" : token.premium ? "subscriber" : "user");
        if (token.name) session.user.name = token.name;
        const safeImage = sanitizeSessionImage(token.picture);
        if (safeImage) {
          session.user.image = safeImage;
        } else {
          delete session.user.image;
        }
      }
      return session;
    },
  },
};
