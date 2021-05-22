import pgInit from "pg-promise";

import { AuthStateData } from "./mutators";

export interface Mutation<T extends Record<string, any>> {
  id: number;
  name: string;
  args: T;
}

// export async function addAuthState(
//   db: pgInit.IDatabase<any>,
//   mutation: Mutation<AuthStateData>
// ): Promise<void> {
//   return db.none(
//     `INSERT INTO auth_state (val) VALUE ($1)`,
//     mutation.args.state
//   );
// }
