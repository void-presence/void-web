'use client'

import type { Config } from '@service/firebase'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import RpcPreview from '../rpc-preview/rpc-user'
import styles from './configs-grid.module.scss'

type CustomRpcPreviewProps = {
	config: Config
	previewIndex: number
	avatarSrc: string
}

function CustomRpcPreview({ config, previewIndex, avatarSrc }: CustomRpcPreviewProps) {
	const configData: any = config.configData
	const cycles = configData.cycles ?? []
	const images = configData.imageCycles ?? []
	const buttonPairs = configData.buttonPairs ?? []

	const maxLen = Math.max(cycles.length || 1, images.length || 1, buttonPairs.length || 1)

	const localIndex = maxLen ? previewIndex % maxLen : 0

	const cycleIndex = localIndex % (cycles.length || 1)
	const imageIndex = localIndex % (images.length || 1)
	const buttonIndex = localIndex % (buttonPairs.length || 1)

	const cycle = cycles[cycleIndex] || { details: '', state: '' }
	const image = images[imageIndex] || { largeImage: '' }
	const buttons = buttonPairs[buttonIndex] ?? {
		label1: '',
		url1: '',
	}

	return (
		<div className={styles.rpc_card_preview}>
			<div className={styles.rpc_card_preview_inner}>
				<RpcPreview
					discriminator={`#${config.authorId!.slice(0, 4)}` || '#0001'}
					username={config.author || 'User'}
					avatarSrc={avatarSrc}
					activityType={config.title}
					currentCycle={cycle}
					currentImage={image}
					currentButtons={buttons}
					currentIndex={localIndex}
					config={configData}
				/>
			</div>
		</div>
	)
}

function SkeletonCard() {
	return (
		<div className={styles.skeleton_card_wrap}>
			<div className={styles.skeleton_card}>
				<div className={styles.skeleton_card_header}>
					<div className={styles.skeleton_title}></div>
				</div>
				<div className={styles.skeleton_rpc_preview}></div>
				<div className={styles.skeleton_card_actions}>
					<div className={styles.skeleton_download_tag}></div>
					<div className={styles.skeleton_action_buttons}>
						<div className={styles.skeleton_btn_primary}></div>
						<div className={styles.skeleton_btn_secondary}></div>
					</div>
				</div>
			</div>
		</div>
	)
}

function getNextTick(prev: number) {
	return prev + 1
}

type Props = {
	configs: Config[]
	loading?: boolean
}

export function ConfigsGrid({ configs, loading }: Props) {
	const [previewTick, setPreviewTick] = useState(0)
	const [mounted, setMounted] = useState(false)
	const [animateColors, setAnimateColors] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		setTimeout(() => {
			setAnimateColors(true)
		}, 100)

		const interval = setInterval(() => {
			setPreviewTick(prev => getNextTick(prev))
		}, 3000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	const showSkeleton = loading && !configs.length

	const handleOpenInApp = async (config: Config) => {
		window.location.href = `voidpresence://import-config?title=${encodeURIComponent(
			config.title
		)}&data=${encodeURIComponent(JSON.stringify(config.configData))}`

		try {
			await fetch(`/api/configs/${config.id}/track-open`, {
				method: 'POST',
			})
		} catch (err) {
			console.error('Failed to track open in app', err)
		}
	}

	return (
		<section id='configs-content' className={styles.page_section}>
			{showSkeleton ? (
				<div className={styles.theme_listings}>
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
				</div>
			) : configs.length === 0 ? (
				<div className={styles.empty_state}>
					<p>No configs found.</p>
				</div>
			) : (
				<div className={styles.cards_grid}>
					{configs.map((config, index) => {
						const highlight = animateColors ? config.averageColor || '#5b5b5b' : '#5b5b5b'
						const hasColor = animateColors && Boolean(config.averageColor)
						const baseIndex = mounted ? previewTick + index : 0
						const borderColor = `${highlight}66`
						const baseBg = 'rgba(26, 26, 26, 0.96)'
						const avatarSrc = config.authorAvatar || '/logo.png'

						return (
							<div
								key={config.id}
								className={`${styles.card_wrap} ${hasColor ? styles.card_wrap_hasColor : ''}`}
								style={{
									background: baseBg,
									borderColor,
									['--card-highlight' as any]: highlight,
								}}
							>
								<div className={styles.card}>
									<div className={styles.card_header}>
										<div className={styles.card_title}>
											<h3 className={styles.card_title}>{config.title}</h3>
										</div>
										<div className={styles.download_tag}>
											<Download size={14} className={styles.download_icon} />
											<span className={styles.download_text}>
												{config.downloads.toLocaleString()}
											</span>
										</div>
									</div>

									<CustomRpcPreview
										config={config}
										previewIndex={baseIndex}
										avatarSrc={avatarSrc}
									/>

									<div className={styles.card_actions}>
										<div className={styles.card_buttons}>
											<a className={styles.btn_primary} onClick={() => handleOpenInApp(config)}>
												Open in app
											</a>
											<a className={styles.btn_secondary} href={`/configs/${config.id}`}>
												Show details
											</a>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</section>
	)
}
