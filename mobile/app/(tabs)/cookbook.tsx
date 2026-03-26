import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "@/shared/Colors";
import RecipeService from "@/services/RecipeService";
import { UserContext } from "@/context/UserContext";
import RecipeCard from "@/components/RecipeCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const Cookbook = () => {
  const insets = useSafeAreaInsets();
  const { user: contextUser } = useContext(UserContext);
  const router = useRouter();
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("created");
  const [stats, setStats] = useState({
    createdCount: 0,
    savedCount: 0,
  });
  const [hasInitialData, setHasInitialData] = useState(false);

  const tabs = [
    {
      id: "created",
      title: "My Recipes",
      icon: "sparkles",
      gradient: ["#FF9800", "#F57C00"],
      description: "Recipes you've created",
    },
    {
      id: "saved",
      title: "Saved",
      icon: "bookmark",
      gradient: ["#2196F3", "#1976D2"],
      description: "Recipes you've saved",
    },
  ];

  const GetUserRecipeList = useCallback(
    async (isRefreshing = false) => {
      if (!contextUser?.email) {
        setError("Please sign in to view your recipes");
        return;
      }

      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      if (!isRefreshing) {
        setRecipeList([]);
      }

      try {
        const result = await RecipeService.getUserCreatedRecipes(
          contextUser.email
        );

        if (result.error) {
          setError(result.error);
          setRecipeList([]);
          setStats((prev) => ({ ...prev, createdCount: 0 }));
          setHasInitialData(false);
        } else {
          setRecipeList(result.data);
          setStats((prev) => ({ ...prev, createdCount: result.data.length }));
          setHasInitialData(true);
        }
      } catch (error: any) {
        setError("Failed to load your recipes. Please try again.");
        setRecipeList([]);
        setStats((prev) => ({ ...prev, createdCount: 0 }));
        setHasInitialData(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [contextUser?.email]
  );

  const GetSavedRecipeList = useCallback(
    async (isRefreshing = false) => {
      if (!contextUser?.email) {
        setError("Please sign in to view your saved recipes");
        return;
      }

      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      if (!isRefreshing) {
        setRecipeList([]);
      }

      try {
        const result = await RecipeService.getUserSavedRecipes(
          contextUser.email
        );

        if (result.error) {
          setError(result.error);
          setRecipeList([]);
          setStats((prev) => ({ ...prev, savedCount: 0 }));
          setHasInitialData(false);
        } else {
          setRecipeList(result.data);
          setStats((prev) => ({ ...prev, savedCount: result.data.length }));
          setHasInitialData(true);
        }
      } catch (error: any) {
        setError("Failed to load your saved recipes. Please try again.");
        setRecipeList([]);
        setStats((prev) => ({ ...prev, savedCount: 0 }));
        setHasInitialData(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [contextUser?.email]
  );

  // Load initial data
  useEffect(() => {
    if (contextUser?.email) {
      if (activeTab === "created") {
        GetUserRecipeList();
      } else {
        GetSavedRecipeList();
      }
    }
  }, [activeTab, contextUser?.email, GetUserRecipeList, GetSavedRecipeList]);

  // Refresh on focus
  useFocusEffect(
    React.useCallback(() => {
      if (contextUser?.email) {
        if (activeTab === "created") {
          GetUserRecipeList();
        } else {
          GetSavedRecipeList();
        }
      }
    }, [contextUser?.email, activeTab, GetUserRecipeList, GetSavedRecipeList])
  );

  const onRefresh = useCallback(() => {
    if (activeTab === "created") {
      GetUserRecipeList(true);
    } else {
      GetSavedRecipeList(true);
    }
  }, [activeTab, GetUserRecipeList, GetSavedRecipeList]);

  const handleTabPress = (tabId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tabId);
    setError(null);
    setHasInitialData(false);
  };

  const handleCreateRecipe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/create");
  };

  const handleExploreRecipes = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/explore");
  };

  const handleRetry = () => {
    setError(null);
    setHasInitialData(false);
    if (activeTab === "created") {
      GetUserRecipeList();
    } else {
      GetSavedRecipeList();
    }
  };

  const getEmptyStateContent = () => {
    if (activeTab === "created") {
      return {
        icon: "restaurant",
        title: "No Recipes Created Yet",
        subtitle: "Start creating your first recipe with AI assistance",
        actionText: "Create Recipe",
        actionIcon: "add-circle",
        onPress: handleCreateRecipe,
        gradient: ["#FF9800", "#F57C00"],
      };
    } else {
      return {
        icon: "bookmark",
        title: "No Saved Recipes",
        subtitle: "Save recipes you love to access them later",
        actionText: "Explore Recipes",
        actionIcon: "compass",
        onPress: handleExploreRecipes,
        gradient: ["#2196F3", "#1976D2"],
      };
    }
  };

  const emptyState = getEmptyStateContent();

  const getCurrentRecipeCount = () => {
    return activeTab === "created" ? stats.createdCount : stats.savedCount;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.headerIconGradient}
              >
                <Ionicons name="book" size={28} color={Colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>My Cookbook</Text>
              <Text style={styles.headerSubtitle}>
                Manage your recipes and favorites
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statContent}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.statNumber}>
                    {getCurrentRecipeCount()}
                  </Text>
                )}
                <Text style={styles.statLabel}>
                  {activeTab === "created" ? "Created" : "Saved"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.8}
            disabled={loading}
          >
            {activeTab === tab.id && (
              <LinearGradient
                colors={tab.gradient as [string, string]}
                style={styles.tabGradient}
              />
            )}
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.id ? Colors.white : Colors.text}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle" size={40} color={Colors.error} />
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.retryButtonGradient}
              >
                <Ionicons name="refresh" size={18} color={Colors.white} />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      {!error && (
        <View style={styles.content}>
          <FlatList
            data={recipeList}
            numColumns={2}
            keyExtractor={(item, index) => item.id || index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={
              !loading && hasInitialData ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <LinearGradient
                      colors={emptyState.gradient as [string, string]}
                      style={styles.emptyIconGradient}
                    >
                      <Ionicons
                        name={emptyState.icon as any}
                        size={50}
                        color={Colors.white}
                      />
                    </LinearGradient>
                  </View>
                  <Text style={styles.emptyTitle}>{emptyState.title}</Text>
                  <Text style={styles.emptySubtitle}>
                    {emptyState.subtitle}
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyActionButton}
                    activeOpacity={0.8}
                    onPress={emptyState.onPress}
                  >
                    <LinearGradient
                      colors={emptyState.gradient as [string, string]}
                      style={styles.emptyActionGradient}
                    >
                      <Ionicons
                        name={emptyState.actionIcon as any}
                        size={18}
                        color={Colors.white}
                      />
                      <Text style={styles.emptyActionText}>
                        {emptyState.actionText}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>
                    Loading{" "}
                    {activeTab === "created" ? "your recipes" : "saved recipes"}
                    ...
                  </Text>
                </View>
              )
            }
            renderItem={({ item }) => (
              <View style={styles.recipeCardContainer}>
                <RecipeCard
                  recipe={item}
                  source={
                    activeTab === "created" ? "myRecipes" : "savedRecipes"
                  }
                />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Cookbook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.background,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  headerIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  headerIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 4,
    lineHeight: 20,
  },
  statsContainer: {
    alignItems: "flex-end",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    fontFamily: "outfit-bold",
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 8,
    position: "relative",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "outfit",
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
  recipeCardContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
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
    width: 120,
    height: 120,
    borderRadius: 60,
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
    paddingHorizontal: 40,
  },
  emptyActionButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyActionGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyActionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  errorContent: {
    alignItems: "center",
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.error,
    fontFamily: "outfit-bold",
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },
});
