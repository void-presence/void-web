import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const url = req.nextUrl
	const hostname = req.headers.get('host') || ''
	const origin = req.headers.get('origin') || ''

	const allowedOrigins = ['https://voidpresence.site', 'http://localhost:3000']
	const isAllowedOrigin = allowedOrigins.includes(origin)
	const isApiSubdomain = hostname.startsWith('api.')

	if (isApiSubdomain) {
		if (req.method === 'OPTIONS') {
			const response = new NextResponse(null, { status: 204 })
			if (isAllowedOrigin) {
				response.headers.set('Access-Control-Allow-Origin', origin)
				response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
				response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
				response.headers.set('Access-Control-Allow-Credentials', 'true')
				response.headers.set(
					'Access-Control-Allow-Headers',
					'Content-Type, Authorization, Cookie, Origin, X-Requested-With'
				)
			}
			return response
		}

		const path = url.pathname
		const response = NextResponse.rewrite(new URL(`/api${path}`, req.url))

		if (isAllowedOrigin) {
			response.headers.set('Access-Control-Allow-Origin', origin)
			response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
			response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
			response.headers.set('Access-Control-Allow-Credentials', 'true')
			response.headers.set(
				'Access-Control-Allow-Headers',
				'Content-Type, Authorization, Cookie, Origin, X-Requested-With'
			)
		}
		return response
	}

	const isMainDomainApiCall = url.pathname.startsWith('/api')
	if (isMainDomainApiCall) {
		const cleanPath = url.pathname.replace(/^\/api/, '')
		const searchParams = url.search

		const isDev = hostname.includes('localhost')
		const targetHost = isDev ? 'api.localhost:3000' : 'api.voidpresence.site'
		const protocol = isDev ? 'http' : 'https'

		const apiSubdomainUrl = `${protocol}://${targetHost}${cleanPath}${searchParams}`
		const response = NextResponse.redirect(new URL(apiSubdomainUrl, req.url))

		if (isAllowedOrigin) {
			response.headers.set('Access-Control-Allow-Origin', origin)
			response.headers.set('Access-Control-Allow-Credentials', 'true')
		}
		return response
	}

	const isProfile = url.pathname.startsWith('/profile')
	if (isProfile) {
		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|robots.txt).*)'],
}
