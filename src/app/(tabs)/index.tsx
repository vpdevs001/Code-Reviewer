import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";
import { lightColors } from "../../constants/colors";
import { addSnippet, getSnippets, initDb, SnippetRow } from "../../db/database";

export default function Index() {
  const [status, setStatus] = useState("Initializing database...");
  const [snippets, setSnippets] = useState<SnippetRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function setup() {
      try {
        await initDb();
        const rows = await getSnippets();
        setSnippets(rows);
        setStatus("SQLite ready");
      } catch (error) {
        setStatus(
          `Failed to initialize: ${error instanceof Error ? error.message : "unknown error"}`,
        );
      }
    }

    setup();
  }, []);

  async function handleAddSample() {
    await addSnippet("Hello SQLite", "console.log('hello world');");
    const rows = await getSnippets();
    setSnippets(rows);
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: lightColors.background }]}
    >
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.content}>
        <Text style={styles.heading}>code-reviewer</Text>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.counter}>
          {snippets.length} saved snippet{snippets.length === 1 ? "" : "s"}
        </Text>
        <Button title="Add sample snippet" onPress={handleAddSample} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: lightColors.text,
  },
  status: {
    marginBottom: 8,
    color: lightColors.subtext,
  },
  counter: {
    marginBottom: 20,
    color: lightColors.text,
  },
});
