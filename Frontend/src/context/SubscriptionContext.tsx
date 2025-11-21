import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Subscription } from '../types/Subscription';
import * as SubscriptionStorage from '../services/SubscriptionStorage'; 
import { scheduleAllReminders } from '../services/NotificationService'; 

interface SubscriptionContextType {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  inactiveSubscriptions: Subscription[];
  isLoading: boolean;
  loadSubscriptions: () => Promise<void>;
  add: (data: Omit<Subscription, 'id' | 'isActive'>) => Promise<void>;
  update: (data: Subscription) => Promise<void>;
  remove: (id: string) => Promise<void>; 
  reactivate: (id: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadSubscriptions = async () => {
    setIsLoading(true);
    const data = await SubscriptionStorage.getSubscriptions();
    setSubscriptions(data);
    setIsLoading(false);

    await scheduleAllReminders(data);
  };

  useEffect(() => {
    loadSubscriptions();
  }, [])
  
  const add = async (data: Omit<Subscription, 'id' | 'isActive'>) => {
    await SubscriptionStorage.addSubscription(data);
    await loadSubscriptions(); 
  };

  const update = async (data: Subscription) => {
    await SubscriptionStorage.updateSubscription(data);
    await loadSubscriptions();
  };

  const remove = async (id: string) => {
    await SubscriptionStorage.removeSubscription(id);
    await loadSubscriptions(); 
  };

  const reactivate = async (id: string) => {
      await SubscriptionStorage.reactivateSubscription(id);
      await loadSubscriptions();
  };

  // Filtros
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  const inactiveSubscriptions = subscriptions.filter(sub => !sub.isActive);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      isLoading,
      loadSubscriptions,
      add,
      update,
      remove,
      reactivate
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};