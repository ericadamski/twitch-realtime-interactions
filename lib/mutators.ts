import { JSONValue, WriteTransaction } from "replicache/out/replicache";

type ReplicacheArgs = Partial<{ [key: string]: JSONValue }>;

export interface CursorData extends ReplicacheArgs {
  x: number;
  y: number;
  id: string;
  displayName: string;
  imageUrl?: string;
  twitchLogin: string;
}

export function updateCursorPosition(tx: WriteTransaction, args: CursorData) {
  return tx.put(`cursor/${args.id}`, args);
}
