import { openDatabaseAsync } from "expo-sqlite";

export type SnippetRow = {
  id: number;
  title: string;
  code: string;
  language: string;
  tags: string;
  favorite: number;
  createdAt: string;
};

let dbPromise: Promise<import("expo-sqlite").SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("code-reviewer.db");
  }
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'javascript',
      tags TEXT NOT NULL DEFAULT '',
      favorite INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );`,
  );

  // Migration: Add new columns if they don't exist
  try {
    await db.execAsync(
      `ALTER TABLE snippets ADD COLUMN language TEXT NOT NULL DEFAULT 'javascript';`,
    );
  } catch (e) {
    // Column already exists
  }
  try {
    await db.execAsync(
      `ALTER TABLE snippets ADD COLUMN tags TEXT NOT NULL DEFAULT '';`,
    );
  } catch (e) {
    // Column already exists
  }
}

export async function getSnippets(): Promise<SnippetRow[]> {
  const db = await getDb();
  return db.getAllAsync<SnippetRow>(
    "SELECT id, title, code, language, tags, favorite, createdAt FROM snippets ORDER BY createdAt DESC",
  );
}

export async function getSnippetById(id: number): Promise<SnippetRow | null> {
  const db = await getDb();
  const rows = await db.getAllAsync<SnippetRow>(
    "SELECT id, title, code, language, tags, favorite, createdAt FROM snippets WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
}

export async function addSnippet(
  title: string,
  code: string,
  language: string = "javascript",
  tags: string = "",
) {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    "INSERT INTO snippets (title, code, language, tags, favorite, createdAt) VALUES (?, ?, ?, ?, 0, ?)",
    [title, code, language, tags, createdAt],
  );
  return result.lastInsertRowId;
}

export async function updateSnippet(
  id: number,
  title: string,
  code: string,
  language: string,
  tags: string,
) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE snippets SET title = ?, code = ?, language = ?, tags = ? WHERE id = ?",
    [title, code, language, tags, id],
  );
}

export async function toggleFavorite(id: number, favorite: boolean) {
  const db = await getDb();
  await db.runAsync("UPDATE snippets SET favorite = ? WHERE id = ?", [
    favorite ? 1 : 0,
    id,
  ]);
}

export async function deleteSnippet(id: number) {
  const db = await getDb();
  await db.runAsync("DELETE FROM snippets WHERE id = ?", [id]);
}

export async function deleteAllSnippets() {
  const db = await getDb();
  await db.runAsync("DELETE FROM snippets");
}
