import CarousalSaved from "@/components/ui/Wishlist/CarousalSaved";
import Collection from "@/components/ui/Wishlist/Collection";
import FilterSavedCard from "@/components/ui/Wishlist/FilterSavedCard";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SAVED_RECIPES = [
  {
    id: "miso-bowl",
    title: "Miso Glow Bowl",
    description:
      "A warm, balanced bowl with roasted vegetables, rice, and umami miso glaze.",
    color: "#D0C4FF",
    propTint: "#C3B2FF",
    tag: "Saved today",
    time: "18 min",
    kcal: "430 kcal",
  },
  {
    id: "salmon-slab",
    title: "Lemon Herb Salmon",
    description:
      "Flaky salmon with citrus butter, herbs, and a bright green side salad.",
    color: "#FFD9C3",
    propTint: "#FFBA96",
    tag: "Pinned recipe",
    time: "24 min",
    kcal: "512 kcal",
  },
  {
    id: "avocado-toast",
    title: "Avocado Morning Toast",
    description:
      "Soft eggs, smashed avocado, and crispy sourdough with chili flakes.",
    color: "#FFF7BA",
    propTint: "#FDEE5F",
    tag: "Quick save",
    time: "12 min",
    kcal: "295 kcal",
  },
] as const;

export default function WishlistScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paddedSection}>
          <CarousalSaved />
        </View>
        <View style={styles.paddedSection}>
          <Collection />
        </View>
        <View style={styles.paddedSection}>
          <FilterSavedCard />
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
