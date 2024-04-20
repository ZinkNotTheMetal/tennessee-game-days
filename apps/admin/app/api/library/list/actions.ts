import prisma from "@/app/lib/prisma";

export async function GetAllLibraryItems() {
  return await prisma.libraryItem.findMany({
    include: {
      boardGameGeekThing: true,
    },
  });
}
