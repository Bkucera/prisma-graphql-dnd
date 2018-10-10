## Prisma Directives N' Delegation

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
git clone https://github.com/bkucera/prisma-dnd \
cd prisma-dnd \
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

open playground (graphql API explorer):
```
npm run playground
```

