import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-placeholder",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "mysetups-nextauth-secret-key-at-least-32-characters-long",
  debug: process.env.NODE_ENV === "development",
};