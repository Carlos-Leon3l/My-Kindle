import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import estilos, { cores } from '../estilos/estilos';

export function IconeBotao({ nome, rotulo, aoPressionar, ativo = false, cor = cores.verde }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={rotulo} accessibilityState={{ selected: ativo }} onPress={aoPressionar} style={({ pressed }) => [estilos.iconeBotao, pressed && estilos.pressionado]}><Ionicons name={nome} color={cor} size={22} /></Pressable>;
}

export function Botao({ texto, aoPressionar, secundario = false, desabilitado = false, icone }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: desabilitado }} disabled={desabilitado} onPress={aoPressionar} style={({ pressed }) => [estilos.botao, secundario && estilos.botaoSecundario, desabilitado && estilos.desabilitado, pressed && estilos.pressionado]}>{icone && <Ionicons name={icone} size={17} color={secundario ? cores.verde : '#FFFFFF'} />}<Text style={[estilos.textoBotao, secundario && estilos.textoBotaoSecundario]}>{texto}</Text></Pressable>;
}

export function CapaLivro({ livro, largura = 130 }) {
  const [falhou, definirFalhou] = useState(false);
  return <View style={[estilos.capa, { width: largura, height: largura * 1.5 }]}>{falhou ? <View style={[estilos.substituta, { backgroundColor: livro.cor }]}><Ionicons name="book-outline" size={24} color="#FFFFFFCC" /><Text numberOfLines={4} style={estilos.tituloCapa}>{livro.titulo}</Text><Text numberOfLines={2} style={estilos.autorCapa}>{livro.autor}</Text></View> : <Image accessibilityLabel={`Capa de ${livro.titulo}`} source={{ uri: livro.capa }} style={{ width: '100%', height: '100%' }} resizeMode="cover" onError={() => definirFalhou(true)} />}</View>;
}

export function Progresso({ valor }) {
  return <View accessibilityLabel={`${valor}% da amostra concluída`}><View style={estilos.trilho}><View style={[estilos.preenchimento, { width: `${valor}%` }]} /></View><Text style={estilos.pequeno}>{valor}% da amostra</Text></View>;
}

export function Busca({ valor, aoAlterar }) {
  return <View style={estilos.busca}><Ionicons name="search-outline" size={20} color={cores.suave} /><TextInput accessibilityLabel="Buscar por livro, autor ou assunto" placeholder="Livro, autor ou assunto" placeholderTextColor={cores.suave} value={valor} onChangeText={aoAlterar} style={estilos.entrada} autoCorrect={false} />{valor.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => aoAlterar('')} hitSlop={12}><Ionicons name="close-circle" size={20} color={cores.suave} /></Pressable>}</View>;
}

export function Filtros({ opcoes, selecionado, aoSelecionar }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.categorias}>{opcoes.map((opcao) => <Pressable accessibilityRole="button" accessibilityState={{ selected: selecionado === opcao }} key={opcao} onPress={() => aoSelecionar(opcao)} style={[estilos.filtro, selecionado === opcao && estilos.filtroAtivo]}><Text style={[estilos.textoFiltro, selecionado === opcao && estilos.textoFiltroAtivo]}>{opcao}</Text></Pressable>)}</ScrollView>;
}

export function Vazio({ titulo = 'Nenhum livro por aqui', descricao = 'Experimente outra busca ou escolha um novo filtro.' }) {
  return <View style={estilos.vazio}><Ionicons name="book-outline" size={38} color={cores.verde} /><Text style={estilos.forte}>{titulo}</Text><Text style={[estilos.pequeno, { textAlign: 'center' }]}>{descricao}</Text></View>;
}

export function CartaoLivro({ livro, aoPressionar }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${livro.titulo}`} onPress={aoPressionar} style={({ pressed }) => [estilos.cartaoLivro, pressed && estilos.pressionado]}><CapaLivro livro={livro} /><Text numberOfLines={2} style={estilos.tituloLivro}>{livro.titulo}</Text><Text numberOfLines={1} style={estilos.pequeno}>{livro.autor}</Text></Pressable>;
}
