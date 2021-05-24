import pgInit from "pg-promise";
import { CursorData } from "./mutators";

export interface Mutation<T extends Record<string, any>> {
  id: number;
  name: string;
  args: T;
}

export async function updateCursorPosition(
  db: pgInit.IDatabase<any>,
  mutation: Mutation<CursorData>,
  version: string
): Promise<void> {
  const exists = await db.oneOrNone<Pick<CursorData, "id">>(
    "SELECT id FROM user_cursor WHERE id = $1",
    mutation.args.id
  );

  if (exists == null) {
    return db.none(
      `INSERT INTO user_cursor (
        id, x, y, displayName, imageUrl, twitchLogin, version
        ) VALUE ($1, $2, $3, $4, $5, $6, $7)`,
      [
        mutation.args.id,
        mutation.args.x,
        mutation.args.y,
        mutation.args.displayName,
        mutation.args.imageUrl,
        mutation.args.twitchLogin,
        version,
      ]
    );
  }

  return db.none(
    'UPDATE user_cursor SET "x" = $2, "y" = $3, "version" = $4 WHERE "id" = $1',
    [mutation.args.id, mutation.args.x, mutation.args.y, version]
  );
}
