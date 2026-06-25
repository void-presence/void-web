'use client'

import styles from './label.module.scss'

interface RpcLabelProps {
	text?: string
}

export default function RpcLabel({ text = 'VIEW' }: RpcLabelProps) {
	const full = `VOID PRESENCE · ${text}`

	return (
		<div className={styles.rpc_label} aria-label={full}>
			<span className={styles.rpc_label_text} data-text={full}>
				{full}
			</span>
		</div>
	)
}
