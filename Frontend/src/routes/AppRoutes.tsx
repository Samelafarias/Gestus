import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
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
  // 1. Pegamos o tema atual do seu Contexto
  const { theme } = useTheme(); 

  return (
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          // Opcional: define o fundo de todas as telas conforme o tema
          contentStyle: { backgroundColor: theme.background } 
        }}
      >
        <Stack.Screen name="Login" component={LoginPage} />   
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} /> 
        <Stack.Screen name="App" component={DrawerStack} />

        <Stack.Screen 
            name="AddAssinatura" 
            component={AddAssinatura} 
            options={{ presentation: 'modal' }} 
        />

        {/* 2. Aplicamos as variáveis do tema nos Headers abaixo */}
        <Stack.Screen 
            name="EdicaoAssinaturas" 
            component={EdicaoAssinatura} 
            options={{ 
                title: 'Editar Assinatura', 
                presentation: 'modal', 
                headerShown: true, 
                headerStyle: { 
                    backgroundColor: theme.headerBackground || theme.background // Usa cor do tema
                },
                headerTintColor: theme.text, // Cor do texto dinâmica
            }} 
        />       

        <Stack.Screen 
            name="DetalhesAssinaturas" 
            component={DetalhesAssinaturas} 
            options={{ 
                title: 'Detalhes da Assinatura', 
                headerShown: true, 
                headerStyle: { 
                    backgroundColor: theme.headerBackground || theme.background 
                },
                headerTintColor: theme.text, 
            }} 
        />

        <Stack.Screen 
            name="EditarCadastro" 
            component={EditarCadastroPage} 
            options={{ 
                title: 'Editar Dados de Cadastro', 
                headerShown: true, 
                headerStyle: { 
                    backgroundColor: theme.headerBackground || theme.background 
                },
                headerTintColor: theme.text, 
            }} 
        />

        <Stack.Screen 
            name="DefinirMetas" 
            component={DefinirMetasPage} 
            options={{ 
                title: 'Definir Metas de Gastos', 
                headerShown: true, 
                headerStyle: { 
                    backgroundColor: theme.headerBackground || theme.background 
                },
                headerTintColor: theme.text, 
            }} 
        />
        
      </Stack.Navigator>
  );
}