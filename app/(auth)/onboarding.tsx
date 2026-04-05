import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect } from "react";
import {
  Image,
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { FONT_FAMILY } from "../../constants/fonts";

const CTA_HORIZONTAL_PADDING = 10;
const CTA_THUMB_SIZE = 44;
const SLIDE_COMPLETE_THRESHOLD = 0.9;
const CTA_IMAGE_SAFE_SPACE = 120;

type AuthStackParamList = {
  onboarding: undefined;
  "sign-in": undefined;
  "sign-up": undefined;
};

export default function Onboarding() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const ctaWidth = useSharedValue(0);
  const thumbX = useSharedValue(0);
  const thumbStartX = useSharedValue(0);
  const chevronPulse = useSharedValue(0);

  useEffect(() => {
    chevronPulse.value = withRepeat(
      withTiming(1, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [chevronPulse]);

  useFocusEffect(
    useCallback(() => {
      thumbX.value = 0;
      thumbStartX.value = 0;
    }, [thumbStartX, thumbX]),
  );

  const getMaxSlide = () => {
    "worklet";
    return Math.max(
      ctaWidth.value - CTA_HORIZONTAL_PADDING * 2 - CTA_THUMB_SIZE,
      0,
    );
  };

  const navigateToSignIn = () => {
    navigation.navigate("sign-in");
  };

  const slideGesture = Gesture.Pan()
    .onBegin(() => {
      thumbStartX.value = thumbX.value;
    })
    .onUpdate((event) => {
      const nextX = thumbStartX.value + event.translationX;
      const maxSlide = getMaxSlide();
      thumbX.value = Math.min(Math.max(nextX, 0), maxSlide);
    })
    .onEnd(() => {
      const maxSlide = getMaxSlide();
      const crossedThreshold =
        thumbX.value >= maxSlide * SLIDE_COMPLETE_THRESHOLD;

      if (crossedThreshold && maxSlide > 0) {
        thumbX.value = withTiming(maxSlide, { duration: 120 }, (finished) => {
          if (finished) {
            runOnJS(navigateToSignIn)();
          }
        });
        return;
      }

      thumbX.value = withTiming(0, { duration: 180 });
    });

  const onCtaLayout = (event: LayoutChangeEvent) => {
    ctaWidth.value = event.nativeEvent.layout.width;
  };

  const sliderThumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: thumbX.value }],
    };
  });

  const ctaTextAnimatedStyle = useAnimatedStyle(() => {
    const maxSlide = getMaxSlide();
    const progress =
      maxSlide > 0 ? Math.min(Math.max(thumbX.value / maxSlide, 0), 1) : 0;

    return {
      opacity: interpolate(progress, [0, 0.55, 1], [1, 0, 0]),
      transform: [{ translateX: interpolate(progress, [0, 1], [0, -24]) }],
    };
  });

  const chevronOneAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(chevronPulse.value, [0, 1], [0.35, 0.8]),
      transform: [
        { translateX: interpolate(chevronPulse.value, [0, 1], [0, 2]) },
      ],
    };
  });

  const chevronTwoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(chevronPulse.value, [0, 1], [0.55, 0.95]),
      transform: [
        { translateX: interpolate(chevronPulse.value, [0, 1], [0, 3]) },
      ],
    };
  });

  const chevronThreeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(chevronPulse.value, [0, 1], [0.75, 1]),
      transform: [
        { translateX: interpolate(chevronPulse.value, [0, 1], [0, 4]) },
      ],
    };
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={["#D0C4FF", "#D0C4FF", "#D0C4FF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.screen}
      >
        <View style={styles.contentWrap}>
          <Image
            source={require("../../assets/images/onboarding/Welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
          <View style={styles.ctaWrap}>
            <View style={styles.cta} onLayout={onCtaLayout}>
              <Animated.Text style={[styles.ctaText, ctaTextAnimatedStyle]}>
                Scroll to start
              </Animated.Text>
              <View style={styles.chevrons}>
                <Animated.View style={chevronOneAnimatedStyle}>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color="#8c8c8cbe"
                  />
                </Animated.View>
                <Animated.View style={chevronTwoAnimatedStyle}>
                  <Ionicons name="chevron-forward" size={14} color="#8C8C8C" />
                </Animated.View>
                <Animated.View style={chevronThreeAnimatedStyle}>
                  <Ionicons name="chevron-forward" size={14} color="#000000" />
                </Animated.View>
              </View>

              <GestureDetector gesture={slideGesture}>
                <Animated.View
                  style={[
                    styles.ctaIconWrap,
                    styles.sliderThumb,
                    sliderThumbAnimatedStyle,
                  ]}
                >
                  <FontAwesome6 name="carrot" size={18} color="#FFFFFF" />
                </Animated.View>
              </GestureDetector>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#D0C4FF",
  },

  screen: {
    flex: 1,
  },
  contentWrap: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
  },
  welcomeImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: CTA_IMAGE_SAFE_SPACE,
    left: 0,
    width: "100%",
    height: "100%",
  },
  ctaWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cta: {
    height: 64,
    borderRadius: 34,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    position: "relative",
    overflow: "hidden",
  },
  ctaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8966FA",
    alignItems: "center",
    justifyContent: "center",
  },
  sliderThumb: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 2,
  },
  ctaText: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: FONT_FAMILY.semibold,
    color: "#16171D",
    fontSize: 22,
  },
  chevrons: {
    position: "absolute",
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    width: 52,
    justifyContent: "center",
    gap: 1,
  },
});
