import Page from '@components/page'
import PageHeader from '@components/page-header'
import type { Metadata } from 'next'
import { ConfigDetailsClient } from './details-client'

type Params = {
	id: string
}

type Props = {
	params: Promise<Params> | Params
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { id } = await props.params

	return {
		title: 'Presence details',
		description: 'Inspect and use a community Void Presence Discord Rich Presence profile.',
		openGraph: {
			title: 'Presence details',
			description: 'Inspect and use a community Void Presence Discord Rich Presence profile.',
			url: `/presence/${id}`,
		},
	}
}

export default async function PresenceDetailsPage(props: Props) {
	const { id } = await props.params
	const previewTick = 0

	return (
		<Page>
			<PageHeader
				title='Presence details'
				subtitle='Inspect and use a community Discord Rich Presence profile'
			/>
			<ConfigDetailsClient configId={id} initialPreviewTick={previewTick} />
		</Page>
	)
}
