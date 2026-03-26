import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import GlobalApi from "@/services/GlobalApi";
import { useRouter } from "expo-router";
import Colors from "@/shared/Colors";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const CategoryList = () => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetCategoryList();
  }, []);

  const GetCategoryList = async () => {
    setLoading(true);
    try {
      const result = await GlobalApi.GetCategories();
      console.log("Categories result:", result.data);
      setCategoryList(result?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryList([]);
    }
    setLoading(false);
  };

  const handleCategoryPress = (category: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/recipe-by-category",
      params: {
        categoryName: category?.name,
      },
    });
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      ["#FFB74D", "#FF9800"],
      ["#81C784", "#4CAF50"],
      ["#64B5F6", "#2196F3"],
      ["#F06292", "#E91E63"],
      ["#FF8A65", "#FF5722"],
      ["#BA68C8", "#9C27B0"],
      ["#4DB6AC", "#009688"],
      ["#FFD54F", "#FFC107"],
      ["#A1887F", "#795548"],
      ["#90A4AE", "#607D8B"],
      ["#FF7043", "#FF5722"],
      ["#7E57C2", "#673AB7"],
    ];
    return gradients[index % gradients.length];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as [string, string]}
              style={styles.iconGradient}
            >
              <Ionicons name="grid" size={20} color={Colors.white} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Categories</Text>
        </View>
        <Text style={styles.subtitle}>Explore recipes by category</Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : (
          <FlatList
            data={categoryList}
            numColumns={2}
            keyExtractor={(item, index) => item?.id || index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={GetCategoryList}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            renderItem={({ item, index }: any) => (
              <View>
                <TouchableOpacity
                  onPress={() => handleCategoryPress(item)}
                  style={styles.categoryCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryIconContainer}>
                      <LinearGradient
                        colors={getCategoryGradient(index) as [string, string]}
                        style={styles.categoryIconGradient}
                      >
                        {item?.image ? (
                          <Image
                            source={{ uri: item.image }}
                            style={styles.categoryImage}
                            defaultSource={require("@/assets/images/logo.png")}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons
                            name="restaurant"
                            size={28}
                            color={Colors.white}
                          />
                        )}
                      </LinearGradient>
                    </View>
                    <Text style={styles.categoryName}>{item?.name}</Text>
                    <Text style={styles.categoryCount}>
                      {item?.recipe_count || "0"} recipes
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <LinearGradient
                      colors={["#BDBDBD", "#9E9E9E"] as [string, string]}
                      style={styles.emptyIconGradient}
                    >
                      <Ionicons name="grid" size={40} color={Colors.white} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.emptyTitle}>No Categories Found</Text>
                  <Text style={styles.emptySubtitle}>
                    Categories will appear here once they're added to the
                    system.
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={GetCategoryList}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#4CAF50", "#2E7D32"] as [string, string]}
                      style={styles.emptyButtonGradient}
                    >
                      <Ionicons name="refresh" size={18} color={Colors.white} />
                      <Text style={styles.emptyButtonText}>Refresh</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
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
  categoriesContainer: {
    minHeight: 200,
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: (width - 60) / 2,
  },
  categoryContent: {
    padding: 20,
    alignItems: "center",
  },
  categoryIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  categoryIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: 48,
    height: 48,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 6,
  },
  categoryCount: {
    fontSize: 13,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
  emptyButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },
});
