import { githubHeaders } from '@/lib/github-headers'
import { normalizeReleaseNotes } from '@/lib/release-notes'
import { classifyRelease } from '@/lib/release-tags'
import { getWailsMetadata } from './parse-version'

export interface ReleaseAsset {
	name: string
	size: number
	downloadUrl: string
}

export interface ReleaseDownloadsItem {
	tag: string
	name: string | null
	totalDownloads: number
}

export type ReleaseType = 'stable' | 'pre-release' | 'nightly' | 'end of life' | 'broken'

export interface ReleaseInfo {
	version: string
	commit: string | null
	date: string
	publishedAt: string
	notes: string
	assets: ReleaseAsset[]
	prerelease: boolean
	draft: boolean
	url: string
	type: ReleaseType
	buildTag?: string
	wailsVersion?: string
	goVersion?: string
}

function formatDate(input: string) {
	if (!input) return 'Unknown'
	const date = new Date(input)
	if (Number.isNaN(date.getTime())) return input
	return date.toISOString().slice(0, 10)
}

function getSortDate(release: ReleaseInfo): Date {
	if (release.publishedAt) {
		const d = new Date(release.publishedAt)
		if (!Number.isNaN(d.getTime())) return d
	}
	if (release.date !== 'Unknown') {
		const d = new Date(release.date)
		if (!Number.isNaN(d.getTime())) return d
	}
	return new Date(0)
}

function compareVersionsDesc(a: string, b: string): number {
	return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
}

function applyBuildTagPriority(releases: ReleaseInfo[]): ReleaseInfo[] {
	return releases.map(release => {
		const tag = release.buildTag
		let type: ReleaseType | null = null

		if (tag === 'nightly') type = 'nightly'
		else if (tag === 'stable') type = 'stable'
		else if (tag === 'pre-release' || tag === 'prerelease') type = 'pre-release'

		if (!type) return release
		return { ...release, type }
	})
}

