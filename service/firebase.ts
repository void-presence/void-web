import { initializeApp } from 'firebase/app'
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

export const app = initializeApp(firebaseConfig)
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
}

export interface Config {
	id: string
	title: string
	author: string
	authorId: string | null
	authorAvatar?: string
	downloads: number
	description: string
	configData: ConfigData
	averageColor: string
}

export function onConfigsChange(
	callback: (configs: Config[]) => void,
	refPath?: string,
	authorId?: string,
) {
	const path = refPath || 'configs'
	const configsRef = ref(db, path)

	const unsubscribe = onValue(configsRef, async snapshot => {
		const data = snapshot.val()
		const allConfigs: Config[] = Object.entries(data || {}).map(([id, raw]) => {
			const config = raw as any
			return {
				id,
				title: config.title || 'Unnamed',
				author: config.author || 'Unknown',
				authorId: config.authorId ?? null,
				authorAvatar: config.authorAvatar || '',
				downloads:
					typeof config.downloads === 'number'
						? config.downloads
						: parseInt(String(config.downloads ?? '0')) || 0,
				description: config.description || '',
				averageColor: config.averageColor || '#5b5b5b',
				configData: config.configData || {
					cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
					imageCycles: [],
					buttonPairs: [],
				},
			}
		})

		const filtered = authorId
			? allConfigs.filter(
					cfg =>
						cfg.authorId !== null &&
						cfg.authorId !== undefined &&
						cfg.authorId !== '' &&
						String(cfg.authorId) === String(authorId),
				)
			: allConfigs

		const authorIds = filtered
			.map(c => c.authorId)
			.filter(
				(id): id is string => id !== null && id !== undefined && id !== '',
			)

		const uniqueIds = [...new Set(authorIds)]
		const avatarsMap: Record<string, string> = {}

		for (const authorId of uniqueIds) {
			try {
				const userRef = ref(db, `users/${authorId}`)
				const userSnap = await get(userRef)
				if (userSnap.exists()) {
					const userData = userSnap.val() as UserRecord
					avatarsMap[authorId] = userData.avatar || userData.image || ''
				}
			} catch {}
		}

		const configsWithAvatars = filtered.map(config => {
			if (config.authorId && avatarsMap[config.authorId]) {
				return {
					...config,
					authorAvatar: avatarsMap[config.authorId],
				}
			}
			return config
		})

		callback(configsWithAvatars)
	})

	return unsubscribe
}

export async function incrementDownloads(configId: string): Promise<void> {
	const configRef = ref(db, `configs/${configId}`)

	await runTransaction(configRef, currentData => {
		if (!currentData) return currentData

		const raw = currentData.downloads
		const current =
			typeof raw === 'number' ? raw : parseInt(String(raw ?? '0')) || 0

		return {
			...currentData,
			downloads: current + 1,
		}
	})
}

export async function incrementVisitors(): Promise<void> {
	try {
		const statsRef = ref(db, 'stats/visitors')
		await runTransaction(statsRef, stats => {
			if (stats) {
				stats.count = (stats.count || 0) + 1
			} else {
				stats = { count: 1, lastUpdated: Date.now() }
			}
			return stats
		})
	} catch {}
}

export async function incrementDownloadsStats(): Promise<void> {
	try {
		const statsRef = ref(db, 'stats/downloads')
		await runTransaction(statsRef, stats => {
			if (stats) {
				stats.count = (stats.count || 0) + 1
			} else {
				stats = { count: 1, lastUpdated: Date.now() }
			}
			return stats
		})
	} catch {}
}

export interface Stats {
	visitors: { count: number; lastUpdated: number }
	downloads: { count: number; lastUpdated: number }
}

export function onStatsChange(callback: (stats: Stats) => void) {
	const statsRef = ref(db, 'stats')
	const unsubscribe = onValue(statsRef, snapshot => {
		const data = snapshot.val()
		callback({
			visitors: data.visitors,
			downloads: data.downloads,
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

		const downloads =
			typeof data.downloads === 'number'
				? data.downloads
				: parseInt(String(data.downloads ?? '0')) || 0

		let authorAvatar = data.authorAvatar || ''

		if (!authorAvatar && data.authorId) {
			try {
				const user = await fetchAuthor(data.authorId)
				if (user) {
					authorAvatar = user.avatar || user.image || ''
				}
			} catch {}
		}

		const config: Config = {
			id,
			title: data.title || 'Unnamed',
			author: data.author || 'Unknown',
			authorId: data.authorId ?? null,
			authorAvatar: authorAvatar,
			downloads,
			averageColor: data.averageColor || '#5b5b5b',
			description: data.description || '',
			configData: data.configData || {
				cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
				imageCycles: [],
				buttonPairs: [],
			},
		}

		callback(config)
	})

	return unsubscribe
}

export async function getConfigs(): Promise<Config[]> {
	const configsRef = ref(db, 'configs')
	const snapshot = await get(configsRef)
	if (!snapshot.exists()) return []
	const data = snapshot.val() as Record<string, any>

	const configs: Config[] = Object.entries(data).map(([id, raw]) => {
		const config = raw as any

		return {
			id,
			title: config.title || 'Unnamed',
			author: config.author || 'Unknown',
			authorId: config.authorId ?? null,
			authorAvatar: config.authorAvatar || '',
			downloads:
				typeof config.downloads === 'number'
					? config.downloads
					: parseInt(String(config.downloads ?? '0')) || 0,
			description: config.description || '',
			averageColor: config.averageColor || '#5b5b5b',
			configData: config.configData || {
				cycles: [{ details: 'Idling in the void', state: 'Just vibing' }],
				imageCycles: [],
				buttonPairs: [],
			},
		}
	})

	return configs
}

export async function getConfigById(id: string): Promise<Config | null> {
	const all = await getConfigs()
	const found = all.find(c => c.id === id)
	return found ?? null
}

export async function fetchAuthor(
	authorId: string,
): Promise<UserRecord | null> {
	const userRef = ref(db, `users/${authorId}`)
	const snapshot = await get(userRef)

	if (!snapshot.exists()) return null

	const data = snapshot.val() as UserRecord
	return data
}

export async function createUserIfNotExists(
	userId: string,
	name?: string,
	avatar?: string,
) {
	const userRef = ref(db, `users/${userId}`)

	await runTransaction(userRef, current => {
		if (current) {
			const newAvatar = avatar || current.image || current.avatar
			if (newAvatar && current.avatar !== newAvatar) {
				return {
					...current,
					avatar: newAvatar,
					image: newAvatar,
				}
			}
			return current
		}

		return {
			name: name ?? 'Unknown',
			avatar: avatar || '/logo.png',
			createdAt: Date.now(),
		}
	})
}

export async function deleteConfig(configId: string): Promise<void> {
	const cfgRef = ref(db, `configs/${configId}`)
	const snap = await get(cfgRef)
	if (!snap.exists()) return
	await remove(cfgRef)
}
