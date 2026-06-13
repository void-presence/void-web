import type { Metadata } from 'next'
import { Suspense } from 'react'
import Footer from '../../../../components/footer'
import Page from '../../../../components/page'
import PageHeader from '../../../../components/page-header'
import ReleaseListSkeleton from '../release-list-skeleton'
import { DownloadsContent } from './downloads-content'

export const metadata: Metadata = {
	title: 'Release Downloads Analytics',
	description:
		'Downloads analytics for all Void Presence releases, based on GitHub release assets.',
	openGraph: {
		title: 'Void Presence Release Downloads',
		description:
			'View download counts for all Void Presence releases and compare their adoption.',
		url: '/schedule/downloads',
	},
}

export default function DownloadsPage() {
	const title = 'Void Presence Release Downloads'

	return (
		<Page>
			<PageHeader
				title={title}
				subtitle='Downloads analytics for all releases, loaded from GitHub release assets.'
			/>
			<Suspense
				fallback={
					<ReleaseListSkeleton
						countSkeleton={0}
						backBtn={true}
						analytics={true}
					/>
				}
			>
				<DownloadsContent />
			</Suspense>
			<Footer />
		</Page>
	)
}
