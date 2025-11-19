import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps,} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; 

const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 50, 
    justifyContent: 'space-between',
    marginBottom: 10,
},
headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1e1e1e', 
    marginTop: 4,
},
footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
},
logoutButton: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingVertical: 10,
     paddingHorizontal: 5,
},
logoutText: { 
    fontSize: 16,
    marginLeft: 15, 
    color: '#8B5CF6', 
    fontWeight: 'bold',
        },
 });

const innerStyles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        borderTopRightRadius: 30, 
        borderBottomRightRadius: 30,
        overflow: 'hidden', 
    },
    innerWhiteView: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 2, 
        borderTopRightRadius: 28, 
        borderBottomRightRadius: 28,
        overflow: 'hidden',
    },
});

export default function CustomDrawerContent(props: DrawerContentComponentProps) {

 const handleLogout = () => {
 props.navigation.dispatch(
  CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }], 
  })
 );
 };

  return (
    <LinearGradient
        colors={['#FF9800', '#8B5CF6', '#03A9F4']}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        style={innerStyles.gradientContainer}
    >
        <View style={innerStyles.innerWhiteView}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerText}>Menu</Text>
                </View>
                <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                    <Ionicons name="close-circle-outline" size={30} color="#8B5CF6" /> 
                </TouchableOpacity>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#8B5CF6" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    </LinearGradient>
  );
}