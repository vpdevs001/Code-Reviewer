import { StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors } from "../constants/colors";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search snippets...",
}: SearchBarProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={lightColors.placeholder}
          style={styles.input}
          returnKeyType="search"
          accessible
          accessibilityLabel="Search snippets"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: lightColors.background,
  },
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: lightColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lightColors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    color: lightColors.text,
    fontSize: 16,
    minHeight: 44,
  },
});
