import Database from "better-sqlite3";

const db = new Database("data/game.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS player (
    id INTEGER PRIMARY KEY,
    streak INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS day (
    id INTEGER PRIMARY KEY,
    player_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    sleep REAL NOT NULL DEFAULT 0,
    water INTEGER NOT NULL DEFAULT 0,
    exercised INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (player_id) REFERENCES player(id),

    UNIQUE(player_id, date)
  );
`);

db.prepare(`
  INSERT OR IGNORE INTO player (id, streak)
  VALUES (1, 0)
`).run();

export default db;