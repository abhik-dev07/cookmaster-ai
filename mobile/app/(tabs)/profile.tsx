import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import { useRouter, useFocusEffect } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import GlobalApi from "@/services/GlobalApi";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    recipes: 0,
    saved: 0,
  });
  const [loading, setLoading] = useState(true);

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

  // Refresh user stats when tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserStats();
    }, [user?.emailAddresses[0]?.emailAddress])
  );

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/");
          } catch (err) {
            console.error("Sign out failed:", err);
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  const menuSections = [
    {
      title: "Recipe Management",
      items: [
        {
          id: "create",
          name: "Create New Recipe",
          subtitle: "AI-powered recipe generation",
          icon: "add-circle",
          color: "#4CAF50",
          path: "/(tabs)/create",
        },
        {
          id: "my-recipes",
          name: "My Recipes",
          subtitle: "View your created recipes",
          icon: "sparkles",
          color: "#FF9800",
          path: "/(tabs)/cookbook",
        },
        {
          id: "explore",
          name: "Browse Recipes",
          subtitle: "Discover new recipes",
          icon: "compass",
          color: "#2196F3",
          path: "/(tabs)/explore",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          id: "settings",
          name: "Settings",
          subtitle: "App preferences and configuration",
          icon: "settings",
          color: "#9C27B0",
          path: "settings",
        },
        {
          id: "help",
          name: "Help & Support",
          subtitle: "Get help and contact support",
          icon: "help-circle",
          color: "#607D8B",
          path: "help",
        },
        {
          id: "logout",
          name: "Log Out",
          subtitle: "Sign out of your account",
          icon: "log-out",
          color: "#F44336",
          path: "logout",
        },
      ],
    },
  ];

  const onOptionClick = (option: any) => {
    if (option.path === "logout") {
      handleSignOut();
      return;
    }
    if (option.path === "settings" || option.path === "help") {
      Alert.alert(
        "Coming Soon",
        "This feature will be available in the next update!"
      );
      return;
    }

    if (
      option.path === "/(tabs)/create" ||
      option.path === "/(tabs)/cookbook" ||
      option.path === "/(tabs)/explore"
    ) {
      setTimeout(() => {
        fetchUserStats();
      }, 100);
    }

    router.push(option.path);
  };

  const renderMenuItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onOptionClick(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.menuIcon, { backgroundColor: item.color + "15" }]}>
          <Ionicons name={item.icon as any} size={24} color={item.color} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{item.name}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
      </TouchableOpacity>
    );
  };

  const renderSection = ({ item }: { item: any }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <View style={styles.sectionContent}>
        {item.items.map((menuItem: any, index: number) => (
          <View key={menuItem.id}>
            {renderMenuItem({ item: menuItem, index })}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account and preferences
        </Text>
      </View>

      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userCard}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.userAvatar}
            defaultSource={require("@/assets/images/logo.png")}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.username
                ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                : "Chef"}
            </Text>
            <Text style={styles.userEmail}>
              {user?.emailAddresses[0]?.emailAddress || "No Email"}
            </Text>
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.statNumber}>{userStats.recipes}</Text>
                )}
                <Text style={styles.statLabel}>Recipes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.statNumber}>{userStats.saved}</Text>
                )}
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      <FlatList
        data={menuSections}
        renderItem={renderSection}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background,
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
  },
  userSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginBottom: 12,
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    fontFamily: "outfit-bold",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
});
