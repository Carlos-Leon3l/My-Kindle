import assert from 'node:assert/strict';
import { test as testar } from 'node:test';
import { livros } from '../src/dados/livros.js';
import { atualizarBiblioteca, calcularProgresso, estadoInicial, filtrarLivros } from '../src/funcoes/biblioteca.js';

const iniciar = () => structuredClone(estadoInicial);

testar('busca combina assunto, autor e título sem distinguir acentos ou maiúsculas', () => {
  assert.equal(filtrarLivros(livros, '  RAMALHO  ')[0].id, 'python');
  assert.ok(filtrarLivros(livros, 'programacao').length > 0);
  assert.equal(filtrarLivros(livros, 'Python', 'Dados')[0].id, 'analise');
  assert.equal(filtrarLivros(livros, 'inexistente').length, 0);
});

testar('salvar é idempotente e não modifica o estado anterior', () => {
  const anterior = iniciar();
  const novo = atualizarBiblioteca(anterior, { tipo: 'salvar', id: 'python' });
  assert.equal(anterior.salvos.includes('python'), false);
  assert.equal(novo.salvos.includes('python'), true);
  assert.equal(atualizarBiblioteca(novo, { tipo: 'salvar', id: 'python' }).salvos.filter((id) => id === 'python').length, 1);
});

testar('favoritar adiciona à biblioteca e pode ser desfeito', () => {
  const favorito = atualizarBiblioteca(iniciar(), { tipo: 'favoritar', id: 'python' });
  assert.ok(favorito.favoritos.includes('python'));
  assert.ok(favorito.salvos.includes('python'));
  assert.equal(atualizarBiblioteca(favorito, { tipo: 'favoritar', id: 'python' }).favoritos.length, 0);
});

testar('leitura limita páginas, registra último livro e mantém o ponto de retomada', () => {
  const leitura = atualizarBiblioteca(iniciar(), { tipo: 'ler', id: 'python', pagina: 2 });
  assert.equal(leitura.ultimoLivro, 'python');
  assert.equal(leitura.leituras.python.pagina, 2);
  assert.equal(calcularProgresso(leitura.leituras.python, 4), 50);
  assert.equal(atualizarBiblioteca(leitura, { tipo: 'ler', id: 'python', pagina: 90 }).leituras.python.pagina, 3);
  assert.equal(atualizarBiblioteca(leitura, { tipo: 'ler', id: 'python', pagina: -2 }).leituras.python.pagina, 0);
});

testar('somente concluir eleva a amostra a 100%, preservando conclusão na releitura', () => {
  const leitura = atualizarBiblioteca(iniciar(), { tipo: 'ler', id: 'python', pagina: 3 });
  assert.equal(calcularProgresso(leitura.leituras.python, 4), 75);
  const concluida = atualizarBiblioteca(leitura, { tipo: 'concluir', id: 'python' });
  assert.equal(calcularProgresso(concluida.leituras.python, 4), 100);
  assert.equal(atualizarBiblioteca(concluida, { tipo: 'ler', id: 'python', pagina: 0 }).leituras.python.concluido, true);
  assert.equal(calcularProgresso(undefined, 4), 0);
});

testar('marcação alterna uma página válida e rejeita índices inválidos', () => {
  const leitura = atualizarBiblioteca(iniciar(), { tipo: 'marcar', id: 'python', pagina: 2 });
  assert.deepEqual(leitura.marcadores.python, [2]);
  assert.deepEqual(atualizarBiblioteca(leitura, { tipo: 'marcar', id: 'python', pagina: 2 }).marcadores.python, []);
  assert.strictEqual(atualizarBiblioteca(leitura, { tipo: 'marcar', id: 'python', pagina: 8 }), leitura);
});

