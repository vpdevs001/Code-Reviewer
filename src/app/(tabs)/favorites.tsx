import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Greetings from "../../components/Greetings";
import { fonts } from "../../constants/typography";
import { getUsername } from "../../utils/userStorage";
import { useTheme } from "../../hooks/theme";

const favorites = () => {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function loadUsername() {
      const storedName = await getUsername();
      if (storedName) {
        setUsername(storedName);
      }
    }
    loadUsername();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.inner}>
        <Greetings username={username} />
        <Text style={[styles.text, { color: colors.text }]}>Favorites</Text>
      </View>
    </SafeAreaView>
  );
};

export default favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
  },
});
