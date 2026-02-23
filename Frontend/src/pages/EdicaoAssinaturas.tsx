import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { useSubscriptions } from '../context/SubscriptionContext';
import { Subscription } from '../types/Subscription';
import { useTheme } from '../context/ThemeContext'; // 1. Importar o Hook

// 2. Mover estilos para uma função que recebe o tema
const createStyles = (theme: any) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    container: {
        flexGrow: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background, 
    },
    label: {
        fontSize: 14,
        color: theme.textSecondary, 
        marginBottom: 5,
        marginTop: 15,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        backgroundColor: theme.surface, 
        borderRadius: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.border,
    },
    inputWrapperMultiline: {
        backgroundColor: theme.surface,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        minHeight: 100,
        alignItems: 'flex-start',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.border,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.text, 
    },
    dateDisplay: {
        flex: 1,
        fontSize: 16,
        color: theme.text,
    },
    buttonContainer: {
        marginTop: 30,
        borderRadius: 25,
        overflow: 'hidden',
    },
    saveButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inactivateButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        padding: 10,
        borderRadius: 8,
    },
    inactivateButtonText: {
        marginLeft: 10,
        color: '#FF5252', 
        fontSize: 16,
        fontWeight: '600',
    }
});

type RootStackParamList = {
    EdicaoAssinaturas: { subscriptionId: string };
};
type EdicaoAssinaturasRouteProp = RouteProp<RootStackParamList, 'EdicaoAssinaturas'>;

type FormState = Omit<Subscription, 'isActive'> & {
    valueInput: string; 
    firstChargeDate: Date;
};

const EdicaoAssinatura: React.FC = () => {
    const route = useRoute<EdicaoAssinaturasRouteProp>();
    const navigation = useNavigation();
    const { subscriptionId } = route.params;
    const { subscriptions, update, remove, isLoading } = useSubscriptions();
    
    // 3. Consumir o tema e gerar os estilos
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [formData, setFormData] = useState<FormState | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        const foundSub = subscriptions.find(sub => sub.id === subscriptionId);
        if (foundSub) {
            setCurrentSubscription(foundSub);
            setFormData({
                id: foundSub.id,
                name: foundSub.name,
                valueInput: foundSub.value.toFixed(2).replace('.', ','), 
                value: foundSub.value,
                recurrence: foundSub.recurrence,
                category: foundSub.category,
                firstChargeDate: new Date(foundSub.firstChargeDate), 
                paymentMethod: foundSub.paymentMethod || '',
                notes: foundSub.notes || '',
            });
        } else if (!isLoading && !foundSub) {
            Alert.alert("Erro", "Assinatura não encontrada.");
            navigation.goBack();
        }
    }, [subscriptions, subscriptionId, isLoading, navigation]);

    const handleChange = useCallback((key: keyof Omit<FormState, 'value' | 'valueInput' | 'firstChargeDate'> | 'valueInput' | 'firstChargeDate', value: string | Date | number) => {
        if (!formData) return;
        if (key === 'valueInput') {
            const cleanValue = value.toString().replace(/[^0-9,]/g, '');
            setFormData(prev => ({
                ...prev!,
                valueInput: cleanValue,
                value: Number(cleanValue.replace(',', '.'))
            }));
        } else if (key === 'firstChargeDate' && value instanceof Date) {
            setFormData(prev => ({ ...prev!, firstChargeDate: value }));
        } else {
            setFormData(prev => ({ ...prev!, [key]: value }));
        }
    }, [formData]);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirmDate = (date: Date) => { handleChange('firstChargeDate', date); hideDatePicker(); };
    const formatDateInput = (date: Date) => date.toLocaleDateString('pt-BR');

    const handleUpdate = async () => {
        if (!formData || !currentSubscription) return;
        const numericValue = formData.value;
        if (!formData.name || isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Erro', 'Por favor, preencha o Nome e um Valor válido.');
            return;
        }
        setIsSaving(true);
        try {
            await update({ 
                ...formData, 
                value: numericValue, 
                isActive: currentSubscription.isActive 
            });
            Alert.alert("Sucesso", "Assinatura atualizada!");
            navigation.goBack(); 
        } catch (error) {
            Alert.alert("Erro", "Não foi possível atualizar a assinatura.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInactivate = () => {
        if (!currentSubscription) return;
        Alert.alert(
            "Excluir Assinatura",
            `Tem certeza que deseja excluir a assinatura "${currentSubscription.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            await remove(currentSubscription.id); 
                            navigation.goBack(); 
                        } catch (error) {
                            Alert.alert("Erro", "Erro ao excluir.");
                        } finally { setIsSaving(false); }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    if (isLoading || !formData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{color: theme.text}}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>

                    <Text style={styles.label}>Nome da Assinatura:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="Ex: Netflix"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <Text style={styles.label}>Valor (R$):</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={formData.valueInput}
                            onChangeText={(text) => handleChange('valueInput', text)}
                            placeholder="Ex: 39,90"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                        />
                    </View>
                    
                    <Text style={styles.label}>Recorrência:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={formData.recurrence}
                            onChangeText={(text) => handleChange('recurrence', text as Subscription['recurrence'])}
                            placeholder="Mensal, Anual..."
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <Text style={styles.label}>Próxima Cobrança:</Text>
                    <View style={styles.inputWrapper}>
                         <Text style={styles.dateDisplay}>{formatDateInput(formData.firstChargeDate)}</Text>
                         <TouchableOpacity onPress={showDatePicker}>
                             <Ionicons name="calendar-outline" size={24} color={theme.primary} />
                         </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Categoria:</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={formData.category}
                            onChangeText={(text) => handleChange('category', text as Subscription['category'])}
                            placeholder="Ex: Streaming, Educação"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <Text style={styles.label}>Notas / Observações (Opcional):</Text>
                    <View style={styles.inputWrapperMultiline}>
                        <TextInput
                            style={[styles.input, { textAlignVertical: 'top' }]}
                            value={formData.notes}
                            onChangeText={(text) => handleChange('notes', text)}
                            placeholder="Adicione detalhes extras aqui..."
                            placeholderTextColor={theme.textSecondary}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>

                    <TouchableOpacity onPress={handleUpdate} disabled={isSaving} style={styles.buttonContainer}>
                         <LinearGradient
                            colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.saveButton}
                         >
                            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>SALVAR EDIÇÃO</Text>}
                         </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inactivateButton} onPress={handleInactivate} disabled={isSaving}>
                        <Ionicons name="trash-outline" size={20} color="#FF5252" />
                        <Text style={styles.inactivateButtonText}>EXCLUIR ASSINATURA</Text>
                    </TouchableOpacity>

                    <View style={{ height: 50 }} />
                    
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date" 
                        date={formData.firstChargeDate} 
                        onConfirm={handleConfirmDate}
                        onCancel={hideDatePicker}
                        textColor={theme.isDark ? "#fff" : "#000"}
                    />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default EdicaoAssinatura;