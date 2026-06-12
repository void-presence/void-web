import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import admin from '../../../../../lib/firebase-admin'

declare module 'next-auth' {
	interface Session {
		accessToken?: string
		firebaseToken?: string
	}

	interface User {
		id: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string
		id?: string
		firebaseToken?: string
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account && user) {
				token.accessToken = account.access_token
				token.id = user.id ?? token.sub

				const firebaseToken = await admin.auth().createCustomToken(user.id)
				token.firebaseToken = firebaseToken
			}
			return token
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken ?? undefined
			session.firebaseToken = token.firebaseToken ?? undefined

			if (session.user) {
				session.user.id = token.id ?? token.sub ?? ''
			}

			return session
		},
	},
	pages: {
		signIn: '/signin',
	},
	session: {
		strategy: 'jwt',
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
