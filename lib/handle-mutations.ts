import pgInit from "pg-promise";

import * as Mutations from "lib/mutations";

export interface Mutation {
  id: number;
  name: string;
  args: string;
}

export async function handleMutation(
  db: pgInit.IDatabase<any>,
  mutation: Mutation,
  version: string
) {
  const handler = Mutations[mutation.name];

  if (handler == null) {
    throw new Error(`Unknown mutation ${mutation.name}`);
  }

  return handler(db, mutation, version);
}
