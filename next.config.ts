/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '**.com' },
			{ protocol: 'https', hostname: '**.net' },
			{ protocol: 'https', hostname: '**.org' },
			{ protocol: 'https', hostname: '**.co' },
			{ protocol: 'https', hostname: '**.ru' },
			{ protocol: 'http', hostname: 'localhost' },
			{ protocol: 'https', hostname: 'cdn.discordapp.com' },
		],
	},
}

module.exports = nextConfig
