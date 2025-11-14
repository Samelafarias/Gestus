import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Subscription } from '../types/Subscription';
import * as SubscriptionStorage from '../services/SubscriptionStorage';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  inactiveSubscriptions: Subscription[];
  isLoading: boolean;
  loadSubscriptions: () => void;
  add: (data: Omit<Subscription, 'id' | 'isActive'>) => Promise<void>;
  update: (data: Subscription) => Promise<void>;
  remove: (id: string) => Promise<void>; // Inativar
  reactivate: (id: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados ao iniciar o app
  const loadSubscriptions = async () => {
    setIsLoading(true);
    const data = await SubscriptionStorage.getSubscriptions();
    setSubscriptions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // --- Funções de Manipulação que chamam o Storage e atualizam o estado ---

  const add = async (data: Omit<Subscription, 'id' | 'isActive'>) => {
    await SubscriptionStorage.addSubscription(data);
    loadSubscriptions(); // Recarrega os dados para atualizar o estado
  };

  const update = async (data: Subscription) => {
    await SubscriptionStorage.updateSubscription(data);
    loadSubscriptions();
  };

  const remove = async (id: string) => {
    await SubscriptionStorage.removeSubscription(id);
    loadSubscriptions();
  };

  const reactivate = async (id: string) => {
      await SubscriptionStorage.reactivateSubscription(id);
      loadSubscriptions();
  };

  // Filtros conforme RF-1.2 e RF-1.3
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