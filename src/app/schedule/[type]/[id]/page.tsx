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

function getProductLabel(type: ReleaseType) {
	if (type === 'application') return 'Application'
	if (type === 'installer') return 'Installer'
	return 'Updates'
}

function getProductPrefix(type: ReleaseType) {
	if (type === 'application') return 'Void Application'
	if (type === 'installer') return 'Void Installer'
	return 'Void Updates'
}

export async function generateMetadata(props: ReleaseDetailsPageProps): Promise<Metadata> {
	const { type, id } = await props.params

	const productLabel = getProductLabel(type)
	const productPrefix = getProductPrefix(type)

	const baseTitle = id ? `${productPrefix} ${id}` : `${productPrefix} Release`

	return {
		title: `${baseTitle} · ${productLabel} Release Details`,
		description: `Detailed information about this ${productPrefix} ${productLabel.toLowerCase()} release, including changelog and build metadata.`,
		openGraph: {
			title: `${baseTitle} · ${productLabel} Release Details`,
			description: `View full details for this ${productPrefix} ${productLabel.toLowerCase()} release, including changelog and downloadable assets.`,
			url: `/schedule/${type}/${id}`,
		},
	}
}

export default async function ReleaseDetailsPage(props: ReleaseDetailsPageProps) {
	const { type, id } = await props.params

	const productLabel = getProductLabel(type)
	const productPrefix = getProductPrefix(type)

	const title = id ? `${productPrefix} ${id}` : `${productPrefix} ${productLabel} Release`

	const subtitleBase =
		type === 'updates' || type === 'installer'
			? `Release details for the ${productPrefix.toLowerCase()} ${productLabel.toLowerCase()} loaded from GitHub release data.`
			: `Release details for the ${productPrefix.toLowerCase()} ${productLabel.toLowerCase()} loaded from GitHub release data and package.json tag.`

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
