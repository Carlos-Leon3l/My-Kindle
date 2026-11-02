import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atualizarBiblioteca, estadoInicial } from '../funcoes/biblioteca';
import { criarPersistencia } from '../funcoes/persistencia';
import estilos from '../estilos/estilos';

const ContextoBiblioteca = createContext(null);

export function ProvedorBiblioteca({ children }) {
  const [biblioteca, enviar] = useReducer(atualizarBiblioteca, estadoInicial);
  const [pronto, definirPronto] = useState(false);
  const [podeSalvar, definirPodeSalvar] = useState(false);
  const [erroArmazenamento, definirErroArmazenamento] = useState('');
  const persistencia = useMemo(() => criarPersistencia(AsyncStorage), []);
  const revisao = useRef(0);
  useEffect(() => {
    let ativo = true;
    persistencia.carregar().then((dados) => {
      if (!ativo) return;
      enviar({ tipo: 'restaurar', dados });
      definirPodeSalvar(true);
      definirPronto(true);
    }).catch(() => {
      if (!ativo) return;
      definirErroArmazenamento('Não foi possível recuperar a biblioteca. Esta sessão não será salva para preservar os dados anteriores. Tente reabrir o aplicativo.');
      definirPronto(true);
    });
    return () => { ativo = false; };
  }, [persistencia]);
  useEffect(() => {
    if (!pronto || !podeSalvar) return undefined;
    let ativo = true;
    const atual = ++revisao.current;
    persistencia.salvar(biblioteca).then(() => {
      if (ativo && atual === revisao.current) definirErroArmazenamento('');
    }).catch(() => {
      if (ativo && atual === revisao.current) definirErroArmazenamento('A última alteração não pôde ser salva no aparelho. As próximas alterações tentarão salvar novamente.');
    });
    return () => { ativo = false; };
  }, [biblioteca, pronto, podeSalvar, persistencia]);
  const valor = useMemo(() => ({ biblioteca, enviar, erroArmazenamento }), [biblioteca, erroArmazenamento]);
  if (!pronto) return <View style={[estilos.pagina, { justifyContent: 'center', alignItems: 'center', gap: 16 }]}><ActivityIndicator color="#245C50" /><Text style={estilos.texto}>Abrindo sua biblioteca…</Text></View>;
  return <ContextoBiblioteca.Provider value={valor}>{children}</ContextoBiblioteca.Provider>;
}

export function useBiblioteca() {
  return useContext(ContextoBiblioteca);
}
