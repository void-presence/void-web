'use client'

import styles from '@/rpc-preview/rpc-preview.module.scss'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface StatusCycle {
	text: string
}

interface StatusConfigData {
	statusCycles: StatusCycle[]
}

interface StatusPreviewProps {
	username?: string
	discriminator?: string
	activityType?: string
	currentStatus?: StatusCycle
	currentIndex?: number
	config?: Partial<StatusConfigData>
	avatarSrc?: string
}

const FALLBACK_AVATAR = '/logo.png'

const StatusUser = ({
	username = 'Devollox',
	discriminator = '#0001',
	avatarSrc,
}: {
	username?: string
	discriminator?: string
	avatarSrc?: string
}) => {
	const [imgSrc, setImgSrc] = useState(avatarSrc || FALLBACK_AVATAR)

	useEffect(() => {
		setImgSrc(avatarSrc || FALLBACK_AVATAR)
	}, [avatarSrc])

	return (
		<div className={styles.rpc_user}>
			<div className={styles.rpc_avatar}>
				<div className={styles.avatar_placeholder}>
					<Image
						src={imgSrc}
						alt='Avatar'
						width={48}
						height={48}
						unoptimized
						onError={() => setImgSrc(FALLBACK_AVATAR)}
					/>
				</div>
				<div className={styles.status_indicator} />
			</div>
			<div>
				<div className={styles.username}>{username}</div>
				<div className={styles.discriminator}>{discriminator}</div>
			</div>
		</div>
	)
}

const StatusDetails = ({
	currentStatus = { text: 'No status' },
	currentIndex = 0,
	config,
}: {
	currentStatus?: StatusCycle
	currentIndex?: number
	config?: Partial<StatusConfigData>
}) => {
	const cycles = config?.statusCycles ?? []
	const maxLen = cycles.length || 1
	const clampedIndex = (((currentIndex ?? 0) % maxLen) + maxLen) % maxLen
	const progress = maxLen > 0 ? Math.round(((clampedIndex + 1) / maxLen) * 100) : 100

	return (
		<div className={styles.activity_details}>
			<div className={styles.details_title}>{currentStatus.text}</div>
			<div className={styles.progress_bar}>
				<div className={styles.progress_bg}>
					<div className={styles.progress_fill} style={{ width: `${progress}%` }} />
				</div>
				<div className={styles.progress_time}>{progress}%</div>
			</div>
		</div>
	)
}

const StatusActivity = ({
	activityType,
	currentStatus,
	currentIndex,
	config,
}: {
	activityType?: string
	currentStatus?: StatusCycle
	currentIndex?: number
	config?: Partial<StatusConfigData>
}) => (
	<div className={styles.rpc_activity}>
		<div className={styles.activity_type}>{activityType}</div>
		<div className={styles.activity_content}>
			<StatusDetails currentStatus={currentStatus} currentIndex={currentIndex} config={config} />
		</div>
	</div>
)

export default function StatusPreview({
	username,
	discriminator,
	activityType,
	currentStatus,
	currentIndex,
	config,
	avatarSrc,
}: StatusPreviewProps) {
	return (
		<div className={styles.rpc_preview}>
			<StatusUser username={username} discriminator={discriminator} avatarSrc={avatarSrc} />
			<StatusActivity
				activityType={activityType}
				currentStatus={currentStatus}
				currentIndex={currentIndex}
				config={config}
			/>
		</div>
	)
}
