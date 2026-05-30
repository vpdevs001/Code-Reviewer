import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, Switch, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts } from "../../constants/typography";
import { useTheme } from "../../hooks/theme";
import { getUsername, saveUsername } from "../../utils/userStorage";
import { deleteAllSnippets } from "../../db/database";

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

  function confirmDeleteAll() {
    Alert.alert(
      "Delete all snippets",
      "Are you sure you want to delete all snippets? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete all",
          style: "destructive",
          onPress: async () => {
            await deleteAllSnippets();
            Alert.alert("Deleted", "All snippets have been removed.");
          },
        },
      ],
    );
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

        <Pressable
          style={({ pressed }) => [
            styles.deleteAllButton,
            {
              borderColor: colors.error,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={confirmDeleteAll}
          accessibilityLabel="Delete all snippets"
        >
          <Text style={[styles.deleteAllText, { color: colors.error }]}>Delete all snippets</Text>
          <Text style={[styles.deleteWarning, { color: colors.error }]}>This is permanent and will remove every saved snippet.</Text>
        </Pressable>
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
    padding: 28,
  },
  text: {
    fontSize: 22,
    fontFamily: fonts.bold,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  settingGroup: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginTop: 28,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
    minHeight: 50,
    fontFamily: fonts.regular,
  },
  saveButton: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: fonts.semiBold,
  },
  savedText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  deleteAllButton: {
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  deleteAllText: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  deleteWarning: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
});
