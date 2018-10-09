import { GraphQLServer } from 'graphql-yoga'
import { makeExecutableSchema } from 'graphql-tools'
import {
    Prisma,
    Query,
    Mutation
} from '../generated/prisma'

import { readFileSync } from 'fs'
import { parse, printSchema } from 'graphql'
import {
    // signupResolver,
    login
} from './resolvers'
import {
  // PrivateDirectiveResolver,
  userOwnsDirectiveResolver,
  privateDirectiveResolver,
  authenticatedDirectiveResolver
} from './directive-resolvers'
import { extractFragmentReplacements } from 'prisma-binding'
import { mergeTypes } from 'merge-graphql-schemas'
import {
  prepareTopLevelResolvers,
  addFragmentToFieldResolvers
} from './utils/resolverUtils'
import * as path from 'path'


export const create = () => {
  const preparedFieldResolvers = addFragmentToFieldResolvers(
    parse(readFileSync(path.join(__dirname, '../schema/datamodel.graphql')).toString()),
    `{ id }`
  )
  const generatedFragmentReplacements = extractFragmentReplacements(
    preparedFieldResolvers
  )
  const PrismaDBConnection = new Prisma({
    endpoint: 'http://127.0.0.1:4466', // the endpoint of the Prisma DB service
    // secret: 'mysecret123', // specified in database/prisma.yml //TODO obviously this should be controlled with environment variables
    debug: true, // log all GraphQL queries & mutations
    fragmentReplacements: generatedFragmentReplacements
  })
  const preparedTopLevelQueryResolvers = prepareTopLevelResolvers(
    PrismaDBConnection.query
  )
  const preparedTopLevelMutationResolvers = prepareTopLevelResolvers(
    PrismaDBConnection.mutation
  )

  const resolvers = {
    Query: {
      ...preparedTopLevelQueryResolvers
    },
    Mutation: {
      ...preparedTopLevelMutationResolvers,
      // signup: signupResolver,
      login,
    },
    ...preparedFieldResolvers
  }

  const directiveResolvers = {
    userOwns: userOwnsDirectiveResolver,
    authenticated: authenticatedDirectiveResolver,
    private: privateDirectiveResolver
  }

  const ultimateSchemaString = mergeTypes(
    [
      readFileSync('./schema/datamodel.graphql').toString(),
      readFileSync('./schema/dataops.graphql').toString(),
      readFileSync('./schema/directives.graphql').toString(),
      readFileSync('./generated/prisma.graphql').toString()
    ],
    {
      all: true
    }
  )
  const ultimateSchema = makeExecutableSchema({
    typeDefs: ultimateSchemaString,
    resolvers,
    directiveResolvers
    // schemaDirectives: {
    //     private: PrivateDirectiveResolver
    // }
	})
	
	// const printedSchema = printSchema(ultimateSchema)

	// console.log(printedSchema)

  const server = new GraphQLServer({
    schema: ultimateSchema,
    context: req => {
      return {
        ...req,
        req: req.request,
        db: PrismaDBConnection
      }
    }
	})
	
	return server
}