import { incrementDownloadsConfigs } from '@service/firebase'
import { NextResponse } from 'next/server'

type Params = { id: string }

export async function POST(_req: Request, ctx: { params: Promise<Params> | Params }) {
	try {
		const { id } = await ctx.params
		await incrementDownloadsConfigs(id)
		return NextResponse.json({ ok: true })
	} catch (err) {
		const message = err instanceof Error ? err.message : JSON.stringify(err)
		return NextResponse.json({ error: 'Internal error', message }, { status: 500 })
	}
}
