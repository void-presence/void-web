import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
	interface Session {
		accessToken?: string
		firebaseToken?: string
		user: {
			id: string
		} & DefaultSession['user']
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
