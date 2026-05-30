import React from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/theme";

const settings = () => {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.inner}>
        <Text style={[styles.text, { color: colors.text }]}>Settings</Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
          <Switch value={theme === "dark"} onValueChange={toggleTheme} thumbColor={colors.card} trackColor={{ true: colors.primary, false: colors.border }} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
  },
});
