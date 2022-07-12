import type { Game, Player } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import Card from "~/components/Card";
import CardList from "~/components/CardList";
import {
  getGame,
  hideGameSelections,
  revealGameSelections,
} from "~/models/game.server";
import {
  getAllPlayersInGame,
  resetAllPlayerSelectionsInGame,
} from "~/models/player.server";

type LoaderData = {
  error?: string;
  game?: Game;
  players?: Player[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const id = params.id;

  if (!id) {
    return {
      error:
        "You obviously need to provide a game id to play THE GAME. Sigh. Idiot.",
    };
  }

  const game = await getGame(id);

  if (!game?.id) {
    return {
      error: "Couldn't find that game. Wah wah wah.",
    };
  }

  const players = await getAllPlayersInGame(id);

  return {
    game,
    players,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id;
  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (!id) {
    return null;
  }

  const game = await getGame(id);

  console.log(action);

  if (action === "toggleReveal") {
    console.log(game?.revealSelections);
    if (game?.revealSelections) {
      await hideGameSelections(id);
    } else {
      await revealGameSelections(id);
    }

    return true;
  }

  if (action === "resetSelections") {
    await resetAllPlayerSelectionsInGame(id);
    return true;
  }
};

export default function GameRoute() {
  const { game, players, error } = useLoaderData<LoaderData>();

  if (error) {
    return <p className="p-8">{error}</p>;
  }

  return (
    <div className="p-8">
      <p>Welcome to Planning Poker.</p>

      <CardList>
        {players?.map((player) => (
          <Card
            highlight={player.selection !== "0"}
            label={game?.revealSelections ? player.selection : player.name}
          />
        ))}
      </CardList>

      <Form method="post">
        <div>
          <button
            className="my-4 w-48 rounded bg-blue-500 py-2 px-4 text-white"
            name="action"
            value="toggleReveal"
          >
            {game?.revealSelections ? "Hide Selections" : "Reveal Selections"}
          </button>
        </div>
        <div>
          <button
            className="w-48 rounded bg-blue-500 py-2 px-4 text-white"
            name="action"
            value="resetSelections"
          >
            Reset Selections
          </button>
        </div>
      </Form>
    </div>
  );
}
