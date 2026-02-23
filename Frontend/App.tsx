import React from 'react';
import AppRoutes from './src/routes/AppRoutes';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import app from '@react-native-firebase/app'; 

export default function App() {
  // Opcional: Verificar se já existe um app inicializado
  // if (!app.apps.length) { app.initializeApp(); }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider> 
        <SubscriptionProvider>
          <AppRoutes /> 
        </SubscriptionProvider>
      </ThemeProvider>
    </GestureHandlerRootView> 
  );
}