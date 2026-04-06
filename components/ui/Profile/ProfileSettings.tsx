import { FONT_FAMILY } from "@/constants/fonts";
import { UserContext } from "@/context/UserContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useContext } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ProfileSettingsProps = {
  onOpenProfileActions?: () => void;
  onOpenPreferences?: () => void;
  onOpenEditProfile?: () => void;
};

export default function ProfileSettings({
  onOpenProfileActions,
  onOpenPreferences,
  onOpenEditProfile,
}: ProfileSettingsProps) {
  const { shouldRemoveTopMargin } = useResponsiveLayout();
  const { user: storedUser } = useContext(UserContext);
  const { user: clerkUser } = useUser();

  const displayName =
    storedUser?.name ??
    clerkUser?.fullName ??
    clerkUser?.firstName ??
    "CookMaster User";
  const displayEmail =
    storedUser?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? "";
  const displayAvatarUri =
    storedUser?.picture ?? clerkUser?.imageUrl ?? undefined;

  const handleOpenProfileActions = () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }

    onOpenProfileActions?.();
  };

  const handleOpenPreferences = () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }

    onOpenPreferences?.();
  };

  const handleOpenEditProfile = () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }

    onOpenEditProfile?.();
  };

  return (
    <View>
      <View
        style={[
          styles.header,
          shouldRemoveTopMargin && styles.headerNoTopMargin,
        ]}
      >
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.settingsButton}
          onPress={handleOpenProfileActions}
        >
          <Ionicons name="settings-sharp" size={22} color="#15161D" />
        </TouchableOpacity>
      </View>

      <View style={styles.accountCard}>
        <View style={styles.accountInfo}>
          <View style={styles.avatarWrap}>
            <Image
              source={
                displayAvatarUri
                  ? { uri: displayAvatarUri }
                  : require("../../../assets/images/icon.png")
              }
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <View style={styles.accountTextWrap}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.editButton}
          onPress={handleOpenEditProfile}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.preferenceCard}>
        <Image
          source={require("../../../assets/images/common/prop.png")}
          style={styles.preferenceBackdrop}
          contentFit="contain"
        />

        <View style={styles.preferenceCopy}>
          <Text style={styles.preferenceTitle}>Preferences</Text>
          <Text style={styles.preferenceSubtitle}>
            Food preferences and more
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.preferenceArrowWrap}
          onPress={handleOpenPreferences}
        >
          <Ionicons name="arrow-forward" size={20} color="#181924" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 10,
  },
  headerNoTopMargin: {
    marginTop: -10,
  },
  title: {
    color: "#15161F",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.7,
    fontFamily: FONT_FAMILY.medium,
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  accountCard: {
    marginTop: 18,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.82)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  avatarWrap: {
    width: 55,
    height: 55,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#E8E2F8",
  },
  avatar: {
    width: 55,
    height: 55,
  },
  accountTextWrap: {
    flexShrink: 1,
    minWidth: 0,
    gap: 5,
  },
  name: {
    color: "#151623",
    fontSize: 18,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.semibold,
  },
  email: {
    marginTop: 2,
    color: "#646878",
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
  editButton: {
    height: 42,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F8",
  },
  editButtonText: {
    color: "#171926",
    fontSize: 15,
    fontFamily: FONT_FAMILY.semibold,
  },
  preferenceCard: {
    marginTop: 18,
    borderRadius: 30,
    backgroundColor: "#D0C4FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 25,
    overflow: "hidden",
  },
  preferenceBackdrop: {
    position: "absolute",
    left: -70,
    top: -70,
    width: 180,
    height: 180,
    tintColor: "#C1AFFF",
    zIndex: 0,
  },
  preferenceCopy: {
    gap: 1,
    zIndex: 2,
  },
  preferenceTitle: {
    color: "#161827",
    fontSize: 20,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.bold,
  },
  preferenceSubtitle: {
    marginTop: 4,
    color: "#3F4050",
    fontSize: 14,
    fontFamily: FONT_FAMILY.regular,
  },
  preferenceArrowWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#C0AEFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
