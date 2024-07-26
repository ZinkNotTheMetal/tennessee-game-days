import prisma from "@/app/lib/prisma";

export async function GetAllLibraryItems() {
  return await prisma.libraryItem.findMany({
    where: {
      isHidden: false
    },
    include: {
      boardGameGeekThing: true,
    },
  });
}
