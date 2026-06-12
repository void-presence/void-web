export function parseElectronVersionFromNotes(
	notes: string,
): string | undefined {
	const lines = notes.split(/\r?\n/).map(line => line.trim())

	for (const line of lines) {
		const match = line.match(
			/Updated\s+Electron\s+to\s+([0-9]+(?:\.[0-9]+){2})/i,
		)
		if (match?.[1]) {
			return match[1]
		}
	}

	let inDependencies = false

	for (const line of lines) {
		if (/^dependencies$/i.test(line)) {
			inDependencies = true
			continue
		}

		if (inDependencies) {
			if (!line) break

			const depsMatch = line.match(/Electron[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
			if (depsMatch?.[1]) {
				return depsMatch[1]
			}
		}
	}

	for (const line of lines) {
		if (!/electron/i.test(line)) continue

		const simpleMatch = line.match(/Electron[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
		if (simpleMatch?.[1]) {
			return simpleMatch[1]
		}
	}

	return undefined
}

export function parseChromiumVersionFromNotes(
	notes: string,
): string | undefined {
	const lines = notes.split(/\r?\n/).map(line => line.trim())

	let inDependencies = false

	for (const line of lines) {
		if (/^dependencies$/i.test(line)) {
			inDependencies = true
			continue
		}

		if (inDependencies) {
			if (!line) break

			const match = line.match(/Chromium[^0-9]*([0-9]+(?:\.[0-9]+){3})/i)
			if (match?.[1]) {
				return match[1]
			}
		}
	}

	for (const line of lines) {
		if (!/chromium/i.test(line)) continue

		const simpleMatch = line.match(/Chromium[^0-9]*([0-9]+(?:\.[0-9]+){3})/i)
		if (simpleMatch?.[1]) {
			return simpleMatch[1]
		}
	}

	return undefined
}

export function parseNodeJsVersionFromNotes(notes: string): string | undefined {
	const lines = notes.split(/\r?\n/).map(line => line.trim())

	let inDependencies = false

	for (const line of lines) {
		if (/^dependencies$/i.test(line)) {
			inDependencies = true
			continue
		}

		if (inDependencies) {
			if (!line) break

			const match = line.match(/Node\.?js[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
			if (match?.[1]) {
				return match[1]
			}
		}
	}

	for (const line of lines) {
		if (!/node/i.test(line)) continue

		const simpleMatch = line.match(/Node\.?js[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
		if (simpleMatch?.[1]) {
			return simpleMatch[1]
		}
	}

	return undefined
}

export function parseV8VersionFromNotes(notes: string): string | undefined {
	const lines = notes.split(/\r?\n/).map(line => line.trim())

	let inDependencies = false

	for (const line of lines) {
		if (/^dependencies$/i.test(line)) {
			inDependencies = true
			continue
		}

		if (inDependencies) {
			if (!line) break

			const match = line.match(/V8[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
			if (match?.[1]) {
				return match[1]
			}
		}
	}

	for (const line of lines) {
		if (!/v8/i.test(line)) continue

		const simpleMatch = line.match(/V8[^0-9]*([0-9]+(?:\.[0-9]+){2})/i)
		if (simpleMatch?.[1]) {
			return simpleMatch[1]
		}
	}

	return undefined
}

export function parseBuildTagFromNotes(notes: string): string | undefined {
	const lines = notes.split(/\r?\n/)

	for (const rawLine of lines) {
		const line = rawLine.trim()
		const preNormalized = line
			.replace(/^[-*+]\s*/, '')
			.replace(/\*\*/g, '')
			.replace(/\*/g, '')
			.replace(/__/g, '')
			.trim()

		if (!/tag:/i.test(preNormalized)) {
			continue
		}

		const normalized = preNormalized
		const match = normalized.match(/tag:\s*([a-z0-9\-_.]+)/i)

		if (match?.[1]) {
			return match[1].toLowerCase()
		}
	}

	if (lines.length > 0) {
		const firstLine = lines[0].trim()

		if (/nightly/i.test(firstLine)) return 'nightly'
		if (/stable/i.test(firstLine)) return 'stable'
		if (/broken|failed|borked/i.test(firstLine)) return 'broken'
		if (/pre-?release/i.test(firstLine)) return 'pre-release'
		if (/alpha/i.test(firstLine)) return 'alpha'
		if (/beta/i.test(firstLine)) return 'beta'
	}

	return undefined
}
