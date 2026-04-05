import { FONT_FAMILY } from "@/constants/fonts";
import { api } from "@/convex/_generated/api";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

type RootStackParamList = {
  categoryRecipe: {
    categoryId: string;
    categoryName: string;
  };
};

export default function Category() {
  const categories = useQuery(api.categories.listCategories);
  const { isCompactDisplay } = useResponsiveLayout();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
        <TouchableOpacity
          key={item._id}
          activeOpacity={0.5}
          onPress={() => {
            if (Platform.OS !== "web") {
              void Haptics.selectionAsync();
            }

            navigation.navigate("categoryRecipe", {
              categoryId: String(item._id),
              categoryName: item.name,
            });
          }}
          style={[
            styles.categoryItem,
            isCompactDisplay && styles.categoryItemCompact,
          ]}
        >
          <View
            style={[
              styles.categoryIconCircle,
              isCompactDisplay && styles.categoryIconCircleCompact,
              {
                backgroundColor:
                  CATEGORY_COLORS[index % CATEGORY_COLORS.length],
              },
            ]}
          >
            {item.image_link ? (
              <Image
                source={{ uri: item.image_link }}
                style={[
                  styles.categoryImage,
                  isCompactDisplay && styles.categoryImageCompact,
                ]}
                contentFit="cover"
              />
            ) : (
              <Text
                style={[
                  styles.categoryEmoji,
                  isCompactDisplay && styles.categoryEmojiCompact,
                ]}
              >
                📷
              </Text>
            )}
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.categoryLabel,
              isCompactDisplay && styles.categoryLabelCompact,
            ]}
            maxFontSizeMultiplier={1.1}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
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
  categoryItemCompact: {
    width: 62,
  },
  categoryIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconCircleCompact: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryEmojiCompact: {
    fontSize: 24,
  },
  categoryImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  categoryImageCompact: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  categoryLabel: {
    marginTop: 9,
    color: "#11121C",
    fontSize: 15,
    fontFamily: FONT_FAMILY.medium,
    width: 80,
    textAlign: "center",
  },
  categoryLabelCompact: {
    width: 66,
    fontSize: 13,
  },
});
