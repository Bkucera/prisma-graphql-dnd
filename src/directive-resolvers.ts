import { Context } from "graphql-binding/dist/types"
// import { SchemaDirectiveVisitor } from "graphql-tools"
// import { GraphQLField, GraphQLInputField } from "graphql"

let fieldDefinitions = 0
let inputFieldDefinitions = 0

const incrementFieldDefinition = ()=>{
	fieldDefinitions++
	console.log('fieldDefinitions:', fieldDefinitions)
}
const incrementInputFieldDefinition = ()=>{
	inputFieldDefinitions++
	console.log('InputfieldDefinitions:', inputFieldDefinitions)
}


function getUserId (context:Context) {
	return false
}

// export class UserOwnsDirectiveResolver extends SchemaDirectiveVisitor {
// 	public visitFieldDefinition(field: GraphQLField<any, any>) {
// 		console.log('----\nvisitFieldDefinition', '\n----')
// 		incrementFieldDefinition()
// 		const { resolve } = field

// 		field.resolve = function (...args) {
// 			console.log('\n\n~~~\nresolve\n~~~')
// 			if (!getUserId(null)) {
// 				throw new Error("ERROR IN DIRECTIVE")
// 			}
// 			return resolve.apply(this, args) 
// 		}
// 	}
//
// 	public visitInputFieldDefinition(field: GraphQLInputField) {
// 		console.log('----\nvisitInputFieldDefinition', field, '\n----')
// 		incrementInputFieldDefinition()
// 	}
// }

export async function userOwnsDirectiveResolver(next, source, args, context) {
	if (source[args.field] === await getUserId(context)) {
			return await next()
	}
	else {
			throw new Error('Not authorized')
	}
}


export async function authenticatedDirectiveResolver(next, source, args, context) {
	if (getUserId(context)) {
			return await next()
	}
	else {
			throw new Error('Not authenticated')
	}
}


export async function privateDirectiveResolver(next, source, args, context) {
	console.log('___@private___')
	throw new Error('Private')
}