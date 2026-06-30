'use client'

import { PresenceGrid } from '@/components/activity-grid/presence'
import { StatusesGrid } from '@/components/activity-grid/statuses'
import type { Config, Status } from '@/service/firebase'
import { getConfigsByAuthor, getStatusesByAuthor } from '@/service/firebase'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import styles from './profile.module.scss'

type Props = {
	userId: string
}

function filterConfigs(configs: Config[], searchTerm: string) {
	const term = searchTerm.toLowerCase()
	if (!term) return configs
	return configs.filter(
		config =>
			config.title.toLowerCase().includes(term) || config.description.toLowerCase().includes(term)
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

function filterStatuses(statuses: Status[], searchTerm: string) {
	const term = searchTerm.toLowerCase()
	if (!term) return statuses
	return statuses.filter(
		status =>
			status.title.toLowerCase().includes(term) || status.description.toLowerCase().includes(term)
	)
}

function sortStatuses(statuses: Status[]) {
	return [...statuses].sort((a, b) => {
		const aDownloads =
			typeof a.downloads === 'number' ? a.downloads : parseInt(String(a.downloads ?? '0')) || 0

		const bDownloads =
			typeof b.downloads === 'number' ? b.downloads : parseInt(String(b.downloads ?? '0')) || 0

		return bDownloads - aDownloads
	})
}

export function ProfileClient({ userId }: Props) {
	const [configs, setConfigs] = useState<Config[]>([])
	const [statuses, setStatuses] = useState<Status[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loadingConfigs, setLoadingConfigs] = useState(true)
	const [loadingStatuses, setLoadingStatuses] = useState(true)

	useEffect(() => {
		async function fetchConfigs() {
			setLoadingConfigs(true)
			const userConfigs = await getConfigsByAuthor(userId)
			setConfigs(userConfigs)
			setLoadingConfigs(false)
		}

		async function fetchStatuses() {
			setLoadingStatuses(true)
			const userStatuses = await getStatusesByAuthor(userId)
			setStatuses(userStatuses)
			setLoadingStatuses(false)
		}

		fetchConfigs()
		fetchStatuses()
	}, [userId])

	const filteredConfigs = useMemo(() => filterConfigs(configs, searchTerm), [configs, searchTerm])

	const sortedConfigs = useMemo(() => sortConfigs(filteredConfigs), [filteredConfigs])

	const filteredStatuses = useMemo(
		() => filterStatuses(statuses, searchTerm),
		[statuses, searchTerm]
	)

	const sortedStatuses = useMemo(() => sortStatuses(filteredStatuses), [filteredStatuses])

	return (
		<section className={styles.section_profile_panel}>
			<div className={styles.profile_container}>
				<div className={styles.themes_left_side}>
					<form className={styles.search_container} onSubmit={e => e.preventDefault()}>
						<Search className={styles.search_icon} />
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

					<div className={styles.stats_summary}>
						<span>{sortedConfigs.length} presence found</span>
					</div>
					<div className={styles.stats_summary}>
						<span>{sortedStatuses.length} statuses found</span>
					</div>
				</div>

				<div className={styles.themes_right_side}>
					<PresenceGrid configs={sortedConfigs} loading={loadingConfigs} />
					<div style={{ marginTop: '20px' }} />
					<StatusesGrid configs={sortedStatuses} loading={loadingStatuses} />
				</div>
			</div>
		</section>
	)
}
