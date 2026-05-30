import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Switch, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/theme";
import { getUsername, saveUsername } from "../../utils/userStorage";

const settings = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const [username, setUsernameText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadUsername() {
      const storedName = await getUsername();
      if (storedName) {
        setUsernameText(storedName);
      }
    }

    loadUsername();
  }, []);

  async function handleSaveUsername() {
    await saveUsername(username.trim());
    setSaved(true);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.inner}>
        <Text style={[styles.text, { color: colors.text }]}>Settings</Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            thumbColor={colors.card}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>

        <View style={[styles.settingGroup, { borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.text }]}>Your name</Text>
          <TextInput
            value={username}
            onChangeText={(value) => {
              setUsernameText(value);
              setSaved(false);
            }}
            placeholder="Enter your name"
            placeholderTextColor={colors.subtext}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleSaveUsername}
            accessibilityLabel="Save username"
          >
            <Text style={[styles.saveButtonText, { color: colors.card }]}>Save</Text>
          </Pressable>
          {saved ? <Text style={[styles.savedText, { color: colors.primary }]}>Name saved</Text> : null}
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
  settingGroup: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  saveButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "600",
  },
  savedText: {
    marginTop: 10,
    fontSize: 14,
  },
});
