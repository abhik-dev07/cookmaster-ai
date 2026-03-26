import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import LoadingScreen from "@/components/LoadingScreen";

export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loader until Clerk is fully initialized
  if (!isLoaded) {
    return <LoadingScreen message="Initializing..." />;
  }

  // Once Clerk is loaded, redirect if user is signed in
  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Otherwise show the auth stack (sign-in / sign-up)
  return <Stack screenOptions={{ headerShown: false }} />;
}
