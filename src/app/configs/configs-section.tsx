import Footer from '../../../components/footer'
import Page from '../../../components/page'
import PageHeader from '../../../components/page-header'
import { ConfigsClient } from './configs-client'
import styles from './configs.module.css'

type Props = {
	initialSearchTerm: string
}

export function ConfigsSection({ initialSearchTerm }: Props) {
	return (
		<Page>
			<PageHeader
				title='Pick a Config!'
				subtitle='Browse community custom Discord Rich Presence configs'
			/>

			<section className={styles.section_themes_panel}>
				<div className={styles.themes_panel}>
					<ConfigsClient initialConfigs={[]} initialSearchTerm={initialSearchTerm} />
				</div>
			</section>
			<Footer />
		</Page>
	)
}
