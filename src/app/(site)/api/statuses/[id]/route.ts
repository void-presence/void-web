import { db } from '@/service/firebase'
import { get, ref, remove } from 'firebase/database'
import { NextResponse } from 'next/server'

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params

	const cfgRef = ref(db, `presence-configs/${id}`)
	const snap = await get(cfgRef)

	if (!snap.exists()) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	await remove(cfgRef)

	return NextResponse.json({ ok: true })
}
