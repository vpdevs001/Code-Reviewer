import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
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
import { fonts } from "../../constants/typography";
import {
  deleteSnippet,
  getSnippets,
  initDb,
  SnippetRow,
} from "../../db/database";
import { useTheme } from "../../hooks/theme";
import { getUsername } from "../../utils/userStorage";

export default function Index() {
  const [status, setStatus] = useState("Getting all the snippets ready");
  const [loading, setLoading] = useState(true);
  const [snippets, setSnippets] = useState<SnippetRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const { colors } = useTheme();
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  const fetchSnippets = useCallback(async () => {
    try {
      setStatus("Getting all the snippets ready");
      setLoading(true);
      await initDb();
      const rows = await getSnippets();
      setSnippets(rows);
      setStatus("SQLite ready");
    } catch (error) {
      setStatus(
        `Failed to initialize: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadUsername() {
      const storedName = await getUsername();
      if (storedName) {
        setUsername(storedName);
      }
    }

    loadUsername();
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  useFocusEffect(
    useCallback(() => {
      fetchSnippets();
    }, [fetchSnippets]),
  );

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

  function handleDeleteSnippet(snippetId: number) {
    Alert.alert(
      "Delete snippet",
      "Are you sure you want to delete this snippet?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSnippet(snippetId);
            const rows = await getSnippets();
            setSnippets(rows);
          },
        },
      ],
    );
  }

  function handleSnippetPress(snippetId: number) {
    router.push(`/snippet/${snippetId}`);
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
        {loading ? (
          <Text style={[styles.status, { color: colors.subtext }]}>
            {status}
          </Text>
        ) : null}
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
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Pressable
                onPress={() => handleSnippetPress(item.id)}
                style={({ pressed }) => [
                  styles.cardContent,
                  { opacity: pressed ? 0.95 : 1 },
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
              <Pressable
                onPress={() => handleDeleteSnippet(item.id)}
                style={({ pressed }) => [
                  styles.cardDelete,
                  {
                    borderColor: colors.error,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                accessibilityLabel="Delete snippet"
              >
                <Feather name="trash-2" size={18} color={colors.error} />
              </Pressable>
            </View>
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
  status: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
  },
  counter: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  listContent: {
    paddingBottom: 28,
  },
  emptyState: {
    marginTop: 72,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
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
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 19,
    fontFamily: fonts.bold,
    flex: 1,
    marginRight: 10,
  },
  cardSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: fonts.code,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 6,
    fontFamily: fonts.semiBold,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  cardContent: {
    flex: 1,
  },
  cardDelete: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});
