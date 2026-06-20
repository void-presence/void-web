import { githubHeaders } from './github-headers'

export type PackageJson = {
	name?: string
	version?: string
	description?: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	peerDependencies?: Record<string, string>
	optionalDependencies?: Record<string, string>
	[key: string]: any
}

export type PackageDependencyEntry = {
	key: string
	label: string
	value: string
	kind: 'runtime' | 'dev' | 'tooling'
}

export type PackageMeta = {
	name: string | null
	version: string | null
	description: string | null
	dependencies: PackageDependencyEntry[]
}

const INTERESTING_DEPENDENCIES = [
	{ name: 'electron', label: 'Electron', kind: 'tooling' },
	{ name: 'typescript', label: 'TypeScript', kind: 'tooling' },
	{ name: 'firebase', label: 'Firebase', kind: 'runtime' },
	{ name: 'discord-rpc', label: 'Discord RPC', kind: 'runtime' },
	{ name: 'ts-node', label: 'TypeScript Node', kind: 'runtime' },
	{
		name: 'electron-squirrel-startup',
		label: 'Electron Squirrel Startup',
		kind: 'tooling',
	},
	{ name: 'electron-reloader', label: 'Electron Reloader', kind: 'tooling' },
	{ name: 'eslint', label: 'ESLint', kind: 'tooling' },
	{
		name: '@coooookies/windows-smtc-monitor',
		label: 'Windows Smtc Monitor',
		kind: 'tooling',
	},
	{
		name: 'dotenv',
		label: 'Dotenv',
		kind: 'tooling',
	},
	{
		name: 'marked',
		label: 'Marked',
		kind: 'tooling',
	},
	{ name: 'react', label: 'React', kind: 'runtime' },
	{ name: 'react-dom', label: 'React DOM', kind: 'runtime' },
	{ name: 'vite', label: 'Vite', kind: 'tooling' },
] satisfies {
	name: string
	label: string
	kind: PackageDependencyEntry['kind']
}[]

function findDepValue(
	pkg: PackageJson,
	name: string,
): { value: string; kind: PackageDependencyEntry['kind'] } | null {
	if (pkg.dependencies?.[name]) {
		return { value: pkg.dependencies[name], kind: 'runtime' }
	}
	if (pkg.devDependencies?.[name]) {
		return { value: pkg.devDependencies[name], kind: 'dev' }
	}
	if (pkg.peerDependencies?.[name]) {
		return { value: pkg.peerDependencies[name], kind: 'runtime' }
	}
	if (pkg.optionalDependencies?.[name]) {
		return { value: pkg.optionalDependencies[name], kind: 'runtime' }
	}
	return null
}

export function extractPackageMeta(
	pkg: PackageJson | null,
): PackageMeta | null {
	if (!pkg) return null

	const entries: PackageDependencyEntry[] = []

	for (const def of INTERESTING_DEPENDENCIES) {
		const found = findDepValue(pkg, def.name)
		if (!found) continue

		entries.push({
			key: def.name,
			label: def.label,
			value: found.value,
			kind: def.kind,
		})
	}

	return {
		name: pkg.name ?? null,
		version: pkg.version ?? null,
		description: pkg.description ?? null,
		dependencies: entries,
	}
}

export async function getApplicationPackageJsonByTag(
	tag: string,
): Promise<PackageJson | null> {
	const url = `https://raw.githubusercontent.com/Devollox/void-presence/${encodeURIComponent(
		tag,
	)}/package.json`

	const res = await fetch(url, {
		cache: 'force-cache',
		next: { revalidate: 300 },
		headers: githubHeaders(),
	})

	if (!res.ok) return null
	try {
		return (await res.json()) as PackageJson
	} catch {
		return null
	}
}

export async function getInstallerPackageJsonByTag(
	tag: string,
): Promise<PackageJson | null> {
	const url = `https://raw.githubusercontent.com/Devollox/void-installer/${encodeURIComponent(
		tag,
	)}/frontend/package.json`

	const res = await fetch(url, {
		cache: 'force-cache',
		next: { revalidate: 300 },
		headers: githubHeaders(),
	})

	if (!res.ok) return null
	try {
		return (await res.json()) as PackageJson
	} catch {
		return null
	}
}
