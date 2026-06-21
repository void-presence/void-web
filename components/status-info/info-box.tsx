import Link from 'next/link'
import { ReactNode } from 'react'
import styles from './info-box.module.css'

type InfoBoxProps = {
	title?: string
	lines?: string[]
	variant?: 'default' | 'muted' | 'secondary'
	linkHref?: string
	linkLabel?: string
	children?: ReactNode
}

export function InfoBox({
	title,
	lines = [],
	variant = 'default',
	linkHref,
	linkLabel,
	children,
}: InfoBoxProps) {
	const boxClass =
		variant === 'muted'
			? styles.info_box_muted
			: variant === 'secondary'
				? styles.info_box_secondary
				: styles.info_box

	return (
		<div className={boxClass}>
			{title && <h4 className={styles.info_title}>{title}</h4>}

			{lines.map((line, idx) => (
				<p key={idx} className={variant === 'muted' ? styles.info_small : styles.info_text}>
					{line}
				</p>
			))}

			{children}

			{variant === 'muted' && linkHref && linkLabel && (
				<Link href={linkHref} className={styles.back_link}>
					{linkLabel}
				</Link>
			)}

			{variant != 'muted' && linkHref && linkLabel && (
				<Link href={linkHref} className={styles.action_button}>
					{linkLabel}
				</Link>
			)}
		</div>
	)
}
