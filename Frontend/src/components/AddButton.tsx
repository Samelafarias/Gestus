import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 

const ADD_ASSINATURA_ROUTE_NAME = 'AddAssinatura'; 

const GRADIENT_COLORS = ['#FF9800', '#8B5CF6', '#03A9F4'];

const AddButton: React.FC = () => {
 const navigation = useNavigation();

 const handlePress = () => {
   navigation.navigate(ADD_ASSINATURA_ROUTE_NAME as never);
 };

 return (

   <TouchableOpacity 
   style={styles.fabContainer} 
   onPress={handlePress}
   >

        <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }}
            style={styles.gradient} 
        >
            <Ionicons name="add-outline" size={30} color="#fff" />
        </LinearGradient>
   </TouchableOpacity>
 );
};

const styles = StyleSheet.create({
 fabContainer: {
   position: 'absolute',
   bottom: 30,
   right: 30, 
   width: 60,
   height: 60,
   borderRadius: 30,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.3,
   shadowRadius: 4.65,
   elevation: 8,
 },
  gradient: {
    flex: 1, 
    width: '100%',
    height: '100%',
    borderRadius: 30, 
    justifyContent: 'center',
   alignItems: 'center',
  },
});

export default AddButton;