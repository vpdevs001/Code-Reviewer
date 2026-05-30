import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getSnippetById } from "../../db/database";
import { useTheme } from "../../hooks/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SnippetDetail() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const snippetId = params.id ? Number(params.id) : null;
  const [snippet, setSnippet] = useState<{ title: string; code: string; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnippet() {
      if (!snippetId) return;
      setLoading(true);
      const result = await getSnippetById(snippetId);
      if (result) {
        setSnippet(result);
      }
      setLoading(false);
    }
    loadSnippet();
  }, [snippetId]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Snippet preview</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>Read the code with a clean editor-like layout</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => snippetId && router.push(`/createEdit?id=${snippetId}`)}
            accessibilityLabel="Edit snippet"
          >
            <Feather name="edit-3" size={18} color={colors.background} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : snippet ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <Text style={[styles.snippetTitle, { color: colors.text }]}>{snippet.title}</Text>
            <Text style={[styles.snippetMeta, { color: colors.subtext }]}>Created {new Date(snippet.createdAt).toLocaleString()}</Text>
            <View style={[styles.editor, { backgroundColor: colors.background, borderColor: colors.border }]}> 
              <Text style={[styles.code, { color: colors.text }]}>{snippet.code}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>Snippet not found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  snippetTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  snippetMeta: {
    fontSize: 13,
    marginBottom: 16,
  },
  editor: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  code: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "monospace",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});