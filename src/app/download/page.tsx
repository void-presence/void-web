import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import { getLatestRelease } from '@lib/releases-schedule'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import { InfoBox } from '../../../components/status-info/info-box'
import config from '../../../data/config.json'
import ChangelogClient from './changelog-client'
import DownloadButtons from './download-buttons'
import DownloadSkeleton from './download-skeleton'
import styles from './download.module.css'
import RpcPreviewClient from './rpc-preview-client'

interface ReleaseAsset {
	name: string
	size: number
	downloadUrl: string
}

export const metadata: Metadata = {
	title: 'Download',
	description:
		'Download Void Presence for Windows and keep your Discord Rich Presence always in sync.',
	openGraph: {
		title: 'Download Void Presence',
		description:
			'Get the latest Void Presence build and customize your Discord Rich Presence with profiles, buttons, and cycles.',
		url: '/download',
	},
}

async function DownloadContent() {
	const { release, error } = await getLatestRelease()

	const left = (
		<>
			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : release ? (
				<>
					<DownloadButtons assets={release.assets} />

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>{release.version}</span>
						</div>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Release date</span>
							<span className={styles.release_value}>{release.date}</span>
						</div>
						{release.electronCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Electron</span>
								<span className={styles.release_value}>
									v{release.electronCurrent}
								</span>
							</div>
						)}
						{release.chromiumCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Chromium</span>
								<span className={styles.release_value}>
									v{release.chromiumCurrent}
								</span>
							</div>
						)}
						{release.nodeJsCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Node.js</span>
								<span className={styles.release_value}>
									v{release.nodeJsCurrent}
								</span>
							</div>
						)}
						{release.v8Current && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>V8</span>
								<span className={styles.release_value}>
									v{release.v8Current}
								</span>
							</div>
						)}
					</div>
				</>
			) : (
				<InfoBox lines={['No release info available.']} />
			)}

			<InfoBox
				variant='secondary'
				title='Need help installing?'
				lines={[
					'Check the install guide on the main page for platform-specific setup and tips.',
				]}
				linkHref='/docs'
				linkLabel='Read docs'
			/>

			<InfoBox
				variant='muted'
				lines={[
					'If your Rich Presence buttons are not visible in Discord, see the status page for details.',
				]}
				linkHref='/status'
				linkLabel='Read setup & troubleshooting'
			/>
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={layoutStyles.preview_title}>
							Live presence preview
						</h3>
						{release && (
							<div className={layoutStyles.preview_badge}>
								<span className={layoutStyles.preview_badge_text}>
									{release.version}
								</span>
							</div>
						)}
					</div>

					<div className={styles.rpc_card_preview}>
						<RpcPreviewClient config={config} />
					</div>

					{release && release.notes && <ChangelogClient release={release} />}
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}

export default function DownloadPage() {
	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Download Void Presence'
					subtitle='Get the desktop client and keep your Discord Rich Presence always in sync.'
				/>
				<Suspense fallback={<DownloadSkeleton />}>
					<DownloadContent />
				</Suspense>
			</main>
			<Footer />
		</Page>
	)
}
