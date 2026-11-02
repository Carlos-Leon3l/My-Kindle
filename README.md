# Entrelinhas Tech

Aplicativo acadêmico de React Native inspirado na experiência de biblioteca e leitura do Kindle. Tema: programação, dados e arquitetura de software. Autor: Carlos Leonel, FATEC Itaquera, Desenvolvimento de Software Multiplataforma.

## Telas e funcionalidades

| Arquivo | Tela | Funcionalidades |
| --- | --- | --- |
| `src/telas/tela1.js` | Início | Catálogo de seis livros, busca por título/autor/assunto, filtros de categoria, destaque e retomada da última leitura. |
| `src/telas/tela2.js` | Biblioteca | Livros salvos, busca, favoritos e filtros Todos/Lendo/Favoritos/Concluídos. |
| `src/telas/tela3.js` | Detalhes | Capa, descrição, autor, adicionar/remover da biblioteca, favoritar, progresso e acesso à amostra. |
| `src/telas/tela4.js` | Leitor | Busca dentro da amostra, sumário, marcadores, destaques e notas por parágrafo, navegação, conclusão e preferências de fonte/tema salvas. |
| `src/telas/tela5.js` | Perfil | Meta semanal ajustável, calendário da semana, dias de leitura, amostras concluídas, acesso ao caderno e créditos. |
| `src/telas/tela6.js` | Caderno | Destaques e notas da biblioteca ou de um livro, busca, edição, exclusão e retorno à página anotada. |

React Navigation organiza três abas com ícones (Início, Biblioteca e Perfil) e três telas em pilha (Detalhes, Leitor e Caderno). O layout usa fundo de papel, títulos serifados, verde escuro e capas em destaque. Conteúdos e controles podem ser rolados em telas menores.

O estado é compartilhado por Context API e `useReducer`. O hook personalizado chama-se `useBiblioteca`, respeitando o prefixo obrigatório `use`. Funções, variáveis e arquivos usam nomes em português. Componentes começam com maiúscula e o código não possui comentários.

## Dados e leituras

O catálogo contém livros reais com imagens remotas de capa. As descrições curtas foram redigidas para o projeto. As páginas do leitor são notas de estudo originais sobre a categoria escolhida: **não são trechos nem o conteúdo integral dos livros**. Livros da mesma categoria compartilham o mesmo caderno demonstrativo de quatro páginas.

O progresso refere-se somente à amostra: abrir a primeira página marca 0%; chegar à última marca 75%; tocar em Concluir marca 100%. A conclusão permanece registrada ao revisitar páginas. Remover um livro limpa seu progresso, marcadores, anotações e favorito; o aviso também aparece nos detalhes antes da remoção. Favoritar um livro também o adiciona à biblioteca.

Dois livros começam salvos na primeira abertura. Biblioteca, favoritos, progresso, marcadores, destaques, notas, preferências, meta e dias de leitura são persistidos no aparelho com AsyncStorage. No preview web, o armazenamento pertence à origem do site; limpar os dados do navegador, reinstalar o aplicativo ou trocar o ambiente pode remover esses dados. Não há autenticação, compras, download de e-books, acesso a contas Amazon ou sincronização entre aparelhos.

## Recursos adicionais aprovados

