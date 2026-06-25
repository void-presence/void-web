'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { createUserIfNotExists } from '../../service/firebase'

export function SaveUserOnMount() {
	const { data: session } = useSession()
	const user = session?.user as any

	useEffect(() => {
		if (!user?.id) return
		createUserIfNotExists(user.id, user.name, user.image, session?.provider).catch(console.error)
	}, [user?.id, user?.name])

	return null
}
