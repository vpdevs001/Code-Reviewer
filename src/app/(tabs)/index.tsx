import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Greetings from "../../components/Greetings";
import SearchBar from "../../components/SearchBar";
import { getSnippets, initDb, SnippetRow } from "../../db/database";
import { useTheme } from "../../hooks/theme";
import { getUsername } from "../../utils/userStorage";

export default function Index() {
  const [status, setStatus] = useState("Initializing database...");
  const [snippets, setSnippets] = useState<SnippetRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
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

      const storedName = await getUsername();
      if (storedName) {
        setUsername(storedName);
      }
    }

    setup();
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredSnippets = useMemo(
    () =>
      snippets.filter((snippet) => {
        const query = searchQuery.toLowerCase().trim();
        return (
          !query ||
          snippet.title.toLowerCase().includes(query) ||
          snippet.code.toLowerCase().includes(query)
        );
      }),
    [snippets, searchQuery],
  );

  function handleAddRoute() {
    router.push("/createEdit");
  }

  function handleSnippetPress(snippetId: number) {
    router.push(`/createEdit?id=${snippetId}`);
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Greetings username={username} />

        <View style={styles.topRow}>
          <SearchBar inline value={searchQuery} onChangeText={setSearchQuery} />
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.text, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleAddRoute}
            accessibilityLabel="Add code snippet"
          >
            <Feather name="plus" size={20} color={colors.background} />
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <View style={styles.statsRow}>
          <Text style={[styles.heading, { color: colors.text }]}>Snippets</Text>
          <Text style={[styles.counter, { color: colors.subtext }]}>
            {filteredSnippets.length} result
            {filteredSnippets.length === 1 ? "" : "s"}
          </Text>
        </View>

        <FlatList
          data={filteredSnippets}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                No snippets match your search.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSnippetPress(item.id)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[styles.cardTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.subtext}
                />
              </View>
              <Text
                style={[styles.cardSubtitle, { color: colors.subtext }]}
                numberOfLines={3}
              >
                {item.code}
              </Text>
              <View style={styles.cardFooter}>
                <View
                  style={[styles.badge, { backgroundColor: colors.border }]}
                >
                  <Feather name="code" size={14} color={colors.text} />
                  <Text style={[styles.badgeText, { color: colors.text }]}>
                    Snippet
                  </Text>
                </View>
                <Text style={[styles.cardDate, { color: colors.subtext }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
  },
  counter: {
    fontSize: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    marginTop: 64,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 6,
  },
  cardDate: {
    fontSize: 12,
  },
});
