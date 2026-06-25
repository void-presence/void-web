'use client'

import Logo from '@public/logo.png'
import Image from 'next/image'
import RpcLabel from '../label'
import styles from './rpc-preview.module.scss'

interface Cycle {
	details: string
	state: string
}

interface ImageCycle {
	largeImage: string
}

interface ButtonPair {
	label1: string
	url1: string
	label2?: string
	url2?: string
}

interface Config {
	cycles: Array<{ details: string; state: string }>
}

interface Props {
	currentCycle: Cycle
	currentImage: ImageCycle
	currentButtons?: ButtonPair
	currentIndex: number
	config: Config
	username?: string
	discriminator?: string
	activityType?: string
	avatarSrc?: string
}

export default function RpcPreview({
	currentCycle,
	currentImage,
	currentButtons,
	currentIndex,
	config,
	username = 'Devollox',
	discriminator = '#0001',
	activityType = 'Void Presence',
	avatarSrc,
}: Props) {
	const buttons = []
	if (currentButtons) {
		buttons.push({ label: currentButtons.label1, url: currentButtons.url1 })
		if (currentButtons.label2 && currentButtons.url2) {
			buttons.push({ label: currentButtons.label2, url: currentButtons.url2 })
		}
	}

	return (
		<section id='rpc-preview-section' className={styles.rpc_section}>
			<div className={`${styles.page_section_inner} ${styles.rpc_inner}`}>
				<RpcLabel text='LIVE PRESENCE' />
				<div className={styles.rpc_preview}>
					<div className={styles.rpc_user}>
						<div className={styles.rpc_avatar}>
							<div className={styles.avatar_placeholder}>
								<Image src={avatarSrc || Logo} alt='Avatar' width={48} height={48} unoptimized />
							</div>
							<div className={styles.status_indicator} />
						</div>
						<div>
							<div className={styles.username}>{username}</div>
							<div className={styles.discriminator}>{discriminator}</div>
						</div>
					</div>

					<div className={styles.rpc_activity}>
						<div className={styles.activity_type}>{activityType}</div>
						<div className={styles.activity_content}>
							<div className={styles.activity_art}>
								<Image
									width={64}
									height={64}
									src={currentImage.largeImage}
									alt='Activity art'
									className={styles.large_art}
									unoptimized
								/>
								<div className={styles.art_overlay} />
							</div>
							<div className={styles.activity_details}>
								<div className={styles.details_title}>{currentCycle.details}</div>
								<div className={styles.details_state}>{currentCycle.state}</div>
								<div className={styles.progress_bar}>
									<div className={styles.progress_bg}>
										<div
											className={styles.progress_fill}
											style={{
												width: `${((currentIndex + 1) / config.cycles.length) * 100}%`,
											}}
										/>
									</div>
									<div className={styles.progress_time}>
										{Math.round(((currentIndex + 1) / config.cycles.length) * 100)}%
									</div>
								</div>
							</div>
						</div>

						{buttons.length > 0 && (
							<div className={styles.rpc_buttons}>
								{buttons.map((button, index) => (
									<a
										key={index}
										href={button.url}
										className={styles.rpc_btn}
										target='_blank'
										rel='noopener noreferrer'
									>
										{button.label}
									</a>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
