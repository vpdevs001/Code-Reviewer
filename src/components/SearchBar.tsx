import { StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inline?: boolean;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search snippets...",
  inline = false,
}: SearchBarProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: inline ? 0 : 16,
      marginBottom: inline ? 0 : 12,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flex: inline ? 1 : undefined,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      color: colors.text,
      fontSize: 16,
      minHeight: 44,
      flex: 1,
    },
  });

  const inner = (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.placeholder} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        returnKeyType="search"
        accessible
        accessibilityLabel="Search snippets"
      />
    </View>
  );

  if (inline) return inner;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {inner}
    </SafeAreaView>
  );
}
