import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required for authentication.`);
  }
  return value;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    DiscordProvider({
      clientId: getEnv("DISCORD_CLIENT_ID"),
      clientSecret: getEnv("DISCORD_CLIENT_SECRET"),
    }),
  ],

  secret: getEnv("NEXTAUTH_SECRET"),
  debug: process.env.NODE_ENV === "development",
};