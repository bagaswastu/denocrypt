import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import * as cookie from "https://deno.land/std@0.192.0/http/cookie.ts";
import { User } from "../utils/interface.ts";
import dayjs from "https://cdn.skypack.dev/dayjs";
import relativeTime from "https://cdn.skypack.dev/dayjs/plugin/relativeTime";
import { Head } from "$fresh/runtime.ts";
import { sha256 } from "../utils/crypt.ts";
dayjs.extend(relativeTime);

export const handler: Handlers = {
  async GET(req, ctx) {
    if (
      (await sha256(ctx.params.id)) ===
      "36a6bfd910698b0bb2d5794d1024b2f0aaaa8d63e56500b9bfcf3af3e12e6c96"
    ) {
      const uuid = cookie.getCookies(req.headers)?.uuid;

      if (!uuid) {
        return ctx.renderNotFound();
      }

      const kv = await Deno.openKv();
      const res = await kv.get<User>(["users", uuid]);

      if (!res.value) {
        return ctx.renderNotFound();
      }
      let user = res.value;
      if (!res.value?.isWinner) {
        user = {
          ...user,
          endTimestamp: Date.now(),
          isWinner: true,
        };
        kv.set(["users", uuid], user);
      }

      return await ctx.render(user);
    }

    return ctx.renderNotFound();
  },
  async POST(req, ctx) {
    const uuid = cookie.getCookies(req.headers)?.uuid;

    if (!uuid) {
      return ctx.renderNotFound();
    }

    const form = await req.formData();
    const name = form.get("name");

    const kv = await Deno.openKv();
    const user = await kv.get<User>(["users", uuid]);

    if (!user.value) {
      return ctx.renderNotFound();
    }

    kv.set(["users", uuid], {
      ...user.value,
      endTimestamp: Date.now(),
      isWinner: true,
      name,
    });

    const headers = new Headers();
    headers.set("location", "/leaderboard");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Greet(props: PageProps) {
  const user = props.data as User;

  const total = dayjs(user.startTimestamp).from(user.endTimestamp, true);

  return (
    <>
      <Head>
        <title>Congratulations!</title>
      </Head>
      <main className="px-4 mx-auto max-w-screen-md mt-20 mb-16 flex flex-col gap-2">
        <h1 className="text-xl">{`In the realm of riddles, your brilliance shines true. Congratulations on unraveling the puzzle.`}</h1>
        <p className="text-gray-600 mb-8">{`Solved in ${total}`}</p>
        <form
          action=""
          method="post"
          className="flex flex-col items-start gap-2"
        >
          <input
            type="text"
            name="name"
            id="name"
            className="border-1 border-gray-800 px-2 py-1"
            placeholder="Enter your name"
            required
          />

          <button type="submit" className="bg-gray-900 text-white px-2 py-1">
            Add me to leaderboard
          </button>
        </form>
      </main>
    </>
  );
}
