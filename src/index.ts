import * as GraphqlServer from "./graphqlServer"
import * as expressSession from "express-session"
import * as ms from 'ms'

// import { Strategy, StrategyOptions } from "passport-jwt"
// import { generateJwt } from "./utils/auth"

const server = GraphqlServer.create()

server.express.use(expressSession({
    name: 'newqid',
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: ms('1d')
    },
}))

server.start(() => console.log('Server is running on http://localhost:4000'))