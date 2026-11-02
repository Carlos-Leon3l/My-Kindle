import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Botao, Filtros, IconeBotao, Vazio } from '../componentes/elementos';
import EditorAnotacao from '../componentes/editorAnotacao';
import PainelLeitura from '../componentes/painelLeitura';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import { livros } from '../dados/livros';
import { buscarNaLeitura, calcularProgresso, dataLocal, normalizarTexto } from '../funcoes/biblioteca';
import estilos from '../estilos/estilos';

const temas = {
  Claro: { fundo: '#FDFCF8', texto: '#202D29', suave: '#68746D', linha: '#E6E4DB' },
  Sépia: { fundo: '#F1E6CF', texto: '#483B2C', suave: '#74634E', linha: '#D6C7AD' },
  Escuro: { fundo: '#17221F', texto: '#E6ECE5', suave: '#A8BCB0', linha: '#34433C' },
};

export default function Tela4({ route: rota, navigation: navegacao }) {
  const livro = livros.find((item) => item.id === rota.params?.id);
  if (!livro) return <SafeAreaView style={estilos.pagina}><Vazio titulo="Amostra não encontrada" /><Botao texto="Voltar" aoPressionar={() => navegacao.goBack()} /></SafeAreaView>;
  return <LeituraLivro key={`${livro.id}:${rota.params?.salto || ''}`} livro={livro} paginaInicial={rota.params?.paginaInicial} navegacao={navegacao} />;
}

