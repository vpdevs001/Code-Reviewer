import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors } from "../../constants/colors";

const settings = () => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: lightColors.background }]}
    >
      <View style={styles.inner}>
        <Text style={styles.text}>Settings</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: lightColors.text,
  },
});
