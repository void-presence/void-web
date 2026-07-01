import { db } from '@/service/firebase'
import { get, ref, remove } from 'firebase/database'
import { NextResponse } from 'next/server'

type Params = {
	id: string
}

export async function GET() {
	const cfgsRef = ref(db, 'status-configs')
	const snap = await get(cfgsRef)

	if (!snap.exists()) {
		return NextResponse.json([], { status: 200 })
	}

	return NextResponse.json(snap.val(), { status: 200 })
}

export async function POST(_req: Request, context: { params: Promise<Params> | Params }) {
	const { id } = await context.params

	const cfgRef = ref(db, `status-configs/${id}`)
	const snap = await get(cfgRef)

	if (!snap.exists()) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	return NextResponse.json(snap.val(), { status: 200 })
}

export async function DELETE(_req: Request, context: { params: Promise<Params> | Params }) {
	const { id } = await context.params

	const cfgRef = ref(db, `status-configs/${id}`)
	const snap = await get(cfgRef)

	if (!snap.exists()) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	await remove(cfgRef)

	return NextResponse.json({ ok: true }, { status: 200 })
}
