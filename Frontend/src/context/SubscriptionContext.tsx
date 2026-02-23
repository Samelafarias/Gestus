import api from '../services/api';

const loadSubscriptions = async () => {
  setIsLoading(true);
  try {
    // Busca do Backend em vez do AsyncStorage
    const response = await api.get('/subscriptions');
    setSubscriptions(response.data);
    
    await loadNotifications();
    await scheduleAllReminders(response.data);
  } catch (error) {
    console.error("Erro ao carregar assinaturas do servidor:", error);
  } finally {
    setIsLoading(false);
  }
};

const add = async (data: any) => {
  await api.post('/subscriptions', data);
  await loadSubscriptions(); // Recarrega a lista do servidor
};