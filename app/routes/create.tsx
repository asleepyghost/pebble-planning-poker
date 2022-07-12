import { Form } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { createGame } from "~/models/game.server";

export const action: ActionFunction = async ({ request }) => {
  const game = await createGame();

  return redirect(`/game/${game.id}`);
};

export default function CreateGameRoute() {
  return (
    <main className="p-16">
      <div>
        <p>Pebble Planning Poker</p>
      </div>
      <div className="block py-4 text-slate-500">
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Create Game
          </button>
        </Form>
      </div>
    </main>
  );
}
