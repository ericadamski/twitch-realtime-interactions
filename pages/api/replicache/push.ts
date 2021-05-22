import { NextApiRequest, NextApiResponse } from "next";

import * as Database from "lib/db";
import * as Mutations from "lib/mutations";
import { handleMutation } from "lib/handle-mutations";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    return res.status(405).end();
  }

  const { clientID, mutations } = req.body;

  try {
    const db = await Database.get();
    await db.tx(async (t) => {
      const { nextval: version } = await db.one("SELECT nextval('version');");
      let lastMutationId = parseInt(
        (
          await db.oneOrNone<{ last_mutation_id: string }>(
            "SELECT last_mutation_id FROM replicache_client WHERE id = $1",
            clientID
          )
        )?.last_mutation_id ?? "0"
      );

      if (!lastMutationId) {
        await db.none(
          "INSERT INTO replicache_client (id, last_mutation_id) VALUES ($1, $2)",
          [clientID, lastMutationId]
        );
      }

      for (const mutation of mutations) {
        const expectedMutationId = lastMutationId + 1;

        if (mutation.id < expectedMutationId) {
          // Mutation has already been processed - skipping
          continue;
        }

        if (mutation.id > expectedMutationId) {
          // Mutation is from the future - aborting
          break;
        }

        await handleMutation(db, mutation, version);

        lastMutationId = expectedMutationId;
      }

      //   await sendPoke

      await db.none(
        "UPDATE replicache_client SET last_mutation_id = $2 WHERE id = $1",
        [clientID, lastMutationId]
      );
    });

    res.end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
}
