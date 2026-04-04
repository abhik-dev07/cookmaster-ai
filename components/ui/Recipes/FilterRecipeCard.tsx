import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
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

const TOP_PICKS = [
  {
    id: "creamy-garlic",
    title: "Creamy Garlic",
    description: "A silky pasta bowl with tender chicken, parmesan, and herbs.",
    time: "25 min",
    kcal: "410 kcal",
    color: "#D0C4FF",
    propTint: "#C3B2FF",
  },
  {
    id: "lemon-herb",
    title: "Lemon Herb",
    description: "Citrusy roasted salmon paired with a bright, fresh finish.",
    time: "30 min",
    kcal: "410 kcal",
    color: "#D6FFD3",
    propTint: "#BDFFB9",
  },
  {
    id: "avocado-morning",
    title: "Avocado Morning",
    description:
      "Creamy avocado, soft egg, and crunchy toast finished with herbs.",
    time: "15 min",
    kcal: "410 kcal",
    color: "#E8FFB7",
    propTint: "#DBFF93",
  },
  {
    id: "rainbow-bowl",
    title: "Rainbow Grain Bowl",
    description:
      "A bright bowl of grains, roasted veggies, chickpeas, and greens.",
    time: "20 min",
    kcal: "410 kcal",
    color: "#FFD9C3",
    propTint: "#FFBA96",
  },
] as const;

export default function FilterRecipeCard() {
  const [selectedFilter, setSelectedFilter] =
    React.useState<(typeof FILTER_CHIPS)[number]>("All");
  const sectionTitle = `${selectedFilter} Recipes`;
  return (
    <View>
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
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      </View>

      <View style={styles.grid}>
        {TOP_PICKS.map((item, index) => (
          <View
            key={item.id}
            style={[styles.pickCard, { backgroundColor: item.color }]}
          >
            <View style={styles.pickImageWrap}>
              <Image
                source={require("../../../assets/images/common/food.jpg")}
                style={styles.pickImage}
                contentFit="cover"
              />
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.pickHeartButton}
              >
                <MaterialCommunityIcons
                  name="heart"
                  size={18}
                  color="#1A1C2A"
                />
              </TouchableOpacity>
            </View>

            <Image
              source={require("../../../assets/images/common/prop.png")}
              style={[
                styles.pickProp,
                index % 2 === 0 ? styles.pickPropLeft : styles.pickPropRight,
                { tintColor: item.propTint },
              ]}
              contentFit="contain"
            />

            <Text numberOfLines={1} style={styles.pickTitle}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={styles.pickDescription}>
              {item.description}
            </Text>

            <View style={styles.pickMetaRow}>
              <Text style={styles.pickTime}>
                <Ionicons name="time-outline" size={14} color="#22222F" />{" "}
                {item.time}
              </Text>
              <Text style={styles.pickTime}>
                <Ionicons name="flame-outline" size={14} color="#22222F" />{" "}
                {item.kcal}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterChipScroller: {
    marginHorizontal: -16,
  },
  filterChipRow: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 16,
    gap: 14,
    paddingRight: 20,
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  pickCard: {
    width: "48%",
    minHeight: 280,
    borderRadius: 24,
    padding: 10,
    overflow: "hidden",
  },
  pickImageWrap: {
    height: 105,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.55)",
    zIndex: 3,
  },
  pickImage: {
    width: "100%",
    height: "100%",
  },
  pickHeartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 4,
  },
  pickProp: {
    position: "absolute",
    top: 150,
    width: 200,
    height: 200,
    zIndex: 1,
  },
  pickPropLeft: {
    left: -80,
  },
  pickPropRight: {
    right: -80,
  },
  pickTitle: {
    marginTop: 14,
    color: "#171A2B",
    fontSize: 25,
    lineHeight: 28,
    letterSpacing: -0.4,
    fontFamily: FONT_FAMILY.medium,
    zIndex: 3,
  },
  pickDescription: {
    marginTop: 8,
    color: "#6A6D80",
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.regular,
    zIndex: 3,
  },
  pickMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },
  pickTime: {
    marginTop: 24,
    color: "#202233",
    fontSize: 15,
    fontFamily: FONT_FAMILY.semibold,
    gap: 6,
    zIndex: 3,
  },
  pickServe: {
    marginTop: 20,
    color: "#202233",
    fontSize: 15,
    fontFamily: FONT_FAMILY.semibold,
    zIndex: 3,
  },
});
