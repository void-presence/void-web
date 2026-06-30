import Footer from '@components/footer'
import Page from '@components/page'
import PageHeader from '@components/page-header'
import { PanelLayout } from '@components/panel-layout'
import { fetchAuthorByName } from '@service/firebase'
import { Metadata } from 'next'
import { leftNotFound, rightNotFound } from '../../../not-found'
import { default as styles } from '../../download/download.module.scss'
import { ProfileClient } from './profile-client'

type Params = {
	id: string
}

type Props = {
	params: Params
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { id } = await props.params
	const user = await fetchAuthorByName(id)

	if (!user) {
		return {
			title: 'User not found – Void Presence',
			description: 'The requested Void Presence profile could not be found.',
		}
	}

	return {
		title: `${user.name}'s Profile`,
		description: `View Discord Rich Presence configs, status cycles, and custom styles created by ${user.name}.`,
		openGraph: {
			title: `Void Presence – ${user.name}'s Profile`,
			description: `Explore custom Discord Rich Presence setups linked to ${user.name}'s Author ID.`,
			url: `/profile/${id}`,
		},
	}
}

export default async function ProfilePage(props: Props) {
	const { id } = await props.params

	const user = await fetchAuthorByName(id)

	if (!user) {
		return (
			<Page>
				<PageHeader title='User Profile' subtitle='User not found' />
				<PanelLayout
					left={leftNotFound({ text: 'Go to configs page', url: '/configs' })}
					right={rightNotFound}
					className={styles.not_found_panel}
				/>
				<Footer />
			</Page>
		)
	}

	return (
		<Page>
			<PageHeader title='User Profile' subtitle={`User configs from ${user.name}`} />
			<ProfileClient userId={user.id} />
			<Footer />
		</Page>
	)
}
