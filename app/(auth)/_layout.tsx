import { router, Slot } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function AuthLayout() {
  return (
    <View>
      <Button title="Home" onPress={() => router.push("/")} />
      <Text>AuthLayout</Text>
      <Slot />
    </View>
  );
}
