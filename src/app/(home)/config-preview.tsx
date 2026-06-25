'use client'

import { Dispatch, SetStateAction } from 'react'

import RpcLabel from '@components/label'
import AppShell from './app-shell'
import styles from './config-preview.module.scss'

interface Props {
	activeTab: 'MAIN' | 'LOGS' | 'CONFIG'
	setActiveTab: Dispatch<SetStateAction<'MAIN' | 'LOGS' | 'CONFIG'>>
}

export default function ConfigPreview({ activeTab, setActiveTab }: Props) {
	return (
		<section id='config-preview-section' className={styles.config_section}>
			<div className={`${styles.page_section_inner} ${styles.rpc_inner}`}>
				<RpcLabel />
				<AppShell
					title='VOID'
					subtitle='PRESENCE'
					tabs={[
						{ id: 'MAIN', label: 'MAIN' },
						{ id: 'LOGS', label: 'LOGS' },
						{ id: 'CONFIG', label: 'CONFIG' },
					]}
					activeTabId={activeTab}
					onTabChange={id => setActiveTab(id as Props['activeTab'])}
					statusLabel='ACTIVE'
					statusHint='Profiles · Status cycles · Buttons · Images'
				>
					{activeTab === 'MAIN' && (
						<div className={styles.config_tab_view}>
							<div className={styles.config_row}>
								<div className={styles.config_field_label}>CLIENT ID</div>
								<div className={styles.config_field_group}>
									<div className={styles.config_field_input}>123456789012345678</div>
									<button className={styles.config_field_button}>SAVE</button>
								</div>
							</div>
							<div className={styles.config_row}>
								<div className={styles.config_field_label}>INTERVAL</div>
								<div className={styles.config_field_group}>
									<div className={styles.config_field_input}>30 sec</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'LOGS' && (
						<div className={styles.config_tab_view}>
							<div className={styles.log_entry}>
								<span className={styles.log_time}>15:18:17</span>
								<span className={styles.log_level}>INFO</span>
								<span className={styles.log_text}>RPC ready</span>
							</div>
							<div className={styles.log_entry}>
								<span className={styles.log_time}>15:18:17</span>
								<span className={styles.log_level}>INFO</span>
								<span className={styles.log_text}>Connecting RPC with clientId</span>
							</div>
						</div>
					)}

					{activeTab === 'CONFIG' && (
						<div className={styles.config_tab_view}>
							<div className={styles.config_row}>
								<div className={styles.config_field_label}>NAME</div>
								<div className={styles.config_field_group}>
									<div className={styles.config_field_input}>profile name</div>
									<button className={styles.config_field_button}>SAVE</button>
								</div>
							</div>

							<div className={styles.config_row}>
								<div className={styles.config_field_label}>SAVED CONFIGS</div>
								<button className={styles.config_add_button}>+ CONFIG</button>
							</div>

							<div className={styles.config_footer_row}>
								<span>cycles · imageCycles · buttonPairs</span>
								<span>JSON profiles live inside /config</span>
							</div>
						</div>
					)}
				</AppShell>
			</div>
		</section>
	)
}
