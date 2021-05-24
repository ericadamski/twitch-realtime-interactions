import * as Database from "lib/db";

export async function initDb() {
  const db = await Database.get();

  return db.task(async (t) => {
    await t.none("DROP TABLE IF EXISTS user_cursor");
    await t.none("DROP TABLE IF EXISTS replicache_client");
    await t.none("DROP SEQUENCE IF EXISTS version");
    /**
     * Create the auth_state table
     */
    await t.none(`CREATE TABLE user_cursor (
        id          VARCHAR(200)  PRIMARY KEY   NOT NULL,
        x           SMALLINT      DEFAULT 0,
        y           SMALLINT      DEFAULT 0,
        imageUrl    VARCHAR(500),
        twitchLogin VARCHAR(200)                NOT NULL,
        displayName VARCHAR(500)                NOT NULL,
        version     BIGINT                      NOT NULL
    )`);
    /**
     * Store mutation ids for replicache
     */
    await t.none(`CREATE TABLE replicache_client (
        id                  VARCHAR(36) PRIMARY KEY NOT NULL,
        last_mutation_id    BIGINT                  NOT NULL
    )`);
    /**
     * See https://doc.replicache.dev/guide/remote-database
     */
    await t.none("CREATE SEQUENCE version");
  });
}
