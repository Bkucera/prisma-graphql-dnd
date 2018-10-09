import * as bcryptjs from "bcryptjs"
import * as jwt from "jsonwebtoken"

interface AuthResponse {
	id: string
	email: string
	newSession: boolean
}

export async function login(parent, args, ctx, info) {

	if (ctx.req.session.user && ctx.req.session.user.email === args.email) {
		return {
			...ctx.req.session.user,
			newSession: false
		}
	}

	const user = await ctx.db.query.user({
		where: {
			email: args.email
		}
	})
	if (!user) {
		throw new Error('No such user')
	}

	// const valid = await bcryptjs.compare(args.password, user.password)
	const valid = args.password === user.password

	if (!valid) {
		throw new Error('Invalid Password')
	}

	const token = jwt.sign({userId: user.id}, 'mysecret')

	const {id, email} = user
	

	

	ctx.req.session.user = {
		id,
		email
	}

	
	const response = {
		id,
		email,
		newSession: true,
	}

	return response
}
