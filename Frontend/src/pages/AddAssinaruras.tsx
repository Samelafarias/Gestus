import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker"; 
import { Subscription } from '../types/Subscription';
import { useSubscriptions } from '../context/SubscriptionContext'; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30, 
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#282828',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
        paddingBottom: 80, 
        marginTop: -6,
    },
    label: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 5,
        marginTop: 15,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        backgroundColor: '#282828',
        borderRadius: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
    },
    inputDateDisplay: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
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
    subtitle: {
        fontSize: 16,
        color: '#fff',
    }
});

const pickerStyles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    label: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 10,
        fontWeight: '600',
    },
    scrollContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#8B5CF6',
        borderRadius: 10,
        paddingVertical: 5,
    },
    option: {
        backgroundColor: '#282828',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#8B5CF6', 
    },
    optionText: {
        color: '#fff',
        fontWeight: '500',
    },
    selectedOptionText: {
        fontWeight: 'bold',
    },
});


const RECURRENCE_OPTIONS: Subscription['recurrence'][] = ['Mensal', 'Anual', 'Trimestral', 'Semestral'];
const CATEGORY_OPTIONS: Subscription['category'][] = ['Streaming', 'Música', 'Software', 'Educação', 'Outros'];


const OptionPicker: React.FC<{
    label: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}> = ({ label, options, selectedValue, onSelect }) => (
    <View style={pickerStyles.container}>
        <Text style={pickerStyles.label}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={pickerStyles.scrollContainer}>
            {options.map(option => (
                <TouchableOpacity
                    key={option}
                    style={[
                        pickerStyles.option,
                        selectedValue === option && pickerStyles.selectedOption,
                    ]}
                    onPress={() => onSelect(option)}
                >
                    <Text
                        style={[
                            pickerStyles.optionText,
                            selectedValue === option && pickerStyles.selectedOptionText,
                        ]}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const AddAssinatura = () => {
    const navigation = useNavigation();
    const { add } = useSubscriptions();
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [recurrence, setRecurrence] = useState<Subscription['recurrence']>('Mensal');
    const [firstChargeDate, setFirstChargeDate] = useState(new Date());
    const [category, setCategory] = useState<Subscription['category']>('Streaming');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setFirstChargeDate(date);
        hideDatePicker();
    };

    const formatDateInput = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    const handleAddSubscription = async () => {
        const numericValue = parseFloat(value.replace(',', '.'));

        if (!name || isNaN(numericValue) || numericValue <= 0) {
            Alert.alert('Erro', 'Por favor, preencha o Nome e um Valor válido.');
            return;
        }

        try {
            const newSubscription: Omit<Subscription, 'id' | 'isActive'> = {
                name,
                value: numericValue,
                recurrence,
                firstChargeDate,
                category,
                paymentMethod: paymentMethod || undefined,
                notes: notes || undefined,
            };

            await add(newSubscription);

            Alert.alert('Sucesso', `${name} foi adicionada à sua lista de assinaturas!`);
            navigation.goBack(); 

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível adicionar a assinatura. Tente novamente.');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Adicionar Nova Assinatura</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close-circle" size={30} color="#8B5CF6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                <Text style={styles.label}>Nome da Assinatura:</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Ex: Netflix"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        value={name}
                        onChangeText={setName} />               
                </View>

                <Text style={styles.label}>Valor (R$):</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Ex: 39,90"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                        keyboardType={Platform.OS === 'android' ? 'numeric' : 'numbers-and-punctuation'}/>      
                </View>
                
                <OptionPicker
                    label="Recorrência:"
                    options={RECURRENCE_OPTIONS}
                    selectedValue={recurrence}
                    onSelect={setRecurrence as (v: string) => void}/>
                
                <Text style={styles.label}>Data da Primeira Cobrança:</Text>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputDateDisplay}>
                       {formatDateInput(firstChargeDate)}
                    </Text>

                    <TouchableOpacity onPress={showDatePicker}>
                        <Ionicons name="calendar-outline" size={24} color="#8B5CF6" />
                    </TouchableOpacity>
                </View>

                <OptionPicker
                    label="Categoria:"
                    options={CATEGORY_OPTIONS}
                    selectedValue={category}
                    onSelect={setCategory as (v: string) => void}/>
                
                <Text style={styles.label}>Forma de Pagamento (Opcional):</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Ex: Cartão de Crédito"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        value={paymentMethod}
                        onChangeText={setPaymentMethod} />            
                </View>

                <TouchableOpacity onPress={handleAddSubscription} style={styles.buttonContainer}>
                    <LinearGradient
                        colors={['#FF9800', '#8B5CF6', '#03A9F4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.button}>
                   
                        <Text style={styles.buttonText}>Adicionar Assinatura</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date" 
                    date={firstChargeDate} 
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    headerTextIOS="Selecione a Data"
                    cancelTextIOS="Cancelar"
                    confirmTextIOS="Confirmar"
                    pickerContainerStyleIOS={{ backgroundColor: '#282828' }}
                    textColor="#fff"
                />
            </ScrollView>
        </View>
    );
};


export default AddAssinatura;