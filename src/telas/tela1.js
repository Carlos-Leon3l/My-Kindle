import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Botao, Busca, CapaLivro, CartaoLivro, Filtros, IconeBotao, Progresso, Vazio } from '../componentes/elementos';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import { categorias, livros } from '../dados/livros';
import { calcularProgresso, filtrarLivros } from '../funcoes/biblioteca';
import estilos, { cores } from '../estilos/estilos';

export default function Tela1({ navigation: navegacao }) {
  const [busca, definirBusca] = useState('');
  const [categoria, definirCategoria] = useState('Todos');
  const { biblioteca } = useBiblioteca();
  const resultado = filtrarLivros(livros, busca, categoria);
  const continuar = livros.find((livro) => livro.id === biblioteca.ultimoLivro);
  const destaque = livros[0];
  const abrir = (livro) => navegacao.navigate('Detalhes', { id: livro.id });
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={estilos.pagina}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <View style={estilos.distribuido}><View><Text style={estilos.marca}>entrelinhas.</Text><Text style={[estilos.etiqueta, { marginTop: 5 }]}>EDIÇÃO TECH</Text></View><IconeBotao nome="person-outline" rotulo="Abrir perfil" aoPressionar={() => navegacao.navigate('Perfil')} /></View>
        <Text style={estilos.titulo}>Boas ideias começam{ '\n' }na próxima página.</Text>
        <Text style={estilos.subtitulo}>Sua estante de programação, dados e descobertas.</Text>
        <Busca valor={busca} aoAlterar={definirBusca} />
        <Filtros opcoes={categorias} selecionado={categoria} aoSelecionar={definirCategoria} />
        {!busca && categoria === 'Todos' && <>
          <View style={estilos.destaque}><View style={estilos.flexivel}><Text style={[estilos.etiqueta, { color: '#E2C994' }]}>ESCOLHA DA ESTANTE</Text><Text style={estilos.tituloDestaque}>Código melhor.{ '\n' }Uma ideia por vez.</Text><Text style={estilos.textoDestaque}>Uma leitura sobre o ofício de desenvolver software.</Text><Pressable accessibilityRole="button" accessibilityLabel="Explorar The Pragmatic Programmer" onPress={() => abrir(destaque)} style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}><Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>Explorar livro</Text><Ionicons name="arrow-forward" size={17} color="#FFFFFF" /></Pressable></View><CapaLivro livro={destaque} largura={92} /></View>
          {continuar && <View style={estilos.painel}><Text style={estilos.etiqueta}>RETOME SUA LEITURA</Text><Text style={[estilos.forte, { marginTop: 10 }]}>{continuar.titulo}</Text><Progresso valor={calcularProgresso(biblioteca.leituras[continuar.id], continuar.paginas.length)} /><View style={{ marginTop: 12 }}><Botao texto="Continuar lendo" icone="book-outline" aoPressionar={() => navegacao.navigate('Leitor', { id: continuar.id })} /></View></View>}
        </>}
        <View style={estilos.cabecalhoSecao}><Text style={estilos.tituloSecao}>{busca || categoria !== 'Todos' ? 'Sua seleção' : 'Explore a estante'}</Text><Text style={estilos.pequeno}>{resultado.length} livros</Text></View>
        {resultado.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.carrossel}>{resultado.map((livro) => <CartaoLivro key={livro.id} livro={livro} aoPressionar={() => abrir(livro)} />)}</ScrollView> : <Vazio />}
        <View style={[estilos.painel, estilos.linha]}><Ionicons name="sparkles-outline" size={26} color={cores.verde} /><View style={estilos.flexivel}><Text style={estilos.forte}>Um pouco a cada dia.</Text><Text style={estilos.pequeno}>Salve seus próximos livros e construa sua trilha de aprendizado.</Text></View></View>
        <Text style={[estilos.pequeno, { marginTop: 20, textAlign: 'center' }]}>Projeto acadêmico inspirado no Kindle.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
