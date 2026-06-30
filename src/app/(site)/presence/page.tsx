import type { Metadata } from 'next'
import { ConfigsSection } from './presence-section'

type SearchParams = {
	q?: string
}

type PageProps = {
	searchParams: Promise<SearchParams> | SearchParams
}

export const metadata: Metadata = {
	title: 'Presence profiles',
	description:
		'Browse and search shared Void Presence profiles to quickly set up your Discord Rich Presence.',
	openGraph: {
		title: 'Void Presence profiles',
		description: 'Discover ready-to-use Void Presence profiles and import them into your setup.',
		url: '/presence',
	},
}

export default async function ConfigsPage(props: PageProps) {
	const { q = '' } = await props.searchParams
	const searchTerm = q || ''

	return <ConfigsSection initialSearchTerm={searchTerm} />
}
