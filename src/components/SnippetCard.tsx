import { Feather, FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fonts } from "../constants/typography";
import { SnippetRow } from "../db/database";
import { useTheme } from "../hooks/theme";

type SnippetCardProps = {
  snippet: SnippetRow;
  onDelete: (id: number) => void;
  onPress: (id: number) => void;
  onToggleFavorite: (snippet: SnippetRow) => void;
};

export default function SnippetCard({
  snippet,
  onDelete,
  onPress,
  onToggleFavorite,
}: SnippetCardProps) {
  const { colors } = useTheme();
  const isFavorite = snippet.favorite === 1;

  return (
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
        onPress={() => onPress(snippet.id)}
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
            {snippet.title}
          </Text>
          <View style={styles.cardActions}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                onToggleFavorite(snippet);
              }}
              hitSlop={10}
              accessibilityLabel={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={20}
                color={isFavorite ? colors.accent : colors.subtext}
              />
            </Pressable>
            <Feather name="chevron-right" size={20} color={colors.subtext} />
          </View>
        </View>
        <Text
          style={[styles.cardSubtitle, { color: colors.subtext }]}
          numberOfLines={3}
        >
          {snippet.code}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, { backgroundColor: colors.border }]}>
              <Feather name="code" size={14} color={colors.text} />
              <Text style={[styles.badgeText, { color: colors.text }]}>
                {snippet.language || "javascript"}
              </Text>
            </View>
            {snippet.tags && snippet.tags.trim() ? (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Feather name="tag" size={14} color={colors.background} />
                <Text style={[styles.badgeText, { color: colors.background }]}>
                  {snippet.tags.split(",").slice(0, 2).join(", ")}
                  {snippet.tags.split(",").length > 2 ? "+" : ""}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.cardDate, { color: colors.subtext }]}>
            {new Date(snippet.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => onDelete(snippet.id)}
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
  );
}

const styles = StyleSheet.create({
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
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
