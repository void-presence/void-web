import Footer from '@components/footer'
import Page from '@components/page'
import PageHeader from '@components/page-header'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReleaseListSkeleton from '../../release-list-skeleton'
import { ReleaseDetailsContent } from './release-details-content'

type ReleaseType = 'application' | 'installer' | 'updates'

interface ReleaseDetailsPageProps {
	params: Promise<{ type: ReleaseType; id: string }>
	searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata(props: ReleaseDetailsPageProps): Promise<Metadata> {
	const { type, id } = await props.params

	const isApplication = type === 'application'
	const isInstaller = type === 'installer'
	const isUpdates = type === 'updates'

	const productLabel = isUpdates ? 'Updates' : isApplication ? 'Application' : 'Installer'

	const baseTitle = id ? `Void Presence ${id}` : 'Void Presence Release'

	return {
		title: `${baseTitle} · ${productLabel} Release Details`,
		description: `Detailed information about this Void Presence ${productLabel.toLowerCase()} release, including changelog and build metadata.`,
		openGraph: {
			title: `${baseTitle} · ${productLabel} Release Details`,
			description: `View full details for this Void Presence ${productLabel.toLowerCase()} release, including changelog and downloadable assets.`,
			url: `/schedule/${type}/${id}`,
		},
	}
}

export default async function ReleaseDetailsPage(props: ReleaseDetailsPageProps) {
	const { type, id } = await props.params

	const isApplication = type === 'application'
	const isInstaller = type === 'installer'
	const isUpdates = type === 'updates'

	const productLabel = isUpdates ? 'Updates' : isApplication ? 'Application' : 'Installer'

	const title = id ? `Void Presence ${id}` : `Void Presence ${productLabel} Release`

	const subtitleBase =
		isUpdates || isInstaller
			? `Release details for the Void Presence ${productLabel.toLowerCase()} loaded from GitHub release data.`
			: `Release details for the Void Presence ${productLabel.toLowerCase()} loaded from GitHub release data and package.json tag.`

	return (
		<Page>
			<PageHeader title={title} subtitle={subtitleBase} />
			<Suspense fallback={<ReleaseListSkeleton countSkeleton={1} backBtn={true} list={true} />}>
				<ReleaseDetailsContent type={type} id={id} />
			</Suspense>
			<Footer />
		</Page>
	)
}
