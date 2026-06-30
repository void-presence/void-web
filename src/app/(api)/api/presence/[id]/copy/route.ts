import { getConfigById, incrementDownloadsConfigs } from '@service/firebase'
import { NextResponse } from 'next/server'

type Params = {
	id: string
}

async function handleCopyConfig(id: string) {
	const config = await getConfigById(id)

	await incrementDownloadsConfigs(id)

	if (!config) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	return NextResponse.json(config, { status: 200 })
}

export async function POST(_req: Request, ctx: { params: Promise<Params> | Params }) {
	const { id } = await ctx.params
	return handleCopyConfig(id)
}

export async function GET(_req: Request, ctx: { params: Promise<Params> | Params }) {
	const { id } = await ctx.params
	return handleCopyConfig(id)
}
