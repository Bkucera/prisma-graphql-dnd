import * as jwt from 'jsonwebtoken'

export function generateJwt(userId) {
	const token = jwt.sign(userId, 'mysecret' ,{
		expiresIn: 86400 * 30,
		audience: 'audience', 
		issuer: 'issuer',
		subject: userId.toString()
	})

	jwt.verify(token, 'secret', (err, data) => {
		console.log('token verification:', err, data)
	})

	return token
}