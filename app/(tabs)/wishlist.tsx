import RecipeCard from "@/components/RecipeCard";
import CarousalSaved from "@/components/ui/Wishlist/CarousalSaved";
import Collection from "@/components/ui/Wishlist/Collection";
import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FILTER_CHIPS = [
  "All",
  "Veg",
  "Non Veg",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Drink",
] as const;

export default function WishlistScreen() {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [selectedFilter, setSelectedFilter] =
    React.useState<(typeof FILTER_CHIPS)[number]>("All");

  const sectionTitleOpacity = scrollY.interpolate({
    inputRange: [0, 12, 36],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.safeArea}>
      <Animated.ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <View style={styles.paddedSection}>
          <CarousalSaved />
        </View>
        <View style={styles.paddedSection}>
          <Collection />
        </View>
        <View style={styles.paddedSection}>
          <View style={styles.filterHeader}>
            <ScrollView
              horizontal
              style={styles.filterChipScroller}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipRow}
            >
              {FILTER_CHIPS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.85}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === filter && styles.filterChipTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeaderTopPicks}>
              <Animated.Text
                style={[styles.sectionTitle, { opacity: sectionTitleOpacity }]}
              >
                {selectedFilter} Saved Recipes
              </Animated.Text>
            </View>
          </View>
          <RecipeCard
            mode="wishlist"
            selectedFilter={selectedFilter}
            showHeader={false}
          />
        </View>
      </Animated.ScrollView>
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
  filterHeader: {
    marginTop: 2,
    marginBottom: 8,
  },
  filterChipScroller: {
    marginHorizontal: -16,
  },
  filterChipRow: {
    paddingTop: 18,
    paddingBottom: 8,
    gap: 10,
    paddingLeft: 16,
    paddingRight: 18,
  },
  filterChip: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EAF3",
  },
  filterChipActive: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  filterChipText: {
    color: "#2A2D3D",
    fontSize: 16,
    fontFamily: FONT_FAMILY.medium,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
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
