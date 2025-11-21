import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { Subscription } from '../types/Subscription'; 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Permissão de notificações não concedida. O agendamento pode falhar.');
        return false;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('gestus_reminders', {
            name: 'Lembretes Gestus',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return true;
}

export async function scheduleSubscriptionReminder(title: string, body: string, date: Date) {
    const now = new Date();
    if (date.getTime() < now.getTime()) {
        return; 
    }

    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: { type: 'reminder', subscription: title },
            },
            trigger: {
                date: date,
                repeats: false,
            },
        });
    } catch (e) {
        console.error("Erro ao agendar notificação:", e);
    }
}

/** 
 @param subscriptions Lista completa de assinaturas.
 */
export async function scheduleAllReminders(subscriptions: Subscription[]): Promise<void> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;
    
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    subscriptions.filter(sub => sub.isActive).forEach(sub => {
        const reminderDate = new Date(sub.firstChargeDate.getTime());
        reminderDate.setDate(reminderDate.getDate() - 3);

        const diffDays = Math.ceil((sub.firstChargeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        if (reminderDate.getTime() > new Date().getTime()) {
            
            const title = 'Lembrete de Pagamento';
            const body = `${sub.name} vence em ${diffDays} dias (${sub.firstChargeDate.toLocaleDateString('pt-BR')}). Valor: R$ ${sub.value.toFixed(2).replace('.', ',')}`;
            
            scheduleSubscriptionReminder(title, body, reminderDate);
            console.log(`[Agendamento Real]: Lembrete para ${sub.name} agendado.`);
        }
        
    });
}