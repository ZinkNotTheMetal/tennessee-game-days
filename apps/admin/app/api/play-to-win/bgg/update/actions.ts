import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";

export async function UpsertBoardGameGeekMechanics(bggId: number, mechanics: {id: number, name: string}[]) {
  console.log("BGG ID", bggId)
  console.log("Mechanics", mechanics)
  
  for (const gm of mechanics) {
    await prisma.mechanic.upsert({
      where: { id: gm.id },
      update: { name: gm.name },
      create: { 
        id: gm.id,
        name: gm.name
      }
    })

    await prisma.gameMechanic.upsert({
      where: {
        boardGameGeekId_mechanicId: {
          boardGameGeekId: bggId,
          mechanicId: gm.id,
        },
      },
      create: {
        mechanicId: gm.id,
        boardGameGeekId: bggId,
      },
      update: {}
    });

  }
  revalidateTag('play-to-win')

}

export async function Sleep (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}