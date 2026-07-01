import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.scss'
import { useState } from 'react'
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
}

function getVersionLabel(endpoints: ApiEndpoint[]): string {
	if (endpoints.length === 0) return 'v0'
	const path = endpoints[0].path
	const match = path.match(/^\/v(\d+)\//)
	if (match && match[1]) {
		return `v${match[1]}`
	}
	return 'v0'
}

function getDotClass(method: ApiEndpoint['method']): string {
	return method === 'POST'
		? apiStyles.dot_nightly
		: method === 'GET'
			? apiStyles.dot_stable
			: method === 'DELETE'
				? apiStyles.dot_broken
				: method === 'PUT'
					? apiStyles.dot_prerelease
					: apiStyles.dot_eol
}

function ApiCardItem({ endpoint }: { endpoint: ApiEndpoint }) {
	const [copied, setCopied] = useState(false)
	const dotClass = getDotClass(endpoint.method)

	const handleCopyPath = async (e: React.MouseEvent) => {
		e.preventDefault()
		try {
			await navigator.clipboard.writeText(endpoint.path)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy path', err)
		}
	}

	return (
		<li className={apiStyles.api_item}>
			<a className={apiStyles.api_card} onClick={handleCopyPath} style={{ cursor: 'pointer' }}>
				<div className={apiStyles.api_card_top}>
					<div className={apiStyles.api_card_left}>
						<div className={apiStyles.api_row}>
							<span className={apiStyles.api_path}>{endpoint.path}</span>
							<span className={apiStyles.api_method_badge}>
								{copied ? 'Copied!' : endpoint.method}
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
						<span className={apiStyles.electron_versions}>{endpoint.description}</span>
					</div>
					<span className={apiStyles.api_card_meta_item}>JSON response</span>
					{endpoint.hasExample && <span className={apiStyles.api_card_meta_item}>Has example</span>}
				</div>
			</a>

			{endpoint.hasChangelog && (
				<div className={styles.release_card_changelog}>
					<p className={styles.release_footer_note}>Detailed docs for this endpoint coming soon.</p>
				</div>
			)}
		</li>
	)
}

export function ApiSectionBase({ left, right, endpoints, basePath, title }: ApiSectionBaseProps) {
	const versionedEndpoints = endpoints.filter(ep => ep.path.match(/\/v(\d+)\//))
	const legacyEndpoints = endpoints.filter(ep => !ep.path.match(/\/v(\d+)\//))

	const versionLabel = getVersionLabel(versionedEndpoints)

	return (
		<PanelLayout
			left={left}
			right={
				<section className={styles.page_section}>
					{right}
					<div className={layoutStyles.preview_card_wrap}>
						<div className={layoutStyles.preview_card}>
							{versionedEndpoints.length > 0 && (
								<>
									<div className={layoutStyles.preview_header}>
										<h3 className={styles.preview_title}>{title}</h3>
										<div className={layoutStyles.preview_badge}>
											<span className={layoutStyles.preview_badge_text}>{versionLabel}</span>
										</div>
									</div>

									<ul className={apiStyles.api_list}>
										{versionedEndpoints.map(endpoint => (
											<ApiCardItem key={endpoint.id} endpoint={endpoint} />
										))}
									</ul>
								</>
							)}

							{legacyEndpoints.length > 0 && (
								<>
									<div className={layoutStyles.preview_header}>
										<h3 className={styles.preview_title}></h3>
										<div className={layoutStyles.preview_badge}>
											<span className={layoutStyles.preview_badge_text}>v0</span>
										</div>
									</div>

									<ul className={apiStyles.api_list}>
										{legacyEndpoints.map(endpoint => (
											<ApiCardItem key={endpoint.id} endpoint={endpoint} />
										))}
									</ul>
								</>
							)}

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
