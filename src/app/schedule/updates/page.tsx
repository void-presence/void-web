import Footer from '@components/footer'
import Page from '@components/page'
import PageHeader from '@components/page-header'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReleaseListSkeleton from '../release-list-skeleton'
import ReleasesSection from './releases-section'

export const metadata: Metadata = {
	title: 'Updates',
	description:
		'Release history for Void Presence updates with version timeline and GitHub release data.',
	openGraph: {
		title: 'Void Presence Updates',
		description: 'Track Void Presence updates and changelog history in one place.',
		url: '/schedule/updates',
	},
}

export default function UpdatesPage() {
	return (
		<Page>
			<PageHeader
				title='Void Presence Updates'
				subtitle='Track current and past updates and published builds.'
			/>
			<Suspense
				fallback={
					<ReleaseListSkeleton countSkeleton={5} backBtn={false} analytics={false} list={true} />
				}
			>
				<ReleasesSection />
			</Suspense>
			<Footer />
		</Page>
	)
}
