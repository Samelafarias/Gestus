import React from 'react';
import AppRoutes from './src/routes/AppRoutes';
import { SubscriptionProvider } from './src/context/SubscriptionContext';

export default function App () {
  return(
     <SubscriptionProvider>
          <AppRoutes /> 
        </SubscriptionProvider>
  );
}
