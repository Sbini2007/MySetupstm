import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-placeholder",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "discord-placeholder",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "discord-placeholder",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "mysetups-nextauth-secret-key-at-least-32-characters-long",
  debug: process.env.NODE_ENV === "development",
};