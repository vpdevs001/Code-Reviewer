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
import { fonts } from "../constants/typography";
import {
  deleteSnippet,
  getSnippets,
  initDb,
  SnippetRow,
  toggleFavorite,
} from "../db/database";
import { useTheme } from "../hooks/theme";
import { getUsername } from "../utils/userStorage";
import Greetings from "./Greetings";
import SearchBar from "./SearchBar";
import SnippetCard from "./SnippetCard";

type SnippetBrowserProps = {
  favoriteOnly?: boolean;
  showAddButton?: boolean;
  title: string;
  emptyMessage: string;
};

export default function SnippetBrowser({
  favoriteOnly = false,
  showAddButton = true,
  title,
  emptyMessage,
}: SnippetBrowserProps) {
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
        `Failed to initialize: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
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
        const matchesFavorite = !favoriteOnly || snippet.favorite === 1;
        const matchesQuery =
          !query ||
          snippet.title.toLowerCase().includes(query) ||
          snippet.code.toLowerCase().includes(query);

        return matchesFavorite && matchesQuery;
      }),
    [favoriteOnly, snippets, searchQuery],
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
            setSnippets((current) =>
              current.filter((snippet) => snippet.id !== snippetId),
            );
          },
        },
      ],
    );
  }

  function handleSnippetPress(snippetId: number) {
    router.push(`/snippet/${snippetId}`);
  }

  async function handleToggleFavorite(snippet: SnippetRow) {
    const nextFavorite = snippet.favorite !== 1;
    await toggleFavorite(snippet.id, nextFavorite);
    setSnippets((current) =>
      current.map((item) =>
        item.id === snippet.id
          ? { ...item, favorite: nextFavorite ? 1 : 0 }
          : item,
      ),
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Greetings username={username} />

        <View style={styles.topRow}>
          <SearchBar inline value={searchQuery} onChangeText={setSearchQuery} />
          {showAddButton ? (
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
          ) : null}
        </View>
      </View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <View style={styles.statsRow}>
          <Text style={[styles.heading, { color: colors.text }]}>{title}</Text>
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
            loading ? null : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  {emptyMessage}
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <SnippetCard
              snippet={item}
              onDelete={handleDeleteSnippet}
              onPress={handleSnippetPress}
              onToggleFavorite={handleToggleFavorite}
            />
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
});
