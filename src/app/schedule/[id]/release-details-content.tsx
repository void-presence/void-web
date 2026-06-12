import DownloadButtons from '@/app/download/download-buttons'
import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import { githubHeaders } from '@lib/github-headers'
import { extractPackageMeta, type PackageJson } from '@lib/package-meta'
import {
	parseChromiumVersionFromNotes,
	parseElectronVersionFromNotes,
	parseNodeJsVersionFromNotes,
	parseV8VersionFromNotes,
} from '@lib/parse-version'
import { normalizeReleaseNotes } from '@lib/release-notes'
import { getReleases, type ReleaseInfo } from '@lib/releases-schedule'
import type { Metadata } from 'next'
import { InfoBox } from '../../../../components/status-info/info-box'
import ChangelogClient from '../../download/changelog-client'
import styles from '../schedule.module.css'

export const metadata: Metadata = {
	title: 'Release Details',
}

async function getPackageJsonByTag(tag: string): Promise<PackageJson | null> {
	const url = `https://raw.githubusercontent.com/Devollox/void-presence/${encodeURIComponent(
		tag,
	)}/package.json`

	const res = await fetch(url, {
		cache: 'force-cache',
		next: { revalidate: 300 },
		headers: githubHeaders(),
	})

	if (!res.ok) {
		return null
	}

	try {
		const json = (await res.json()) as PackageJson
		return json
	} catch {
		return null
	}
}

