import { NextApiRequest, NextApiResponse } from "next";
import { until } from "@open-draft/until";

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

    console.log({ token_type });

    const [userGetError, user] = await until(() =>
      Twitch.getUser(access_token)
    );

    if (userGetError == null && user != null) {
      console.log(user);
      // store in DB?
      // then send back a cookie with the deets
    }
  }

  res.end();
};
