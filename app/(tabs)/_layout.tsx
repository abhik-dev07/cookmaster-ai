import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

const TAB_ICON_SIZE = 22;
const ANDROID_TAB_BG = "rgba(255,255,255,0.30)";
const ANDROID_TAB_BORDER = "rgba(255,255,255,0.35)";
const IOS_TAB_OVERLAY_BG = "rgba(255,255,255,0.30)";
const IOS_TAB_OVERLAY_BORDER = "rgba(255,255,255,0.35)";

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
          color={focused ? "#2D2D2D" : "#8966FA"}
        />
      ) : family === "octicons" ? (
        <Octicons
          name={icon as React.ComponentProps<typeof Octicons>["name"]}
          size={TAB_ICON_SIZE}
          color={focused ? "#2D2D2D" : "#8966FA"}
        />
      ) : (
        <Ionicons
          name={icon as React.ComponentProps<typeof Ionicons>["name"]}
          size={TAB_ICON_SIZE}
          color={focused ? "#2D2D2D" : "#8966FA"}
        />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#d4d1d1ff",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarItemStyle: styles.item,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
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
                tint="light"
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "transparent" },
                ]}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: IOS_TAB_OVERLAY_BG,
                    borderRadius: 999,
                    borderColor: IOS_TAB_OVERLAY_BORDER,
                  },
                ]}
              />
            </View>
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: ANDROID_TAB_BG,
                  borderRadius: 999,
                  borderColor: ANDROID_TAB_BORDER,
                },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              family="material"
              icon="chef-hat"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              family="material"
              icon="book-open-variant"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cooking"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              family="octicons"
              icon="sparkle-fill"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              family="material"
              icon="heart"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              family="ionicons"
              icon="person"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    width: "85%",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 30 : 20,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    borderRadius: 999,
    marginLeft: 31,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#D0C4FF",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 31,
  },
  iconWrapActive: {
    backgroundColor: "#FFFFFF",
  },
});
