import Footer from '@components/footer'
import Page from '../../../../components/page'
import PageHeader from '../../../../components/page-header'
import { fetchAuthorByName } from '../../../../service/firebase'
import { ProfileClient } from './profile-client'

type Params = {
	id: string
}

type Props = {
	params: Params
}

export default async function ProfilePage(props: Props) {
	const { id } = await props.params

	const user = await fetchAuthorByName(id)

	if (!user) {
		return (
			<Page>
				<PageHeader title='User Profile' subtitle='User not found' />
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
