import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LISTS = [
  {
    id: "yummy",
    title: "Yummy",
    count: "05 recipes",
    tint: "#FFFFFF",
    image: require("../../../assets/images/common/food.jpg"),
  },
  {
    id: "favorites",
    title: "My Favorites",
    count: "7 recipes",
    tint: "#FFFFFF",
    image: require("../../../assets/images/common/food.jpg"),
  },
] as const;

export default function ProfileRecipe() {
  return (
    <View>
      <View style={styles.segmentWrap}>
        <TouchableOpacity
          activeOpacity={0.86}
          style={[styles.segment, styles.segmentActive]}
        >
          <Text style={[styles.segmentText, styles.segmentTextActive]}>
            My Lists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.86} style={styles.segment}>
          <Text style={styles.segmentText}>My Recipes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.createButton}>
        <Ionicons name="add" size={18} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create New List</Text>
      </TouchableOpacity>

      <View style={styles.listsContainer}>
        {LISTS.map((item, index) => (
          <View
            key={item.id}
            style={[styles.listCard, index === 0 && styles.darkListCard]}
          >
            <Image
              source={item.image}
              style={styles.listImage}
              contentFit="cover"
            />
            <View style={styles.overlay} />

            <View style={styles.listPlusButton}>
              <Ionicons name="add" size={24} color={"#1A1B28"} />
            </View>

            <View style={styles.listTextWrap}>
              <Text style={[styles.listTitle, { color: item.tint }]}>
                {item.title}
              </Text>
              <Text style={[styles.listCount, { color: item.tint }]}>
                {item.count}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentWrap: {
    marginTop: 20,
    flexDirection: "row",
    padding: 4,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.76)",
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: "#F5F7FB",
  },
  segmentText: {
    color: "#1B1D29",
    fontSize: 15,
    fontFamily: FONT_FAMILY.medium,
  },
  segmentTextActive: {
    color: "#1B1D29",
  },
  createButton: {
    marginTop: 14,
    height: 48,
    borderRadius: 30,
    marginBottom: 6,
    backgroundColor: "#7C5CFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONT_FAMILY.semibold,
  },
  listsContainer: {
    marginTop: 14,
    gap: 18,
  },
  listCard: {
    height: 150,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#E8E8E8",
  },
  darkListCard: {
    backgroundColor: "#12131A",
  },
  listImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,12,18,0.28)",
  },
  listPlusButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.38)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.42)",
  },
  listTextWrap: {
    position: "absolute",
    left: 14,
    bottom: 16,
  },
  listTitle: {
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.2,
    fontFamily: FONT_FAMILY.bold,
  },
  listCount: {
    marginTop: 4,
    fontSize: 15,
    fontFamily: FONT_FAMILY.medium,
  },
});
