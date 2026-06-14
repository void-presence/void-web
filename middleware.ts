import { auth } from './src/app/api/auth/[...nextauth]/route'

export default auth

export const config = {
	matcher: ['/profile'],
}
