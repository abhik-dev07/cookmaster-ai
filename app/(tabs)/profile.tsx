import ProfileRecipe from "@/components/ui/Profile/ProfileRecipe";
import ProfileSettings from "@/components/ui/Profile/ProfileSettings";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSettings />
        <ProfileRecipe />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 124,
  },
});
