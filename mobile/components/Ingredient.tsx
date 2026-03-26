import { FlatList, Text, View, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/shared/Colors";

const Ingredient = ({ ingredients }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingredients</Text>
        <Text style={styles.itemCount}>{ingredients?.length} Items</Text>
      </View>

      <View style={styles.ingredientsList}>
        <FlatList
          data={ingredients}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.ingredientItem}>
              <View style={styles.ingredientContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item?.icon}</Text>
                </View>
                <Text style={styles.ingredientName}>{item.ingredient}</Text>
              </View>
              <Text style={styles.quantity}>{item.quantity}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default Ingredient;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.text,
    flex: 1,
  },
  itemCount: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.textLight,
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 0,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.grayLight,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 60,
    gap: 12,
  },
  ingredientContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
    marginRight: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    fontSize: 16,
  },
  ingredientName: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
    flexWrap: "wrap",
  },
  quantity: {
    fontFamily: "outfit-bold",
    fontSize: 14,
    color: Colors.primary,
    textAlign: "right",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexWrap: "wrap",
    alignSelf: "flex-start",
    maxWidth: "40%",
  },
});
