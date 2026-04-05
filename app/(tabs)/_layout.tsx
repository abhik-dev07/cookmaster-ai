import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Platform, StyleSheet, View } from "react-native";
import CookingScreen from "./cooking";
import HomeScreen from "./home";
import ProfileScreen from "./profile";
import RecipesScreen from "./recipes";
import WishlistScreen from "./wishlist";

const TAB_ICON_SIZE = 22;
const ANDROID_TAB_OVERLAY_BG = "rgba(255,255,255,0.24)";
const ANDROID_TAB_BORDER = "rgba(255,255,255,0.35)";
const IOS_TAB_OVERLAY_BG = "rgba(255,255,255,0.30)";
const IOS_TAB_OVERLAY_BORDER = "rgba(255,255,255,0.35)";

const BottomTab = createBottomTabNavigator();

type TabBarIconProps = {
  focused: boolean;
  color: string;
};

type TabIconProps = {
  focused: boolean;
  color: string;
  family?: "ionicons" | "material" | "octicons";
  icon:
    | React.ComponentProps<typeof Ionicons>["name"]
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof Octicons>["name"];
};

function TabIcon({ focused, color, icon, family = "ionicons" }: TabIconProps) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      {family === "material" ? (
        <MaterialCommunityIcons
          name={
            icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]
          }
          size={TAB_ICON_SIZE}
          color={focused ? "#2D2D2D" : "#FFFFFF"}
        />
      ) : family === "octicons" ? (
        <Octicons
          name={icon as React.ComponentProps<typeof Octicons>["name"]}
          size={TAB_ICON_SIZE}
          color={focused ? "#2D2D2D" : "#FFFFFF"}
        />
      ) : (
        <Ionicons
          name={icon as React.ComponentProps<typeof Ionicons>["name"]}
          size={TAB_ICON_SIZE}
          color={focused ? "#2D2D2D" : "#FFFFFF"}
        />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <BottomTab.Navigator
      initialRouteName="home"
      detachInactiveScreens={false}
      screenListeners={{
        tabPress: () => {
          if (Platform.OS !== "web") {
            void Haptics.selectionAsync();
          }
        },
      }}
      screenOptions={{
        headerShown: false,
        animation: "shift",
        lazy: false,
        sceneStyle: styles.scene,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2D2D2D",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarItemStyle: styles.item,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => {
          const isIOS = Platform.OS === "ios";
          return (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: 999,
                  overflow: "hidden",
                },
              ]}
            >
              <BlurView
                intensity={20}
                tint="systemThickMaterialDark"
                experimentalBlurMethod={isIOS ? undefined : "dimezisBlurView"}
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "transparent" },
                ]}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: isIOS
                      ? IOS_TAB_OVERLAY_BG
                      : ANDROID_TAB_OVERLAY_BG,
                    borderRadius: 999,
                    borderColor: isIOS
                      ? IOS_TAB_OVERLAY_BORDER
                      : ANDROID_TAB_BORDER,
                  },
                ]}
              />
            </View>
          );
        },
      }}
    >
      <BottomTab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }: TabBarIconProps) => (
            <TabIcon
              focused={focused}
              color={color}
              family="material"
              icon="chef-hat"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="recipes"
        component={RecipesScreen}
        options={{
          tabBarIcon: ({ focused, color }: TabBarIconProps) => (
            <TabIcon
              focused={focused}
              color={color}
              family="material"
              icon="book-open-variant"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="cooking"
        component={CookingScreen}
        options={{
          tabBarIcon: ({ focused, color }: TabBarIconProps) => (
            <TabIcon
              focused={focused}
              color={color}
              family="octicons"
              icon="sparkle-fill"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused, color }: TabBarIconProps) => (
            <TabIcon
              focused={focused}
              color={color}
              family="material"
              icon="heart"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }: TabBarIconProps) => (
            <TabIcon
              focused={focused}
              color={color}
              family="ionicons"
              icon="person"
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: "#F5F7FB",
  },
  tabBar: {
    position: "absolute",
    width: "85%",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 30 : 5,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    borderRadius: 999,
    marginLeft: 31,
    paddingHorizontal: 5,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  label: {
    fontSize: 12,
    fontFamily: "System",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 31,
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  iconWrapActive: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
