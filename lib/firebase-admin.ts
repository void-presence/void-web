import * as firebaseAdminModule from 'firebase-admin'

// @ts-ignore
const firebaseAdmin = firebaseAdminModule.default || firebaseAdminModule
const admin = firebaseAdmin

if (!admin.apps || admin.apps.length === 0) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
			}),
		})
	} catch (error: any) {
		console.error(error)
	}
}

export { admin }
