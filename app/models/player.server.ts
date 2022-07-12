import { prisma } from "~/db.server";
import getRandomName from "~/utils/random-name";

export function createPlayer(gameId: string) {
  return prisma.player.create({
    data: {
      name: getRandomName(),
      selection: "0",
      gameId,
    },
  });
}

export function getPlayer(id: string) {
  return prisma.player.findFirst({
    where: {
      id,
    },
  });
}

export function makePlayerSelection(id: string, selection: string) {
  return prisma.player.update({
    where: {
      id,
    },
    data: {
      selection,
    },
  });
}

export function getAllPlayersInGame(id: string) {
  return prisma.player.findMany({
    where: {
      gameId: id,
    },
  });
}

export function resetPlayerSelection(id: string) {
  return prisma.player.update({
    where: {
      id,
    },
    data: {
      selection: "0",
    },
  });
}

export async function resetAllPlayerSelectionsInGame(gameId: string) {
  const players = await getAllPlayersInGame(gameId);

  return prisma.$transaction(
    players.map((player) => resetPlayerSelection(player.id))
  );
}
