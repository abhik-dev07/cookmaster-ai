import { View, StyleSheet, LayoutChangeEvent, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Colors from "./Colors";
import TabBarButton from "./TabBarButton";
import { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Keyboard, KeyboardEvent } from "react-native";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const topPositionX = useSharedValue(0);
  const tabBarTranslateY = useSharedValue(0);
  const tabBarOpacity = useSharedValue(1);

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        setKeyboardVisible(true);
        // Hide the tab bar when keyboard appears
        tabBarTranslateY.value = withTiming(100, { duration: 250 });
        tabBarOpacity.value = withTiming(0, { duration: 200 });
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        // Show the tab bar when keyboard hides
        tabBarTranslateY.value = withTiming(0, { duration: 250 });
        tabBarOpacity.value = withTiming(1, { duration: 300 });
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (dimensions.width > 0) {
      const tabCenter = buttonWidth * state.index + buttonWidth / 2;
      const backgroundCenter = (buttonWidth - 25) / 2;
      const targetPosition = tabCenter - backgroundCenter;

      topPositionX.value = withSpring(targetPosition, {
        duration: 1500,
      });
    }
  }, [state.index, buttonWidth, dimensions.width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: topPositionX.value }],
    };
  });

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarTranslateY.value }],
      opacity: tabBarOpacity.value,
    };
  });

  return (
    <Animated.View
      onLayout={onTabBarLayout}
      style={[styles.tabBar, { bottom: 20 }, tabBarAnimatedStyle]}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: Colors.primary,
            borderRadius: 35,
            height: dimensions.height - 15,
            width: buttonWidth - 25,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          navigation.emit({ type: "tabLongPress", target: route.key });
          if (!isFocused) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <View
            key={route.key}
            style={{ width: buttonWidth, alignItems: "center" }}
          >
            <TabBarButton
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              label={label}
              color={isFocused ? Colors.primary : "#000000"}
            />
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingVertical: 12,
    borderRadius: 35,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    borderColor: Colors.border,
    borderWidth: 1,
  },
});
