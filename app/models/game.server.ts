import { Player } from "@prisma/client";
import { prisma } from "~/db.server";

export function createGame() {
  return prisma.game.create({
    data: {
      revealSelections: false,
    },
  });
}

export function getGame(id: string) {
  return prisma.game.findFirst({
    where: {
      id,
    },
  });
}

export function revealGameSelections(id: string) {
  return prisma.game.update({
    where: {
      id,
    },
    data: {
      revealSelections: true,
    },
  });
}

export function hideGameSelections(id: string) {
  return prisma.game.update({
    where: {
      id,
    },
    data: {
      revealSelections: false,
    },
  });
}
