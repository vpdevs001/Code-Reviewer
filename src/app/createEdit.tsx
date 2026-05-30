import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SnippetForm from "../components/SnippetForm";
import { addSnippet, getSnippetById, updateSnippet } from "../db/database";
import { useTheme } from "../hooks/theme";

export default function CreateEdit() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const snippetId = params.id ? Number(params.id) : null;
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSnippet() {
      if (!snippetId) return;
      setLoading(true);
      const snippet = await getSnippetById(snippetId);
      if (snippet) {
        setTitle(snippet.title);
        setCode(snippet.code);
      }
      setLoading(false);
    }

    loadSnippet();
  }, [snippetId]);

  async function handleSave() {
    if (!title.trim() || !code.trim()) {
      return;
    }

    setSaving(true);
    if (snippetId) {
      await updateSnippet(snippetId, title.trim(), code.trim());
    } else {
      await addSnippet(title.trim() || "Untitled snippet", code.trim());
    }
    setSaving(false);
    router.push("/");
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SnippetForm
          code={code}
          isEditing={Boolean(snippetId)}
          loading={loading}
          saving={saving}
          title={title}
          onChangeCode={setCode}
          onChangeTitle={setTitle}
          onSave={handleSave}
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
