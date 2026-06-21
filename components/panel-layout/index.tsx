import { ReactNode } from 'react'
import styles from './layout-panels.module.css'

interface PanelLayoutProps {
	left?: ReactNode
	right?: ReactNode
	className?: string
}

export function PanelLayout({ left, right, className }: PanelLayoutProps) {
	const rootClassName = className ? `${styles.panel} ${className}` : styles.panel

	return (
		<section className={styles.wrapper_section_page}>
			<div className={rootClassName}>
				<div className={styles.wrapper_panel_left_side}>
					<div className={styles.panel_left_side}>{left}</div>
				</div>
				<div className={styles.panel_right_side}>{right}</div>
			</div>
		</section>
	)
}
