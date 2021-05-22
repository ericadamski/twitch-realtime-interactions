import * as Database from "lib/db";

export async function initDb() {
  const db = await Database.get();

  return db.task(async (t) => {
    await t.none("DROP SEQUENCE IF EXISTS auth_state");
    await t.none("DROP TABLE IF EXISTS replicache_client");
    await t.none("DROP SEQUENCE IF EXISTS version");
    /**
     * Create the auth_state table
     */
    await t.none(`CREATE TABLE auth_state (
        id  SERIAL      PRIMARY KEY NOT NULL,
        val VARCHAR(36)             NOT NULL
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
