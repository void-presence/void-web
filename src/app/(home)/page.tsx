'use client'

import { useEffect, useState } from 'react'
import Footer from '../../../components/footer'
import Page from '../../../components/page'
import RpcPreview from '../../../components/rpc-preview'
import config from '../../../data/config.json'
import ConfigPreview from './config-preview'
import FeaturesSection from './features-section'
import HeroSection from './hero-section'
import InstallGuide from './install-guide-section'

export default function Home() {
	const [currentIndex, setCurrentIndex] = useState<number>(0)
	const [activeTab, setActiveTab] = useState<'MAIN' | 'LOGS' | 'CONFIG'>('CONFIG')

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % config.cycles.length)
		}, 1500)

		return () => clearInterval(interval)
	}, [])

	const currentCycle = config.cycles[currentIndex]
	const currentImage = config.imageCycles[currentIndex]
	const currentButtons = config.buttonPairs[currentIndex]

	return (
		<Page home={true}>
			<HeroSection />
			<RpcPreview
				currentCycle={currentCycle}
				currentImage={currentImage}
				currentButtons={currentButtons}
				currentIndex={currentIndex}
				config={config}
			/>
			<ConfigPreview activeTab={activeTab} setActiveTab={setActiveTab} />
			<FeaturesSection />
			<InstallGuide />
			<section
				style={{
					scrollSnapAlign: 'start' as const,
				}}
			>
				<Footer />
			</section>
		</Page>
	)
}
