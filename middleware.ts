import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const isProfile = req.nextUrl.pathname.startsWith('/profile')
	if (!isProfile) return NextResponse.next()

	return NextResponse.next()
}

export const config = {
	matcher: ['/profile'],
}
