import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.scss'
import styles from '../../(site)/schedule/release-schedule.module.scss'
import apiStyles from './api.module.scss'

export type ApiGroupType = 'presence' | 'statuses' | 'auth' | 'analytics' | 'internal'

export interface ApiEndpoint {
	id: string
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	path: string
	title: string
	description: string
	group: ApiGroupType
	authRequired?: boolean
	hasExample?: boolean
	hasChangelog?: boolean
}

interface ApiSectionBaseProps {
	left: React.ReactNode
	right: React.ReactNode
	endpoints: ApiEndpoint[]
	basePath: string
	title: string
	counterLabel: (count: number) => string
}

export function ApiSectionBase({
	left,
	right,
	endpoints,
	basePath,
	title,
	counterLabel,
}: ApiSectionBaseProps) {
	return (
		<PanelLayout
			left={left}
			right={
				<section className={styles.page_section}>
					{right}
					<div className={layoutStyles.preview_card_wrap}>
						<div className={layoutStyles.preview_card}>
							<div className={layoutStyles.preview_header}>
								<h3 className={styles.preview_title}>{title}</h3>
								<div className={layoutStyles.preview_badge}>
									<span className={layoutStyles.preview_badge_text}>
										{counterLabel(endpoints.length)}
									</span>
								</div>
							</div>

							<ul className={apiStyles.api_list}>
								{endpoints.map(endpoint => {
									const bgClass =
										endpoint.method === 'POST'
											? apiStyles.bg_release_stable
											: endpoint.method === 'GET'
												? apiStyles.bg_release_nightly
												: endpoint.method === 'DELETE'
													? apiStyles.bg_release_broken
													: apiStyles.bg_release_eol

									const dotClass =
										endpoint.method === 'POST'
											? apiStyles.dot_stable
											: endpoint.method === 'GET'
												? apiStyles.dot_nightly
												: endpoint.method === 'DELETE'
													? apiStyles.dot_broken
													: apiStyles.dot_eol

									return (
										<li key={endpoint.id} className={`${bgClass} ${apiStyles.api_item} `}>
											<a className={apiStyles.api_card}>
												<div className={apiStyles.api_card_top}>
													<div className={apiStyles.api_card_left}>
														<div className={apiStyles.api_row}>
															<span className={apiStyles.api_path}>{endpoint.path}</span>
															<span className={`${apiStyles.api_method_badge}`}>
																{endpoint.method}
															</span>
														</div>
														<span className={styles.release_card_meta_item}>{endpoint.title}</span>
													</div>

													<span className={apiStyles.api_card_date}>
														{endpoint.authRequired ? 'Auth required' : 'Public'}
													</span>
												</div>

												<div className={apiStyles.api_card_meta}>
													<div className={apiStyles.electron_row}>
														<div className={apiStyles.dot_wrap}>
															<span className={`${apiStyles.dot} ${dotClass}`} />
														</div>
														<span className={apiStyles.electron_versions}>
															{endpoint.description}
														</span>
													</div>
													<span className={apiStyles.api_card_meta_item}>JSON response</span>
													{endpoint.hasExample && (
														<span className={apiStyles.api_card_meta_item}>Has example</span>
													)}
												</div>
											</a>

											{endpoint.hasChangelog && (
												<div className={styles.release_card_changelog}>
													<p className={styles.release_footer_note}>
														Detailed docs for this endpoint coming soon.
													</p>
												</div>
											)}
										</li>
									)
								})}
							</ul>

							<p className={styles.release_footer_note}>
								All endpoints respond with JSON and follow the same structure as your presence and
								status configs.
							</p>
						</div>
					</div>
				</section>
			}
		/>
	)
}
