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
		title: 'Config details',
		description: 'Inspect and use a community Void Presence Discord Rich Presence config.',
		openGraph: {
			title: 'Config details',
			description: 'Inspect and use a community Void Presence Discord Rich Presence config.',
			url: `/configs/${id}`,
		},
	}
}

export default async function ConfigDetailsPage(props: Props) {
	const { id } = await props.params
	const previewTick = 0

	return (
		<Page>
			<PageHeader
				title='Pick a Config!'
				subtitle='Browse community custom Discord Rich Presence configs'
			/>
			<ConfigDetailsClient configId={id} initialPreviewTick={previewTick} />
		</Page>
	)
}
