'use client'

import type { Session } from 'next-auth'
import { useEffect, useMemo, useState } from 'react'
import type { Config } from '../../../service/firebase'
import { onConfigsChange } from '../../../service/firebase'
import { ProfileConfigsClient } from './profile-configs-client'
import { ProfileDetailsClient } from './profile-details-client'

type Props = {
	initialConfigs: Config[]
	user: any
	session: Session
	userId: string
}

export function ProfileContainerClient({ initialConfigs, user, session, userId }: Props) {
	const [configs, setConfigs] = useState<Config[]>(initialConfigs)

	useEffect(() => {
		const unsubscribe = onConfigsChange(
			next => {
				setConfigs(next)
			},
			undefined,
			userId
		)

		return () => {
			unsubscribe()
		}
	}, [userId])

	const lastConfig = useMemo(() => (configs.length ? configs[configs.length - 1] : null), [configs])

	return (
		<>
			<ProfileDetailsClient
				authorID={user.id}
				user={user}
				session={session}
				lastConfig={lastConfig}
			/>
			<ProfileConfigsClient configs={configs} userId={userId} />
		</>
	)
}