testar('remover limpa também progresso, marcadores, favorito e retomada', () => {
  let estado = iniciar();
  for (const acao of [{ tipo: 'favoritar' }, { tipo: 'ler', pagina: 1 }, { tipo: 'marcar', pagina: 1 }]) estado = atualizarBiblioteca(estado, { ...acao, id: 'python' });
  const removido = atualizarBiblioteca(estado, { tipo: 'remover', id: 'python' });
  assert.equal(removido.salvos.includes('python'), false);
  assert.equal(removido.favoritos.includes('python'), false);
  assert.equal(removido.leituras.python, undefined);
  assert.equal(removido.marcadores.python, undefined);
  assert.equal(removido.ultimoLivro, null);
});

testar('ações com livros desconhecidos não alteram a biblioteca', () => {
  const estado = iniciar();
  assert.strictEqual(atualizarBiblioteca(estado, { tipo: 'ler', id: 'ausente', pagina: 2 }), estado);
});

testar('destaque e nota podem ser criados, editados e removidos sem modificar a entrada', async () => {
  const { listarAnotacoes } = await import('../src/funcoes/biblioteca.js');
  const inicial = iniciar();
  let estado = atualizarBiblioteca(inicial, { tipo: 'anotar', id: 'python', pagina: 1, paragrafo: 0, nota: '  Revisar teste  ', destaque: true });
  assert.equal(inicial.anotacoes.python, undefined);
  assert.equal(estado.anotacoes.python['1:0'].nota, 'Revisar teste');
  assert.equal(listarAnotacoes(estado)[0].trecho, livros.find((livro) => livro.id === 'python').paginas[1].paragrafos[0]);
  assert.ok(estado.salvos.includes('python'));
  estado = atualizarBiblioteca(estado, { tipo: 'anotar', id: 'python', pagina: 1, paragrafo: 0, nota: 'Outra ideia', destaque: false });
  assert.equal(listarAnotacoes(estado).length, 1);
  assert.equal(estado.anotacoes.python['1:0'].destaque, false);
  estado = atualizarBiblioteca(estado, { tipo: 'anotar', id: 'python', pagina: 1, paragrafo: 0, nota: '', destaque: false });
  assert.deepEqual(listarAnotacoes(estado), []);
});

testar('anotações rejeitam parágrafos inválidos e limitam o tamanho da nota', () => {
  const inicial = iniciar();
  assert.strictEqual(atualizarBiblioteca(inicial, { tipo: 'anotar', id: 'python', pagina: 9, paragrafo: 0, nota: 'Inválida' }), inicial);
  assert.strictEqual(atualizarBiblioteca(inicial, { tipo: 'anotar', id: 'python', pagina: 1, paragrafo: -1, nota: 'Inválida' }), inicial);
  const estado = atualizarBiblioteca(inicial, { tipo: 'anotar', id: 'python', pagina: 1, paragrafo: 0, nota: 'x'.repeat(2200) });
  assert.equal(estado.anotacoes.python['1:0'].nota.length, 2000);
  assert.equal(atualizarBiblioteca(estado, { tipo: 'remover', id: 'python' }).anotacoes.python, undefined);
});

testar('busca dentro do livro localiza página e trecho sem distinguir acentos', async () => {
  const { buscarNaLeitura } = await import('../src/funcoes/biblioteca.js');
  const livro = livros.find((item) => item.id === 'python');
  const resultado = buscarNaLeitura(livro, 'FUNCOES');
  assert.ok(resultado.some((item) => item.pagina === 0 && item.paragrafo === 1));
  assert.equal(buscarNaLeitura(livro, '   ').length, 0);
  assert.equal(buscarNaLeitura(livro, 'zzzzzzzz').length, 0);
  assert.equal(buscarNaLeitura(livro, 'pensar antes')[0].pagina, 0);
});

testar('abrir leituras repetidas no mesmo dia não duplica estatísticas', () => {
  let estado = iniciar();
  estado = atualizarBiblioteca(estado, { tipo: 'diaLeitura', dia: '2026-11-01' });
  assert.strictEqual(atualizarBiblioteca(estado, { tipo: 'diaLeitura', dia: '2026-11-01' }), estado);
  assert.strictEqual(atualizarBiblioteca(estado, { tipo: 'diaLeitura', dia: '2026-02-30' }), estado);
  assert.strictEqual(atualizarBiblioteca(estado, { tipo: 'diaLeitura', dia: '01/11/2026' }), estado);
  assert.deepEqual(estado.diasLeitura, ['2026-11-01']);
});

