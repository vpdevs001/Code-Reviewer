import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fonts } from "../constants/typography";
import { useTheme } from "../hooks/theme";

type SnippetFormProps = {
  code: string;
  isEditing: boolean;
  loading: boolean;
  saving: boolean;
  title: string;
  onChangeCode: (value: string) => void;
  onChangeTitle: (value: string) => void;
  onSave: () => void;
};

export default function SnippetForm({
  code,
  isEditing,
  loading,
  saving,
  title,
  onChangeCode,
  onChangeTitle,
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
              <Text style={[styles.saveButtonText, { color: colors.background }]}>
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
            <TextInput
              value={code}
              onChangeText={onChangeCode}
              placeholder="Paste or type your code here"
              placeholderTextColor={colors.placeholder}
              style={[styles.codeInput, { color: colors.text }]}
              multiline
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
});
