import { estadoInicial, normalizarBiblioteca } from './biblioteca.js';

export const chaveBiblioteca = '@entrelinhas/biblioteca-v1';

export function criarPersistencia(armazenamento) {
  let fila = Promise.resolve();
  return {
    async carregar() {
      const texto = await armazenamento.getItem(chaveBiblioteca);
      if (texto === null) return normalizarBiblioteca(estadoInicial);
      const pacote = JSON.parse(texto);
      if (pacote?.versao !== 1 || !pacote.biblioteca || typeof pacote.biblioteca !== 'object' || Array.isArray(pacote.biblioteca)) throw new Error('Biblioteca salva incompatível.');
      return normalizarBiblioteca(pacote.biblioteca);
    },
    salvar(biblioteca) {
      const texto = JSON.stringify({ versao: 1, biblioteca });
      fila = fila.catch(() => undefined).then(() => armazenamento.setItem(chaveBiblioteca, texto));
      return fila;
    },
  };
}
