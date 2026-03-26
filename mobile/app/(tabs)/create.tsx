import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/shared/Colors";
import CreateRecipe from "@/components/CreateRecipe";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width } = Dimensions.get("window");

const Create = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("ai");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedQuickAction, setSelectedQuickAction] = useState("");

  const tabs = [
    {
      id: "ai",
      title: "AI Recipe",
      icon: "sparkles",
      gradient: ["#4CAF50", "#2E7D32"],
    },
    {
      id: "manual",
      title: "Manual",
      icon: "create",
      gradient: ["#FF9800", "#F57C00"],
    },
  ];

  const categories = [
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "sunny",
      color: "#FFB74D",
      gradient: ["#FFB74D", "#FF9800"],
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "restaurant",
      color: "#81C784",
      gradient: ["#81C784", "#4CAF50"],
    },
    {
      id: "dinner",
      name: "Dinner",
      icon: "moon",
      color: "#64B5F6",
      gradient: ["#64B5F6", "#2196F3"],
    },
    {
      id: "dessert",
      name: "Dessert",
      icon: "ice-cream",
      color: "#F06292",
      gradient: ["#F06292", "#E91E63"],
    },
    {
      id: "snack",
      name: "Snack",
      icon: "pizza",
      color: "#FF8A65",
      gradient: ["#FF8A65", "#FF5722"],
    },
    {
      id: "drink",
      name: "Drink",
      icon: "wine",
      color: "#BA68C8",
      gradient: ["#BA68C8", "#9C27B0"],
    },
  ];

  const quickActions = [
    {
      id: "quick",
      title: "Quick & Easy",
      subtitle: "Under 30 minutes",
      icon: "flash",
      prompt: "Quick and easy recipes under 30 minutes",
      gradient: ["#FF6B6B", "#FF5252"],
    },
    {
      id: "healthy",
      title: "Healthy",
      subtitle: "Nutritious & balanced",
      icon: "leaf",
      prompt: "Healthy and nutritious recipes with balanced ingredients",
      gradient: ["#4ECDC4", "#26A69A"],
    },
    {
      id: "budget",
      title: "Budget-Friendly",
      subtitle: "Affordable ingredients",
      icon: "wallet",
      prompt: "Budget-friendly recipes using affordable and common ingredients",
      gradient: ["#95E1D3", "#48CAB2"],
    },
    {
      id: "comfort",
      title: "Comfort Food",
      subtitle: "Hearty & satisfying",
      icon: "home",
      prompt: "Comfort food recipes that are hearty and satisfying",
      gradient: ["#FECA57", "#FF9F43"],
    },
    {
      id: "dessert",
      title: "Sweet Treats",
      subtitle: "Desserts & sweets",
      icon: "heart",
      prompt: "Sweet Treats recipes that are Desserts & sweets",
      gradient: ["#FFB3BA", "#F06292"],
    },
    {
      id: "spicy",
      title: "Spicy & Bold",
      subtitle: "Rich in flavors",
      icon: "flame",
      prompt: "Spicy and bold recipes with rich flavors and heat",
      gradient: ["#FF6348", "#FF3838"],
    },
    {
      id: "one-pot",
      title: "One-Pot Meals",
      subtitle: "Minimal cleanup",
      icon: "restaurant",
      prompt: "One-pot meals that are easy to make with minimal cleanup",
      gradient: ["#A8E6CF", "#7FCDCD"],
    },
  ];

  const handleTabPress = (tabId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tabId);
  };

  const handleCategoryPress = (category: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (selectedCategory === category.id) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category.id);
    }
  };

  const handleQuickActionPress = (action: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (selectedQuickAction === action.prompt) {
      setSelectedQuickAction("");
    } else {
      setSelectedQuickAction(action.prompt);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as const}
              style={styles.headerIconGradient}
            >
              <Ionicons name="restaurant" size={28} color={Colors.white} />
            </LinearGradient>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create Recipe</Text>
            <Text style={styles.headerSubtitle}>
              Let's make something delicious together
            </Text>
          </View>
        </View>
      </View>

      {/* Fixed Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.8}
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

      {/* Scrollable Content */}
      <KeyboardAwareScrollView
        style={styles.scrollableContent}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={30}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "ai" ? (
          <View style={styles.aiContainer}>
            {/* AI Recipe Generator - Moved to Top */}
            <View style={styles.aiGeneratorContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>AI Recipe Generator</Text>
              </View>
              <CreateRecipe
                selectedCategory={selectedCategory}
                selectedQuickAction={selectedQuickAction}
              />
            </View>

            {/* Recipe Categories */}
            <View style={styles.categoriesContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="grid" size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Choose a Category</Text>
              </View>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      selectedCategory === category.id &&
                        styles.selectedCategory,
                    ]}
                    onPress={() => handleCategoryPress(category)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={category.gradient as [string, string]}
                      style={styles.categoryIconGradient}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={24}
                        color="white"
                      />
                    </LinearGradient>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flash" size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.quickActionCard,
                      selectedQuickAction === action.prompt &&
                        styles.selectedQuickAction,
                    ]}
                    onPress={() => handleQuickActionPress(action)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={action.gradient as [string, string]}
                      style={styles.quickActionIconGradient}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={20}
                        color="white"
                      />
                    </LinearGradient>
                    <View style={styles.quickActionContent}>
                      <Text style={styles.quickActionTitle}>
                        {action.title}
                      </Text>
                      <Text style={styles.quickActionSubtitle}>
                        {action.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
              <View style={styles.disclaimerContent}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={Colors.textLight}
                />
                <Text style={styles.disclaimerText}>
                  You can create recipes without selecting categories or quick
                  actions. These options help AI generate more specific recipes
                  for you.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.manualContainer}>
            <LinearGradient
              colors={["#FF9800", "#F57C00"]}
              style={styles.comingSoonIconGradient}
            >
              <Ionicons name="construct" size={60} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
            <Text style={styles.comingSoonText}>
              Manual recipe creation will be available in the next update. For
              now, use our AI-powered recipe generator to create amazing recipes
              instantly!
            </Text>
            <TouchableOpacity
              style={styles.switchToAiButton}
              onPress={() => handleTabPress("ai")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                style={styles.switchToAiGradient}
              >
                <Ionicons name="sparkles" size={20} color={Colors.white} />
                <Text style={styles.switchToAiText}>
                  Try AI Recipe Generator
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Create;

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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
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
    marginTop: 4,
    fontFamily: "outfit",
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
  scrollableContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  aiContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  categoriesContainer: {
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryCard: {
    width: (width - 72) / 2,
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCategory: {
    borderColor: Colors.primary,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    fontFamily: "outfit",
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedQuickAction: {
    borderColor: Colors.primary,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  disclaimerContainer: {
    marginBottom: 24,
  },
  disclaimerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    lineHeight: 20,
  },
  aiGeneratorContainer: {
    marginBottom: 20,
  },
  manualContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  comingSoonContainer: {
    alignItems: "center",
    padding: 40,
    backgroundColor: Colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  comingSoonIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  comingSoonTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
    fontFamily: "outfit-bold",
  },
  comingSoonText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: "outfit",
  },
  switchToAiButton: {
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  switchToAiGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchToAiText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },
});
