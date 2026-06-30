'use client'

import { UseFirebaseAuth } from '@hook/use-firebase-auth'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function NextAuthProvider({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<UseFirebaseAuth />
			{children}
		</SessionProvider>
	)
}
