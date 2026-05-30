import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/theme";

type GreetingsProps = {
  username?: string;
};

export default function Greetings({ username }: GreetingsProps) {
  const { colors } = useTheme();
  const displayName = username?.trim() ? username.trim() : "developer";

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Hello {displayName}</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>Let's get some cool snippets managed throughout</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
