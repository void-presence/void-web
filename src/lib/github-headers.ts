export function githubHeaders() {
	const token = process.env.GITHUB_TOKEN
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	return headers
}
