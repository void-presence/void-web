'use client'

import { Download, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import RpcPreview from '../../../components/rpc-preview/rpc-user'
import type { Config } from '../../../service/firebase'
import { onConfigsChange } from '../../../service/firebase'
import styles from './configs.module.css'

type Props = {
	initialConfigs?: Config[]
	initialSearchTerm: string
}

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

function filterConfigs(configs: Config[], searchTerm: string) {
	const term = searchTerm.toLowerCase()
	if (!term) return configs
	return configs.filter(
		config =>
			config.title.toLowerCase().includes(term) ||
			config.author.toLowerCase().includes(term) ||
			config.description.toLowerCase().includes(term)
	)
}

function sortConfigs(configs: Config[]) {
	return [...configs].sort((a, b) => {
		const aDownloads =
			typeof a.downloads === 'number' ? a.downloads : parseInt(String(a.downloads ?? '0')) || 0

		const bDownloads =
			typeof b.downloads === 'number' ? b.downloads : parseInt(String(b.downloads ?? '0')) || 0

		return bDownloads - aDownloads
	})
}

export function ConfigsClient({ initialConfigs = [], initialSearchTerm }: Props) {
	const [configs, setConfigs] = useState<Config[]>(initialConfigs)
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? '')
	const [previewTick, setPreviewTick] = useState(0)
	const [mounted, setMounted] = useState(false)
	const [loading, setLoading] = useState(true)
	const [animateColors, setAnimateColors] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const unsubscribe = onConfigsChange(next => {
			setConfigs(next)
			setLoading(false)
			setTimeout(() => {
				setAnimateColors(true)
			}, 100)
		})

		const interval = setInterval(() => {
			setPreviewTick(prev => getNextTick(prev))
		}, 3000)

		return () => {
			unsubscribe()
			clearInterval(interval)
		}
	}, [])

	const filteredConfigs = useMemo(() => filterConfigs(configs, searchTerm), [configs, searchTerm])

	const sortedConfigs = useMemo(() => sortConfigs(filteredConfigs), [filteredConfigs])

	const showSkeleton = loading && !sortedConfigs.length

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
		<>
			<div className={styles.themes_left_side}>
				<form className={styles.search_container} onSubmit={e => e.preventDefault()}>
					<Search className={styles.search_icon} />
					<input
						className={styles.search}
						type='text'
						placeholder='Search by title, author or description...'
						name='q'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
					{searchTerm && (
						<button
							type='button'
							className={styles.search_clear_btn}
							onClick={() => setSearchTerm('')}
						>
							<X size={16} />
						</button>
					)}
				</form>

				<div className={styles.stats_summary}>
					<span>{sortedConfigs.length} configs found</span>
				</div>
			</div>

			<div className={styles.themes_right_side}>
				<section id='configs-content' className={styles.page_section}>
					{showSkeleton ? (
						<div className={styles.theme_listings}>
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
						</div>
					) : sortedConfigs.length === 0 ? (
						<div className={styles.empty_state}>
							<p>No configs match your search. Try different keywords.</p>
						</div>
					) : (
						<div className={styles.cards_grid}>
							{sortedConfigs.map((config, index) => {
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
			</div>
		</>
	)
}
