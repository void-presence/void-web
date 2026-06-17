import { getApps, initializeApp } from 'firebase/app'
import {
	get,
	getDatabase,
	onValue,
	ref,
	remove,
	runTransaction,
} from 'firebase/database'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
	messagingSenderId: process.env
		.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
}

export const app = getApps().length
	? getApps()[0]
	: initializeApp(firebaseConfig)
export const db = getDatabase(app, firebaseConfig.databaseURL)

export interface ButtonPair {
	label1: string
	url1: string
	label2?: string
	url2?: string
}

export interface ConfigData {
	cycles: Array<{ details: string; state: string }>
	imageCycles: Array<{
		largeImage: string
		largeText?: string
		smallImage?: string
		smallText?: string
	}>
	buttonPairs: ButtonPair[]
}

export interface UserRecord {
	name?: string
	createdAt?: number
	avatar?: string
	image?: string
	provider?: string | null
	lastSeen?: number
}

export interface Config {
	id: string
	title: string
	author: string
	authorId: string
	authorAvatar?: string
	downloads: number
	description: string
	configData: ConfigData
	averageColor: string
}

function mapRawToConfig(
	id: string,
	data: any,
	overriddenAvatar?: string,
	overriddenAuthor?: string,
): Config {
	return {
		id,
		title: data?.title || 'Unnamed',
		author: overriddenAuthor || data?.author || 'Unknown',
		authorId: data?.authorId ?? null,
		authorAvatar: overriddenAvatar || data?.authorAvatar || '',
		downloads:
			typeof data?.downloads === 'number'
				? data.downloads
				: parseInt(String(data?.downloads ?? '0')) || 0,
		description: data?.description || '',
		averageColor: data?.averageColor || '#5b5b5b',
		configData: data?.configData || {
			cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
			imageCycles: [],
			buttonPairs: [],
		},
	}
}

async function fetchAuthor(authorId: string): Promise<UserRecord | null> {
	const userRef = ref(db, `users/${authorId}`)
	const snapshot = await get(userRef)
	if (!snapshot.exists()) return null
	return snapshot.val() as UserRecord
}

export function onConfigsChange(
	callback: (configs: Config[]) => void,
	refPath?: string,
	authorId?: string,
) {
	const path = refPath || 'configs'
	const configsRef = ref(db, path)
	const usersCache: Record<string, UserRecord> = {}

	const unsubscribe = onValue(configsRef, async snapshot => {
		const data = snapshot.val()
		if (!data) {
			callback([])
			return
		}

		const allConfigs: Config[] = Object.entries(data).map(([id, raw]) =>
			mapRawToConfig(id, raw),
		)

		const filtered = authorId
			? allConfigs.filter(cfg => String(cfg.authorId) === String(authorId))
			: allConfigs

		const missingAuthorIds = [
			...new Set(
				filtered
					.map(c => c.authorId)
					.filter((id): id is string => !!id && !usersCache[id]),
			),
		]

		if (missingAuthorIds.length > 0) {
			await Promise.all(
				missingAuthorIds.map(async id => {
					try {
						const user = await fetchAuthor(id)
						if (user) usersCache[id] = user
					} catch {}
				}),
			)
		}

		const configsWithUsers = filtered.map(config => {
			const user = config.authorId ? usersCache[config.authorId] : null
			if (!user) return config
			return mapRawToConfig(
				config.id,
				config,
				user.avatar || user.image || '',
				user.name || config.author,
			)
		})

		callback(configsWithUsers)
	})

	return unsubscribe
}

export async function incrementDownloads(configId: string): Promise<void> {
	const downloadsRef = ref(db, `configs/${configId}/downloads`)
	await runTransaction(downloadsRef, current => {
		return (Number(current) || 0) + 1
	})
}

export async function incrementVisitors(): Promise<void> {
	try {
		const countRef = ref(db, 'stats/visitors/count')
		const lastUpdatedRef = ref(db, 'stats/visitors/lastUpdated')

		await runTransaction(countRef, count => (Number(count) || 0) + 1)
		await runTransaction(lastUpdatedRef, () => Date.now())
	} catch {}
}

export async function incrementDownloadsStats(): Promise<void> {
	try {
		const countRef = ref(db, 'stats/downloads/count')
		const lastUpdatedRef = ref(db, 'stats/downloads/lastUpdated')

		await runTransaction(countRef, count => (Number(count) || 0) + 1)
		await runTransaction(lastUpdatedRef, () => Date.now())
	} catch {}
}

export interface Stats {
	visitors: { count: number; lastUpdated: number }
	downloads: { count: number; lastUpdated: number }
}

export function onStatsChange(callback: (stats: Stats) => void) {
	const statsRef = ref(db, 'stats')
	const unsubscribe = onValue(statsRef, snapshot => {
		const data = snapshot.val() || {}
		callback({
			visitors: data.visitors || { count: 0, lastUpdated: Date.now() },
			downloads: data.downloads || { count: 0, lastUpdated: Date.now() },
		})
	})
	return unsubscribe
}

export function onConfigByIdChange(
	id: string,
	callback: (config: Config | null) => void,
) {
	const configRef = ref(db, `configs/${id}`)

	const unsubscribe = onValue(configRef, async snapshot => {
		const data = snapshot.val()

		if (!data) {
			callback(null)
			return
		}

		let user: UserRecord | null = null

		if (data.authorId) {
			try {
				user = await fetchAuthor(data.authorId)
			} catch {}
		}

		callback(
			mapRawToConfig(
				id,
				data,
				user?.avatar || user?.image || data.authorAvatar || '',
				user?.name || data.author || 'Unknown',
			),
		)
	})

	return unsubscribe
}

export async function getConfigs(): Promise<Config[]> {
	const configsRef = ref(db, 'configs')
	const snapshot = await get(configsRef)
	if (!snapshot.exists()) return []
	const data = snapshot.val() as Record<string, any>
	return Object.entries(data).map(([id, raw]) => mapRawToConfig(id, raw))
}

export async function getConfigById(id: string): Promise<Config | null> {
	const configRef = ref(db, `configs/${id}`)
	const snapshot = await get(configRef)
	if (!snapshot.exists()) return null
	const data = snapshot.val()

	let user: UserRecord | null = null
	if (data.authorId) {
		try {
			user = await fetchAuthor(data.authorId)
		} catch {}
	}

	return mapRawToConfig(
		id,
		data,
		user?.avatar || user?.image || data.authorAvatar || '',
		user?.name || data.author || 'Unknown',
	)
}

export async function createUserIfNotExists(
	userId: string,
	name?: string,
	avatar?: string,
	provider?: string,
) {
	const userRef = ref(db, `users/${userId}`)
	await runTransaction(userRef, current => {
		if (current) {
			const next = { ...current }

			if (name) {
				next.name = name
			}

			if (avatar) {
				next.avatar = avatar
			}

			if (provider) {
				next.provider = provider
			}

			next.lastSeen = Date.now()
			return next
		}

		return {
			name: name ?? 'Unknown',
			avatar: avatar || '/logo.png',
			provider: provider || null,
			createdAt: Date.now(),
			lastSeen: Date.now(),
		}
	})
}

export async function deleteConfig(configId: string): Promise<void> {
	const cfgRef = ref(db, `configs/${configId}`)
	const snap = await get(cfgRef)
	if (!snap.exists()) return
	await remove(cfgRef)
}
