import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.user
  .findFirst({
    where: { id: 1 },
    include: { posts: true },
  })
  .then((data) => console.log(data))
  .catch((e) => console.error(e));
