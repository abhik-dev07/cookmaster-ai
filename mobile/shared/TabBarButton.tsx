import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const icon = {
  home: () => (
    <Image
      source={require("./../assets/images/house.png")}
      style={styles.icon}
    />
  ),
  explore: () => (
    <Image source={require("./../assets/images/i2.png")} style={styles.icon} />
  ),
  create: () => (
    <Image source={require("./../assets/images/i1.png")} style={styles.icon} />
  ),
  cookbook: () => (
    <Image source={require("./../assets/images/i3.png")} style={styles.icon} />
  ),
  profile: () => (
    <Image source={require("./../assets/images/i4.png")} style={styles.icon} />
  ),
};

const getIcon = (routeName: string) => {
  return icon[routeName as keyof typeof icon]?.() || null;
};

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
  color,
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  label: string;
  color: string;
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    const translateY = interpolate(scale.value, [0, 1], [0, 6]);
    return {
      transform: [{ scale: scaleValue }, { translateY }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
      transform: [{ translateY: 2 }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.button}
    >
      <Animated.View style={[animatedIconStyle]}>
        {getIcon(routeName)}
      </Animated.View>
      <Animated.Text style={[styles.label, { color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