export async function ReleaseDetailsContent({ id }: { id: string }) {
	const [{ releases, githubLatestRelease, error }, pkg] = await Promise.all([
		getReleases(),
		getPackageJsonByTag(id),
	])

	const stableRelease = githubLatestRelease ?? releases[0] ?? null

	const matched =
		releases.find(r => r.version === id) ??
		releases.find(r => r.version === `v${id}`) ??
		null

	const release: ReleaseInfo | null = matched ?? stableRelease

	const isCurrentStable =
		!!stableRelease && !!release && stableRelease.version === release.version

	const effectiveType =
		release && (isCurrentStable ? ('stable' as const) : release.type)

	const pkgMeta = extractPackageMeta(pkg)
	const electronFromPkg =
		pkg?.dependencies?.electron ?? pkg?.devDependencies?.electron

	const notes = release?.notes ? normalizeReleaseNotes(release.notes) : ''
	const electronVersion = parseElectronVersionFromNotes(notes)
	const chromiumVersion = parseChromiumVersionFromNotes(notes)
	const nodeJsVersion = parseNodeJsVersionFromNotes(notes)
	const v8Version = parseV8VersionFromNotes(notes)

	const electronMain =
		release?.electronCurrent ??
		electronVersion ??
		(electronFromPkg ? String(electronFromPkg) : undefined)

	const chromiumMain = release?.chromiumCurrent ?? chromiumVersion
	const nodeJsMain = release?.nodeJsCurrent ?? nodeJsVersion
	const v8Main = release?.v8Current ?? v8Version

	const left = (
		<>
			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : release ? (
				<>
					{release.assets.length > 0 && (
						<DownloadButtons assets={release.assets} />
					)}

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>{release.version}</span>
						</div>

						{release.date && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Release date</span>
								<span className={styles.release_value}>{release.date}</span>
							</div>
						)}

						{electronMain && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Electron</span>
								<span className={styles.release_value}>v{electronMain}</span>
							</div>
						)}

						{chromiumMain && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Chromium</span>
								<span className={styles.release_value}>v{chromiumMain}</span>
							</div>
						)}

						{nodeJsMain && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Node.js</span>
								<span className={styles.release_value}>v{nodeJsMain}</span>
							</div>
						)}

						{v8Main && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>V8</span>
								<span className={styles.release_value}>v{v8Main}</span>
							</div>
						)}
					</div>

					<InfoBox
						variant='secondary'
						title='Want the latest version?'
						lines={[
							'If you just need the latest stable build, you can always download it from the main download page.',
						]}
						linkHref='/download'
						linkLabel='Go to download page'
					/>

					{release.url && (
						<InfoBox
							variant='secondary'
							lines={[
								'View this release on GitHub for full changelog and assets.',
							]}
							linkHref={release.url}
							linkLabel='Check GitHub'
						/>
					)}
				</>
			) : (
				<InfoBox
					variant='muted'
					lines={[
						'This release could not be loaded from GitHub.',
						'It may have been removed or is temporarily unavailable.',
					]}
				/>
			)}

			{!pkg && (
				<p className={styles.release_footer_note}>
					Could not load package.json for this tag. It may not exist for older
					releases or this tag may not be available on GitHub.
				</p>
			)}
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div style={{ marginBottom: '20px' }}>
				<InfoBox
					variant='secondary'
					linkHref='/schedule'
					linkLabel='Back to Schedule'
				/>
			</div>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={styles.preview_title}>Release details</h3>
						<div className={layoutStyles.preview_badge}>
							<span className={layoutStyles.preview_badge_text}>
								{release && release.version}
							</span>
						</div>
					</div>

					{release && (
						<ul className={styles.release_list}>
							<li
								key={release.version}
								className={`${styles.release_item} ${
									release.buildTag === 'alpha'
										? styles.bg_release_alpha
										: release.buildTag === 'beta'
											? styles.bg_release_beta
											: effectiveType === 'stable'
												? styles.bg_release_stable
												: effectiveType === 'nightly'
													? styles.bg_release_nightly
													: effectiveType === 'pre-release'
														? styles.bg_release_prerelease
														: effectiveType === 'broken'
															? styles.bg_release_broken
															: styles.bg_release_eol
								}`}
							>
								<div className={styles.release_card}>
									<div className={styles.release_card_top}>
										<div className={styles.release_card_left}>
											<div className={styles.version_row}>
												<span className={styles.release_card_version}>
													{release.version}
												</span>
												<span className={styles.release_card_badge}>
													{release.buildTag === 'alpha'
														? 'Alpha'
														: release.buildTag === 'beta'
															? 'Beta'
															: effectiveType === 'stable'
																? 'Stable'
																: effectiveType === 'nightly'
																	? 'Nightly'
																	: effectiveType === 'pre-release'
																		? 'Prerelease'
																		: effectiveType === 'broken'
																			? 'Broken'
																			: 'End of Life'}
												</span>
											</div>
										</div>

										{release.date && (
											<span className={styles.release_card_date}>
												{release.date}
											</span>
										)}
									</div>

									<div className={styles.release_card_meta}>
										{(electronMain || pkgMeta) && (
											<div className={styles.electron_row}>
												<div className={styles.dot_wrap}>
													<div
														className={`
                              ${styles.dot}
                              ${
																release.buildTag === 'alpha'
																	? styles.dot_alpha
																	: release.buildTag === 'beta'
																		? styles.dot_beta
																		: release.buildTag === 'broken'
																			? styles.dot_broken
																			: effectiveType === 'stable'
																				? styles.dot_stable
																				: effectiveType === 'nightly'
																					? styles.dot_nightly
																					: effectiveType === 'pre-release'
																						? styles.dot_prerelease
																						: styles.dot_eol
															}
                            `}
													/>
												</div>

												<span className={styles.electron_versions}>
													Electron v
													{electronMain ??
														pkgMeta?.dependencies.find(
															dep => dep.key === 'electron',
														)?.value ??
														'unknown'}
												</span>
											</div>
										)}

										<span className={styles.release_card_meta_item}>
											{release.assets.length} assets
										</span>
										<span className={styles.release_card_meta_item}>
											{release.notes ? 'Has changelog' : 'No changelog'}
										</span>
									</div>
								</div>

								{release.notes && (
									<div className={styles.release_card_changelog}>
										<ChangelogClient
											release={{
												version: release.version,
												date: release.date,
												notes: release.notes,
												assets: release.assets,
											}}
										/>
									</div>
								)}
							</li>
						</ul>
					)}

					{pkgMeta && (
						<div className={styles.package_snapshot_wrap}>
							<div className={styles.package_snapshot_grid}>
								{pkgMeta.dependencies.map(dep => (
									<div key={dep.key} className={styles.package_snapshot_row}>
										<span className={styles.package_snapshot_label}>
											{dep.label}
										</span>
										<div className={styles.package_snapshot_value}>
											<span className={styles.package_snapshot_version}>
												{dep.value}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
