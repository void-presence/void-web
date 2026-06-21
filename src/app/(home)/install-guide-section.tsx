'use client'

import RpcLabel from '@components/label'
import AppShell from './app-shell'
import styles from './install-guide-section.module.css'

export default function InstallGuide() {
	return (
		<section id='install-guide-section' className={styles.config_section}>
			<div className={`${styles.page_section_inner} ${styles.rpc_inner}`}>
				<RpcLabel text='INSTALL' />
				<AppShell
					title='VOID'
					subtitle='INSTALL GUIDE'
					tabs={[
						{ id: 'windows', label: 'WINDOWS' },
						{ id: 'macos', label: 'MACOS' },
						{ id: 'linux', label: 'LINUX' },
					]}
					activeTabId='windows'
					statusLabel='STEP BY STEP'
					statusHint='Install · Connect · Start Rich Presence'
				>
					<div className={styles.install_steps}>
						<div className={styles.install_step}>
							<div className={styles.step_body}>
								<div className={styles.step_title}>Download Void Presence</div>
								<div className={styles.step_text}>
									Grab the latest release from GitHub releases and extract it to any folder you
									control.
								</div>
							</div>
						</div>
						<div className={styles.install_step}>
							<div className={styles.step_body}>
								<div className={styles.step_title}>Add your Discord Client ID</div>
								<div className={styles.step_text}>
									Open the app, paste your Discord application client ID into the Client ID field
									and hit Save.
								</div>
							</div>
						</div>
						<div className={styles.install_step}>
							<div className={styles.step_body}>
								<div className={styles.step_title}>Start Rich Presence</div>
								<div className={styles.step_text}>
									Press Start or enable Auto‑launch to keep your custom presence running while
									Discord is open.
								</div>
							</div>
						</div>
					</div>
					<div className={styles.install_footer_hint}>
						Need help? Full documentation lives inside /documentation.
					</div>
				</AppShell>
			</div>
		</section>
	)
}
