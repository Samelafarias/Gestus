import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { Subscription } from '../types/Subscription';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext'; 

const RECURRENCE_OPTIONS: Subscription['recurrence'][] = ['Mensal', 'Anual', 'Trimestral', 'Semestral'];
const CATEGORY_OPTIONS: Subscription['category'][] = ['Streaming', 'Música', 'Software', 'Educação', 'Outros'];

const AddAssinatura = () => {
    const navigation = useNavigation();
    const { add } = useSubscriptions();
    const { theme } = useTheme(); 

    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [recurrence, setRecurrence] = useState<Subscription['recurrence']>('Mensal');
    const [firstChargeDate, setFirstChargeDate] = useState(new Date());
    const [category, setCategory] = useState<Subscription['category']>('Streaming');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background, 
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 30, 
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            marginTop: 20,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.text,
        },
        content: {
            padding: 20,
            paddingBottom: 80, 
            marginTop: -6,
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
        },
        inputWrapperMultiline: {
            backgroundColor: theme.surface,
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 10,
            minHeight: 100,
            alignItems: 'flex-start',
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: theme.text,
        },
        inputDateDisplay: {
            flex: 1,
            fontSize: 16,
            color: theme.text,
        },
        buttonContainer: {
            marginTop: 30,
            borderRadius: 25,
            overflow: 'hidden',
        },
        button: {
            paddingVertical: 15,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff', 
            fontWeight: 'bold',
            fontSize: 16,
        },
    });

    const pickerStyles = StyleSheet.create({
        container: { marginTop: 15 },
        label: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 10,
            fontWeight: '600',
        },
        scrollContainer: {
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 10,
            paddingVertical: 5,
        },
        option: {
            backgroundColor: theme.surface,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 20,
            marginHorizontal: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedOption: { backgroundColor: theme.primary },
        optionText: {
            color: theme.text,
            fontWeight: '500',
        },
        selectedOptionText: { 
            color: '#fff',
            fontWeight: 'bold',
        },
    });

    // Funções de controle
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = (date: Date) => {
        setFirstChargeDate(date);
        hideDatePicker();
    };

    const handleAddSubscription = async () => {
        const numericValue = parseFloat(value.replace(',', '.'));
        if (!name || isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Erro', 'Por favor, preencha o Nome e um Valor válido.');
            return;
        }
        try {
            await add({
                name,
                value: numericValue,
                recurrence,
                firstChargeDate,
                category,
                paymentMethod: paymentMethod || 'Não informado',
                notes: notes || undefined,
            });
            Alert.alert('Sucesso', `${name} foi adicionada!`);
            navigation.goBack(); 
        } catch (error) {
            Alert.alert('Erro', 'Tente novamente.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Adicionar Nova Assinatura</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close-circle" size={30} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nome da Assinatura:</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Ex: Netflix"
                        placeholderTextColor={theme.textSecondary}
                        style={styles.input}
                        value={name}
                        onChangeText={setName} 
                    />                
                </View>

                <Text style={styles.label}>Valor (R$):</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Ex: 39,90"
                        placeholderTextColor={theme.textSecondary}
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                        keyboardType="numeric"
                    />       
                </View>
                
                <View style={pickerStyles.container}>
                    <Text style={pickerStyles.label}>Recorrência:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={pickerStyles.scrollContainer}>
                        {RECURRENCE_OPTIONS.map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[pickerStyles.option, recurrence === option && pickerStyles.selectedOption]}
                                onPress={() => setRecurrence(option)}
                            >
                                <Text style={[pickerStyles.optionText, recurrence === option && pickerStyles.selectedOptionText]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                <Text style={styles.label}>Data da Primeira Cobrança:</Text>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputDateDisplay}>{firstChargeDate.toLocaleDateString('pt-BR')}</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Ionicons name="calendar-outline" size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <View style={pickerStyles.container}>
                    <Text style={pickerStyles.label}>Categoria:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={pickerStyles.scrollContainer}>
                        {CATEGORY_OPTIONS.map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[pickerStyles.option, category === option && pickerStyles.selectedOption]}
                                onPress={() => setCategory(option)}
                            >
                                <Text style={[pickerStyles.optionText, category === option && pickerStyles.selectedOptionText]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <Text style={styles.label}>Notas / Observações (Opcional):</Text>
                <View style={styles.inputWrapperMultiline}>
                    <TextInput
                        placeholder="Detalhes extras..."
                        placeholderTextColor={theme.textSecondary}
                        style={[styles.input, { textAlignVertical: 'top' }]}
                        value={notes}
                        onChangeText={setNotes}
                        multiline={true}
                        numberOfLines={4}
                    />            
                </View>

                <TouchableOpacity onPress={handleAddSubscription} style={styles.buttonContainer}>
                    <LinearGradient
                        colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Adicionar Assinatura</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date" 
                    date={firstChargeDate} 
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    textColor={theme.isDark ? "#fff" : "#000"}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddAssinatura;