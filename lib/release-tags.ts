import { parseBuildTagFromNotes } from './parse-version'

export type ReleaseType = 'stable' | 'pre-release' | 'nightly' | 'end of life' | 'broken'

export interface ClassifiedReleaseTag {
	type: ReleaseType
	buildTag?: string
}

export function parseBuildTagFromTagName(tagName: string | undefined): string | undefined {
	if (!tagName) return undefined

	const lower = tagName.toLowerCase()

	if (/-nightly\b/.test(lower)) return 'nightly'
	if (/-stable\b/.test(lower)) return 'stable'
	if (/-alpha\b/.test(lower)) return 'alpha'
	if (/-beta\b/.test(lower)) return 'beta'
	if (/-pre[-_]?release\b/.test(lower)) return 'pre-release'
	if (/-broken\b/.test(lower) || /-(failed|borked)\b/.test(lower)) {
		return 'broken'
	}

	return undefined
}

export function classifyRelease(
	raw: { tag_name?: string; prerelease?: boolean },
	notes: string
): ClassifiedReleaseTag {
	const tagFromTagName = parseBuildTagFromTagName(raw.tag_name)
	const tagFromNotes = parseBuildTagFromNotes(notes)

	const lowerNotes = tagFromNotes?.toLowerCase()

	if (lowerNotes && ['broken', 'failed', 'borked'].includes(lowerNotes)) {
		return { type: 'broken', buildTag: 'broken' }
	}

	const tag = (tagFromTagName ?? tagFromNotes)?.toLowerCase()

	if (tag === 'nightly') {
		return { type: 'nightly', buildTag: tag }
	}

	if (tag === 'broken' || tag === 'failed' || tag === 'borked') {
		return { type: 'broken', buildTag: tag }
	}

	if (tag === 'alpha') {
		return { type: 'pre-release', buildTag: 'alpha' }
	}

	if (tag === 'beta') {
		return { type: 'pre-release', buildTag: 'beta' }
	}

	if (tag === 'pre-release' || tag === 'prerelease') {
		return { type: 'pre-release', buildTag: 'pre-release' }
	}

	if (tag === 'stable') {
		return { type: 'stable', buildTag: tag }
	}

	if (raw.prerelease) {
		return {
			type: 'pre-release',
			buildTag: tagFromTagName ?? tagFromNotes,
		}
	}

	return {
		type: 'end of life',
		buildTag: tagFromTagName ?? tagFromNotes,
	}
}
