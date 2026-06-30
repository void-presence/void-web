import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		status: 'success',
		message: 'Presence',
		version: '1.0.0',
	})
}
