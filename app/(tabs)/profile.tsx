import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ProfileActionsSheet from "../../components/ui/Profile/ProfileActionsSheet";
import ProfileEditSheet from "../../components/ui/Profile/ProfileEditSheet";
import ProfilePreferenceSheet from "../../components/ui/Profile/ProfilePreferenceSheet";
import ProfileRecipe from "../../components/ui/Profile/ProfileRecipe";
import ProfileSettings from "../../components/ui/Profile/ProfileSettings";

export default function ProfileScreen() {
  const [isProfileActionsOpen, setIsProfileActionsOpen] = React.useState(false);
  const [isPreferenceOpen, setIsPreferenceOpen] = React.useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);

  const handleOpenProfileActions = React.useCallback(() => {
    setIsPreferenceOpen(false);
    setIsEditProfileOpen(false);
    setIsProfileActionsOpen(true);
  }, []);

  const handleOpenPreferences = React.useCallback(() => {
    setIsProfileActionsOpen(false);
    setIsEditProfileOpen(false);
    setIsPreferenceOpen(true);
  }, []);

  const handleOpenEditProfile = React.useCallback(() => {
    setIsProfileActionsOpen(false);
    setIsPreferenceOpen(false);
    setIsEditProfileOpen(true);
  }, []);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSettings
          onOpenProfileActions={handleOpenProfileActions}
          onOpenPreferences={handleOpenPreferences}
          onOpenEditProfile={handleOpenEditProfile}
        />
        <ProfileRecipe />
      </ScrollView>
      <ProfileActionsSheet
        isOpen={isProfileActionsOpen}
        onClose={() => setIsProfileActionsOpen(false)}
      />
      <ProfilePreferenceSheet
        isOpen={isPreferenceOpen}
        onClose={() => setIsPreferenceOpen(false)}
      />
      <ProfileEditSheet
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 124,
  },
});
