'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import { UseFirebaseAuth } from '../../hook/use-firebase-auth'

export function NextAuthProvider({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<UseFirebaseAuth />
			{children}
		</SessionProvider>
	)
}
