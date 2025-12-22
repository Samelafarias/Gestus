import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Subscription } from '../types/Subscription';
import * as SubscriptionStorage from '../services/SubscriptionStorage'; 
import { scheduleAllReminders } from '../services/NotificationService'; 
import { getNotificationHistory, NotificationLog } from '../services/NotificationHistoryStorage';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  inactiveSubscriptions: Subscription[];
  notificationHistory: NotificationLog[]; 
  isLoading: boolean;
  loadSubscriptions: () => Promise<void>;
  loadNotifications: () => Promise<void>; 
  add: (data: Omit<Subscription, 'id' | 'isActive'>) => Promise<void>;
  update: (data: Subscription) => Promise<void>;
  remove: (id: string) => Promise<void>; 
  reactivate: (id: string) => Promise<void>;
  pay: (id: string) => Promise<void>; 
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o histórico de notificações real do storage 
  const loadNotifications = async () => {
    const history = await getNotificationHistory();
    setNotificationHistory(history);
  };

  const loadSubscriptions = async () => {
    setIsLoading(true);
    try {
      const data = await SubscriptionStorage.getSubscriptions();
      setSubscriptions(data);
      
      // Sempre carrega as notificações junto com as assinaturas 
      await loadNotifications();
      
      // Reagenda os alertas baseados nas datas atualizadas 
      await scheduleAllReminders(data);
    } catch (error) {
      console.error("Erro ao carregar dados do Context:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);
  
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

  // Lógica de pagamento: atualiza a data no storage e recarrega o estado global 
  const pay = async (id: string) => {
    try {
      // Chama a função que criamos no SubscriptionStorage
      await SubscriptionStorage.paySubscription(id);
      // Recarrega assinaturas e histórico de notificações
      await loadSubscriptions();
    } catch (error) {
      console.error("Erro ao processar pagamento no contexto:", error);
      throw error;
    }
  };

  // Filtros derivados do estado principal 
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
  const inactiveSubscriptions = subscriptions.filter(sub => !sub.isActive);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      notificationHistory,
      isLoading,
      loadSubscriptions,
      loadNotifications,
      add,
      update,
      remove,
      reactivate,
      pay
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