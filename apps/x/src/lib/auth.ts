import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import "next-auth/jwt";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Twitter]
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
