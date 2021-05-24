import { NextApiRequest, NextApiResponse } from "next";

import * as Database from "lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = await Database.get();
    const { clientID, cookie } = req.body;

    console.log({ clientID, cookie });

    db.tx(async (t) => {
      const lastMutationId = parseInt(
        (
          await db.oneOrNone(
            "SELECT last_mutation_id FROM replicache_client WHERE id = $1",
            clientID
          )
        )?.last_mutation_id ?? "0"
      );

      const changed = await db.manyOrNone(
        "SELECT * FROM user_cursor WHERE version > $1",
        parseInt(cookie ?? 0)
      );

      const nextCookie = (
        await db.one("SELECT max(version) AS version FROM user_cursor")
      ).version;

      console.log({ lastMutationId, nextCookie, changed });

      res.json({
        lastMutationId,
        cookie: nextCookie,
        path: changed.map((row) => ({
          op: "put",
          key: `cursor/${row.id}`,
          value: row,
        })),
      });
      res.end();
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};
