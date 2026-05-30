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

export async function fetchSnippets(): Promise<SnippetRow[]> {
  const db = await getDb();
  const statement = await db.prepareAsync(
    "SELECT id, title, code, favorite, createdAt FROM snippets ORDER BY createdAt DESC",
  );

  try {
    const result = await statement.executeAsync<SnippetRow>([]);
    return result.getAllAsync();
  } finally {
    await statement.finalizeAsync();
  }
}

export async function addSnippet(title: string, code: string) {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const statement = await db.prepareAsync(
    "INSERT INTO snippets (title, code, favorite, createdAt) VALUES (?, ?, 0, ?)",
  );

  try {
    const result = await statement.executeAsync<SnippetRow[]>([
      title,
      code,
      createdAt,
    ]);
    return result.lastInsertRowId;
  } finally {
    await statement.finalizeAsync();
  }
}

export async function toggleFavorite(id: number, favorite: boolean) {
  const db = await getDb();
  const statement = await db.prepareAsync(
    "UPDATE snippets SET favorite = ? WHERE id = ?",
  );

  try {
    await statement.executeAsync([favorite ? 1 : 0, id]);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function deleteSnippet(id: number) {
  const db = await getDb();
  const statement = await db.prepareAsync("DELETE FROM snippets WHERE id = ?");

  try {
    await statement.executeAsync([id]);
  } finally {
    await statement.finalizeAsync();
  }
}
