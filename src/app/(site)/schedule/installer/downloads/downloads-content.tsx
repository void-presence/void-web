import { getInstallerReleaseDownloads } from '@/lib/releases-installer'
import { DownloadsContentBase } from '../../common/downloads-content-base'

export async function DownloadsContent() {
	const { items, error } = await getInstallerReleaseDownloads()

	return (
		<DownloadsContentBase
			items={items}
			error={error}
			scheduleHref='/schedule/installer'
			downloadHref='/download'
			docsHref='/docs'
			chartTitle='Installer downloads'
			scheduleLabel='Open installer release schedule'
			context='installer'
		/>
	)
}
