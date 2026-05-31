import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { fonts } from "../constants/typography";
import { CodeLine } from "../utils/syntaxHighlighter";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  subtextColor: string;
};

export default function CodeEditor({
  value,
  onChange,
  placeholder = "Paste or type your code here",
  subtextColor,
}: CodeEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const lines = value.split("\n");

  if (isFocused) {
    return (
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={subtextColor}
          multiline
          autoFocus
          onBlur={() => setIsFocused(false)}
          style={[styles.textInput, { color: subtextColor }]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <View style={styles.codeContainer}>
            {lines.length === 0 ? (
              <Text style={[styles.placeholder, { color: subtextColor }]}>
                {placeholder}
              </Text>
            ) : (
              lines.map((line, index) => (
                <CodeLine
                  key={index}
                  line={line}
                  lineNumber={index + 1}
                  subtextColor={subtextColor}
                />
              ))
            )}
          </View>
        </ScrollView>
      </ScrollView>
      <Text
        style={[styles.editHint, { color: subtextColor }]}
        onPress={() => setIsFocused(true)}
      >
        Tap to edit
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#282c34",
    minHeight: 220,
  },
  codeContainer: {
    flexDirection: "column",
  },
  textInput: {
    fontSize: 16,
    fontFamily: fonts.code,
    lineHeight: 24,
    minHeight: 220,
    textAlignVertical: "top",
    color: "#abb2bf",
  },
  placeholder: {
    fontSize: 16,
    fontFamily: fonts.code,
    lineHeight: 24,
    color: "#5c6370",
  },
  editHint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 8,
    opacity: 0.6,
    textAlign: "center",
  },
});
