import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../pages/Login'; 
import HomePage from '../pages/Home';
import RegisterPage from '../pages/Cadastrar';
import ResetPassword from '../pages/ResetPassword';
import RedefinirSenha from '../pages/RedefinirSenha';
import DrawerStack from './DrawerStack';
import AddAssinatura from '../pages/AddAssinaruras';
import EdicaoAssinatura from '../pages/EdicaoAssinaturas';
import DetalhesAssinaturas from '../pages/DetalhesAssinaturas'; 
import EditarCadastroPage from '../pages/EditarCadastro'; 
import DefinirMetasPage from '../pages/DefinirMetas';

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
        <Stack.Screen name='AddAssinatura' component={AddAssinatura} options={{presentation:'modal',  headerShown: false}} />
        <Stack.Screen 
            name="EdicaoAssinaturas" 
            component={EdicaoAssinatura} 
            options={{ 
                title: 'Editar Assinatura', 
                presentation:'modal', 
                headerShown: true, 
                headerStyle: { 
                    backgroundColor: '#1e1e1e' 
                },
                headerTintColor: '#fff', 
            }} 
        />       
        <Stack.Screen 
            name="DetalhesAssinaturas" 
            component={DetalhesAssinaturas} 
            options={{ 
                title: 'Detalhes da Assinatura', 
                headerShown: true, 
                headerStyle: { 
                    backgroundColor: '#1e1e1e' 
                },
                headerTintColor: '#fff', 
            }} 
        />
        <Stack.Screen 
            name="EditarCadastro" 
            component={EditarCadastroPage} 
            options={{ 
                title: 'Editar Dados de Cadastro', 
                headerShown: true, 
                headerStyle: { backgroundColor: '#1e1e1e' },
                headerTintColor: '#fff', 
            }} 
        />
        <Stack.Screen 
            name="DefinirMetas" 
            component={DefinirMetasPage} 
            options={{ 
                title: 'Definir Metas de Gastos', 
                headerShown: true, 
                headerStyle: { backgroundColor: '#1e1e1e' },
                headerTintColor: '#fff', 
            }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}