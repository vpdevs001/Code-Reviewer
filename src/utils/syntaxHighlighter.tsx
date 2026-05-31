import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../constants/typography";

export type Token = { text: string; color: string };

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "delete",
  "typeof",
  "instanceof",
  "in",
  "of",
  "class",
  "extends",
  "import",
  "export",
  "default",
  "from",
  "async",
  "await",
  "try",
  "catch",
  "finally",
  "throw",
  "this",
  "super",
  "static",
  "null",
  "undefined",
  "true",
  "false",
  "void",
  "yield",
  "def",
  "pass",
  "lambda",
  "with",
  "as",
  "raise",
  "global",
  "nonlocal",
  "assert",
  "del",
  "elif",
  "except",
  "exec",
  "print",
  "and",
  "or",
  "not",
  "is",
  "None",
  "True",
  "False",
]);

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const regex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/{2}[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|(0x[\da-fA-F]+|\b\d+\.?\d*\b)|(\b[A-Z][a-zA-Z0-9_]*\b)|(\b\w+\b)|([\s\S])/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    const [, str, comment, num, className, word, other] = match;
    if (str) tokens.push({ text: str, color: "#98c379" });
    else if (comment) tokens.push({ text: comment, color: "#5c6370" });
    else if (num) tokens.push({ text: num, color: "#d19a66" });
    else if (className) tokens.push({ text: className, color: "#e5c07b" });
    else if (word)
      tokens.push({
        text: word,
        color: KEYWORDS.has(word) ? "#c678dd" : "#abb2bf",
      });
    else tokens.push({ text: other ?? "", color: "#abb2bf" });
  }
  return tokens;
}

export function CodeLine({
  line,
  lineNumber,
  subtextColor,
}: {
  line: string;
  lineNumber: number;
  subtextColor: string;
}) {
  const tokens = tokenize(line || " ");
  return (
    <View style={codeStyles.lineRow}>
      <Text style={[codeStyles.lineNumber, { color: subtextColor }]}>
        {String(lineNumber).padStart(3, " ")}
      </Text>
      <Text style={codeStyles.codeLine}>
        {tokens.map((token, i) => (
          <Text
            key={i}
            style={{
              color: token.color,
              fontFamily: fonts.code,
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            {token.text}
          </Text>
        ))}
      </Text>
    </View>
  );
}

const codeStyles = StyleSheet.create({
  lineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  lineNumber: {
    fontSize: 12,
    fontFamily: fonts.code,
    lineHeight: 20,
    width: 36,
    textAlign: "right",
    paddingRight: 12,
    opacity: 0.5,
  },
  codeLine: {
    flex: 1,
    flexWrap: "wrap",
    lineHeight: 20,
  },
});
