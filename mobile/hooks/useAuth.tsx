import { useEffect, useContext } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { UserContext } from "@/context/UserContext";
import UserService from "@/services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const { isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const loadUserData = async () => {
      if (isSignedIn && clerkUser?.primaryEmailAddress?.emailAddress) {
        try {
          const email = clerkUser.primaryEmailAddress.emailAddress;

          // Store user email in AsyncStorage for API authentication
          await AsyncStorage.setItem("user_email", email);

          const userResponse = await UserService.getUserByEmail(email);

          if (userResponse.data) {
            setUser(userResponse.data);
            console.log("User data loaded on app start:", userResponse.data);
          } else if (userResponse.error) {
            console.log("No user data found in database for:", email);
            // Only create user if we have some display name information
            if (
              clerkUser.firstName ||
              clerkUser.lastName ||
              clerkUser.username
            ) {
              try {
                const displayName =
                  clerkUser.firstName || clerkUser.username || "User";
                const newUserData = await UserService.handleUserVerification(
                  email,
                  displayName,
                  clerkUser.imageUrl
                );
                if (newUserData) {
                  setUser(newUserData);
                  console.log("Created missing user data:", newUserData);
                }
              } catch (createError) {
                console.error("Error creating user data:", createError);
                // Don't throw here, just log the error
              }
            }
          }
        } catch (error) {
          console.error("Error loading user data on app start:", error);
        }
      } else if (!isSignedIn) {
        // Clear user data when signed out
        setUser(null);
        // Remove user email from AsyncStorage
        await AsyncStorage.removeItem("user_email");
      }
    };

    loadUserData();
  }, [isSignedIn, clerkUser, setUser]);

  return {
    isSignedIn,
    user,
    clerkUser,
    setUser,
  };
};
