import { getStatusById, incrementDownloadsStatuses } from '@/service/firebase'
import { NextResponse } from 'next/server'

type Params = {
	id: string
}

async function handleCopyStatus(id: string) {
	const config = await getStatusById(id)

	await incrementDownloadsStatuses(id)

	if (!config) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	return NextResponse.json(config, { status: 200 })
}

export async function POST(_req: Request, ctx: { params: Promise<Params> | Params }) {
	const { id } = await ctx.params
	return handleCopyStatus(id)
}

export async function GET(_req: Request, ctx: { params: Promise<Params> | Params }) {
	const { id } = await ctx.params
	return handleCopyStatus(id)
}
