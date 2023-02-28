import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const scopes = ['identify'].join(' ')

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            authorization: {params: {scope: scopes}},
        }),
    ],
    callbacks: {
        async session ({ session, user, token }) {
            if (session?.user) {
                session.user.id = token.sub;
            }

            return session;
        },
    },
};

export default NextAuth(authOptions)