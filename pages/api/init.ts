import { NextApiRequest, NextApiResponse } from "next";

import { initDb } from "utils/init-db";

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  await initDb();

  res.end();
};
