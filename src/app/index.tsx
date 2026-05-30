import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { addSnippet, fetchSnippets, initDb, SnippetRow } from "../db/database";

export default function Index() {
  const [status, setStatus] = useState("Initializing database...");
  const [snippets, setSnippets] = useState<SnippetRow[]>([]);

  useEffect(() => {
    async function setup() {
      try {
        await initDb();
        const rows = await fetchSnippets();
        setSnippets(rows);
        setStatus("SQLite ready");
      } catch (error) {
        setStatus(`Failed to initialize: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }

    setup();
  }, []);

  async function handleAddSample() {
    await addSnippet("Hello SQLite", "console.log('hello world');");
    const rows = await fetchSnippets();
    setSnippets(rows);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>code-reviewer</Text>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.counter}>{snippets.length} saved snippet{snippets.length === 1 ? "" : "s"}</Text>
      <Button title="Add sample snippet" onPress={handleAddSample} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  status: {
    marginBottom: 8,
    color: "#333",
  },
  counter: {
    marginBottom: 20,
  },
});
