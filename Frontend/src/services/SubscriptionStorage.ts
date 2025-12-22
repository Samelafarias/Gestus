import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '../types/Subscription';

// Chave onde as assinaturas serão armazenadas
const STORAGE_KEY = '@Gestus:subscriptions';

/**
 * 1. GET ALL: Carrega todas as assinaturas do AsyncStorage.
 * @returns {Promise<Subscription[]>} Lista de assinaturas.
 */
export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    // Se não houver dados, retorna um array vazio
    const subscriptions: Subscription[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    
    // Converte as strings de data de volta para objetos Date
    return subscriptions.map(sub => ({
        ...sub,
        firstChargeDate: new Date(sub.firstChargeDate),
    }));
  } catch (e) {
    console.error("Erro ao carregar assinaturas:", e);
    return []; // Retorna vazio em caso de erro
  }
}

/**
 * 2. SAVE ALL: Salva toda a lista de assinaturas no AsyncStorage.
 * @param {Subscription[]} subscriptions - Lista completa a ser salva.
 */
async function saveSubscriptions(subscriptions: Subscription[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(subscriptions);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar assinaturas:", e);
  }
}

// --- Funções CRUD ---

/**
 * CREATE: Adiciona uma nova assinatura.
 * @param {Omit<Subscription, 'id' | 'isActive'>} newSubscriptionData - Dados da nova assinatura (sem ID).
 */
export async function addSubscription(newSubscriptionData: Omit<Subscription, 'id' | 'isActive'>): Promise<Subscription> {
  const subscriptions = await getSubscriptions();
  const newSubscription: Subscription = {
    ...newSubscriptionData,
    id: Date.now().toString(), // ID simples baseado no timestamp
    isActive: true, // Começa como ativa
  };
  
  subscriptions.push(newSubscription);
  await saveSubscriptions(subscriptions);
  return newSubscription;
}

/**
 * UPDATE: Edita uma assinatura existente.
 * @param {Subscription} updatedSubscription - A assinatura com os dados atualizados.
 */
export async function updateSubscription(updatedSubscription: Subscription): Promise<void> {
  const subscriptions = await getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === updatedSubscription.id);

  if (index > -1) {
    // Substitui a assinatura antiga pela nova
    subscriptions[index] = updatedSubscription;
    await saveSubscriptions(subscriptions);
  } else {
    throw new Error('Assinatura não encontrada para atualização.');
  }
}

/**
 * DELETE (Marcar como Inativa/Cancelada): Marca uma assinatura como inativa (Status = Inativa/Cancelada).
 * Conforme RF-1.4, vamos marcar como inativa em vez de remover totalmente.
 * @param {string} id - ID da assinatura a ser removida/inativada.
 */ // <--- Certifique-se de que o JSDoc está fechado AQUI.
export async function removeSubscription(id: string): Promise<void> {
  const subscriptions = await getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === id);

  if (index > -1) {
    // Modifica o status para inativa
    subscriptions[index].isActive = false;
    await saveSubscriptions(subscriptions);
  }
}

/**
 * REATIVAR: Marca uma assinatura como ativa. (Conforme RF-1.3)
 * @param {string} id - ID da assinatura a ser reativada.
 */
export async function reactivateSubscription(id: string): Promise<void> {
    const subscriptions = await getSubscriptions();
    const index = subscriptions.findIndex(sub => sub.id === id);

    if (index > -1) {
        // Modifica o status para ativa
        subscriptions[index].isActive = true;
        await saveSubscriptions(subscriptions);
    }
}

/**
 * REGISTRAR PAGAMENTO: Atualiza a data da próxima cobrança para o mês seguinte
 * e mantém o histórico se necessário.
 * @param {string} id - ID da assinatura paga.
 */
export async function paySubscription(id: string): Promise<void> {
  const subscriptions = await getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === id);

  if (index > -1) {
    const sub = subscriptions[index];
    const nextDate = new Date(sub.firstChargeDate);
    
    // Avança a data baseada na recorrência (Mensal por padrão no protótipo)
    if (sub.recurrence === 'Mensal') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (sub.recurrence === 'Anual') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    subscriptions[index] = {
      ...sub,
      firstChargeDate: nextDate,
    };
    
    await saveSubscriptions(subscriptions);
  }
}