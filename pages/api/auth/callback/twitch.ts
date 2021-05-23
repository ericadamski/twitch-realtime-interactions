import { NextApiRequest, NextApiResponse } from "next";
import { until } from "@open-draft/until";
import ms from "ms";
import * as Cookie from "cookie";

import * as Twitch from "lib/twitch";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { code } = req.query as { code: string };

  const [authError, authResponse] = await until(() =>
    Twitch.getOAuthToken(code)
  );

  if (authError == null && authResponse.ok) {
    const { access_token, token_type } = await authResponse.json();

    const [userGetError, user] = await until(() =>
      Twitch.getUser(access_token)
    );

    if (userGetError == null && user != null) {
      res.setHeader("access-control-expose-headers", "Set-Cookie");
      res.setHeader(
        "Set-Cookie",
        Cookie.serialize("__trtiu", JSON.stringify(user), {
          expires: new Date(Date.now() + ms("1y")),
          path: "/",
        })
      );
    }
  }

  res.end();
};
