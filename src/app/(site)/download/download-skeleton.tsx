import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.scss'
import { default as skeletonStyles, default as styles } from '@styles/skeleton.module.scss'

export default function DownloadSkeleton() {
	const left = (
		<>
			<div
				className={`${skeletonStyles.skeleton_release_meta} ${skeletonStyles.skeleton_release_meta_release}`}
			>
				<div className={skeletonStyles.skeleton_row}>
					<div className={skeletonStyles.skeleton_label} />
				</div>
				<div className={skeletonStyles.skeleton_row}>
					<div className={skeletonStyles.skeleton_label} />
				</div>
			</div>

			<div className={styles.skeleton_meta}>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
				<div className={styles.skeleton_row}>
					<div className={styles.skeleton_label} />
					<div className={styles.skeleton_value_short} />
				</div>
			</div>

			<div
				className={`${skeletonStyles.skeleton_release_meta} ${skeletonStyles.skeleton_release_meta_info}`}
			>
				<div className={skeletonStyles.skeleton_row}>
					<div className={skeletonStyles.skeleton_label} />
				</div>
				<div className={skeletonStyles.skeleton_row}>
					<div className={skeletonStyles.skeleton_label} />
				</div>
			</div>
			<div
				className={`${skeletonStyles.skeleton_release_meta} ${skeletonStyles.skeleton_release_meta_info}`}
			>
				<div className={skeletonStyles.skeleton_row}>
					<div className={skeletonStyles.skeleton_label} />
				</div>
				<div className={skeletonStyles.skeleton_row}>
					<div className={skeletonStyles.skeleton_label} />
				</div>
			</div>
		</>
	)

	const right = (
		<section className={styles.page_section}>
			<div className={layoutStyles.preview_card_wrap}>
				<div className={layoutStyles.preview_card}>
					<div className={layoutStyles.preview_header}>
						<div className={styles.skeleton_title} />
						<div className={styles.skeleton_badge} />
					</div>

					<div className={styles.skeleton_changelog} />
					<div className={styles.skeleton_changelog_footer} />
				</div>
			</div>
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
