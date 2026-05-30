import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../constants/typography";
import { useTheme } from "../hooks/theme";

type GreetingsProps = {
  username?: string;
};

export default function Greetings({ username }: GreetingsProps) {
  const { colors } = useTheme();
  const displayName = username?.trim() ? username.trim() : "developer";

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Hello, {displayName}!
      </Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        Let's get some cool snippets managed throughout!!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 18,
    marginBottom: 22,
  },
  title: {
    fontSize: 34,
    fontFamily: fonts.extraBold,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regular,
    color: "#666",
  },
});
