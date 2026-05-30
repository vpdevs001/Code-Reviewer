import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SnippetPreview from "../../components/SnippetPreview";
import { getSnippetById, SnippetRow } from "../../db/database";
import { useTheme } from "../../hooks/theme";

export default function SnippetDetail() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const snippetId = params.id ? Number(params.id) : null;
  const [snippet, setSnippet] = useState<SnippetRow | null>(null);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SnippetPreview
          loading={loading}
          snippet={snippet}
          onEdit={() => snippetId && router.push(`/createEdit?id=${snippetId}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 28,
    paddingBottom: 44,
  },
});
