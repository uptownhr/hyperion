const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

console.log('prisma', prisma)

async function main () {
  let count = 0
  console.log(1)
  count = await prisma.account.count()
  console.log(2, count)
  const create = await prisma.account.create({
    data: {
      name: 'hi'
    }
  })
  console.log('created', create)
  count = await prisma.account.count()
  console.log('count', count)
}


main()