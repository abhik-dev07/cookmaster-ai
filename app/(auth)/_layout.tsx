import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "./onboarding";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

const NativeStack = createNativeStackNavigator();

export default function AuthRoutesLayout() {
  return (
    <NativeStack.Navigator
      initialRouteName="onboarding"
      screenOptions={{ headerShown: false }}
    >
      <NativeStack.Screen name="onboarding" component={Onboarding} />
      <NativeStack.Screen name="sign-in" component={SignIn} />
      <NativeStack.Screen name="sign-up" component={SignUp} />
    </NativeStack.Navigator>
  );
}
