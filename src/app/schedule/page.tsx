import type { Metadata } from 'next'
import { Suspense } from 'react'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import ReleaseListSkeleton from './release-list-skeleton'
import { ReleasesSection } from './releases-section'

export const metadata: Metadata = {
	title: 'Release Schedule',
	description:
		'Release schedule and history for Void Presence with version timeline and GitHub release data.',
	openGraph: {
		title: 'Void Presence Release Schedule',
		description:
			'Track Void Presence releases, prereleases, and changelog history in one place.',
		url: '/schedule',
	},
}

export default function SchedulePage() {
	return (
		<Page>
			<main id='main-page-content'>
				<PageHeader
					title='Void Presence Release Schedule'
					subtitle='Track current and past releases, prereleases, and published builds.'
				/>
				<Suspense
					fallback={
						<ReleaseListSkeleton
							countSkeleton={5}
							backBtn={false}
							analytics={false}
							list={true}
						/>
					}
				>
					<ReleasesSection />
				</Suspense>
			</main>
			<Footer />
		</Page>
	)
}
