import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationLog {
    id: string;
    title: string;
    message: string;
    timestamp: number; // Data em milissegundos
    status: 'success' | 'failure' | 'reminder';
    subscriptionName: string;
}

const STORAGE_KEY = '@gestus:notifications';

export const saveNotification = async (log: NotificationLog) => {
    const history = await getNotificationHistory();
    const updatedHistory = [log, ...history];
    
    // Filtro de 5 dias: remove qualquer uma com mais de 5 dias 
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const filteredHistory = updatedHistory.filter(item => (now - item.timestamp) < fiveDaysInMs);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
};

export const getNotificationHistory = async (): Promise<NotificationLog[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};