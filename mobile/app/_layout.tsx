import { Slot } from "expo-router";
import { UserContext, User } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "@/hooks/useAuth";

// Component that uses auth hook inside ClerkProvider context
const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isVegMode, setIsVegMode] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isVegMode, setIsVegMode }}>
      <AuthHandler />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </UserContext.Provider>
  );
};

// Separate component to handle auth logic
const AuthHandler = () => {
  // Use the auth hook to handle user data loading
  useAuth();
  return null; // This component doesn't render anything
};

const RootLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AppContent />

      <StatusBar style="dark" />
    </ClerkProvider>
  );
};

export default RootLayout;
