import type { Metadata } from 'next'
import { Suspense } from 'react'
import Footer from '../../../../components/footer'
import Page from '../../../../components/page'
import PageHeader from '../../../../components/page-header'
import ReleaseListSkeleton from '../release-list-skeleton'
import { ReleaseDetailsContent } from './release-details-content'

export async function generateMetadata(
	props: ReleaseDetailsPageProps,
): Promise<Metadata> {
	const { id } = await props.params

	return {
		title: 'Release Schedule',
		description:
			'Release schedule and history for Void Presence with version timeline and GitHub release data.',
		openGraph: {
			title: 'Void Presence Release Schedule',
			description:
				'Track Void Presence releases, prereleases, and changelog history in one place.',
			url: `/schedule/${id}`,
		},
	}
}

interface ReleaseDetailsPageProps {
	params: Promise<{ id: string }>
	searchParams: Record<string, string | string[] | undefined>
}

export default async function ReleaseDetailsPage(
	props: ReleaseDetailsPageProps,
) {
	const { id } = await props.params
	const title = id ? `Void Presence ${id}` : 'Void Presence Release'

	return (
		<Page>
			<PageHeader
				title={title}
				subtitle='Release details loaded from GitHub release and this tag package.json.'
			/>
			<Suspense
				fallback={
					<ReleaseListSkeleton countSkeleton={1} backBtn={true} list={true} />
				}
			>
				<ReleaseDetailsContent id={id} />
			</Suspense>
			<Footer />
		</Page>
	)
}