testar('semana começa na segunda e separa o domingo anterior sem depender do fuso UTC', async () => {
  const { calcularEstatisticas, dataLocal } = await import('../src/funcoes/biblioteca.js');
  const estado = { ...iniciar(), diasLeitura: ['2026-11-01', '2026-11-02', '2026-11-04'] };
  const domingo = calcularEstatisticas(estado, new Date(2026, 10, 1, 23, 59));
  assert.equal(domingo.semana[0].data, '2026-10-26');
  assert.equal(domingo.diasSemana, 1);
  const segunda = calcularEstatisticas(estado, new Date(2026, 10, 2, 0, 1));
  assert.equal(segunda.semana[0].data, '2026-11-02');
  assert.equal(segunda.diasSemana, 2);
  assert.equal(segunda.diasTotal, 3);
  assert.equal(dataLocal(new Date(2026, 10, 2, 0, 1)), '2026-11-02');
});

testar('conclusões repetidas e releituras não inflam o total de amostras', async () => {
  const { calcularEstatisticas } = await import('../src/funcoes/biblioteca.js');
  let estado = iniciar();
  for (let indice = 0; indice < 4; indice += 1) estado = atualizarBiblioteca(estado, { tipo: 'concluir', id: 'python' });
  assert.equal(calcularEstatisticas(estado).concluidos, 1);
  assert.equal(calcularEstatisticas(atualizarBiblioteca(estado, { tipo: 'remover', id: 'python' })).concluidos, 0);
});

testar('meta e preferências são limitadas aos valores suportados', () => {
  let estado = atualizarBiblioteca(iniciar(), { tipo: 'meta', valor: 100 });
  assert.equal(estado.metaSemanal, 7);
  estado = atualizarBiblioteca(estado, { tipo: 'meta', valor: -3 });
  assert.equal(estado.metaSemanal, 1);
  estado = atualizarBiblioteca(estado, { tipo: 'preferencias', tema: 'Escuro', tamanho: 30 });
  assert.deepEqual(estado.preferencias, { tema: 'Escuro', tamanho: 27 });
  estado = atualizarBiblioteca(estado, { tipo: 'preferencias', tema: 'Inexistente', tamanho: 2 });
  assert.deepEqual(estado.preferencias, { tema: 'Escuro', tamanho: 15 });
});

testar('restauração mantém estado completo, dias, preferências, notas e marcadores', async () => {
  const { normalizarBiblioteca } = await import('../src/funcoes/biblioteca.js');
  let estado = iniciar();
  for (const acao of [
    { tipo: 'ler', id: 'python', pagina: 2 }, { tipo: 'favoritar', id: 'python' },
    { tipo: 'marcar', id: 'python', pagina: 2 }, { tipo: 'anotar', id: 'python', pagina: 2, paragrafo: 1, nota: 'Revisar', destaque: true },
    { tipo: 'preferencias', tema: 'Sépia', tamanho: 23 }, { tipo: 'meta', valor: 5 }, { tipo: 'diaLeitura', dia: '2026-11-02' },
  ]) estado = atualizarBiblioteca(estado, acao);
  assert.deepEqual(normalizarBiblioteca(JSON.parse(JSON.stringify(estado))), estado);
  assert.deepEqual(normalizarBiblioteca({ ...estado, salvos: [] }).salvos, []);
});