- **Destaques e notas:** toque em qualquer parágrafo no leitor, marque a opção de destaque e/ou escreva uma nota de até 2.000 caracteres. Salvar aplica a mudança; Cancelar descarta a edição; Excluir destaque e nota remove os dois. A seleção é por parágrafo, não por intervalo arbitrário de palavras.
- **Caderno:** acessível pelo perfil, pelos detalhes e pelo leitor. A abertura a partir de um livro filtra suas anotações; Ver todos os livros remove o filtro. A busca considera título do livro, trecho e nota. Ir à página abre a seção correspondente, inclusive em outro livro.
- **Busca na leitura:** acessível pelo botão Buscar. Pesquisa títulos e parágrafos sem distinguir acentos ou maiúsculas. Cada resultado representa uma página, com título e um trecho. Ao abri-lo, a página é exibida e parágrafos correspondentes recebem uma indicação temporária. Limpar busca remove essa indicação.
- **Sumário e marcadores:** Sumário lista as quatro seções e as páginas marcadas, com navegação direta. O marcador no topo continua alternando a marcação da página atual.
- **Ajustes:** o botão de texto no topo abre o painel de tema e fonte. Essas preferências são compartilhadas entre livros e preservadas ao reabrir.
- **Meta e estatísticas:** no perfil, a meta pode variar de 1 a 7 dias por semana, começando em 3. Abrir o leitor em primeiro plano registra a data local uma única vez. O leitor também verifica mudanças de dia enquanto permanece aberto e ao voltar do segundo plano. A semana vai de segunda a domingo. Não há estimativa de minutos de leitura. O total de amostras concluídas corresponde aos livros ainda na biblioteca; remover um deles reduz esse total, mas não apaga o histórico dos dias em que o leitor foi usado.

### Persistência

A biblioteca é carregada antes da montagem das telas; o estado inicial não é gravado enquanto o carregamento não termina. O pacote salvo tem versão 1 e utiliza a chave `@entrelinhas/biblioteca-v1`. A restauração valida IDs de livros, páginas, parágrafos e preferências. As gravações são serializadas para evitar que uma operação antiga sobrescreva uma mais recente.

Se o carregamento falhar ou o pacote estiver corrompido/incompatível, a sessão abre com dados provisórios, não sobrescreve o armazenamento anterior e exibe um aviso no perfil. Se uma gravação falhar, o perfil também informa; a próxima alteração tenta salvar novamente. O aplicativo não solicita dados de uma conta Amazon.

## Importar no Snack Expo SDK 54

1. Extraia `../entregaveis/entrelinhasTechCodigo.zip` no computador.
2. Coloque o conteúdo extraído em um repositório GitHub usando a interface web. Mantenha `App.js`, `index.js`, `package.json` e `src` na raiz do repositório.
3. Importe esse repositório no Snack Expo e selecione SDK 54. Também é possível transferir os arquivos manualmente preservando a estrutura.
4. Confira as dependências do `package.json`, execute o preview e valide as telas no dispositivo.
5. Salve o Snack e entregue seu link compartilhável no Teams.

Não existe pasta `assets` nem diretório `.git` neste aplicativo ou no ZIP. As capas são carregadas por URLs HTTPS definidas em `src/dados/livros.js`, usando a API de capas da Open Library por ISBN. Não é necessário enviar imagens para o Snack. Se uma capa falhar, aparece uma representação com título e autor. O catálogo e as notas demonstrativas são locais e continuam acessíveis sem conexão; as imagens de capa dependem do provedor externo.

Os ícones usam Ionicons de `@expo/vector-icons`, como biblioteca de dependência. As fontes dos ícones são administradas pelo Expo; não são arquivos de assets adicionados ao projeto.

O componente principal é exportado em `App.js`. `index.js` registra esse componente no Expo e também o exporta por padrão para compatibilidade com o carregador do Snack.

## Execução local

Com Node.js 20.19 ou superior e acesso ao npm:

```bash
npm install
npm run web
```

As dependências declaram Expo `~54.0.37`, React `19.1.0`, React Native `0.81.5`, React Native Web `~0.21.0`, Metro Runtime `~6.1.2`, React Navigation Native `^7.5.0`, Native Stack `^7.20.0`, Bottom Tabs `^7.20.0`, Vector Icons `^15.0.3`, Safe Area Context `~5.6.0` e Screens `~4.16.0`. A nova dependência é `@react-native-async-storage/async-storage` na versão **`2.2.0`**, compatível com os metadados locais do Expo SDK 54. No Snack já existente, atualize também o `package.json` ou adicione essa dependência pelo painel de dependências.

## Verificação realizada