function LeituraLivro({ livro, paginaInicial, navegacao }) {
  const { biblioteca, enviar } = useBiblioteca();
  const [pagina, definirPagina] = useState(() => Number.isInteger(paginaInicial) && paginaInicial >= 0 && paginaInicial < livro.paginas.length ? paginaInicial : biblioteca.leituras[livro.id]?.pagina || 0);
  const [painel, definirPainel] = useState(null);
  const [busca, definirBusca] = useState('');
  const [paragrafoEditado, definirParagrafoEditado] = useState(null);
  const rolagem = useRef(null);
  const focado = useIsFocused();
  const { tamanho, tema } = biblioteca.preferencias;
  const paleta = temas[tema];
  const atual = livro.paginas[pagina];
  const resultados = buscarNaLeitura(livro, busca);
  const marcado = (biblioteca.marcadores[livro.id] || []).includes(pagina);
  const concluido = biblioteca.leituras[livro.id]?.concluido;
  useEffect(() => {
    enviar({ tipo: 'ler', id: livro.id, pagina });
    rolagem.current?.scrollTo({ y: 0, animated: false });
  }, [livro.id, pagina, enviar]);
  useFocusEffect(useCallback(() => {
    function registrarDia() {
      if (AppState.currentState === 'background' || AppState.currentState === 'inactive') return;
      if (Platform.OS === 'web' && document.hidden) return;
      enviar({ tipo: 'diaLeitura', dia: dataLocal() });
    }
    registrarDia();
    const intervalo = setInterval(registrarDia, 60000);
    const assinatura = AppState.addEventListener('change', (estado) => { if (estado === 'active') registrarDia(); });
    return () => { clearInterval(intervalo); assinatura.remove(); };
  }, [enviar]));
  function abrirPagina(indice) {
    definirPagina(indice);
    definirPainel(null);
    rolagem.current?.scrollTo({ y: 0, animated: false });
  }
  return (
    <SafeAreaView style={[estilos.paginaLeitor, { backgroundColor: paleta.fundo }]}>
      {focado && <StatusBar barStyle={tema === 'Escuro' ? 'light-content' : 'dark-content'} />}
      <View style={estilos.topo}>
        <IconeBotao nome="arrow-back" rotulo="Voltar ao livro" aoPressionar={() => navegacao.goBack()} />
        <Text numberOfLines={1} style={[estilos.pequeno, estilos.flexivel, { color: paleta.suave }]}>{livro.titulo}</Text>
        <IconeBotao nome={marcado ? 'bookmark' : 'bookmark-outline'} rotulo={marcado ? 'Remover marcação desta página' : 'Marcar esta página'} ativo={marcado} aoPressionar={() => enviar({ tipo: 'marcar', id: livro.id, pagina })} />
        <IconeBotao nome="text-outline" rotulo="Ajustes de leitura" aoPressionar={() => definirPainel('ajustes')} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={estilos.ferramentasLeitor}>
        <Botao texto="Sumário" icone="list-outline" secundario aoPressionar={() => definirPainel('sumario')} />
        <Botao texto="Buscar" icone="search-outline" secundario aoPressionar={() => definirPainel('busca')} />
        <Botao texto="Caderno" icone="create-outline" secundario aoPressionar={() => navegacao.navigate('Caderno', { id: livro.id })} />
      </ScrollView>
      <ScrollView ref={rolagem} style={estilos.flexivel} contentContainerStyle={estilos.conteudo}>
        <Text style={[estilos.etiqueta, { color: paleta.suave }]}>CADERNO DE ESTUDO · {pagina + 1} / {livro.paginas.length}</Text>
        <Text style={[estilos.tituloLeitor, { color: paleta.texto }]}>{atual.titulo}</Text>
        <Text style={[estilos.pequeno, { color: paleta.suave, marginBottom: 18 }]}>Toque em um parágrafo para destacar ou fazer uma anotação.</Text>
        {atual.paragrafos.map((paragrafo, indice) => {
          const anotacao = biblioteca.anotacoes[livro.id]?.[`${pagina}:${indice}`];
          const encontrado = busca.trim() && normalizarTexto(paragrafo).includes(normalizarTexto(busca.trim()));
          const destacado = anotacao?.destaque;
          return <Pressable key={`${pagina}:${indice}`} accessibilityRole="button" accessibilityLabel={`Anotar parágrafo ${indice + 1}${destacado ? ', destacado' : ''}${anotacao?.nota ? ', com nota' : ''}`} onPress={() => definirParagrafoEditado(indice)} style={[estilos.paragrafoInterativo, destacado && { backgroundColor: '#F4DEA2' }, !destacado && encontrado && { backgroundColor: tema === 'Escuro' ? '#2D4940' : '#DCEDE5' }]}>
            <Text style={[estilos.textoLeitor, { color: destacado ? '#3F3420' : paleta.texto, fontSize: tamanho, lineHeight: tamanho * 1.7, marginBottom: 0 }]}>{paragrafo}</Text>
            {anotacao?.nota ? <Text style={[estilos.pequeno, { color: destacado ? '#67532D' : paleta.suave, marginTop: 10 }]}>Nota: {anotacao.nota}</Text> : null}
          </Pressable>;
        })}
        <Text style={[estilos.pequeno, { color: paleta.suave, fontStyle: 'italic' }]}>Texto demonstrativo original do projeto. Não reproduz o conteúdo de {livro.titulo}.</Text>
        {concluido && <Text accessibilityLiveRegion="polite" style={[estilos.forte, { marginTop: 20, color: paleta.texto }]}>Amostra concluída. Que tal escolher sua próxima leitura?</Text>}
      </ScrollView>
      <View style={[estilos.rodapeLeitor, { borderTopColor: paleta.linha }]}>
        <View style={[estilos.distribuido, { marginBottom: 12 }]}><Text style={[estilos.pequeno, { color: paleta.suave }]}>Página {pagina + 1} de {livro.paginas.length}</Text><Text style={[estilos.pequeno, { color: paleta.suave }]}>{calcularProgresso(biblioteca.leituras[livro.id], livro.paginas.length)}% da amostra</Text></View>
        <View style={estilos.linha}><View style={estilos.flexivel}><Botao texto="Anterior" secundario desabilitado={pagina === 0} aoPressionar={() => definirPagina((anterior) => anterior - 1)} /></View><View style={estilos.flexivel}><Botao texto={pagina === livro.paginas.length - 1 ? (concluido ? 'Concluída' : 'Concluir') : 'Próxima'} desabilitado={pagina === livro.paginas.length - 1 && concluido} aoPressionar={() => pagina === livro.paginas.length - 1 ? enviar({ tipo: 'concluir', id: livro.id }) : definirPagina((anterior) => anterior + 1)} /></View></View>
      </View>
      <PainelLeitura titulo={painel === 'sumario' ? 'Sumário e marcadores' : painel === 'busca' ? 'Buscar nesta leitura' : 'Ajustes de leitura'} visivel={painel !== null} aoFechar={() => definirPainel(null)}>
        {painel === 'ajustes' && <>
          <View style={estilos.distribuido}><Text style={estilos.texto}>Tamanho da fonte</Text><View style={estilos.linha}><IconeBotao nome="remove" rotulo="Diminuir fonte" aoPressionar={() => enviar({ tipo: 'preferencias', tamanho: tamanho - 2 })} /><Text style={estilos.texto}>{tamanho}</Text><IconeBotao nome="add" rotulo="Aumentar fonte" aoPressionar={() => enviar({ tipo: 'preferencias', tamanho: tamanho + 2 })} /></View></View>
          <Filtros opcoes={Object.keys(temas)} selecionado={tema} aoSelecionar={(valor) => enviar({ tipo: 'preferencias', tema: valor })} /><Text style={estilos.pequeno}>Tema e tamanho ficam salvos para suas próximas leituras.</Text>
        </>}
        {painel === 'sumario' && <>
          <Text style={estilos.etiqueta}>SEÇÕES DA AMOSTRA</Text>
          {livro.paginas.map((secao, indice) => <Pressable key={indice} accessibilityRole="button" accessibilityState={{ selected: pagina === indice }} onPress={() => abrirPagina(indice)} style={estilos.itemPainel}><Text style={estilos.forte}>{indice + 1}. {secao.titulo}</Text><Text style={estilos.pequeno}>{pagina === indice ? 'Você está aqui' : `Ir para a página ${indice + 1}`}</Text></Pressable>)}
          <Text style={[estilos.etiqueta, { marginTop: 24 }]}>PÁGINAS MARCADAS</Text>
          {(biblioteca.marcadores[livro.id] || []).length ? [...biblioteca.marcadores[livro.id]].sort((a, b) => a - b).map((indice) => <Botao key={indice} texto={`Página ${indice + 1} · ${livro.paginas[indice].titulo}`} secundario aoPressionar={() => abrirPagina(indice)} />) : <Text style={[estilos.pequeno, { marginTop: 12 }]}>Use o ícone de marcador no topo para salvar uma página.</Text>}
        </>}
        {painel === 'busca' && <>
          <TextInput accessibilityLabel="Buscar palavra na amostra" value={busca} onChangeText={definirBusca} placeholder="Digite uma palavra ou expressão" placeholderTextColor="#68746D" style={estilos.campoBuscaLeitor} autoCorrect={false} />
          <Text accessibilityLiveRegion="polite" style={estilos.pequeno}>{busca.trim() ? `${resultados.length} páginas encontradas` : 'A busca considera os títulos e o texto das quatro páginas.'}</Text>
          {resultados.map((resultado) => <Pressable key={resultado.pagina} accessibilityRole="button" accessibilityLabel={`Abrir resultado na página ${resultado.pagina + 1}`} onPress={() => abrirPagina(resultado.pagina)} style={estilos.itemPainel}><Text style={estilos.forte}>Página {resultado.pagina + 1} · {resultado.titulo}</Text><Text numberOfLines={3} style={estilos.pequeno}>{resultado.trecho}</Text></Pressable>)}
          {busca.trim() && !resultados.length ? <Text style={[estilos.subtitulo, { marginVertical: 20 }]}>Nenhuma ocorrência. Tente outra palavra.</Text> : null}
          {busca && <Botao texto="Limpar busca" secundario aoPressionar={() => definirBusca('')} />}
        </>}
      </PainelLeitura>
      {paragrafoEditado !== null && <EditorAnotacao key={`${pagina}:${paragrafoEditado}`} livro={livro} pagina={pagina} paragrafo={paragrafoEditado} aoFechar={() => definirParagrafoEditado(null)} />}
    </SafeAreaView>
  );
}
