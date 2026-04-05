import { FONT_FAMILY } from "@/constants/fonts";
import { useRoute, type RouteProp } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  categoryRecipe: {
    categoryId: string;
    categoryName: string;
  };
};

const SUBCATEGORY_BY_CATEGORY: Record<string, string[]> = {
  breakfast: [
    "Eggs",
    "Pancakes",
    "Toast",
    "Cereal",
    "Paratha",
    "Poha",
    "Upma",
    "Idli & Dosa",
  ],
  lunch: [
    "Rice dishes",
    "Roti & sabzi",
    "Dal",
    "Soup",
    "Sandwich",
    "Noodles",
    "Biryani",
  ],
  dinner: [
    "Rice dishes",
    "Roti & sabzi",
    "Dal & curry",
    "Biryani",
    "Pasta",
    "Kebabs",
    "Soup",
  ],
  "fast food": [
    "Burger",
    "Pizza",
    "Fried chicken",
    "Hot dog",
    "French fries",
    "Tacos",
    "Rolls & wraps",
  ],
  drinks: [
    "Water",
    "Juice",
    "Tea & coffee",
    "Milkshake",
    "Smoothie",
    "Soda",
    "Lassi",
    "Coconut water",
  ],
  dessert: [
    "Ice cream",
    "Pudding",
    "Brownie",
    "Cookie",
    "Halwa",
    "Kheer",
    "Gulab jamun",
    "Pie",
  ],
  cake: [
    "Chocolate",
    "Vanilla",
    "Cheesecake",
    "Cupcake",
    "Fruit cake",
    "Black forest",
    "Red velvet",
  ],
  salad: [
    "Green salad",
    "Fruit salad",
    "Pasta salad",
    "Chicken salad",
    "Egg salad",
    "Coleslaw",
  ],
};

function normalizeCategoryName(value: string) {
  return value.trim().toLowerCase();
}

type FilterCategoryProps = {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
};

export default function FilterCategory({
  selectedFilter,
  onSelectFilter,
}: FilterCategoryProps) {
  const route = useRoute<RouteProp<RootStackParamList, "categoryRecipe">>();
  const categoryName = route.params?.categoryName ?? "Category";
  const normalized = normalizeCategoryName(categoryName);
  const subCategories = SUBCATEGORY_BY_CATEGORY[normalized] ?? [];

  const filters = React.useMemo(
    () => ["All", ...subCategories],
    [subCategories],
  );

  React.useEffect(() => {
    onSelectFilter("All");
  }, [categoryName, onSelectFilter]);

  return (
    <View>
      <ScrollView
        horizontal
        style={styles.filterChipScroller}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipRow}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            activeOpacity={0.85}
            onPress={async () => {
              await Haptics.selectionAsync();
              onSelectFilter(filter);
            }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  filterChipScroller: {
    marginHorizontal: -16,
  },
  filterChipRow: {
    paddingTop: 8,
    paddingBottom: 10,
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
});
