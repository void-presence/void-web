import { getReleaseDownloads } from '@/lib/releases-application'
import { DownloadsContentBase } from '../../common/downloads-content-base'

export async function DownloadsContent() {
	const { items, error } = await getReleaseDownloads()

	return (
		<DownloadsContentBase
			items={items}
			error={error}
			scheduleHref='/schedule/application'
			downloadHref='/download'
			docsHref='/docs'
			chartTitle='Release downloads'
			scheduleLabel='Open application release schedule'
			context='application'
		/>
	)
}
