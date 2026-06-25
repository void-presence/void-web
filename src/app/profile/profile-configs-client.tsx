'use client'

import { PresenceGrid } from '@/components/presence-grid'
import { StatusesGrid } from '@/components/statuses-grid'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Config, Status } from '../../service/firebase'
import { onConfigsChange, onStatusesChange } from '../../service/firebase'
import styles from './profile-configs.module.scss'

type Props = {
	userId: string
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

function filterStatuses(statuses: Status[], searchTerm: string) {
	const term = searchTerm.toLowerCase()
	if (!term) return statuses
	return statuses.filter(
		status =>
			status.title.toLowerCase().includes(term) || status.description.toLowerCase().includes(term)
	)
}

export function ProfileConfigsClient({ userId }: Props) {
	const [searchTerm, setSearchTerm] = useState('')
	const [liveConfigs, setLiveConfigs] = useState<Config[]>([])
	const [liveStatuses, setLiveStatuses] = useState<Status[]>([])
	const [hasLoadedConfigs, setHasLoadedConfigs] = useState(false)
	const [hasLoadedStatuses, setHasLoadedStatuses] = useState(false)

	const loadingConfigs = !hasLoadedConfigs
	const loadingStatuses = !hasLoadedStatuses

	useEffect(() => {
		const unsubscribeConfigs = onConfigsChange(
			next => {
				setLiveConfigs(next)
				setHasLoadedConfigs(true)
			},
			undefined,
			userId
		)

		const unsubscribeStatuses = onStatusesChange(
			next => {
				setLiveStatuses(next)
				setHasLoadedStatuses(true)
			},
			undefined,
			userId
		)

		return () => {
			unsubscribeConfigs()
			unsubscribeStatuses()
		}
	}, [userId])

	const filteredConfigs = useMemo(
		() => filterConfigs(liveConfigs, searchTerm),
		[liveConfigs, searchTerm]
	)

	const filteredStatuses = useMemo(
		() => filterStatuses(liveStatuses, searchTerm),
		[liveStatuses, searchTerm]
	)

	return (
		<section className={styles.profile_section}>
			<div className={styles.profile_configs_layout}>
				<div className={styles.profile_header_row}>
					<div className={styles.profile_header_title}>Your configs</div>
				</div>

				<form className={styles.profile_search_container} onSubmit={e => e.preventDefault()}>
					<Search className={styles.profile_search_icon} />
					<input
						className={styles.search}
						type='text'
						placeholder='Search by title or description...'
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

				<div className={styles.profile_stats_row}>
					<span>{filteredConfigs.length} presence found</span>
				</div>
				<div className={styles.profile_stats_row}>
					<span>{filteredStatuses.length} statuses found</span>
				</div>

				<div className={styles.themes_right_side}>
					<PresenceGrid configs={filteredConfigs} loading={loadingConfigs} allowDelete={true} />
					<div style={{ marginTop: '20px' }} />
					<StatusesGrid configs={filteredStatuses} loading={loadingStatuses} allowDelete={true} />
				</div>
			</div>
		</section>
	)
}
