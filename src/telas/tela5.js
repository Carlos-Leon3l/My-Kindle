import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Botao, IconeBotao } from '../componentes/elementos';
import { useBiblioteca } from '../contexto/contextoBiblioteca';
import estilos, { cores } from '../estilos/estilos';
import { calcularEstatisticas } from '../funcoes/biblioteca';

export default function Tela5({ navigation: navegacao }) {
  const { biblioteca, enviar, erroArmazenamento } = useBiblioteca();
  const [hoje, definirHoje] = useState(() => new Date());
  useFocusEffect(useCallback(() => {
    definirHoje(new Date());
    const intervalo = setInterval(() => definirHoje(new Date()), 60000);
    return () => clearInterval(intervalo);
  }, []));
  const estatisticas = calcularEstatisticas(biblioteca, hoje);
  const concluidos = estatisticas.concluidos;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={estilos.pagina}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.etiqueta}>LEITURA É CONSTRUÇÃO</Text><Text style={estilos.titulo}>Seu perfil leitor</Text>
        <View style={[estilos.linha, { marginTop: 24 }]}><View style={estilos.avatar}><Text style={{ color: '#FFFFFF', fontSize: 23, fontWeight: '600' }}>CL</Text></View><View style={estilos.flexivel}><Text style={estilos.forte}>Carlos Leonel</Text><Text style={estilos.pequeno}>Programação, dados e novas ideias.</Text></View></View>
        <View style={[estilos.painel, estilos.linha]}>{[[biblioteca.salvos.length, 'Na estante'], [biblioteca.favoritos.length, 'Favoritos'], [concluidos, 'Concluídas']].map(([valor, rotulo]) => <View key={rotulo} style={estilos.metrica}><Text style={estilos.numero}>{valor}</Text><Text style={estilos.pequeno}>{rotulo}</Text></View>)}</View>
        <View style={estilos.grupoBotoes}><Botao texto="Explorar minha biblioteca" icone="library-outline" aoPressionar={() => navegacao.navigate('Biblioteca')} /><Botao texto="Meu caderno de anotações" icone="create-outline" secundario aoPressionar={() => navegacao.navigate('Caderno')} /></View>
        <View style={estilos.painel}>
          <Text style={estilos.etiqueta}>SUA SEMANA DE LEITURA</Text>
          <Text style={[estilos.tituloSecao, { marginTop: 12 }]}>{estatisticas.diasSemana} de {biblioteca.metaSemanal} dias da meta</Text>
          <Text style={estilos.subtitulo}>Meta: abrir uma leitura em {biblioteca.metaSemanal} dias diferentes nesta semana.</Text>
          <View style={estilos.semana}>{estatisticas.semana.map((dia, indice) => <View key={dia.data} accessibilityLabel={`${dia.data}: ${dia.leu ? 'leitura registrada' : 'sem leitura'}`} style={[estilos.diaSemana, { backgroundColor: dia.leu ? cores.verde : cores.claro }]}><Text style={[estilos.pequeno, { color: dia.leu ? '#FFFFFF' : cores.suave }]}>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][indice]}</Text><Ionicons name={dia.leu ? 'checkmark' : 'remove'} size={14} color={dia.leu ? '#FFFFFF' : cores.suave} /></View>)}</View>
          <View style={estilos.distribuido}><Text style={estilos.forte}>Meta semanal</Text><View style={estilos.linha}><IconeBotao nome="remove" rotulo="Reduzir meta semanal" aoPressionar={() => enviar({ tipo: 'meta', valor: biblioteca.metaSemanal - 1 })} /><Text style={estilos.texto}>{biblioteca.metaSemanal}</Text><IconeBotao nome="add" rotulo="Aumentar meta semanal" aoPressionar={() => enviar({ tipo: 'meta', valor: biblioteca.metaSemanal + 1 })} /></View></View>
          <Text accessibilityLiveRegion="polite" style={[estilos.subtitulo, { color: cores.verde }]}>{estatisticas.diasSemana >= biblioteca.metaSemanal ? 'Meta da semana alcançada!' : `Faltam ${biblioteca.metaSemanal - estatisticas.diasSemana} dias para sua meta.`}</Text>
          <Text style={estilos.pequeno}>{estatisticas.diasTotal} dias de leitura registrados no total. A semana vai de segunda a domingo. Reabrir no mesmo dia não aumenta a contagem.</Text>
        </View>
        {erroArmazenamento ? <View accessibilityLiveRegion="polite" style={estilos.painel}><Text style={estilos.forte}>Atenção ao salvamento</Text><Text style={estilos.subtitulo}>{erroArmazenamento}</Text></View> : null}
        <View style={estilos.cabecalhoSecao}><Text style={estilos.tituloSecao}>Sobre o projeto</Text><Ionicons name="leaf-outline" color={cores.verde} size={24} /></View>
        <Text style={estilos.texto}>Entrelinhas Tech é uma biblioteca acadêmica inspirada na experiência do Kindle, dedicada a livros técnicos.</Text>
        <View style={estilos.painel}><Text style={estilos.forte}>Carlos Leonel</Text><Text style={estilos.subtitulo}>FATEC Itaquera{ '\n' }Desenvolvimento de Software Multiplataforma</Text></View>
        <View style={estilos.painel}><Text style={estilos.forte}>Nesta demonstração</Text><Text style={estilos.subtitulo}>Biblioteca, favoritos, progresso, anotações, marcadores, preferências e metas ficam salvos neste aparelho. No navegador, ficam associados ao armazenamento deste site. Limpar esses dados pode apagar a biblioteca. Não há sincronização entre aparelhos. As leituras são notas de estudo originais de quatro páginas, não os livros completos.</Text></View>
        <Text style={[estilos.pequeno, { marginTop: 24 }]}>Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.</Text>
        <Text style={[estilos.pequeno, { marginTop: 16 }]}>Sem vínculo com a Amazon. Capas fornecidas por URLs da Open Library; títulos e autores pertencem aos seus respectivos responsáveis.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
