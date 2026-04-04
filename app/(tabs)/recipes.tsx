import CarousalRecipe from "@/components/ui/Recipes/CarousalRecipe";
import FilterRecipeCard from "@/components/ui/Recipes/FilterRecipeCard";
import SearchArea from "@/components/ui/Recipes/SearchArea";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function RecipesScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paddedSection}>
          <SearchArea />
        </View>
        <CarousalRecipe />
        <View style={styles.paddedSection}>
          <FilterRecipeCard />
        </View>
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
    paddingTop: 12,
    paddingBottom: 120,
  },
  paddedSection: {
    paddingHorizontal: 16,
  },
});
