'use client'

import RpcPreview from '@components/rpc-preview/rpc-user'
import { Download, Search, Trash, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Config } from '../../service/firebase'
import { deleteConfig, onConfigsChange } from '../../service/firebase'
import styles from './profile-configs.module.scss'

type Props = {
	configs: Config[]
	userId: string
}

type CustomRpcPreviewProps = {
	config: Config
	previewIndex: number
	id: string
	avatarSrc: string
}

function CustomRpcPreview({ config, previewIndex, id, avatarSrc }: CustomRpcPreviewProps) {
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
					discriminator={config.authorId ? `#${config.authorId.slice(0, 4)}` : '#0001'}
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
		<div className={styles.profile_skeleton_card_wrap}>
			<div className={styles.profile_skeleton_card}>
				<div className={styles.profile_skeleton_card_header}>
					<div className={styles.profile_skeleton_title}></div>
				</div>
				<div className={styles.profile_skeleton_rpc_preview}></div>
				<div className={styles.profile_skeleton_card_actions}>
					<div className={styles.profile_skeleton_download_tag}></div>
					<div className={styles.profile_skeleton_action_buttons}>
						<div className={styles.profile_skeleton_btn_primary}></div>
						<div className={styles.profile_skeleton_btn_secondary}></div>
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

export function ProfileConfigsClient({ configs, userId }: Props) {
	const [searchTerm, setSearchTerm] = useState('')
	const [previewTick, setPreviewTick] = useState(0)
	const [mounted, setMounted] = useState(false)
	const [liveConfigs, setLiveConfigs] = useState<Config[]>(configs)
	const [hasLoadedFirstSnapshot, setHasLoadedFirstSnapshot] = useState(false)
	const [deleting, setDeleting] = useState<string | null>(null)
	const [animateColors, setAnimateColors] = useState(false)

	const loading = !hasLoadedFirstSnapshot

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const unsubscribe = onConfigsChange(
			next => {
				setLiveConfigs(next)
				setHasLoadedFirstSnapshot(true)
				setTimeout(() => {
					setAnimateColors(true)
				}, 100)
			},
			undefined,
			userId
		)

		const interval = setInterval(() => {
			setPreviewTick(prev => getNextTick(prev))
		}, 3000)

		return () => {
			unsubscribe()
			clearInterval(interval)
		}
	}, [userId])

	const filteredConfigs = useMemo(
		() => filterConfigs(liveConfigs, searchTerm),
		[liveConfigs, searchTerm]
	)

	const sortedConfigs = useMemo(() => sortConfigs(filteredConfigs), [filteredConfigs])

	const showSkeleton = loading

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
		<section className={styles.profile_section}>
			<div className={styles.profile_configs_layout}>
				<div className={styles.profile_header_row}>
					<div className={styles.profile_header_title}>Your configs</div>
				</div>

				<div className={styles.profile_search_row}>
					<form className={styles.profile_search_container} onSubmit={e => e.preventDefault()}>
						<Search className={styles.profile_search_icon} />
						<input
							className={styles.profile_search_input}
							type='text'
							placeholder='Search by title, author or description...'
							name='q'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
						{searchTerm && (
							<button
								type='button'
								className={styles.profile_search_clear}
								onClick={() => setSearchTerm('')}
							>
								<X size={16} />
							</button>
						)}
					</form>
				</div>

				<div className={styles.profile_stats_row}>
					<span>{sortedConfigs.length} configs found</span>
				</div>

				{showSkeleton ? (
					<div className={styles.profile_cards_grid}>
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
				) : sortedConfigs.length === 0 ? (
					<div className={styles.profile_empty_state}>
						<p>No configs match your search. Try different keywords.</p>
					</div>
				) : (
					<div className={styles.profile_cards_grid}>
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
									className={`${styles.profile_card_wrap} ${
										hasColor ? styles.profile_card_wrap_hasColor : ''
									}`}
									style={{
										background: baseBg,
										borderColor,
										['--card-highlight' as any]: highlight,
									}}
								>
									<div className={styles.profile_card}>
										<div className={styles.profile_card_header}>
											<div className={styles.profile_card_title}>
												<h3 className={styles.profile_card_title}>{config.title}</h3>
											</div>
											<div>
												<div className={styles.profile_download_tag}>
													<Download size={14} className={styles.profile_download_icon} />
													<span className={styles.download_text}>
														{config.downloads.toLocaleString()}
													</span>
												</div>
												<button
													type='button'
													className={`${styles.profile_download_tag} ${styles.profile_delete_tag}`}
													style={{ marginLeft: '5px', cursor: 'pointer' }}
													disabled={deleting === config.id}
													onClick={async () => {
														setDeleting(config.id)
														try {
															await deleteConfig(config.id)
															setLiveConfigs(prev => prev.filter(c => c.id !== config.id))
														} finally {
															setDeleting(null)
														}
													}}
												>
													<Trash size={14} />
												</button>
											</div>
										</div>

										<CustomRpcPreview
											config={config}
											previewIndex={baseIndex}
											id={config.id}
											avatarSrc={avatarSrc}
										/>

										<div className={styles.profile_card_actions}>
											<div className={styles.profile_card_buttons}>
												<a
													className={styles.profile_btn_primary}
													onClick={() => handleOpenInApp(config)}
												>
													Open in app
												</a>
												<a className={styles.profile_btn_secondary} href={`/configs/${config.id}`}>
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
			</div>
		</section>
	)
}
