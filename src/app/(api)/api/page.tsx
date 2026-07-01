import Footer from '@components/footer'
import Page from '@components/page'
import PageHeader from '@components/page-header'
import type { Metadata } from 'next'
import type { ApiEndpoint } from './api-client'
import { ApiDocsClient } from './api-docs-client'

export const metadata: Metadata = {
	title: 'API endpoints',
	description: 'HTTP endpoints for Void Presence.',
	openGraph: {
		title: 'Void Presence API endpoints',
		description:
			'Browse the HTTP API endpoints for Void Presence, including presence configs, status cycles and session info.',
		url: '/api',
	},
}

const endpoints: ApiEndpoint[] = [
	{
		id: 'presence-get-full',
		method: 'POST',
		path: '/api/v1/presence/{id}',
		title: 'Get presence config (full)',
		description:
			'Returns the full presence config document, including metadata and configData, by Firebase ID.',
		group: 'presence',
		hasExample: true,
	},
	{
		id: 'presence-copy',
		method: 'POST',
		path: '/api/v1/presence/{id}/copy',
		title: 'Copy presence config',
		description:
			'Creates a duplicate of the given presence config with a new ID while preserving metadata and configData.',
		group: 'presence',
		authRequired: true,
		hasExample: true,
	},
	{
		id: 'presence-download-json',
		method: 'GET',
		path: '/api/v1/presence/{id}/download',
		title: 'Download presence JSON',
		description:
			'Returns only the configData of a presence config as a downloadable JSON file and increments download counters.',
		group: 'presence',
		hasExample: true,
	},
	{
		id: 'presence-track-open',
		method: 'POST',
		path: '/api/v1/presence/{id}/track-open',
		title: 'Track presence open',
		description:
			'Signals that a presence config has been opened in the app and increments analytics counters.',
		group: 'analytics',
		hasExample: true,
	},
	{
		id: 'presence-delete',
		method: 'DELETE',
		path: '/api/v1/presence/{id}',
		title: 'Delete presence config',
		description:
			'Deletes a presence config by Firebase ID from the realtime database. Returns ok: true on success.',
		group: 'presence',
		authRequired: true,
		hasExample: true,
	},
	{
		id: 'statuses-get-full',
		method: 'POST',
		path: '/api/v1/statuses/{id}',
		title: 'Get status config (full)',
		description:
			'Returns the full status config document, including metadata and configData, by Firebase ID.',
		group: 'statuses',
		hasExample: true,
	},
	{
		id: 'statuses-copy',
		method: 'POST',
		path: '/api/v1/statuses/{id}/copy',
		title: 'Copy status config',
		description:
			'Creates a duplicate of the given status config with a new ID while preserving metadata and configData.',
		group: 'statuses',
		authRequired: true,
		hasExample: true,
	},
	{
		id: 'statuses-download-json',
		method: 'GET',
		path: '/api/v1/statuses/{id}/download',
		title: 'Download status JSON',
		description:
			'Returns only the configData of a status config as a downloadable JSON file and increments download counters.',
		group: 'statuses',
		hasExample: true,
	},
	{
		id: 'statuses-track-open',
		method: 'POST',
		path: '/api/v1/statuses/{id}/track-open',
		title: 'Track status open',
		description:
			'Signals that a status config has been opened in the app and increments analytics counters.',
		group: 'analytics',
		hasExample: true,
	},
	{
		id: 'statuses-delete',
		method: 'DELETE',
		path: '/api/v1/statuses/{id}',
		title: 'Delete status config',
		description:
			'Deletes a status config by Firebase ID from the realtime database. Returns ok: true on success.',
		group: 'statuses',
		authRequired: true,
		hasExample: true,
	},
	{
		id: 'auth-session',
		method: 'GET',
		path: '/api/auth/session',
		title: 'Get current session',
		description:
			'Returns the current next-auth session including provider, accessToken and Firebase custom token.',
		group: 'auth',
		authRequired: true,
		hasExample: true,
	},
	{
		id: 'auth-signin-provider',
		method: 'GET',
		path: '/api/auth/signin/{provider}',
		title: 'Start OAuth sign-in',
		description:
			'Starts OAuth sign-in for the given provider (google, discord, github, steam) and redirects to the provider.',
		group: 'auth',
		hasExample: false,
	},
	{
		id: 'auth-callback-provider',
		method: 'GET',
		path: '/api/auth/callback/{provider}',
		title: 'Handle OAuth callback',
		description: 'Route used by next-auth to handle OAuth callbacks for configured providers.',
		group: 'internal',
		hasExample: false,
	},
	{
		id: 'auth-steam-bridge',
		method: 'GET',
		path: '/api/auth/fuckoffnextauth/{provider}',
		title: 'Steam OAuth bridge',
		description:
			'Custom bridge route used by the Steam provider to normalize callback parameters before passing them to next-auth.',
		group: 'internal',
		hasExample: true,
	},
]

export default function ApiDocsPage() {
	return (
		<Page>
			<PageHeader
				title='API endpoints'
				subtitle='Browse HTTP endpoints in the same layout as your release schedule.'
			/>
			<ApiDocsClient initialEndpoints={endpoints} />
			<Footer />
		</Page>
	)
}
