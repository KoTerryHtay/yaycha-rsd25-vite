import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.post
  .deleteMany({
    where: { id: 1 },
  })
  .then(() =>
    prisma.user
      .delete({
        where: { id: 1 },
      })
      .then(() => console.log("deleted user 1 and their posts"))
  )
  .catch((e) => console.error(e));
