import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconeBotao } from './elementos';
import estilos from '../estilos/estilos';

export default function PainelLeitura({ titulo, visivel, aoFechar, children }) {
  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <KeyboardAvoidingView style={estilos.fundoModal} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar painel" style={estilos.fundoClique} onPress={aoFechar} />
        <SafeAreaView edges={['bottom']} style={estilos.painelModal}>
          <View style={estilos.topo}><Text accessibilityRole="header" style={[estilos.tituloSecao, estilos.flexivel]}>{titulo}</Text><IconeBotao nome="close" rotulo="Fechar painel" aoPressionar={aoFechar} /></View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: 0 }}>{children}</ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
