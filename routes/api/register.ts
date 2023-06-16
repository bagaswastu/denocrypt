import { Handlers } from "$fresh/server.ts";
import * as cookie from "https://deno.land/std@0.192.0/http/cookie.ts";
import { User } from "../../utils/interface.ts";

export const handler: Handlers = {
  async GET(req, _) {
    const cookies = cookie.getCookies(req.headers);
    console.log(cookies);

    if (cookies["uuid"]) {
      const kv = await Deno.openKv("denocrypt");
      const user = await kv.get<User>(["users", cookies["uuid"]]);

      if (user) {
        return new Response('ok');
      }
    }

    const data: User = {
      uuid: crypto.randomUUID(),
      startTimestamp: new Date().getTime(),
      endTimestamp: 0,
      name: null,
      isWinner: false,
    };

    const kv = await Deno.openKv("denocrypt");
    const res = await kv.set(["users", data.uuid], data);

    if (!res.ok) {
      return new Response("internal server error", { status: 500 });
    }

    const headers = new Headers();
    cookie.setCookie(headers, {
      name: "uuid",
      value: data.uuid,
      expires: new Date(data.startTimestamp + 1000 * 60 * 60 * 24 * 365),
      path: '/'
    });
    
    return new Response('ok', {
      headers,
    });
  },
};
