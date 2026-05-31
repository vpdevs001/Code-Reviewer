import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "../constants/typography";
import { SnippetRow } from "../db/database";
import { useTheme } from "../hooks/theme";
import { shareSnippet } from "../utils/export";
import { CodeLine } from "../utils/syntaxHighlighter";

type SnippetPreviewProps = {
  loading: boolean;
  snippet: Pick<
    SnippetRow,
    "title" | "code" | "language" | "tags" | "createdAt"
  > | null;
  onEdit: () => void;
};

export default function SnippetPreview({
  loading,
  snippet,
  onEdit,
}: SnippetPreviewProps) {
  const { colors } = useTheme();

  async function handleShare(format: "text" | "js" | "json") {
    if (!snippet) return;
    try {
      await shareSnippet(snippet, format);
    } catch (error) {
      Alert.alert("Share Failed", "Failed to share snippet.");
    }
  }

  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Snippet preview
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Read the code with a clean editor-like layout
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={onEdit}
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
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.snippetTitle, { color: colors.text }]}>
              {snippet.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.border }]}>
              <Feather name="code" size={14} color={colors.text} />
              <Text style={[styles.badgeText, { color: colors.text }]}>
                {snippet.language || "javascript"}
              </Text>
            </View>
          </View>
          <Text style={[styles.snippetMeta, { color: colors.subtext }]}>
            Created {new Date(snippet.createdAt).toLocaleString()}
          </Text>
          {snippet.tags && snippet.tags.trim() ? (
            <View style={styles.tagsContainer}>
              {snippet.tags.split(",").map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tagBadge, { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.tagText, { color: colors.background }]}>
                    {tag.trim()}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View
            style={[
              styles.editor,
              { backgroundColor: "#282c34", borderColor: colors.border },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.codeContainer}>
                  {snippet.code.split("\n").map((line, index) => (
                    <CodeLine
                      key={index}
                      line={line}
                      lineNumber={index + 1}
                      subtextColor={colors.subtext}
                    />
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() => handleShare("text")}
            >
              <Feather name="share-2" size={18} color={colors.background} />
              <Text
                style={[styles.actionButtonText, { color: colors.background }]}
              >
                Share
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Snippet not found.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.extraBold,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
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
    padding: 24,
    marginTop: 14,
  },
  snippetTitle: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    marginBottom: 10,
  },
  snippetMeta: {
    fontSize: 14,
    marginBottom: 18,
    fontFamily: fonts.regular,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  editor: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    maxHeight: 400,
  },
  codeContainer: {
    flexDirection: "column",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    flex: 1,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
});