export async function getUpdatesReleases(): Promise<{
	releases: ReleaseInfo[]
	githubLatestRelease: ReleaseInfo | null
	error: string | null
}> {
	try {
		const [listRes, latestRes] = await Promise.all([
			fetch('https://api.github.com/repos/Devollox/void-updates/releases?per_page=100', {
				cache: 'force-cache',
				next: { revalidate: 300 },
				headers: githubHeaders(),
			}),
			fetch('https://api.github.com/repos/Devollox/void-updates/releases/latest', {
				cache: 'force-cache',
				next: { revalidate: 300 },
				headers: githubHeaders(),
			}),
		])

		if (!listRes.ok) {
			return {
				releases: [],
				githubLatestRelease: null,
				error:
					listRes.status === 403
						? 'GitHub API rate limit exceeded. Please try again in a few minutes or open the GitHub releases page.'
						: 'Failed to load updates release schedule. Please try again later.',
			}
		}

		const data = await listRes.json()
		const rawReleases = Array.isArray(data) ? data : []

		let releases: ReleaseInfo[] = await Promise.all(
			rawReleases
				.filter((item: any) => item && !item.draft)
				.map(async (item: any) => {
					const rawAssets = Array.isArray(item.assets) ? item.assets : []

					const assets: ReleaseAsset[] = rawAssets
						.map((asset: any) => ({
							name: asset.name,
							size: asset.size / (1024 * 1024),
							downloadUrl: asset.browser_download_url,
						}))
						.sort((a: ReleaseAsset, b: ReleaseAsset) => {
							const aIsExe = a.name.toLowerCase().endsWith('.exe')
							const bIsExe = b.name.toLowerCase().endsWith('.exe')

							if (aIsExe && !bIsExe) return -1
							if (bIsExe && !aIsExe) return 1

							return 0
						})

					const rawBody = item.body || ''
					const notes = normalizeReleaseNotes(rawBody)
					const classification = classifyRelease(item, rawBody)

					const tag = item.tag_name || 'unknown'
					const wailsMeta = tag && tag !== 'unknown' ? await getWailsMetadata(tag) : null

					return {
						version: tag,
						commit: item.target_commitish || null,
						date: item.published_at ? formatDate(item.published_at) : 'Unknown',
						publishedAt: item.published_at ?? '',
						notes,
						assets,
						prerelease: !!item.prerelease,
						draft: !!item.draft,
						url: item.html_url || '',
						type: classification.type,
						buildTag: classification.buildTag,
						wailsVersion: wailsMeta?.wails,
						goVersion: wailsMeta?.go,
					} as ReleaseInfo
				})
		)

		releases = applyBuildTagPriority(releases)

		const stableTagVersions = new Set(
			releases.filter(r => r.buildTag?.toLowerCase() === 'stable').map(r => r.version)
		)

		releases = releases.map(r => {
			if (r.type === 'nightly' || r.type === 'pre-release' || r.type === 'broken') {
				return r
			}

			if (stableTagVersions.has(r.version)) {
				return { ...r, type: 'stable' as const }
			}

			return { ...r, type: 'end of life' as const }
		})

		releases = releases.sort((a, b) => {
			const dateDiff = getSortDate(b).getTime() - getSortDate(a).getTime()
			if (dateDiff !== 0) return dateDiff
			return compareVersionsDesc(a.version, b.version)
		})

		let githubLatestRelease: ReleaseInfo | null = null

		if (latestRes.ok) {
			const latestData = await latestRes.json()
			const rawAssets = Array.isArray(latestData.assets) ? latestData.assets : []

			const assets: ReleaseAsset[] = rawAssets
				.map((asset: any) => ({
					name: asset.name,
					size: asset.size / (1024 * 1024),
					downloadUrl: asset.browser_download_url,
				}))
				.sort((a: ReleaseAsset, b: ReleaseAsset) => {
					const aIsExe = a.name.toLowerCase().endsWith('.exe')
					const bIsExe = b.name.toLowerCase().endsWith('.exe')

					if (aIsExe && !bIsExe) return -1
					if (bIsExe && !aIsExe) return 1

					return 0
				})

			const rawBody = latestData.body || ''
			const notes = normalizeReleaseNotes(rawBody)
			const classification = classifyRelease(latestData, rawBody)

			githubLatestRelease = {
				version: latestData.tag_name || 'unknown',
				commit: latestData.target_commitish || null,
				date: latestData.published_at ? formatDate(latestData.published_at) : 'Unknown',
				publishedAt: latestData.published_at ?? '',
				notes,
				assets,
				prerelease: !!latestData.prerelease,
				draft: !!latestData.draft,
				url: latestData.html_url || '',
				type: classification.type,
				buildTag: classification.buildTag,
			}
		}

		return { releases, githubLatestRelease, error: null }
	} catch {
		return {
			releases: [],
			githubLatestRelease: null,
			error: 'Failed to load updates release schedule. Please try again later.',
		}
	}
}

export interface ReleaseDownloadsResult {
	items: ReleaseDownloadsItem[]
	error: string | null
}

export async function getUpdatesReleaseDownloads(): Promise<ReleaseDownloadsResult> {
	const res = await fetch(
		'https://api.github.com/repos/Devollox/void-updates/releases?per_page=100',
		{
			cache: 'force-cache',
			next: { revalidate: 300 },
			headers: githubHeaders(),
		}
	)

	if (!res.ok) {
		return {
			items: [],
			error:
				res.status === 403
					? 'GitHub API rate limit exceeded. Please try again in a few minutes or open the GitHub releases page.'
					: 'Failed to load updates release schedule. Please try again later.',
		}
	}

	const data = await res.json()
	const rawReleases = Array.isArray(data) ? data : []

	const items: ReleaseDownloadsItem[] = rawReleases
		.filter((item: any) => item && !item.draft)
		.map((item: any) => {
			const tag = item.tag_name as string
			const name = (item.name as string) ?? null
			const assets = Array.isArray(item.assets) ? item.assets : []

			const totalDownloads = assets.reduce(
				(sum: number, asset: any) =>
					sum + (typeof asset.download_count === 'number' ? asset.download_count : 0),
				0
			)

			return {
				tag,
				name,
				totalDownloads,
			}
		})
		.sort((a, b) => {
			const aTag = a.tag
			const bTag = b.tag
			return bTag.localeCompare(aTag, undefined, {
				numeric: true,
				sensitivity: 'base',
			})
		})

	return { items, error: null }
}
