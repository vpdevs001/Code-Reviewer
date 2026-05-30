import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Snippet = () => {
  const id = useLocalSearchParams();

  return (
    <View>
      <Text>Snippet</Text>
    </View>
  );
};

export default Snippet;

const styles = StyleSheet.create({});
