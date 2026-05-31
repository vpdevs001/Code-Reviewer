import { Feather } from "@expo/vector-icons";
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
import { useTheme } from "../hooks/theme";
import CodeEditor from "./CodeEditor";

type SnippetFormProps = {
  code: string;
  isEditing: boolean;
  loading: boolean;
  saving: boolean;
  title: string;
  language: string;
  tags: string;
  onChangeCode: (value: string) => void;
  onChangeTitle: (value: string) => void;
  onChangeLanguage: (value: string) => void;
  onChangeTags: (value: string) => void;
  onSave: () => void;
};

export default function SnippetForm({
  code,
  isEditing,
  loading,
  saving,
  title,
  language,
  tags,
  onChangeCode,
  onChangeTitle,
  onChangeLanguage,
  onChangeTags,
  onSave,
}: SnippetFormProps) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.formHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          {isEditing ? "Edit snippet" : "New snippet"}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={onSave}
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
                style={styles.saveIcon}
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
              onChangeText={onChangeTitle}
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
            <CodeEditor
              value={code}
              onChange={onChangeCode}
              placeholder="Paste or type your code here"
              subtextColor={colors.text}
            />
          </View>
          <View
            style={[
              styles.field,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Programming Language
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.languageScroll}
              contentContainerStyle={styles.languageScrollContent}
            >
              {[
                "javascript",
                "typescript",
                "python",
                "java",
                "cpp",
                "csharp",
                "go",
                "rust",
                "swift",
                "kotlin",
                "php",
                "ruby",
                "html",
                "css",
                "sql",
                "bash",
                "other",
              ].map((lang) => (
                <Pressable
                  key={lang}
                  style={({ pressed }) => [
                    styles.languageChip,
                    {
                      backgroundColor:
                        language === lang ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => onChangeLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.languageChipText,
                      {
                        color:
                          language === lang ? colors.background : colors.text,
                      },
                    ]}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <View
            style={[
              styles.field,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Tags (comma separated)
            </Text>
            <TextInput
              value={tags}
              onChangeText={onChangeTags}
              placeholder="react, hooks, api"
              placeholderTextColor={colors.placeholder}
              style={[styles.input, { color: colors.text }]}
            />
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  saveIcon: {
    marginRight: 8,
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
  languageScroll: {
    marginTop: 8,
  },
  languageScrollContent: {
    paddingRight: 8,
  },
  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  languageChipText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
});
