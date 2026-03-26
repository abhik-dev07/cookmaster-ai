import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const CreateRecipeBanner = () => {
  const router = useRouter();

  const handleCreateRecipe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/create");
  };

  return (
    <View style={styles.adBanner}>
      <LinearGradient
        colors={["#4CAF50", "#2E7D32"] as [string, string]}
        style={styles.adGradient}
      >
        <View style={styles.adContent}>
          <View style={styles.adIconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="sparkles" size={24} color={Colors.white} />
            </View>
          </View>
          <View style={styles.adTextContainer}>
            <Text style={styles.adTitle}>Create Your Recipe</Text>
            <Text style={styles.adSubtitle}>
              Turn your ideas into delicious recipes with AI
            </Text>
          </View>
          <TouchableOpacity
            style={styles.adButton}
            onPress={handleCreateRecipe}
            activeOpacity={0.8}
          >
            <View style={styles.buttonBackground}>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CreateRecipeBanner;

const styles = StyleSheet.create({
  adBanner: {
    marginBottom: 24,
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  adGradient: {
    borderRadius: 24,
    padding: 24,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  adIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
    fontFamily: "outfit-bold",
    marginBottom: 6,
  },
  adSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "outfit",
    lineHeight: 22,
  },
  adButton: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
