import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		status: 'success',
		message: 'Statuses',
		version: '1.0.0',
	})
}
