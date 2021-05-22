import pgInit from "pg-promise";

let pgp: pgInit.IMain;
let db: pgInit.IDatabase<any>;

export async function get() {
  if (pgp == null) {
    pgp = pgInit();
  }

  if (db == null) {
    db = pgp({ connectionString: process.env.PG_CONNECTION_STRING });
  }

  await db.connect();

  return db;
}
