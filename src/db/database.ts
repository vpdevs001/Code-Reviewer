import { openDatabaseAsync } from "expo-sqlite";

export type SnippetRow = {
  id: number;
  title: string;
  code: string;
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
      favorite INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );`,
  );
}

export async function getSnippets(): Promise<SnippetRow[]> {
  const db = await getDb();
  return db.getAllAsync<SnippetRow>(
    "SELECT id, title, code, favorite, createdAt FROM snippets ORDER BY createdAt DESC",
  );
}

export async function getSnippetById(id: number): Promise<SnippetRow | null> {
  const db = await getDb();
  const rows = await db.getAllAsync<SnippetRow>(
    "SELECT id, title, code, favorite, createdAt FROM snippets WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
}

export async function addSnippet(title: string, code: string) {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    "INSERT INTO snippets (title, code, favorite, createdAt) VALUES (?, ?, 0, ?)",
    [title, code, createdAt],
  );
  return result.lastInsertRowId;
}

export async function updateSnippet(id: number, title: string, code: string) {
  const db = await getDb();
  await db.runAsync("UPDATE snippets SET title = ?, code = ? WHERE id = ?", [
    title,
    code,
    id,
  ]);
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
