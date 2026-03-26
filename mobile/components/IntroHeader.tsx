import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import GlobalApi from "@/services/GlobalApi";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { UserContext } from "@/context/UserContext";

const IntroHeader = React.forwardRef((props, ref) => {
  const { user } = useUser();
  const { isVegMode, setIsVegMode } = useContext(UserContext);
  const [userStats, setUserStats] = useState({
    recipes: 0,
    saved: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleVegToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsVegMode(!isVegMode);
    Alert.alert(
      isVegMode ? "Non-Vegetarian Mode" : "Vegetarian Mode",
      `Switched to ${
        isVegMode ? "Non-Vegetarian" : "Vegetarian"
      } mode. Recipes will be filtered accordingly.`
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour === 12) return "Good Noon";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const fetchUserStats = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) return;

    try {
      setLoading(true);
      const userEmail = user.emailAddresses[0].emailAddress;

      // Fetch user's created recipes
      const recipesResponse = await GlobalApi.GetUserCreatedRecipe(userEmail);
      const recipesCount = recipesResponse.data?.data?.length || 0;

      // Fetch user's saved recipes
      const savedResponse = await GlobalApi.SavedRecipeList(userEmail);
      const savedCount = savedResponse.data?.data?.length || 0;

      setUserStats({
        recipes: recipesCount,
        saved: savedCount,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user?.emailAddresses[0]?.emailAddress]);

  // Refresh stats when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.emailAddresses[0]?.emailAddress) {
        fetchUserStats();
      }
    }, [user?.emailAddresses[0]?.emailAddress])
  );

  // Expose refresh function for parent component
  React.useImperativeHandle(ref, () => ({
    refresh: fetchUserStats,
  }));

  const getUserDisplayName = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return "Chef";
  };

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as [string, string]}
              style={styles.avatarGradient}
            >
              <Image
                source={{ uri: user?.imageUrl }}
                style={styles.userAvatar}
                defaultSource={require("@/assets/images/logo.png")}
              />
            </LinearGradient>
          </View>
          <View style={styles.userText}>
            <Text style={styles.greeting}>{getGreeting()}!</Text>
            <Text style={styles.userName}>{getUserDisplayName()}</Text>
            <Text style={styles.userSubtitle}>
              Ready to cook something amazing?
            </Text>
          </View>
        </View>

        {/* Veg/Non-Veg Toggle */}
        <TouchableOpacity
          style={[styles.vegToggle, isVegMode && styles.vegToggleActive]}
          onPress={handleVegToggle}
          activeOpacity={0.8}
        >
          {isVegMode && (
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as [string, string]}
              style={styles.vegToggleGradient}
            />
          )}
          {isVegMode && <Ionicons name="leaf" size={18} color={Colors.white} />}
          <Text style={[styles.vegText, isVegMode && styles.vegTextActive]}>
            {isVegMode ? "Veg" : "Non-Veg"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <LinearGradient
              colors={["#FF6B6B", "#FF5252"] as [string, string]}
              style={styles.statIconGradient}
            >
              <Ionicons name="restaurant" size={18} color={Colors.white} />
            </LinearGradient>
          </View>
          <View style={styles.statContent}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginTop: 4 }}
              />
            ) : (
              <Text style={styles.statNumber}>{userStats.recipes}</Text>
            )}
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <LinearGradient
              colors={["#4ECDC4", "#26A69A"] as [string, string]}
              style={styles.statIconGradient}
            >
              <Ionicons name="bookmark" size={18} color={Colors.white} />
            </LinearGradient>
          </View>
          <View style={styles.statContent}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginTop: 4 }}
              />
            ) : (
              <Text style={styles.statNumber}>{userStats.saved}</Text>
            )}
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default IntroHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  avatarContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userText: {
    flex: 1,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 6,
  },
  userSubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    lineHeight: 20,
  },
  vegToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.grayLight,
    borderWidth: 2,
    borderColor: Colors.border,
    position: "relative",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vegToggleActive: {
    borderColor: "transparent",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  vegToggleGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
  },
  vegText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "outfit",
    fontWeight: "600",
  },
  vegTextActive: {
    color: Colors.white,
  },
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
    alignItems: "flex-start",
    justifyContent: "center",
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
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
    alignSelf: "center",
  },
});
