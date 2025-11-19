// Frontend/src/routes/DrawerStack.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import CustomDrawerContent from '../components/CustomDrawerContent'; 
import { Ionicons } from '@expo/vector-icons'; 
import HomePage from '../pages/Home';
import ListaAssinaturas from '../pages/ListaAssinaturas';
// import EdicaoAssinaturas from '../pages/EdicaoAssinaturas';
// import AssinaturasInativas from '../pages/AssinaturasInativas';
// import Relatorio from '../pages/Relatorio';
// import Notificacoes from '../pages/Notificacoes';
// import Configuracoes from '../pages/Configuracoes';
// import AjudaSobre from '../pages/AjudaSobre';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
    return (
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            
            screenOptions={{
                drawerActiveTintColor: '#8B5CF6', 
                drawerInactiveTintColor: '#1e1e1e',
                drawerStyle: {
                    width: '80%', 
                    backgroundColor: '#fff', 
                    borderTopRightRadius: 30,
                    borderBottomRightRadius: 30,
                    overflow: 'hidden', 
                },

                drawerLabelStyle: {
                    marginLeft: 10, 
                    fontWeight: '600',
                    fontSize: 15,
                },

                headerShown: true,
                headerStyle: { backgroundColor: '#1e1e1e' },
                headerTintColor: '#fff',
            }}
        >
            <Drawer.Screen 
                name="HomePage" 
                component={HomePage}
                options={{
                    drawerLabel: 'Home', 
                    title: 'Visão Geral', 
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="ListaAssinaturas" 
                 component={ListaAssinaturas}
                options={{
                    drawerLabel: 'Lista de Assinaturas', 
                    title: 'Assinaturas',
                    drawerIcon: ({ color, size }) => (
                         <Ionicons name="list-outline" color={color} size={size} />
                    ),
                }}
            />
           
        </Drawer.Navigator>
    );
}