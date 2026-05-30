import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { SnippetRow } from "../db/database";

type SnippetData = Pick<
  SnippetRow,
  "title" | "code" | "language" | "tags" | "createdAt"
>;

function sanitizeFilename(title: string): string {
  return title.replace(/[^a-z0-9]/gi, "_");
}

function writeFile(
  directory: typeof Paths.document,
  filename: string,
  content: string,
): string {
  const file = new File(directory, filename);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(content);
  return file.uri;
}

export function exportSnippetAsText(snippet: SnippetData): string {
  const content = `Title: ${snippet.title}
Language: ${snippet.language}
Tags: ${snippet.tags || "None"}
Created: ${new Date(snippet.createdAt).toLocaleString()}

${snippet.code}`;

  const filename = `${sanitizeFilename(snippet.title)}.txt`;
  return writeFile(Paths.document, filename, content);
}

export function exportSnippetAsJS(snippet: SnippetData): string {
  const content = `/**
 * ${snippet.title}
 * Language: ${snippet.language}
 * Tags: ${snippet.tags || "None"}
 * Created: ${new Date(snippet.createdAt).toLocaleString()}
 */

${snippet.code}`;

  const filename = `${sanitizeFilename(snippet.title)}.js`;
  return writeFile(Paths.cache, filename, content);
}

export function exportSnippetAsJSON(snippet: SnippetData): string {
  const data = {
    title: snippet.title,
    code: snippet.code,
    language: snippet.language,
    tags: snippet.tags,
    createdAt: snippet.createdAt,
  };

  const content = JSON.stringify(data, null, 2);
  const filename = `${sanitizeFilename(snippet.title)}.json`;
  return writeFile(Paths.cache, filename, content);
}

export async function shareSnippet(
  snippet: SnippetData,
  format: "text" | "js" | "json",
): Promise<void> {
  let fileUri: string;

  switch (format) {
    case "text":
      fileUri = exportSnippetAsText(snippet);
      break;
    case "js":
      fileUri = exportSnippetAsJS(snippet);
      break;
    case "json":
      fileUri = exportSnippetAsJSON(snippet);
      break;
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: format === "json" ? "application/json" : "text/plain",
      dialogTitle: `Share ${snippet.title}`,
    });
  } else {
    throw new Error("Sharing is not available on this device");
  }
}

export function saveSnippetLocally(
  snippet: SnippetData,
  format: "text" | "js" | "json",
): string {
  switch (format) {
    case "text":
      return exportSnippetAsText(snippet);
    case "js":
      return exportSnippetAsJS(snippet);
    case "json":
      return exportSnippetAsJSON(snippet);
  }
}
