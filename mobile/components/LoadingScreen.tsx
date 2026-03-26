import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/shared/Colors";
import { Image } from "expo-image";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <Image
        source={require("../assets/images/pan.gif")}
        style={styles.panGif}
        contentFit="contain"
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  panGif: {
    width: 64,
    height: 64,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
  },
});

export default LoadingScreen;
