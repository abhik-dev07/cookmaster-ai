import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import GlobalApi from "@/services/GlobalApi";
import RecipeCard from "@/components/RecipeCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

// Sort options
const sortOptions = [
  { id: "newest", name: "Newest", icon: "calendar" },
  { id: "name", name: "Name (A to Z)", icon: "text" },
  { id: "time", name: "Lowest Cooking Time", icon: "time" },
  { id: "difficulty", name: "Difficulty", icon: "trending-up" },
];

const RecipeByCategory = () => {
  const { categoryName } = useLocalSearchParams();
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(""); // No default sorting
  const [tempSortBy, setTempSortBy] = useState("");

  // Reference to the action sheet
  const filterActionSheetRef = useRef<ActionSheetRef>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/home");
  };

  const handleFilterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Initialize temporary state with current value
    setTempSortBy(sortBy);
    // Show the action sheet
    filterActionSheetRef.current?.show();
  };

  const handleTempSortPress = (sort: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTempSortBy(sort);
  };

  const clearFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTempSortBy("");
  };

  const GetRecipeListByCategory = useCallback(async () => {
    setLoading(true);
    const result = await GlobalApi.GetRecipeByCategory(categoryName as string);
    console.log("---", result.data.data);
    setRecipeList(result?.data?.data);
    setLoading(false);
  }, [categoryName]);

  useEffect(() => {
    GetRecipeListByCategory();
  }, [GetRecipeListByCategory]);

  const getCategoryIcon = (category: string) => {
    if (!category) return { name: "restaurant", type: "Ionicons" };

    const categoryIcons: { [key: string]: { name: string; type: string } } = {
      breakfast: { name: "sunny", type: "Ionicons" },
      lunch: { name: "restaurant", type: "Ionicons" },
      dinner: { name: "moon", type: "Ionicons" },
      dessert: { name: "ice-cream", type: "Ionicons" },
      cake: { name: "cake", type: "MaterialIcons" },
      drink: { name: "cafe", type: "Ionicons" },
      fastfood: { name: "fast-food", type: "Ionicons" },
      salad: { name: "leaf", type: "Ionicons" },
    };

    const lowerCategory = category.toLowerCase();
    return (
      categoryIcons[lowerCategory] || { name: "restaurant", type: "Ionicons" }
    );
  };

  const getCategoryGradient = (category: string) => {
    const lowerCategory = category?.toLowerCase();
    const gradients: { [key: string]: [string, string] } = {
      breakfast: ["#FFB74D", "#FF9800"],
      lunch: ["#81C784", "#4CAF50"],
      dinner: ["#64B5F6", "#2196F3"],
      dessert: ["#F06292", "#E91E63"],
      cake: ["#BA68C8", "#9C27B0"],
      drink: ["#4DB6AC", "#009688"],
      fastfood: ["#FF8A65", "#FF5722"],
      salad: ["#A8E6CF", "#81C784"],
    };
    return gradients[lowerCategory] || ["#4CAF50", "#2E7D32"];
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case "name":
        return "text";
      case "time":
        return "time";
      case "difficulty":
        return "trending-up";
      case "newest":
        return "calendar";
      default:
        return "filter"; // Filter for no selection
    }
  };

  const sortedRecipes = [...recipeList].sort((a, b) => {
    switch (sortBy) {
      case "name":
        const nameA = a?.attributes?.recipe_name || a?.recipe_name || "";
        const nameB = b?.attributes?.recipe_name || b?.recipe_name || "";
        return nameA.localeCompare(nameB);
      case "time":
        const timeA =
          a?.attributes?.cook_time ??
          a?.cook_time ??
          a?.attributes?.cooking_time ??
          a?.cooking_time ??
          0;
        const timeB =
          b?.attributes?.cook_time ??
          b?.cook_time ??
          b?.attributes?.cooking_time ??
          b?.cooking_time ??
          0;
        return timeA - timeB;
      case "difficulty":
        // Difficulty = more steps => harder
        const stepsAData = a?.attributes?.steps ?? a?.steps ?? [];
        const stepsBData = b?.attributes?.steps ?? b?.steps ?? [];
        const stepsALen = Array.isArray(stepsAData)
          ? stepsAData.length
          : (() => {
              try {
                return JSON.parse(stepsAData || "[]").length;
              } catch {
                return 0;
              }
            })();
        const stepsBLen = Array.isArray(stepsBData)
          ? stepsBData.length
          : (() => {
              try {
                return JSON.parse(stepsBData || "[]").length;
              } catch {
                return 0;
              }
            })();
        return stepsBLen - stepsALen; // more steps first
      case "newest":
        const dateA = a?.attributes?.created_at || a?.created_at || 0;
        const dateB = b?.attributes?.created_at || b?.created_at || 0;
        return new Date(dateB).getTime() - new Date(dateA).getTime();

      default:
        // No sorting, return as is
        return 0;
    }
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"] as [string, string]}
            style={styles.backButtonGradient}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.categoryInfo}>
            <View style={styles.categoryIconContainer}>
              <LinearGradient
                colors={getCategoryGradient(categoryName as string)}
                style={styles.categoryIconGradient}
              >
                {getCategoryIcon(categoryName as string).type ===
                "MaterialIcons" ? (
                  <MaterialIcons
                    name={getCategoryIcon(categoryName as string).name as any}
                    size={24}
                    color={Colors.white}
                  />
                ) : (
                  <Ionicons
                    name={getCategoryIcon(categoryName as string).name as any}
                    size={24}
                    color={Colors.white}
                  />
                )}
              </LinearGradient>
            </View>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTitle}>{categoryName}</Text>
              <Text style={styles.categorySubtitle}>
                {recipeList?.length || 0} recipes available
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFilterPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF5252"] as [string, string]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name={getSortIcon()} size={18} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Indicator - Only visible when sorting is applied */}
      {sortBy !== "" && (
        <View style={styles.sortIndicator}>
          <View style={styles.sortIconContainer}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as [string, string]}
              style={styles.sortIconGradient}
            >
              <Ionicons name={getSortIcon()} size={16} color={Colors.white} />
            </LinearGradient>
          </View>
          <Text style={styles.sortText}>
            Sorted by{" "}
            {sortBy === "time"
              ? "lowest cooking time"
              : sortBy === "difficulty"
              ? "difficulty"
              : sortBy === "name"
              ? "name (A to Z)"
              : sortBy === "newest"
              ? "newest"
              : ""}
          </Text>
          <TouchableOpacity
            onPress={() => setSortBy("")}
            activeOpacity={0.8}
            style={styles.clearSortButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      )}

      {/* Recipe Grid */}
      <View style={styles.content}>
        <FlatList
          data={sortedRecipes}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={GetRecipeListByCategory}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={getCategoryGradient(categoryName as string)}
                    style={styles.emptyIconGradient}
                  >
                    {getCategoryIcon(categoryName as string).type ===
                    "MaterialIcons" ? (
                      <MaterialIcons
                        name={
                          getCategoryIcon(categoryName as string).name as any
                        }
                        size={40}
                        color={Colors.white}
                      />
                    ) : (
                      <Ionicons
                        name={
                          getCategoryIcon(categoryName as string).name as any
                        }
                        size={40}
                        color={Colors.white}
                      />
                    )}
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>No Recipes Found</Text>
                <Text style={styles.emptySubtitle}>
                  No {(categoryName as string).toLowerCase()} recipes available
                  at the moment.
                </Text>
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={handleBackPress}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#2E7D32"] as [string, string]}
                    style={styles.exploreButtonGradient}
                  >
                    <Ionicons name="search" size={18} color={Colors.white} />
                    <Text style={styles.exploreButtonText}>
                      Explore Other Categories
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.recipeCardContainer}>
              <RecipeCard
                recipe={item}
                source="category"
                categoryName={categoryName}
              />
            </View>
          )}
        />
      </View>

      {/* Action Sheet for Filters */}
      <ActionSheet
        ref={filterActionSheetRef}
        containerStyle={styles.actionSheetContainer}
        indicatorStyle={styles.actionSheetIndicator}
        gestureEnabled={true}
        closeOnPressBack={true}
        closeOnTouchBackdrop={true}
        defaultOverlayOpacity={0.3}
      >
        <View style={styles.actionSheetContent}>
          <View style={styles.actionSheetHeader}>
            <Text style={styles.actionSheetTitle}>Sort Recipes</Text>
            <TouchableOpacity
              onPress={() => filterActionSheetRef.current?.hide()}
              style={styles.actionSheetCloseButton}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.sortOptionsList}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.sortChip}
                  onPress={() => handleTempSortPress(option.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      tempSortBy === option.id
                        ? (["#4CAF50", "#2E7D32"] as [string, string])
                        : [Colors.card, Colors.card]
                    }
                    style={[
                      styles.sortChipGradient,
                      tempSortBy === option.id &&
                        styles.selectedSortChipGradient,
                    ]}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={16}
                      color={
                        tempSortBy === option.id ? Colors.white : Colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.actionSheetSortText,
                        tempSortBy === option.id && styles.selectedSortText,
                      ]}
                    >
                      {option.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              // Apply the temporary selections
              setSortBy(tempSortBy);
              filterActionSheetRef.current?.hide();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as [string, string]}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>Apply Sorting</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default RecipeByCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Action Sheet Styles
  actionSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.card,
  },
  actionSheetIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
  actionSheetContent: {
    padding: 20,
    paddingBottom: 32,
  },
  actionSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  actionSheetTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.text,
  },
  actionSheetCloseButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  sortOptionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sortChip: {
    borderRadius: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortChipGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedSortChipGradient: {
    borderColor: Colors.primary,
  },
  actionSheetSortText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  selectedSortText: {
    color: Colors.white,
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearFiltersText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  applyButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonGradient: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  categoryIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  categorySubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 4,
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sortIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sortIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sortText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: "outfit",
    fontWeight: "600",
  },
  clearSortButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  recipeCardContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exploreButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 10,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "outfit",
  },
});
