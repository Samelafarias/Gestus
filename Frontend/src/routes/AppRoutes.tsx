import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../pages/Login'; 
import HomePage from '../pages/Home';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ title: 'Página Inicial' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
