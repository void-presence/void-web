import type { Metadata } from 'next'
import { StatusSection } from './statuses-section'

type SearchParams = {
	q?: string
}

type PageProps = {
	searchParams: Promise<SearchParams> | SearchParams
}

export const metadata: Metadata = {
	title: 'Statuses',
	description: 'Browse and search shared Void Presence statuses.',
	openGraph: {
		title: 'Void Presence Statuses',
		description: 'Discover ready-to-use Void Presence statuses and import them into your setup.',
		url: '/statuses',
	},
}

export default async function StatusPage(props: PageProps) {
	const { q = '' } = await props.searchParams
	const searchTerm = q || ''

	return <StatusSection initialSearchTerm={searchTerm} />
}
