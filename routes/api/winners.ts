import { Handlers } from "$fresh/server.ts";
import { User } from "../../utils/interface.ts";

export const handler: Handlers = {
  async GET(_, __) {
    const kv = await Deno.openKv('denocrypt');

    const users: User[] = [];
    const iter = kv.list<User>({ prefix: ["users"] });
    for await (const { value } of iter) {
      users.push(value);
    }

    const winners = users
      .filter((user) => user.isWinner)
      .filter((user) => user.name !== null)
      .sort((a, b) => a.endTimestamp - b.endTimestamp);

    return new Response(JSON.stringify(winners));
  },
};
