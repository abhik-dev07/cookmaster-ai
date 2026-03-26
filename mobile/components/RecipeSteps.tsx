import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/shared/Colors";

const RecipeSteps = ({ steps }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Steps</Text>
        <Text style={styles.stepCount}>{steps?.length} Steps</Text>
      </View>

      <View style={styles.stepsList}>
        <FlatList
          data={steps}
          scrollEnabled={false}
          renderItem={({ item, index }: any) => (
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepDescription}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default RecipeSteps;

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
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.text,
  },
  stepCount: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.textLight,
    backgroundColor: Colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.grayLight,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.white,
  },
  stepDescription: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
});
