import { Response } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { getGame } from "~/models/game.server";
import { createPlayer } from "~/models/player.server";

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | globalThis.Response> => {
  const data = await request.formData();

  const gameId = data.get("gameId") as string;

  if (!gameId) {
    return {
      error:
        "What are you doing, exactly? Do you have the IQ of a cheese baguette or are you this annoying intentionally? How am I meant to connect you to a game if you don't tell me what game to connect you to? Please enter an id. Or leave. I do not care.",
    };
  }

  const game = await getGame(gameId);

  if (!game?.id) {
    return {
      error:
        "Either you are trying to annoy me or someone has given you an incorrect id because they do not want to play with you because you are very irritating. I assume it is the latter. That game does not exist. Try again, or accept that you are destined to be a lonely hermit. It is no skin off my nose (that is because I do not have a nose, I am a computer).",
    };
  }

  const player = await createPlayer(game.id);

  return redirect(`/play/${player.id}`);
};

export default function Index() {
  const actionData = useActionData<ActionData>();

  return (
    <main className="p-16">
      <div>
        <p>Pebble Planning Poker</p>
      </div>
      {actionData?.error && (
        <p className="p-4 text-red-500">{actionData.error}</p>
      )}
      <div className="block py-4 text-slate-500">
        <Form method="post">
          <label className="mx-4">
            <input name="gameId" placeholder="Enter game id." className="p-4" />
          </label>
          <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
            Join Game
          </button>
        </Form>
      </div>
    </main>
  );
}
