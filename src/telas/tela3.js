import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao, CapaLivro, IconeBotao, Progresso, Vazio } from '../componentes/elementos';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import { livros } from '../dados/livros';
import { calcularProgresso } from '../funcoes/biblioteca';
import estilos from '../estilos/estilos';

export default function Tela3({ route: rota, navigation: navegacao }) {
  const { biblioteca, enviar } = useBiblioteca();
  const livro = livros.find((item) => item.id === rota.params?.id);
  if (!livro) return <SafeAreaView style={estilos.pagina}><Vazio titulo="Livro não encontrado" /><Botao texto="Voltar" aoPressionar={() => navegacao.goBack()} /></SafeAreaView>;
  const salvo = biblioteca.salvos.includes(livro.id);
  const favorito = biblioteca.favoritos.includes(livro.id);
  return (
    <SafeAreaView style={estilos.pagina}>
      <View style={estilos.topo}><IconeBotao nome="arrow-back" rotulo="Voltar" aoPressionar={() => navegacao.goBack()} /><Text style={estilos.etiqueta}>NA SUA PRÓXIMA PÁGINA</Text><IconeBotao nome={favorito ? 'heart' : 'heart-outline'} rotulo="Alternar favorito" ativo={favorito} aoPressionar={() => enviar({ tipo: 'favoritar', id: livro.id })} /></View>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.livroCentral}><CapaLivro livro={livro} largura={142} /></View>
        <Text style={estilos.tituloDetalhe}>{livro.titulo}</Text><Text style={[estilos.subtitulo, { textAlign: 'center' }]}>{livro.autor}</Text>
        <View style={[estilos.distribuido, { marginTop: 22 }]}><Text style={estilos.etiqueta}>{livro.categoria}</Text><Text style={estilos.pequeno}>4 páginas demonstrativas</Text></View>
        <View style={estilos.grupoBotoes}><Botao texto={biblioteca.leituras[livro.id] ? 'Continuar amostra' : 'Ler amostra'} icone="book-outline" aoPressionar={() => navegacao.navigate('Leitor', { id: livro.id })} /><Botao texto={salvo ? 'Remover da biblioteca' : 'Adicionar à biblioteca'} icone={salvo ? 'remove-circle-outline' : 'add-outline'} secundario aoPressionar={() => enviar({ tipo: salvo ? 'remover' : 'salvar', id: livro.id })} /></View>
        {salvo && <Text style={[estilos.pequeno, { marginTop: 12 }]}>Remover da biblioteca também apaga o progresso, os marcadores e as anotações deste livro.</Text>}
        {biblioteca.leituras[livro.id] && <View style={estilos.painel}><Text style={estilos.forte}>Seu ponto de leitura</Text><Progresso valor={calcularProgresso(biblioteca.leituras[livro.id], livro.paginas.length)} /><Text style={estilos.pequeno}>{(biblioteca.marcadores[livro.id] || []).length} páginas marcadas nesta amostra.</Text><View style={{ marginTop: 12 }}><Botao texto="Ver destaques e notas" secundario aoPressionar={() => navegacao.navigate('Caderno', { id: livro.id })} /></View></View>}
        <View style={estilos.separador} /><Text style={estilos.tituloSecao}>Sobre o livro</Text><Text style={estilos.subtitulo}>{livro.descricao}</Text>
        <View style={estilos.painel}><Text style={estilos.forte}>Uma experiência de leitura</Text><Text style={estilos.subtitulo}>A amostra deste aplicativo contém notas de estudo originais sobre {livro.categoria.toLowerCase()}. Não é um trecho nem uma reprodução do livro. O progresso corresponde somente às quatro páginas demonstrativas.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}
