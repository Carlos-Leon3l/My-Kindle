const temas = {
  Programação: [
    ['Pensar antes de implementar', 'Um programa começa com uma pergunta. Antes de escolher uma linguagem ou escrever uma função, descreva o problema com suas próprias palavras. Pense em quem utilizará a solução e em como reconhecer um resultado correto.', 'Experimente resolver um caso pequeno no papel. Transforme as etapas em funções com responsabilidades claras. Nomes que descrevem intenções tornam a leitura do código mais próxima da leitura de uma explicação.'],
    ['Construir em pequenos passos', 'Separe a entrada, o processamento e a saída. Uma mudança pequena é mais fácil de compreender e de verificar. Ao terminar cada etapa, execute o programa com dados conhecidos.', 'Considere também uma entrada vazia, um valor inesperado e uma repetição da mesma operação. Essas situações ajudam a descobrir decisões que ainda não estavam explícitas.'],
    ['Aprender com o comportamento', 'Quando um resultado surpreende, procure um exemplo mínimo que reproduza o comportamento. Observe valores intermediários e compare o que aconteceu com a sua hipótese inicial.', 'Um teste útil descreve um comportamento importante. Ele oferece confiança para melhorar a organização do código sem alterar o resultado que o usuário espera.'],
    ['Da leitura à prática', 'Escolha uma tarefa curta: filtrar uma lista de livros, calcular um progresso ou validar um formulário. Implemente uma primeira solução e depois revise os nomes e as responsabilidades.', 'Registre o que você aprendeu e uma dúvida para investigar na próxima sessão. Aprender programação é um processo de experimentar, observar e revisar.'],
  ],
  Dados: [
    ['Começar pela pergunta', 'Um conjunto de dados não explica sozinho o mundo. Defina a pergunta da análise, a origem das informações e as limitações da coleta antes de escolher uma visualização.', 'Uma tabela de leituras, por exemplo, pode mostrar páginas visitadas. Ela não permite afirmar, por si só, quanto conteúdo foi compreendido. Métricas precisam de contexto.'],
    ['Preparar os dados', 'Verifique tipos, unidades, valores ausentes e registros duplicados. Uma coluna numérica armazenada como texto pode produzir comparações inesperadas e distorcer resultados.', 'Preserve os dados originais e descreva cada transformação. Esse cuidado permite revisar decisões e repetir a análise quando uma nova versão do conjunto chegar.'],
    ['Interpretar com cuidado', 'Compare grupos com critérios claros. Uma média resume valores, mas pode esconder diferenças importantes. Observe a distribuição e investigue observações muito distantes das demais.', 'Apresente o que foi observado e o que ainda permanece incerto. Uma relação entre duas medidas não demonstra, sozinha, que uma causou a outra.'],
    ['Transformar em conhecimento', 'Crie uma análise pequena com dados de uma atividade cotidiana. Defina uma pergunta, prepare os registros e escolha um gráfico que ajude alguém a entender a resposta.', 'Finalize escrevendo uma conclusão curta com suas limitações. Uma análise útil torna o raciocínio verificável e ajuda outra pessoa a decidir o próximo passo.'],
  ],
  Arquitetura: [
    ['Responsabilidades e limites', 'Organizar um sistema é decidir onde cada responsabilidade deve ficar. Uma interface apresenta informações; uma regra de domínio descreve o comportamento; uma camada de dados cuida do acesso às informações.', 'Essa separação permite alterar detalhes sem reescrever todo o aplicativo. Comece pelas necessidades existentes e evite criar camadas que ainda não resolvem um problema concreto.'],
    ['Mudanças com segurança', 'Antes de modificar uma parte importante, identifique o comportamento que deve permanecer. Testes e exemplos observáveis ajudam a transformar essa expectativa em uma referência verificável.', 'Prefira mudanças pequenas. Renomear uma função, extrair uma responsabilidade e substituir uma implementação são etapas diferentes que podem ser verificadas separadamente.'],
    ['Dados e consistência', 'Quando vários componentes compartilham informação, defina uma fonte de verdade. Atualizar cópias independentes do mesmo dado pode deixar telas mostrando resultados diferentes.', 'Uma biblioteca digital pode guardar a página atual em um contexto compartilhado. A lista e o leitor consultam essa mesma informação em vez de calcular estados incompatíveis.'],
    ['Decidir e registrar', 'Uma decisão técnica envolve vantagens e custos. Uma solução simples pode ser suficiente para uma atividade acadêmica, enquanto um serviço real pode exigir persistência e sincronização.', 'Registre a necessidade, a decisão e suas limitações. Esse pequeno histórico ajuda a entender quando uma escolha continua adequada e quando deve ser revista.'],
  ],
};

const catalogo = [
  ['pragmatico', 'The Pragmatic Programmer', 'David Thomas e Andrew Hunt', 'Programação', '9780135957059', '#244C43', 'Práticas e reflexões sobre o trabalho de desenvolver software.', 'https://books.pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/'],
  ['python', 'Fluent Python', 'Luciano Ramalho', 'Programação', '9781492056355', '#6B4B3E', 'Uma exploração dos recursos da linguagem Python e de suas estruturas.', 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/'],
  ['dados', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Arquitetura', '9781449373320', '#924735', 'Conceitos para compreender sistemas que armazenam e processam dados.', 'https://github.com/oreillymedia/designing-data-intensive-apps'],
  ['analise', 'Python for Data Analysis', 'Wes McKinney', 'Dados', '9781098104030', '#375A74', 'Preparação e análise de dados com ferramentas do ecossistema Python.', 'https://wesmckinney.com/book/'],
  ['javascript', 'Eloquent JavaScript', 'Marijn Haverbeke', 'Programação', '9781593279509', '#B07932', 'Fundamentos da programação apresentados por meio de JavaScript.', 'https://eloquentjavascript.net/'],
  ['refatoracao', 'Refactoring', 'Martin Fowler', 'Arquitetura', '9780134757599', '#675174', 'Melhorias graduais na estrutura de código existente.', 'https://martinfowler.com/books/refactoring.html'],
];

export const categorias = ['Todos', 'Programação', 'Dados', 'Arquitetura'];
export const livros = catalogo.map(([id, titulo, autor, categoria, isbn, cor, descricao, fonte]) => ({
  id, titulo, autor, categoria, cor, descricao, fonte,
  capa: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
  paginas: temas[categoria].map(([tituloPagina, ...paragrafos]) => ({ titulo: tituloPagina, paragrafos })),
}));
