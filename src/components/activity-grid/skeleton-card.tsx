'use client'

import styles from './activity-grid.module.scss'

type SkeletonCardProps = {
	height?: 'presence' | 'status'
}

export function SkeletonCard({ height = 'presence' }: SkeletonCardProps) {
	return (
		<div
			className={`${styles.skeleton_card_wrap} ${
				height === 'status' ? styles.skeleton_card_wrap_status : styles.skeleton_card_wrap_presence
			}`}
		>
			<div className={styles.skeleton_card}>
				<div className={styles.skeleton_card_header}>
					<div className={styles.skeleton_title}></div>
				</div>
				<div
					className={`${styles.skeleton_rpc_preview} ${
						height === 'status'
							? styles.skeleton_rpc_preview_status
							: styles.skeleton_rpc_preview_presence
					}`}
				></div>
				<div className={styles.skeleton_card_actions}>
					<div className={styles.skeleton_download_tag}></div>
					<div className={styles.skeleton_action_buttons}>
						<div className={styles.skeleton_btn_primary}></div>
						<div className={styles.skeleton_btn_secondary}></div>
					</div>
				</div>
			</div>
		</div>
	)
}
