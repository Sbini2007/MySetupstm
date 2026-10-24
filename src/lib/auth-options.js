import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { isAdminEmail } from "@/lib/admin-emails";
import { getServerUserByEmail, getServerUsers, patchServerUserOAuth, upsertServerUser } from "@/lib/server-store";

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
    CredentialsProvider({
      id: "credentials",
      name: "Account MySetups",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "pilota@mysetups.it" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const existing = getServerUserByEmail(email);

        if (existing) {
          if (existing.password && credentials.password && existing.password !== credentials.password) {
            throw new Error("Password errata");
          }
          return {
            id: String(existing.id || email),
            email: existing.email,
            name: existing.name || email.split("@")[0],
            image: existing.image,
            role: existing.role,
            admin: Boolean(existing.admin || isAdminEmail(email)),
            premium: Boolean(existing.premium || isAdminEmail(email)),
          };
        }

        // Auto-provision admin if signing in with authorized admin email
        if (isAdminEmail(email)) {
          upsertServerUser({
            email,
            name: email.split("@")[0],
            admin: true,
            role: "admin",
            premium: true,
            password: credentials.password || "",
            provider: "server-credentials",
          });
          const adminUser = getServerUserByEmail(email);
          return {
            id: String(adminUser?.id || email),
            email: adminUser.email,
            name: adminUser.name,
            role: "admin",
            admin: true,
            premium: true,
          };
        }

        // Standard user automatic registration on first credentials signin if valid
        upsertServerUser({
          email,
          name: email.split("@")[0],
          password: credentials.password || "",
          role: "user",
          premium: false,
          admin: false,
          provider: "server-credentials",
        });
        const created = getServerUserByEmail(email);
        return {
          id: String(created?.id || email),
          email: created.email,
          name: created.name,
          role: created.role,
          admin: created.admin,
          premium: created.premium,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "discord-client-id-placeholder",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "discord-client-secret-placeholder",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "mysetups-nextauth-secret-key-at-least-32-characters-long",
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
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
        maxAge: SESSION_MAX_AGE,
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
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
        } else if (isAdminEmail(email)) {
          token.admin = true;
          token.premium = true;
          token.role = "admin";
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
