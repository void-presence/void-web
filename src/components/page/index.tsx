import { ReactNode } from 'react'
import Header from '../navbar/index'
import styles from './page.module.scss'

type PageProps = {
	children?: ReactNode
	home?: boolean
}

const Page = ({ children, home = false }: PageProps) => {
	return (
		<>
			<Header />
			<main className={`${styles.main} ${home ? styles.home : styles.normal}`}>{children}</main>
		</>
	)
}

export default Page
