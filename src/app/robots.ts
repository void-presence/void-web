import { MetadataRoute } from 'next'

const siteUrl = 'https://voidpresence.site'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	}
}
