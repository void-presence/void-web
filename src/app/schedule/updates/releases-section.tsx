import { InfoBox } from '@components/status-info/info-box'
import { getReleases } from '@lib/releases-updates'
import type { Metadata } from 'next'
import DownloadButtons from '../../download/download-buttons'
import styles from '../release-schedule.module.scss'
import { ReleasesSectionBase } from '../releases-section-base'

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Updates',
		description:
			'Updates and history for Void Presence with version timeline and GitHub release data.',
		openGraph: {
			title: 'Void Presence Updates',
			description: 'Track Void Presence updates, prereleases, and changelog history in one place.',
			url: '/schedule/updates',
		},
	}
}

export default async function ReleasesSection() {
	const { releases, githubLatestRelease, error } = await getReleases()

	const stableRelease = githubLatestRelease ?? releases[0] ?? null

	const left = (
		<>
			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : stableRelease ? (
				<>
					{stableRelease.assets.length > 0 && <DownloadButtons assets={stableRelease.assets} />}

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>{stableRelease.version}</span>
						</div>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Release date</span>
							<span className={styles.release_value}>{stableRelease.date}</span>
						</div>
					</div>
				</>
			) : (
				<InfoBox lines={['No stable release available.']} />
			)}

			<InfoBox
				variant='secondary'
				title='Updates info'
				lines={[
					'Latest GitHub release appears at the top.',
					'Prereleases and nightly builds are ordered by release date.',
				]}
			/>
		</>
	)

	return (
		<ReleasesSectionBase
			left={left}
			releases={releases}
			stableRelease={stableRelease}
			basePath='/schedule/updates'
			title='Release list'
			counterLabel={count => `${count} total release`}
			legendVariant='application'
		/>
	)
}
