import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.user
  .create({
    data: {
      name: "BoB",
      bio: "profile bio",
      posts: {
        create: [{ content: "First post" }, { content: "Second post" }],
      },
    },
  })
  .then(() => {
    console.log("Inserted User Bob with Posts");
  })
  .catch((e) => {
    console.error(e);
  });
// .finally(() => {
//   prisma.$disconnect();
// });
