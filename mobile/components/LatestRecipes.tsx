import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import RecipeService from "@/services/RecipeService";
import RecipeCardHome from "./RecipeCardHome";
import Colors from "@/shared/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const LatestRecipes = () => {
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetAllLatestRecipe();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      GetAllLatestRecipe();
    }, [])
  );

  const GetAllLatestRecipe = async () => {
    setLoading(true);
    try {
      const result = await RecipeService.getAllRecipes(10);

      if (result.error) {
        console.error("Error fetching latest recipes:", result.error);
        setRecipeList([]);
      } else {
        setRecipeList(result.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipeList([]);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    GetAllLatestRecipe();
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/explore");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.iconGradient}
              >
                <Ionicons name="time" size={20} color={Colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Latest Recipes</Text>
          </View>
          <Text style={styles.subtitle}>
            Discover the newest culinary creations
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={loading}
            style={styles.refreshButton}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.refreshText}>Refresh</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleViewAll}
            style={styles.viewAllButton}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recipes List */}
      <View style={styles.listContainer}>
        <FlatList
          data={recipeList}
          horizontal
          keyExtractor={(item, index) =>
            item.documentId || item.id || index.toString()
          }
          contentContainerStyle={
            recipeList.length === 0
              ? styles.emptyListContainer
              : styles.listContent
          }
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.recipeCardWrapper}>
              <RecipeCardHome recipe={item} />
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={["#BDBDBD", "#9E9E9E"] as [string, string]}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons
                      name="restaurant"
                      size={40}
                      color={Colors.white}
                    />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>No Latest Recipes</Text>
                <Text style={styles.emptySubtitle}>
                  Be the first to create an amazing recipe and share it with the
                  community!
                </Text>
                <View style={styles.emptyActions}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push("/(tabs)/create")}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#4CAF50", "#2E7D32"] as [string, string]}
                      style={styles.primaryButtonGradient}
                    >
                      <Ionicons
                        name="add-circle"
                        size={18}
                        color={Colors.white}
                      />
                      <Text style={styles.primaryButtonText}>
                        Create Recipe
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        />
      </View>

      {/* Loading State */}
      {loading && recipeList.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading latest recipes...</Text>
        </View>
      )}
    </View>
  );
};

export default LatestRecipes;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  headerSection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerContent: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  iconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginLeft: 52,
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  refreshButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "outfit",
    fontWeight: "600",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "outfit",
    fontWeight: "600",
  },
  listContainer: {
    minHeight: 200,
  },
  listContent: {
    paddingRight: 20,
  },
  recipeCardWrapper: {
    marginRight: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 200,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
    paddingHorizontal: 20,
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
    fontSize: 20,
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
  emptyActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
});
