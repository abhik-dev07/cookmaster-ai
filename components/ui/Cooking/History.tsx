import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PROP_IMAGE = require("../../../assets/images/common/prop.png");

const RECENT_RECIPES = [
  {
    title: "Pizza Cooking",
    calories: "975 Kcal",
    duration: "20 min",
    ingredients: "5 Ingredients",
    cardColor: "#FFE9CC",
    propTint: "#FFD097",
  },
  {
    title: "Pasta Primavera",
    calories: "820 Kcal",
    duration: "18 min",
    ingredients: "7 Ingredients",
    cardColor: "#FFD9C3",
    propTint: "#FFBA96",
  },
  {
    title: "Veggie Omelette",
    calories: "540 Kcal",
    duration: "12 min",
    ingredients: "6 Ingredients",
    cardColor: "#FFF7BA",
    propTint: "#FDEE5F",
  },
] as const;

export default function History() {
  return (
    <View>
      <View style={styles.historyHeading}>
        <Text style={styles.historyTitle}>History</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 15 }}>
        {RECENT_RECIPES.map((recipe) => (
          <View
            key={recipe.title}
            style={[styles.historyCard, { backgroundColor: recipe.cardColor }]}
          >
            <Image
              source={PROP_IMAGE}
              style={[styles.propBackdrop, { tintColor: recipe.propTint }]}
              contentFit="contain"
            />

            <View style={styles.historyIconWrap}>
              <Image
                source={require("../../../assets/images/common/food.jpg")}
                contentFit="cover"
                style={styles.historyImage}
              />
            </View>
            <View style={styles.historyBody}>
              <Text style={styles.historyCardTitle}>{recipe.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaText}>🔥 {recipe.calories}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={12} color="#000000" />
                  <Text style={styles.metaText}>{recipe.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="apps" size={12} color="#000000" />
                  <Text style={styles.metaText}>{recipe.ingredients}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  historyHeading: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  historyTitle: {
    color: "#2B2B2B",
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 24,
  },
  seeAllText: {
    color: "#858484",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 15,
  },
  historyCard: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    gap: 10,
    overflow: "hidden",
  },
  propBackdrop: {
    position: "absolute",
    bottom: 1,
    right: -60,
    width: 160,
    height: 160,
    zIndex: 1,
  },
  historyIconWrap: {
    width: 65,
    height: 65,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  historyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  historyBody: {
    flex: 1,
    gap: 5,
    zIndex: 2,
  },
  historyCardTitle: {
    color: "#000000",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#000000",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 13,
  },
});
