import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../pages/Login'; 
import HomePage from '../pages/Home';
import RegisterPage from '../pages/Cadastrar';
import ResetPassword from '../pages/ResetPassword';
import RedefinirSenha from '../pages/RedefinirSenha';
import ListaAssinaturas from '../pages/ListaAssinaturas';
import DrawerStack from './DrawerStack';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
  <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Login" component={LoginPage} />   
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />       
        <Stack.Screen name="App" component={DrawerStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
