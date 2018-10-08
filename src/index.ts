import {GraphQLServer} from 'graphql-yoga'
import {makeExecutableSchema} from 'graphql-tools'
// import {
//     Prisma,
//     Query,
//     Mutation
// } from './generated/prisma'
import {Prisma} from 'prisma-binding'
import {readFileSync} from 'fs'
import {parse} from 'graphql'
// import {
//     signupResolver,
//     loginResolver
// } from './resolvers'
import {
    userOwnsDirectiveResolver,
    privateDirectiveResolver,
    authenticatedDirectiveResolver
} from './directive-resolvers'
import {extractFragmentReplacements} from 'prisma-binding'
import {mergeTypes} from 'merge-graphql-schemas'
import {prepareTopLevelResolvers, addFragmentToFieldResolvers} from './services/utilities'

const preparedFieldResolvers = addFragmentToFieldResolvers(parse(readFileSync('./schema/datamodel.graphql').toString()), `{ id }`)
const generatedFragmentReplacements = extractFragmentReplacements(preparedFieldResolvers)
const PrismaDBConnection = new Prisma({
    typeDefs: 'generated/prisma.graphql',
    endpoint: 'http://127.0.0.1:4466', // the endpoint of the Prisma DB service
    // secret: 'mysecret123', // specified in database/prisma.yml //TODO obviously this should be controlled with environment variables
    debug: true, // log all GraphQL queries & mutations
    fragmentReplacements: generatedFragmentReplacements
})
const preparedTopLevelQueryResolvers = prepareTopLevelResolvers(PrismaDBConnection.query)
const preparedTopLevelMutationResolvers = prepareTopLevelResolvers(PrismaDBConnection.mutation)

const resolvers = {
    Query: {
        ...preparedTopLevelQueryResolvers
    },
    Mutation: {
        ...preparedTopLevelMutationResolvers,
        // signup: signupResolver,
        // login: loginResolver
    },
    ...preparedFieldResolvers
}

const directiveResolvers = {
    userOwns: userOwnsDirectiveResolver,
    authenticated: authenticatedDirectiveResolver,
    private: privateDirectiveResolver
}

const ultimateSchemaString = mergeTypes([
    readFileSync('./schema/datamodel.graphql').toString(),
    readFileSync('./schema/dataops.graphql').toString(),
    readFileSync('./schema/directives.graphql').toString(),
    readFileSync('./generated/prisma.graphql').toString()
], {
    all: true
})
const ultimateSchema = makeExecutableSchema({
    typeDefs: ultimateSchemaString,
    resolvers,
    directiveResolvers
})

const server = new GraphQLServer({
    schema: ultimateSchema,
    context: (req) => {
        return {
            ...req,
            db: PrismaDBConnection
        }
    }
})

server.start(() => console.log('Server is running on http://localhost:4000'))