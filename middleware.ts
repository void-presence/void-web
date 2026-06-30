import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const url = req.nextUrl
	const hostname = req.headers.get('host') || ''
	const pathname = url.pathname
	const search = url.search

	const isApiSubdomain = hostname.startsWith('api.')
	const isMainDomainApiCall = pathname.startsWith('/api')

	if (!isApiSubdomain && isMainDomainApiCall) {
		const cleanPath = pathname.replace(/^\/api/, '') || '/'
		const apiSubdomainUrl = `https://api.voidpresence.site${cleanPath}${search}`
		return NextResponse.redirect(apiSubdomainUrl)
	}

	if (isApiSubdomain) {
		if (pathname.startsWith('/api')) {
			return NextResponse.next()
		}

		const rewrittenPath = `/api${pathname}`
		const rewrittenUrl = new URL(rewrittenPath + search, req.url)
		return NextResponse.rewrite(rewrittenUrl)
	}

	if (pathname.startsWith('/profile')) {
		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|robots.txt).*)'],
}
