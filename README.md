## Prisma GraphQL Directives N' Delegation (dnd)

### Why?

I like graphql. I like Primsa CRUD operations. I don't like boilerplate.

inspired by (stolen from): [Jordan Last's blog post](https://medium.com/@lastmjs/advanced-graphql-directive-permissions-with-prisma-fdee6f846044) 

This repo gives you the following:
- auto-generated graphql API from Prisma
- directive based permissions
- session management using `express-session`
- script for easy schema generation from Prisma

### Getting Started:

setup repo:
```sh
git clone https://github.com/bkucera/prisma-graphql-dnd \
cd prisma-graphql-dnd \
npm install \
```

start docker:
```sh
cd database
docker-compose up -d
```

start prisma, generate schemas:
```sh
npm run deploy
```

**GraphQL Playground:** [`localhost:4000`](http://localhost:4000) 

**I plan on abstracting most of this away in an npm package, to reduce cluttering repos looking to use this strategy**

### want to improve it? PRs welcome!