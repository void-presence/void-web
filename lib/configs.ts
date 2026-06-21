import fs from 'fs'
import path from 'path'
import { cache } from 'react'

export interface ConfigData {
	name: string
	description: string
	preview?: string
	image?: string
	downloads?: number
	author?: string
	authorAvatar?: string
	cycles: Array<{ details: string; state: string }>
	imageCycles: Array<{ largeImage: string; largeText?: string }>
	buttonPairs: Array<{
		label1: string
		url1: string
		label2?: string
		url2?: string
	}>
}

export interface Config {
	id: string
	title: string
	description: string
	image: string
	downloads: string
	author: string
	avatar: string
	configData: ConfigData
}

const CONFIGS_PATH = path.join(process.cwd(), 'config')

function parseConfigFile(filename: string): Config {
	const filePath = path.join(CONFIGS_PATH, filename)
	const fileContent = fs.readFileSync(filePath, 'utf-8')
	const configData = JSON.parse(fileContent) as ConfigData

	const id = path.parse(filename).name
	return {
		id,
		title: configData.name || id,
		description: configData.description || 'Custom Discord Rich Presence config',
		image:
			configData.preview ||
			configData.image ||
			configData.imageCycles?.[0]?.largeImage ||
			`/config/${id}/preview.jpg`,
		downloads: configData.downloads?.toString() || 'N/A',
		author: configData.author || 'Community',
		avatar: configData.authorAvatar || 'https://avatars.githubusercontent.com/u/66759305?v=4',
		configData,
	}
}

export const getConfigs = cache((): Config[] => {
	try {
		const configFiles = fs.readdirSync(CONFIGS_PATH)
		const jsonFiles = configFiles.filter(file => file.endsWith('.json'))

		return jsonFiles.map(filename => parseConfigFile(filename))
	} catch (error) {
		console.error('Error loading configs:', error)

		return [
			{
				id: 'demo1',
				title: 'Demo Config',
				description: 'Sample Discord Rich Presence config',
				image: 'https://via.placeholder.com/320x180/333/fff?text=Demo',
				downloads: '1.2K',
				author: 'Demo User',
				avatar: 'https://avatars.githubusercontent.com/u/66759305?v=4',
				configData: {
					name: 'Demo Config',
					description: 'Sample Discord Rich Presence config',
					cycles: [{ details: 'Demo', state: 'Active' }],
					imageCycles: [{ largeImage: 'https://via.placeholder.com/64/333/fff?text=D' }],
					buttonPairs: [{ label1: 'Demo', url1: '#' }],
				},
			},
		]
	}
})

export const getConfigById = cache((id: string): Config | null => {
	try {
		const filePath = path.join(CONFIGS_PATH, `${id}.json`)
		if (!fs.existsSync(filePath)) return null

		return parseConfigFile(`${id}.json`)
	} catch (error) {
		console.error(`Error loading config ${id}:`, error)
		return null
	}
})
