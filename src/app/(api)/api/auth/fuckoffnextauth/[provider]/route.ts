import { NextRequest } from 'next/server'

type Params = { params: Promise<{ provider: string }> }

export async function GET(req: NextRequest, { params }: Params) {
	const { provider } = await params
	const { searchParams } = new URL(req.url)

	searchParams.set('code', '123')

	const redirectUrl = `${process.env.NEXTAUTH_URL}/auth/callback/${provider}?${searchParams.toString()}`

	return Response.redirect(redirectUrl)
}

export async function POST(req: NextRequest, { params }: Params) {
	return GET(req, { params })
}
