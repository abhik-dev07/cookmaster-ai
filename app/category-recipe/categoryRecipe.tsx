import RecipeCard from "@/components/Common/ui/RecipeCard";
import FilterCategory from "@/components/ui/Catagory/FilterCategory";
import Header from "@/components/ui/Catagory/Header";
import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function CategoryRecipe() {
  const [selectedFilter, setSelectedFilter] = React.useState("All");
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const sectionTitleOpacity = scrollY.interpolate({
    inputRange: [0, 16, 56],
    outputRange: [1, 0.0, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Header />
      <FilterCategory
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      <Animated.ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <View style={styles.sectionHeaderTopPicks}>
          <Animated.Text
            style={[styles.sectionTitle, { opacity: sectionTitleOpacity }]}
          >
            {selectedFilter} Recipes
          </Animated.Text>
        </View>

        <RecipeCard
          mode="category"
          selectedFilter={selectedFilter}
          showHeader={false}
        />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  sectionHeaderTopPicks: {
    marginTop: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#171B2A",
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.4,
    fontFamily: FONT_FAMILY.bold,
  },
});
