import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import SteamProvider from 'steam-next-auth'
import { admin } from '../../../../../lib/firebase-admin'

export const { handlers, auth, signIn, signOut } = NextAuth(req => {
	const host = req?.headers.get('host') || 'voidpresence.site'
	const protocol = host.includes('localhost') ? 'http://' : 'https://'
	const steamReq = req ?? new Request(`${protocol}${host}`)

	return {
		providers: [
			GitHub({
				clientId: process.env.GITHUB_ID!,
				clientSecret: process.env.GITHUB_SECRET!,
				authorization: {
					params: {
						scope: 'read:user user:email',
						prompt: 'select_account',
					},
				},
			}),
			Google({
				clientId: process.env.GOOGLE_ID!,
				clientSecret: process.env.GOOGLE_SECRET!,
				authorization: {
					params: {
						scope: 'openid email profile',
						prompt: 'select_account',
					},
				},
			}),
			SteamProvider(steamReq, {
				clientSecret: process.env.NEXTAUTH_STEAM_SECRET!,
				callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/fuckoffnextauth`,
				authorization: {
					params: {
						scope: 'read:user user:email',
						prompt: 'select_account',
					},
				},
			}),
		],
		session: {
			strategy: 'jwt',
		},
		pages: {
			signIn: '/signin',
		},
		callbacks: {
			async jwt({ token, account, user }) {
				if (account && user) {
					token.accessToken = account.access_token
					token.id = user.id ?? token.sub
				}

				if (token.id) {
					try {
						token.firebaseToken = await admin
							.auth()
							.createCustomToken(String(token.id))
					} catch (error) {
						console.error(error)
					}
				}

				return token
			},
			async session({ session, token }) {
				session.accessToken = token.accessToken
				session.firebaseToken = token.firebaseToken

				if (session.user) {
					session.user.id = token.id ?? token.sub ?? ''
				}

				return session
			},
		},
	}
})

export const { GET, POST } = handlers
