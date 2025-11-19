import React from 'react';
import AppRoutes from './src/routes/AppRoutes';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler'; 

export default function App () {
  return(
     <GestureHandlerRootView style={{ flex: 1 }}>
        <SubscriptionProvider>
          <AppRoutes /> 
        </SubscriptionProvider>
     </GestureHandlerRootView> 
  );
}