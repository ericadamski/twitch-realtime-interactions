import { JSONValue, WriteTransaction } from "replicache/out/replicache";

type ReplicacheArgs = Partial<{ [key: string]: JSONValue }>;

// export interface AuthStateData extends ReplicacheArgs {
//   state: string;
// }

// export function addAuthState(tx: WriteTransaction, args: AuthStateData) {
//   tx.put(`/auth/state/${args.state}`, args);
// }
