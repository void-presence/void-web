import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const url = req.nextUrl
	const hostname = req.headers.get('host') || ''

	const isApiSubdomain = hostname.startsWith('api.')

	if (isApiSubdomain) {
		const path = url.pathname
		return NextResponse.rewrite(new URL(`/api${path}`, req.url))
	}

	const isMainDomainApiCall = url.pathname.startsWith('/api')
	if (isMainDomainApiCall) {
		const cleanPath = url.pathname.replace(/^\/api/, '')

		const searchParams = url.search

		const apiSubdomainUrl = `https://voidpresence.site${cleanPath}${searchParams}`

		return NextResponse.redirect(new URL(apiSubdomainUrl, req.url))
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
