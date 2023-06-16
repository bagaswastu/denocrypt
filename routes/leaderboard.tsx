import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import dayjs from "https://cdn.skypack.dev/dayjs";
import { User } from "../utils/interface.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const kv = await Deno.openKv();

    const users: User[] = [];
    const iter = kv.list<User>({ prefix: ["users"] });
    for await (const { value } of iter) {
      users.push(value);
    }

    const winners = users
      .filter((user) => user.isWinner)
      .filter((user) => user.name !== null)
      .sort((a, b) => a.endTimestamp - b.endTimestamp);
    return ctx.render(winners);
  },
};

export default function Winners(props: PageProps) {
  const winners = props.data as User[];
  return (
    <>
      <Head>
        <title>Winners</title>
      </Head>
      <main class="p-4 mx-auto max-w-screen-md mt-20 mb-16 flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Leaderboard</h1>
        {winners.length === 0 ? (
          <p>No winners yet.</p>
        ) : (
          <ul className="list-decimal ml-4">
            {winners.map((user) => {
              const total = dayjs(user.endTimestamp).from(user.startTimestamp);
              return <li>{`${user.name} - ${total}`}</li>;
            })}
          </ul>
        )}
      </main>
    </>
  );
}
