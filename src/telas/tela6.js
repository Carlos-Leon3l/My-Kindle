import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao, Busca, IconeBotao, Vazio } from '../componentes/elementos';
import EditorAnotacao from '../componentes/editorAnotacao';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import { listarAnotacoes, normalizarTexto } from '../funcoes/biblioteca';
import estilos from '../estilos/estilos';

export default function Tela6({ route: rota, navigation: navegacao }) {
  const { biblioteca } = useBiblioteca();
  const [busca, definirBusca] = useState('');
  const [edicao, definirEdicao] = useState(null);
  const id = rota.params?.id;
  const anotacoes = listarAnotacoes(biblioteca).filter((item) => (!id || item.livro.id === id) && normalizarTexto(`${item.livro.titulo} ${item.nota} ${item.trecho}`).includes(normalizarTexto(busca.trim())));
  return (
    <SafeAreaView style={estilos.pagina}>
      <View style={estilos.topo}><IconeBotao nome="arrow-back" rotulo="Voltar" aoPressionar={() => navegacao.goBack()} /><Text style={estilos.etiqueta}>IDEIAS QUE FICAM</Text><View style={{ width: 44 }} /></View>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={[estilos.titulo, { marginTop: 0 }]}>Meu caderno</Text><Text style={estilos.subtitulo}>{id ? 'Destaques e notas desta leitura.' : 'Destaques e notas de toda a biblioteca.'}</Text>
        {id && <View style={{ marginTop: 14 }}><Botao texto="Ver todos os livros" secundario aoPressionar={() => navegacao.setParams({ id: null })} /></View>}
        <Busca valor={busca} aoAlterar={definirBusca} />
        {anotacoes.length ? anotacoes.map((item) => <View key={`${item.livro.id}:${item.chave}`} style={estilos.painel}>
          <Text style={estilos.etiqueta}>{item.livro.titulo}</Text><Text style={[estilos.pequeno, { marginTop: 6 }]}>Página {item.pagina + 1} · {item.destaque ? 'Destaque' : 'Anotação'}</Text>
          <Text style={[estilos.texto, estilos.trechoNota, item.destaque && { backgroundColor: '#F4DEA2' }]}>{item.trecho}</Text>
          {item.nota ? <Text style={estilos.texto}>{item.nota}</Text> : null}
          <View style={estilos.grupoBotoes}><Botao texto="Ir à página" icone="book-outline" aoPressionar={() => navegacao.navigate('Leitor', { id: item.livro.id, paginaInicial: item.pagina, salto: `${Date.now()}` })} /><Botao texto="Editar ou excluir" secundario icone="create-outline" aoPressionar={() => definirEdicao(item)} /></View>
        </View>) : <Vazio titulo="Seu caderno está em branco" descricao="Toque em um parágrafo no leitor para criar um destaque ou nota. Se estiver buscando, tente outro termo." />}
      </ScrollView>
      {edicao && <EditorAnotacao key={`${edicao.livro.id}:${edicao.chave}`} livro={edicao.livro} pagina={edicao.pagina} paragrafo={edicao.paragrafo} aoFechar={() => definirEdicao(null)} />}
    </SafeAreaView>
  );
}
