import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import { Botao } from './elementos';
import PainelLeitura from './painelLeitura';
import estilos, { cores } from '../estilos/estilos';

export default function EditorAnotacao({ livro, pagina, paragrafo, aoFechar }) {
  const { biblioteca, enviar } = useBiblioteca();
  const atual = biblioteca.anotacoes[livro.id]?.[`${pagina}:${paragrafo}`];
  const [nota, definirNota] = useState(atual?.nota || '');
  const [destaque, definirDestaque] = useState(atual?.destaque || false);
  function salvar(apagar = false) {
    enviar({ tipo: 'anotar', id: livro.id, pagina, paragrafo, nota: apagar ? '' : nota, destaque: apagar ? false : destaque });
    aoFechar();
  }
  return (
    <PainelLeitura titulo="Destaque e anotação" visivel aoFechar={aoFechar}>
      <Text style={estilos.etiqueta}>{livro.titulo} · PÁGINA {pagina + 1}</Text>
      <Text style={[estilos.texto, estilos.trechoNota]}>{livro.paginas[pagina].paragrafos[paragrafo]}</Text>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: destaque }} onPress={() => definirDestaque((anterior) => !anterior)} style={[estilos.linha, { paddingVertical: 16 }]}><Ionicons name={destaque ? 'checkbox' : 'square-outline'} color={cores.verde} size={25} /><Text style={estilos.texto}>Destacar este parágrafo</Text></Pressable>
      <Text style={estilos.forte}>Sua anotação</Text>
      <TextInput accessibilityLabel="Texto da anotação" multiline maxLength={2000} value={nota} onChangeText={definirNota} placeholder="O que você quer lembrar deste trecho?" placeholderTextColor={cores.suave} style={estilos.campoNota} textAlignVertical="top" />
      <Text style={estilos.pequeno}>{nota.length}/2000 caracteres</Text>
      <View style={estilos.grupoBotoes}><Botao texto="Salvar anotação" icone="checkmark" aoPressionar={() => salvar()} />{atual && <Botao texto="Excluir destaque e nota" secundario icone="trash-outline" aoPressionar={() => salvar(true)} />}<Botao texto="Cancelar" secundario aoPressionar={aoFechar} /></View>
    </PainelLeitura>
  );
}
