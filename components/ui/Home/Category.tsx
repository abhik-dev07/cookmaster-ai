import { FONT_FAMILY } from "@/constants/fonts";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CATEGORY_COLORS = [
  "#BDF5A5",
  "#F8CF9C",
  "#D4C1FF",
  "#D0F593",
  "#FFC8A8",
  "#FFB8D1",
  "#B8E6FF",
  "#FFD4A3",
];

export default function Category() {
  const categories = useQuery(api.categories.listCategories);

  if (categories === undefined) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#8B68FF" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryList}
    >
      {categories.map((item, index) => (
        <View key={item._id} style={styles.categoryItem}>
          <View
            style={[
              styles.categoryIconCircle,
              {
                backgroundColor:
                  CATEGORY_COLORS[index % CATEGORY_COLORS.length],
              },
            ]}
          >
            {item.image_link ? (
              <Image
                source={{ uri: item.image_link }}
                style={styles.categoryImage}
                contentFit="cover"
              />
            ) : (
              <Text style={styles.categoryEmoji}>📷</Text>
            )}
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.categoryLabel}
          >
            {item.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryList: {
    paddingTop: 25,
    paddingBottom: 20,
    gap: 15,
    paddingHorizontal: 15,
  },
  categoryItem: {
    width: 68,
    alignItems: "center",
  },
  categoryIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  categoryLabel: {
    marginTop: 9,
    color: "#11121C",
    fontSize: 15,
    fontFamily: FONT_FAMILY.medium,
    width: 80,
    textAlign: "center",
  },
});
