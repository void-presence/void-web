import { PanelLayout } from '@components/panel-layout'
import layoutStyles from '@components/panel-layout/layout-panels.module.css'
import skeletonStyles from '../../../styles/skeleton.module.css'
import scheduleStyles from './schedule.module.css'

export default function ReleaseListSkeleton({
	countSkeleton,
	backBtn,
	analytics,
	list,
}: {
	countSkeleton: number
	backBtn?: boolean
	analytics?: boolean
	list?: boolean
}) {
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

			{!analytics && (
				<div className={skeletonStyles.skeleton_meta}>
					<div className={skeletonStyles.skeleton_row}>
						<div className={skeletonStyles.skeleton_label} />
						<div className={skeletonStyles.skeleton_value_short} />
					</div>
					<div className={skeletonStyles.skeleton_row}>
						<div className={skeletonStyles.skeleton_label} />
						<div className={skeletonStyles.skeleton_value_short} />
					</div>
					<div className={skeletonStyles.skeleton_row}>
						<div className={skeletonStyles.skeleton_label} />
						<div className={skeletonStyles.skeleton_value_short} />
					</div>
				</div>
			)}

			{analytics && (
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
			)}

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
		<section className={scheduleStyles.page_section}>
			{backBtn === true && (
				<div
					className={layoutStyles.preview_card_wrap}
					style={{ marginBottom: 20, height: 88 }}
				>
					<div
						className={layoutStyles.preview_card}
						style={{ flexDirection: 'row' }}
					>
						<div
							className={layoutStyles.preview_header}
							style={{ width: '100%' }}
						>
							<div
								className={skeletonStyles.skeleton_title}
								style={{ width: '100%', height: 40, borderRadius: 12 }}
							/>
						</div>
					</div>
				</div>
			)}
			{analytics === true && (
				<div
					className={layoutStyles.preview_card_wrap}
					style={{ marginBottom: 20, height: 342 }}
				>
					<div className={layoutStyles.preview_card}>
						<div className={layoutStyles.preview_header}>
							<div className={skeletonStyles.skeleton_title} />
							<div className={skeletonStyles.skeleton_badge} />
						</div>
						<div className={skeletonStyles.skeleton_chart} />
					</div>
				</div>
			)}
			{backBtn === false && (
				<div
					className={layoutStyles.preview_card_wrap}
					style={{ marginBottom: 20, height: 88 }}
				>
					<div
						className={layoutStyles.preview_card}
						style={{ flexDirection: 'row' }}
					>
						<div
							className={layoutStyles.preview_header}
							style={{ width: '100%' }}
						>
							<div
								className={skeletonStyles.skeleton_title}
								style={{ width: '100%', height: 40, borderRadius: 12 }}
							/>
						</div>
					</div>
				</div>
			)}
			{list === true && (
				<div className={layoutStyles.preview_card_wrap}>
					<div className={layoutStyles.preview_card}>
						<div className={layoutStyles.preview_header}>
							<div className={skeletonStyles.skeleton_title} />
							<div className={skeletonStyles.skeleton_badge} />
						</div>

						<ul className={scheduleStyles.release_list}>
							{Array.from({ length: countSkeleton }).map((_, idx) => (
								<li key={idx} className={scheduleStyles.release_item}>
									<div className={scheduleStyles.release_card}>
										<div className={scheduleStyles.release_card_top}>
											<div className={scheduleStyles.release_card_left}>
												<div className={skeletonStyles.skeleton_version_row}>
													<div className={skeletonStyles.skeleton_version} />
													<div
														className={skeletonStyles.skeleton_badge_small}
													/>
												</div>
											</div>
											<div className={skeletonStyles.skeleton_date} />
										</div>

										<div className={scheduleStyles.release_card_meta}>
											<div className={skeletonStyles.skeleton_meta_chip} />
										</div>
										<div className={scheduleStyles.release_card_meta}>
											<div
												className={skeletonStyles.skeleton_meta_chip_changelog}
											/>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</section>
	)

	return <PanelLayout left={left} right={right} />
}
