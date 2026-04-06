import MetaData from "@/components/ui/RecipeDetails/MetaData";
import RecipeInfo from "@/components/ui/RecipeDetails/RecipeInfo";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function RecipeDetails() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <RecipeInfo />
      <MetaData />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  screenContent: {
    paddingTop: 56,
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
});
