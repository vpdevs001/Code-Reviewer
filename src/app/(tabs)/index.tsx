import { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";
import { addSnippet, getSnippets, initDb, SnippetRow } from "../../db/database";
import { useTheme } from "../../hooks/theme";
import { useRouter } from "expo-router";

export default function Index() {
  const [status, setStatus] = useState("Initializing database...");
  const [snippets, setSnippets] = useState<SnippetRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { colors } = useTheme();
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

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
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  async function handleAddSample() {
    await addSnippet("Hello SQLite", "console.log('hello world');");
    const rows = await getSnippets();
    setSnippets(rows);
  }

  function handleAddRoute() {
    router.push("/createEdit");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.topRow}>
        <SearchBar inline value={searchQuery} onChangeText={setSearchQuery} />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddRoute}
          accessibilityLabel="Add code snippet"
        >
          <Text style={[styles.addButtonText, { color: colors.card }]}>Add</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Text style={[styles.heading, { color: colors.text }]}>code-reviewer</Text>
        <Text style={[styles.status, { color: colors.subtext }]}>{status}</Text>
        <Text style={[styles.counter, { color: colors.text }]}>
          {snippets.length} saved snippet{snippets.length === 1 ? "" : "s"}
        </Text>
        <Button title="Add sample snippet" onPress={handleAddSample} color={colors.primary} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  status: {
    marginBottom: 8,
  },
  counter: {
    marginBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12,
  },
  addButtonText: {
    fontWeight: "600",
  },
});
