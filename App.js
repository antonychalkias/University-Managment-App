// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DashboardScreen from "./screens/DashboardScreen";
import LogoutScreen from "./screens/LogoutScreen";
import VerifyScreen from "./screens/VerifyScreen";
import MapsScreen from "./screens/MapsScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import { StatusBar } from "react-native";
import VerifyUsersScreen from "./screens/VerifyUsersScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#3498db" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogoutScreen"
          component={LogoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyScreen"
          component={VerifyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MapsScreen"
          component={MapsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboardScreen"
          component={AdminDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyUsersScreen"
          component={VerifyUsersScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
