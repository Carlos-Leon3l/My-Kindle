import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationIndependentTree, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProvedorBiblioteca } from './src/contexto/contextoBiblioteca';
import Tela1 from './src/telas/tela1';
import Tela2 from './src/telas/tela2';
import Tela3 from './src/telas/tela3';
import Tela4 from './src/telas/tela4';
import Tela5 from './src/telas/tela5';
import Tela6 from './src/telas/tela6';

const Pilha = createNativeStackNavigator();
const Abas = createBottomTabNavigator();
const tema = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: '#245C50', background: '#F7F5EF', card: '#FDFCF8', border: '#E6E4DB' } };

function NavegacaoPrincipal() {
  return (
    <Abas.Navigator screenOptions={({ route: rota }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#245C50',
      tabBarInactiveTintColor: '#797E77',
      tabBarStyle: { backgroundColor: '#FDFCF8', borderTopColor: '#E6E4DB' },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused: selecionado, color: cor, size: tamanho }) => {
        const icones = { Inicio: 'home', Biblioteca: 'library', Perfil: 'person-circle' };
        return <Ionicons name={`${icones[rota.name]}${selecionado ? '' : '-outline'}`} color={cor} size={tamanho} />;
      },
    })}>
      <Abas.Screen name="Inicio" component={Tela1} options={{ title: 'Início' }} />
      <Abas.Screen name="Biblioteca" component={Tela2} />
      <Abas.Screen name="Perfil" component={Tela5} />
    </Abas.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ProvedorBiblioteca>
        <NavigationIndependentTree>
          <NavigationContainer theme={tema}>
            <Pilha.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Pilha.Screen name="Principal" component={NavegacaoPrincipal} />
              <Pilha.Screen name="Detalhes" component={Tela3} />
              <Pilha.Screen name="Leitor" component={Tela4} />
              <Pilha.Screen name="Caderno" component={Tela6} />
            </Pilha.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </ProvedorBiblioteca>
    </SafeAreaProvider>
  );
}
