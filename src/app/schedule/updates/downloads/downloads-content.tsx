import { getReleaseDownloads } from '@/lib/releases-updates'
import { DownloadsContentBase } from '../../common/downloads-content-base'

export async function DownloadsContent() {
	const { items, error } = await getReleaseDownloads()

	return (
		<DownloadsContentBase
			items={items}
			error={error}
			scheduleHref='/schedule/updates'
			downloadHref='/download'
			docsHref='/docs'
			chartTitle='Release downloads'
			scheduleLabel='Open updates release schedule'
			context='updates'
		/>
	)
}
