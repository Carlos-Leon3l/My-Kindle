import { livros } from '../dados/livros.js';

export const estadoInicial = {
  salvos: ['pragmatico', 'analise'], favoritos: [], leituras: {}, marcadores: {}, ultimoLivro: null,
  anotacoes: {}, diasLeitura: [], metaSemanal: 3, preferencias: { tema: 'Claro', tamanho: 19 },
};

export function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function dataLocal(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

function diaValido(dia) {
  if (typeof dia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dia)) return false;
  const data = new Date(`${dia}T12:00:00`);
  return !Number.isNaN(data.getTime()) && dataLocal(data) === dia;
}

export function calcularEstatisticas(estado, hoje = new Date()) {
  const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 12);
  segunda.setDate(segunda.getDate() - (segunda.getDay() + 6) % 7);
  const semana = Array.from({ length: 7 }, (_, indice) => {
    const dia = new Date(segunda);
    dia.setDate(dia.getDate() + indice);
    return { data: dataLocal(dia), leu: estado.diasLeitura.includes(dataLocal(dia)) };
  });
  return { semana, diasSemana: semana.filter((dia) => dia.leu).length, diasTotal: estado.diasLeitura.length, concluidos: Object.values(estado.leituras).filter((leitura) => leitura.concluido).length };
}

export function buscarNaLeitura(livro, busca) {
  const termo = normalizarTexto(busca.trim());
  if (!termo) return [];
  return livro.paginas.flatMap((pagina, indice) => {
    const paragrafo = pagina.paragrafos.findIndex((texto) => normalizarTexto(texto).includes(termo));
    return paragrafo >= 0 || normalizarTexto(pagina.titulo).includes(termo)
      ? [{ pagina: indice, titulo: pagina.titulo, trecho: paragrafo >= 0 ? pagina.paragrafos[paragrafo] : pagina.titulo, paragrafo: paragrafo >= 0 ? paragrafo : null }]
      : [];
  });
}

export function listarAnotacoes(estado) {
  return livros.flatMap((livro) => Object.entries(estado.anotacoes[livro.id] || {}).map(([chave, anotacao]) => {
    const [pagina, paragrafo] = chave.split(':').map(Number);
    return { ...anotacao, livro, chave, pagina, paragrafo, trecho: livro.paginas[pagina].paragrafos[paragrafo] };
  }));
}

export function filtrarLivros(lista, busca = '', categoria = 'Todos') {
  const termo = normalizarTexto(busca.trim());
  return lista.filter((livro) => (categoria === 'Todos' || livro.categoria === categoria) && normalizarTexto(`${livro.titulo} ${livro.autor} ${livro.categoria}`).includes(termo));
}

export function calcularProgresso(leitura, quantidade) {
  if (!leitura || quantidade <= 0) return 0;
  return leitura.concluido ? 100 : Math.floor(leitura.pagina / quantidade * 100);
}

