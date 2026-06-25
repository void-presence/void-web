'use client'

import { ReactNode } from 'react'
import styles from './page-header.module.scss'

interface PageHeaderProps {
	title: string
	subtitle: string
	rightSlot?: ReactNode
}

export default function PageHeader({ title, subtitle, rightSlot }: PageHeaderProps) {
	return (
		<section id='configs-header' className={styles.content_header}>
			<div
				className={`${styles.page_section_inner} ${styles.flex_container} ${styles.justify_between} ${styles.align_center}`}
			>
				<div className={styles.header_left}>
					<h1 className={styles.title}>{title}</h1>
					<p className={styles.title_tooltip}>{subtitle}</p>
				</div>

				{rightSlot && <div className={styles.header_right}>{rightSlot}</div>}
			</div>
		</section>
	)
}
