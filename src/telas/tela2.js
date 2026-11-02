import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Busca, CapaLivro, Filtros, IconeBotao, Progresso, Vazio } from '../componentes/elementos';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import { livros } from '../dados/livros';
import { calcularProgresso, filtrarLivros } from '../funcoes/biblioteca';
import estilos from '../estilos/estilos';

export default function Tela2({ navigation: navegacao }) {
  const { biblioteca, enviar } = useBiblioteca();
  const [busca, definirBusca] = useState('');
  const [filtro, definirFiltro] = useState('Todos');
  const selecionados = livros.filter((livro) => biblioteca.salvos.includes(livro.id)).filter((livro) => {
    if (filtro === 'Favoritos') return biblioteca.favoritos.includes(livro.id);
    if (filtro === 'Lendo') return biblioteca.leituras[livro.id] && !biblioteca.leituras[livro.id].concluido;
    if (filtro === 'Concluídos') return biblioteca.leituras[livro.id]?.concluido;
    return true;
  });
  const resultado = filtrarLivros(selecionados, busca);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={estilos.pagina}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.etiqueta}>SEU ESPAÇO DE LEITURA</Text><Text style={estilos.titulo}>Minha biblioteca</Text><Text style={estilos.subtitulo}>{biblioteca.salvos.length} livros salvos. Muitas ideias para descobrir.</Text>
        <Busca valor={busca} aoAlterar={definirBusca} /><Filtros opcoes={['Todos', 'Lendo', 'Favoritos', 'Concluídos']} selecionado={filtro} aoSelecionar={definirFiltro} />
        {resultado.length ? resultado.map((livro) => <View key={livro.id} style={estilos.itemLista}><Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${livro.titulo}`} onPress={() => navegacao.navigate('Detalhes', { id: livro.id })}><CapaLivro livro={livro} largura={72} /></Pressable><View style={estilos.flexivel}><Text style={estilos.etiqueta}>{livro.categoria}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Detalhes de ${livro.titulo}`} onPress={() => navegacao.navigate('Detalhes', { id: livro.id })}><Text style={[estilos.forte, { marginTop: 5 }]}>{livro.titulo}</Text></Pressable><Text style={estilos.pequeno}>{livro.autor}</Text><Progresso valor={calcularProgresso(biblioteca.leituras[livro.id], livro.paginas.length)} /></View><IconeBotao nome={biblioteca.favoritos.includes(livro.id) ? 'heart' : 'heart-outline'} rotulo={`Alternar favorito: ${livro.titulo}`} ativo={biblioteca.favoritos.includes(livro.id)} aoPressionar={() => enviar({ tipo: 'favoritar', id: livro.id })} /></View>) : <Vazio descricao="Salve livros na tela inicial ou experimente outro filtro." />}
      </ScrollView>
    </SafeAreaView>
  );
}