export function atualizarBiblioteca(estado, acao) {
  if (acao.tipo === 'restaurar') return normalizarBiblioteca(acao.dados);
  if (acao.tipo === 'meta') return { ...estado, metaSemanal: Math.max(1, Math.min(7, Math.round(Number(acao.valor) || 3))) };
  if (acao.tipo === 'preferencias') return { ...estado, preferencias: {
    tema: ['Claro', 'Sépia', 'Escuro'].includes(acao.tema) ? acao.tema : estado.preferencias.tema,
    tamanho: Number.isFinite(acao.tamanho) ? Math.max(15, Math.min(27, acao.tamanho)) : estado.preferencias.tamanho,
  } };
  if (acao.tipo === 'diaLeitura') return diaValido(acao.dia) && !estado.diasLeitura.includes(acao.dia)
    ? { ...estado, diasLeitura: [...estado.diasLeitura, acao.dia].sort() } : estado;
  const livro = livros.find((item) => item.id === acao.id);
  if (!livro) return estado;
  const adicionar = (lista) => lista.includes(acao.id) ? lista : [...lista, acao.id];
  const alternar = (lista, valor) => lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];
  switch (acao.tipo) {
    case 'salvar': return { ...estado, salvos: adicionar(estado.salvos) };
    case 'remover': {
      const leituras = { ...estado.leituras };
      const marcadores = { ...estado.marcadores };
      const anotacoes = { ...estado.anotacoes };
      delete leituras[acao.id];
      delete marcadores[acao.id];
      delete anotacoes[acao.id];
      return { ...estado, salvos: estado.salvos.filter((id) => id !== acao.id), favoritos: estado.favoritos.filter((id) => id !== acao.id), leituras, marcadores, anotacoes, ultimoLivro: estado.ultimoLivro === acao.id ? null : estado.ultimoLivro };
    }
    case 'favoritar': return { ...estado, salvos: adicionar(estado.salvos), favoritos: alternar(estado.favoritos, acao.id) };
    case 'ler': {
      const pagina = Math.max(0, Math.min(livro.paginas.length - 1, Math.floor(Number(acao.pagina) || 0)));
      return { ...estado, salvos: adicionar(estado.salvos), ultimoLivro: acao.id, leituras: { ...estado.leituras, [acao.id]: { pagina, concluido: estado.leituras[acao.id]?.concluido || false } } };
    }
    case 'concluir': return { ...estado, salvos: adicionar(estado.salvos), ultimoLivro: acao.id, leituras: { ...estado.leituras, [acao.id]: { pagina: livro.paginas.length - 1, concluido: true } } };
    case 'marcar': {
      if (!Number.isInteger(acao.pagina) || acao.pagina < 0 || acao.pagina >= livro.paginas.length) return estado;
      return { ...estado, marcadores: { ...estado.marcadores, [acao.id]: alternar(estado.marcadores[acao.id] || [], acao.pagina) } };
    }
    case 'anotar': {
      if (!Number.isInteger(acao.pagina) || !Number.isInteger(acao.paragrafo) || !livro.paginas[acao.pagina]?.paragrafos[acao.paragrafo]) return estado;
      const chave = `${acao.pagina}:${acao.paragrafo}`;
      const anotacoesLivro = { ...estado.anotacoes[acao.id] };
      const nota = typeof acao.nota === 'string' ? acao.nota.trim().slice(0, 2000) : '';
      if (acao.destaque || nota) anotacoesLivro[chave] = { destaque: Boolean(acao.destaque), nota };
      else delete anotacoesLivro[chave];
      return { ...estado, salvos: adicionar(estado.salvos), anotacoes: { ...estado.anotacoes, [acao.id]: anotacoesLivro } };
    }
    default: return estado;
  }
}

export function normalizarBiblioteca(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return JSON.parse(JSON.stringify(estadoInicial));
  const idsValidos = (lista) => Array.isArray(lista) ? [...new Set(lista.filter((id) => livros.some((livro) => livro.id === id)))] : [];
  let estado = { ...estadoInicial, salvos: idsValidos(dados.salvos), favoritos: [], leituras: {}, marcadores: {}, anotacoes: {}, diasLeitura: [], ultimoLivro: null };
  for (const livro of livros) {
    if (!estado.salvos.includes(livro.id)) continue;
    const leitura = dados.leituras?.[livro.id];
    if (leitura && Number.isInteger(leitura.pagina)) estado.leituras[livro.id] = { pagina: Math.max(0, Math.min(livro.paginas.length - 1, leitura.pagina)), concluido: leitura.concluido === true };
    const marcadores = dados.marcadores?.[livro.id];
    if (Array.isArray(marcadores)) estado.marcadores[livro.id] = [...new Set(marcadores.filter((pagina) => Number.isInteger(pagina) && pagina >= 0 && pagina < livro.paginas.length))];
    const anotacoes = dados.anotacoes?.[livro.id];
    if (anotacoes && typeof anotacoes === 'object') {
      for (const [chave, anotacao] of Object.entries(anotacoes)) {
        if (!/^\d+:\d+$/.test(chave) || !anotacao || typeof anotacao !== 'object') continue;
        const [pagina, paragrafo] = chave.split(':').map(Number);
        estado = atualizarBiblioteca(estado, { tipo: 'anotar', id: livro.id, pagina, paragrafo, nota: anotacao.nota, destaque: anotacao.destaque === true });
      }
    }
  }
  estado.favoritos = idsValidos(dados.favoritos).filter((id) => estado.salvos.includes(id));
  estado.ultimoLivro = Object.prototype.hasOwnProperty.call(estado.leituras, dados.ultimoLivro) ? dados.ultimoLivro : null;
  estado.diasLeitura = Array.isArray(dados.diasLeitura) ? [...new Set(dados.diasLeitura.filter(diaValido))].sort() : [];
  estado = atualizarBiblioteca(estado, { tipo: 'meta', valor: dados.metaSemanal });
  return atualizarBiblioteca(estado, { tipo: 'preferencias', tema: dados.preferencias?.tema, tamanho: dados.preferencias?.tamanho });
}
