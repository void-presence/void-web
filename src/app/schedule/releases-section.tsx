import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import { getReleases } from '@lib/releases-schedule'
import type { Metadata } from 'next'
import { InfoBox } from '../../../components/status-info/info-box'
import ChangelogClient from '../download/changelog-client'
import DownloadButtons from '../download/download-buttons'
import styles from './schedule.module.css'

export const metadata: Metadata = {
	title: 'Release Schedule',
	description:
		'Release schedule and history for Void Presence with version timeline and GitHub release data.',
	openGraph: {
		title: 'Void Presence Release Schedule',
		description:
			'Track Void Presence releases, prereleases, and changelog history in one place.',
		url: '/schedule',
	},
}

export async function ReleasesSection() {
	const { releases, githubLatestRelease, error } = await getReleases()

	const stableRelease = githubLatestRelease ?? releases[0] ?? null
	const scheduleElectronSource =
		releases.find(r => r.version === stableRelease?.version) ?? stableRelease

	const left = (
		<>
			{error ? (
				<InfoBox variant='muted' lines={[error]} />
			) : stableRelease ? (
				<>
					{stableRelease.assets.length > 0 && (
						<DownloadButtons assets={stableRelease.assets} />
					)}

					<div className={styles.release_meta}>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Version</span>
							<span className={styles.release_value}>
								{stableRelease.version}
							</span>
						</div>
						<div className={styles.release_row}>
							<span className={styles.release_label}>Release date</span>
							<span className={styles.release_value}>{stableRelease.date}</span>
						</div>
						{scheduleElectronSource?.electronCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Electron</span>
								<span className={styles.release_value}>
									v{scheduleElectronSource.electronCurrent}
								</span>
							</div>
						)}
						{scheduleElectronSource?.chromiumCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Chromium</span>
								<span className={styles.release_value}>
									v{scheduleElectronSource.chromiumCurrent}
								</span>
							</div>
						)}
						{scheduleElectronSource?.nodeJsCurrent && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>Node.js</span>
								<span className={styles.release_value}>
									v{scheduleElectronSource.nodeJsCurrent}
								</span>
							</div>
						)}
						{scheduleElectronSource?.v8Current && (
							<div className={styles.release_row}>
								<span className={styles.release_label}>V8</span>
								<span className={styles.release_value}>
									v{scheduleElectronSource.v8Current}
								</span>
							</div>
						)}
					</div>
				</>
			) : (
				<InfoBox lines={['No stable release available.']} />
			)}

			<InfoBox
				variant='secondary'
				title='Schedule info'
				lines={[
					'Latest GitHub release appears at the top.',
					'Prereleases and nightly builds are ordered by release date.',
				]}
				linkHref='/schedule/downloads'
				linkLabel='View downloads analytics'
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
			<div
				className={`${layoutStyles.preview_card_wrap} ${styles.preview_release_legend}`}
			>
				<div className={layoutStyles.preview_card}>
					<div className={styles.release_legend}>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_stable}`} />
							<span className={styles.release_legend_label}>
								Stable (Long-tested, latest recommended)
							</span>
						</div>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_prerelease}`} />
							<span className={styles.release_legend_label}>
								Prerelease (Testing build)
							</span>
						</div>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_nightly}`} />
							<span className={styles.release_legend_label}>
								Nightly (Fast builds, experimental)
							</span>
						</div>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_broken}`} />
							<span className={styles.release_legend_label}>
								Broken (Known issues, debug only)
							</span>
						</div>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_eol}`} />
							<span className={styles.release_legend_label}>
								End of Life (Legacy, lightly tested)
							</span>
						</div>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_alpha}`} />
							<span className={styles.release_legend_label}>
								Alpha (Early testing, very unstable)
							</span>
						</div>
						<div className={styles.release_legend_item}>
							<span className={`${styles.dot} ${styles.dot_beta}`} />
							<span className={styles.release_legend_label}>
								Beta (Feature-complete, might be unstable)
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<h3 className={styles.preview_title}>Release list</h3>
						<div className={layoutStyles.preview_badge}>
							<span className={layoutStyles.preview_badge_text}>
								{releases.length} total release
							</span>
						</div>
					</div>

					<ul className={styles.release_list}>
						{releases.map(release => {
							const hasElectron = release.electronCurrent
							const isCurrentStable =
								stableRelease && release.version === stableRelease.version

							const effectiveType = isCurrentStable ? 'stable' : release.type

							return (
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
									<a
										href={`/schedule/${encodeURIComponent(release.version)}`}
										className={styles.release_card}
									>
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

											<span className={styles.release_card_date}>
												{release.date}
											</span>
										</div>

										<div className={styles.release_card_meta}>
											{hasElectron && (
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
														Electron v{release.electronCurrent}
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
									</a>

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
							)
						})}
					</ul>
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
