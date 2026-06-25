'use client'

import { ConfigsGrid } from '@components/configs-grid/configs-grid'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Config } from '../../../service/firebase'
import { getConfigsByAuthor } from '../../../service/firebase'
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

export function ProfileClient({ userId }: Props) {
	const [configs, setConfigs] = useState<Config[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchConfigs() {
			setLoading(true)
			const userConfigs = await getConfigsByAuthor(userId)
			setConfigs(userConfigs)
			setLoading(false)
		}

		fetchConfigs()
	}, [userId])

	const filteredConfigs = useMemo(() => filterConfigs(configs, searchTerm), [configs, searchTerm])

	const sortedConfigs = useMemo(() => sortConfigs(filteredConfigs), [filteredConfigs])

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
						<span>{sortedConfigs.length} configs found</span>
					</div>
				</div>

				<div className={styles.themes_right_side}>
					<ConfigsGrid configs={sortedConfigs} loading={loading} />
				</div>
			</div>
		</section>
	)
}