testar('restauração descarta IDs e páginas inválidas e migra o formato anterior', async () => {
  const { normalizarBiblioteca } = await import('../src/funcoes/biblioteca.js');
  const dados = { salvos: ['python', 'ausente', 'python'], favoritos: ['ausente', 'python'], leituras: { python: { pagina: 40, concluido: 'sim' } }, marcadores: { python: [-1, 1, 1, 10] }, anotacoes: { python: { '99:0': { nota: 'Inválida' }, '0:0': { nota: 'Válida', destaque: true } } }, diasLeitura: ['2026-02-30', '2026-11-02', '2026-11-02'], ultimoLivro: 'ausente' };
  const estado = normalizarBiblioteca(dados);
  assert.deepEqual(estado.salvos, ['python']);
  assert.deepEqual(estado.favoritos, ['python']);
  assert.deepEqual(estado.leituras.python, { pagina: 3, concluido: false });
  assert.deepEqual(estado.marcadores.python, [1]);
  assert.equal(estado.anotacoes.python['99:0'], undefined);
  assert.equal(estado.anotacoes.python['0:0'].nota, 'Válida');
  assert.equal(estado.metaSemanal, 3);
  assert.equal(estado.preferencias.tema, 'Claro');
  assert.equal(estado.ultimoLivro, null);
  assert.deepEqual(estado.diasLeitura, ['2026-11-02']);
});

testar('persistência recarrega dados em uma nova instância sem escrita durante o carregamento', async () => {
  const { criarPersistencia } = await import('../src/funcoes/persistencia.js');
  const dados = new Map();
  let escritas = 0;
  const armazenamento = { getItem: async (chave) => dados.get(chave) ?? null, setItem: async (chave, valor) => { escritas += 1; dados.set(chave, valor); } };
  const primeira = criarPersistencia(armazenamento);
  assert.deepEqual(await primeira.carregar(), iniciar());
  assert.equal(escritas, 0);
  const estado = atualizarBiblioteca(iniciar(), { tipo: 'ler', id: 'python', pagina: 2 });
  await primeira.salvar(estado);
  assert.deepEqual(await criarPersistencia(armazenamento).carregar(), estado);
  assert.equal(escritas, 1);
});

testar('escritas são serializadas para impedir que um estado antigo termine por último', async () => {
  const { criarPersistencia } = await import('../src/funcoes/persistencia.js');
  const ordem = [];
  let liberar;
  const espera = new Promise((resolver) => { liberar = resolver; });
  let chamadas = 0;
  let salvo;
  const armazenamento = { getItem: async () => null, setItem: async (_, texto) => {
    chamadas += 1;
    ordem.push(JSON.parse(texto).biblioteca.metaSemanal);
    if (chamadas === 1) await espera;
    salvo = texto;
  } };
  const servico = criarPersistencia(armazenamento);
  const primeira = servico.salvar({ ...iniciar(), metaSemanal: 2 });
  const segunda = servico.salvar({ ...iniciar(), metaSemanal: 5 });
  await new Promise((resolver) => setTimeout(resolver, 0));
  assert.deepEqual(ordem, [2]);
  liberar();
  await Promise.all([primeira, segunda]);
  assert.deepEqual(ordem, [2, 5]);
  assert.equal(JSON.parse(salvo).biblioteca.metaSemanal, 5);
});

testar('falhas de leitura e JSON corrompido são reportadas sem sobrescrever os dados', async () => {
  const { criarPersistencia } = await import('../src/funcoes/persistencia.js');
  let escritas = 0;
  const armazenamento = { getItem: async () => '{inválido', setItem: async () => { escritas += 1; } };
  await assert.rejects(criarPersistencia(armazenamento).carregar());
  await assert.rejects(criarPersistencia({ ...armazenamento, getItem: async () => JSON.stringify({ versao: 99, biblioteca: {} }) }).carregar());
  await assert.rejects(criarPersistencia({ ...armazenamento, getItem: async () => { throw new Error('Indisponível'); } }).carregar());
  assert.equal(escritas, 0);
});

testar('uma falha de escrita não bloqueia os salvamentos seguintes', async () => {
  const { criarPersistencia } = await import('../src/funcoes/persistencia.js');
  let tentativas = 0;
  const servico = criarPersistencia({ getItem: async () => null, setItem: async () => { if (++tentativas === 1) throw new Error('Sem espaço'); } });
  await assert.rejects(servico.salvar(iniciar()));
  await servico.salvar(iniciar());
  assert.equal(tentativas, 2);
});
