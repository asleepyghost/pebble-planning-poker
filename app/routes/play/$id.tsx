import { Player } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import Card from "~/components/Card";
import CardList from "~/components/CardList";
import { getPlayer, makePlayerSelection } from "~/models/player.server";

const selections = ["2", "3", "4", "6", "8", "13", "?", "☕"];

type LoaderData = {
  player?: Player;
  error?: string;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const id = params.id;

  if (!id) {
    return {
      error: "I need a player id. You muppet.",
    };
  }

  const player = await getPlayer(id);

  if (!player?.id) {
    return {
      error: "That player does not exist, you inebriated Toucan. Try again.",
    };
  }

  return {
    player,
  };
};

export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id as string;
  const formData = await request.formData();
  const selection = formData.get("selection") as string;

  console.log(selection);

  await makePlayerSelection(id, selection);

  return true;
};

export default function PlayerRoute() {
  const { player, error } = useLoaderData<LoaderData>();

  console.log(player);

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-16">
      <p>
        Hello, you are playing as{" "}
        <span className="text-blue-600">{player?.name}</span>. Make your
        selection below.
      </p>
      <CardList>
        {selections.map((selection) => (
          <Form method="post">
            <Card
              highlight={player?.selection === selection}
              label={selection}
            />
          </Form>
        ))}
      </CardList>
    </div>
  );
}
