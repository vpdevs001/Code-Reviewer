import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fonts } from "../constants/typography";
import { addSnippet, getSnippetById, updateSnippet } from "../db/database";
import { useTheme } from "../hooks/theme";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <View style={styles.formHeader}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            {snippetId ? "Edit snippet" : "New snippet"}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleSave}
            accessibilityLabel="Save snippet"
          >
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <View style={styles.saveButtonContent}>
                <Feather
                  name="save"
                  size={16}
                  color={colors.background}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[styles.saveButtonText, { color: colors.background }]}
                >
                  Save
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <View
              style={[
                styles.field,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Snippet title"
                placeholderTextColor={colors.placeholder}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
            <View
              style={[
                styles.field,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Code
              </Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Paste or type your code here"
                placeholderTextColor={colors.placeholder}
                style={[styles.codeInput, { color: colors.text }]}
                multiline
              />
            </View>
          </>
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
    padding: 28,
    paddingBottom: 44,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  field: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 15,
    marginBottom: 12,
    fontFamily: fonts.semiBold,
  },
  input: {
    fontSize: 16,
    minHeight: 48,
    fontFamily: fonts.regular,
  },
  codeInput: {
    fontSize: 16,
    minHeight: 220,
    textAlignVertical: "top",
    fontFamily: fonts.code,
    lineHeight: 24,
  },
});