- `npm test`: **21 testes passaram**. Além dos oito casos anteriores, cobrem destaques/notas, edição/exclusão, busca dentro do texto, dias duplicados, limites da semana, metas e preferências, restauração completa, dados inválidos, ordem de gravação, leitura corrompida e recuperação após falha de escrita. Os testes de persistência usam um armazenamento em memória que implementa a interface getItem/setItem, não um aparelho real.
- Os 17 arquivos JavaScript foram analisados quanto à sintaxe, importações locais e ausência de comentários. As 37 chamadas de hooks têm funções com nomes reconhecidos pelo padrão do React. Essa análise não substitui uma execução completa do ESLint do Snack.
- O lockfile existente foi atualizado para incluir AsyncStorage e suas duas dependências, usando metadados oficiais do registro npm e conferindo a integridade SHA-512 dos pacotes baixados.
- A exportação web pelo Expo/Metro passou em uma cópia temporária. A instalação completa via npm falhou porque o ambiente não resolveu `registry.npmjs.org`.
- Para a compilação temporária foram usadas bibliotecas já presentes nos projetos anteriores: Expo 54.0.37, React 19.1, RN 0.81.5, Vector Icons 15.1.1 e Bottom Tabs 7.20.0. Safe Area Context 4.12.0, Screens 4.4.0 e Metro Runtime 4.0.1 foram usados apenas nesse ambiente de verificação, diferentes das versões declaradas para a entrega. As substituições não estão no ZIP. Nesta atualização foi utilizada também a implementação real do AsyncStorage 2.2.0, com merge-options 3.0.4 e is-plain-obj 2.1.0, baixadas do registro npm para o ambiente temporário.
- O Chromium não conseguiu iniciar por restrições do ambiente. Não foram executados testes interativos no navegador, no Snack ou em dispositivo. A disponibilidade das capas remotas também precisa ser conferida no Snack; a requisição de verificação feita neste ambiente recebeu HTTP 502.

### Conferência no Snack

- Navegar entre as três abas, abrir um livro e voltar.
- Buscar por título, autor e assunto; combinar busca e categoria; conferir resultado vazio e limpar a busca.
- Adicionar/remover livros e conferir biblioteca, favoritos e contadores.
- Abrir uma amostra, trocar páginas, voltar à biblioteca e retomar do ponto anterior.
- Concluir a amostra e conferir 100% e o filtro Concluídos.
- Marcar/desmarcar uma página e conferir a marcação ao retornar a ela.
- Alterar fonte e tema, recarregar e conferir a restauração junto com os favoritos e o progresso.
- Destacar um parágrafo, escrever uma nota, editar, cancelar uma edição e excluir pelo caderno.
- No caderno, buscar texto, alternar para todos os livros e abrir a página de uma anotação.
- Buscar dentro da amostra, abrir um resultado, limpar a busca e testar uma palavra sem resultados.
- Abrir o sumário e ir a uma página marcada.
- Abrir leituras repetidas no mesmo dia e conferir que o perfil conta somente um dia; ajustar a meta.
- Conferir leitores, painéis, teclado e botões em uma tela pequena.
- Conferir as imagens de capa, os ícones e os créditos antes de salvar o link.

## Referências e contexto consultado

Foram consultados `AGENTS.md`, os quatro workers, a base da atividade11 e os padrões já levantados dos projetos anteriores. Em especial, foram relidos o Projeto8 (abas e ícones), o Projeto9 (Context API compartilhado entre telas) e o Projeto10 (componentes reutilizáveis e convenções de hooks). A estrutura, as versões e o propósito de cada projeto foram tratados separadamente. A implementação desta atividade fica restrita ao Projeto11.

Referências de metadados, capas e armazenamento:

- [AsyncStorage — biblioteca oficial](https://github.com/react-native-async-storage/async-storage)
- [API de capas da Open Library](https://openlibrary.org/dev/docs/api/covers)
- [The Pragmatic Programmer — editora](https://books.pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
- [Fluent Python — O'Reilly](https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/copyright-page01.html)
- [Designing Data-Intensive Applications — repositório da O'Reilly](https://github.com/oreillymedia/designing-data-intensive-apps)
- [Python for Data Analysis — autor](https://wesmckinney.com/book/)
- [Eloquent JavaScript — autor](https://eloquentjavascript.net/)
- [Refactoring — autor](https://martinfowler.com/books/refactoring.html)

Sem vínculo com a Amazon. Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.
