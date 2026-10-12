import { PracticalCase, QuizQuestion, FiscalDeadline, ChecklistItem } from '../types/tax';

export const PRACTICAL_CASES: PracticalCase[] = [
  {
    id: 'case-1',
    titulo: 'Prestação de Serviços com Cativação de IVA (50%) e Retenção na Fonte (6,5%)',
    categoria: 'CIVA',
    dificuldade: 'Intermédio',
    cenario: 'A empresa "TechAngola, Lda" (Regime Geral de IVA) emitiu uma fatura de consultoria de TI no valor base de 5.000.000 Kz ao "Banco Sol, S.A." (Grande Contribuinte sujeito ao mecanismo de cativação de IVA nos termos do Decreto Presidencial n.º 180/19 e da Lei n.º 42/20).',
    valoresExemplo: {
      'Valor dos Serviços': '5.000.000 Kz',
      'Taxa de IVA': '14% (700.000 Kz)',
      'Cativação de IVA (50%)': '350.000 Kz',
      'Retenção II (6,5%)': '325.000 Kz (6,5% de 5.000.000 Kz)',
      'Valor Líquido a Receber': '5.025.000 Kz'
    },
    resolucaoPassoAPasso: [
      '1. Cálculo do IVA Faturado: 5.000.000 Kz × 14% = 700.000 Kz (Total faturado bruto: 5.700.000 Kz).',
      '2. Cativação de IVA: Sendo o adquirente um Banco/Grande Contribuinte, retém obrigatoriamente 50% do IVA faturado: 700.000 Kz × 50% = 350.000 Kz. O Banco entrega este valor à AGT.',
      '3. Retenção na Fonte de Imposto Industrial (Art.º 71.º do CII): Tratando-se de prestação de serviços, o adquirente retém 6,5% sobre o valor ilíquido dos serviços: 5.000.000 Kz × 6,5% = 325.000 Kz.',
      '4. Apuramento do Valor Líquido a Cobrar: 5.700.000 Kz - 350.000 Kz (IVA Cativado) - 325.000 Kz (Retenção 6,5%) = 5.025.000 Kz.',
      '5. Créditos Fiscais do Prestador: Os 350.000 Kz de IVA cativado abatem na Declaração Modelo 7 como crédito de imposto cativado. Os 325.000 Kz de Retenção II serão deduzidos na coleta anual do Modelo 1.'
    ],
    baseLegal: 'CIVA Art.º 12.º e 15.º; Decreto Presidencial n.º 180/19; Lei n.º 42/20; Código do Imposto Industrial (Lei n.º 26/20), Art.º 71.º.',
    lancamentos: [
      { conta: '31.1 - Clientes Correntes', descricao: 'Valor líquido a receber do Banco', debito: 5025000, credito: 0 },
      { conta: '34.2.6 - IVA Cativado por Terceiros', descricao: '50% do IVA retido pelo adquirente', debito: 350000, credito: 0 },
      { conta: '34.1.3 - II Retenções na Fonte Suportadas', descricao: 'Retenção na fonte de 6,5% a abater no Modelo 1', debito: 325000, credito: 0 },
      { conta: '71.1 - Prestação de Serviços de TI', descricao: 'Reconhecimento do proveito pelo valor ilíquido', debito: 0, credito: 5000000 },
      { conta: '34.2.3 - IVA Liquidado', descricao: 'IVA total gerado à taxa normal de 14%', debito: 0, credito: 700000 }
    ],
    dicaPratica: 'Exija sempre o DAR (Documento de Arrecadação de Receitas) ou DLI da retenção de 6,5% e comprovativo da entrega do IVA cativado para anexar ao Dossier Fiscal da empresa.'
  },
  {
    id: 'case-2',
    titulo: 'Liquidação Provisória sobre Vendas do Imposto Industrial (Mês de Agosto)',
    categoria: 'IMPOSTO_INDUSTRIAL',
    dificuldade: 'Iniciante',
    cenario: 'A empresa comercial "Luanda Retalho, Lda" (Regime Geral do Imposto Industrial) faturou no 1.º Semestre (1 de Janeiro a 30 de Junho) o montante global de 80.000.000 Kz em vendas de mercadorias. Qual a obrigação fiscal devida em Agosto?',
    valoresExemplo: {
      'Vendas 1.º Semestre': '80.000.000 Kz',
      'Taxa de Liquidação Provisória': '2% (Art.º 66.º do CII)',
      'Imposto Industrial Provisório': '1.600.000 Kz',
      'Prazo Limite de Pagamento': '31 de Agosto'
    },
    resolucaoPassoAPasso: [
      '1. Base de Incidência: Volume total de vendas e serviços prestados no primeiro semestre do exercício económico.',
      '2. Taxa Aplicável: 2% nos termos do n.º 1 do Art.º 66.º do Código do Imposto Industrial.',
      '3. Cálculo: 80.000.000 Kz × 2% = 1.600.000 Kz.',
      '4. Pagamento: Liquidado e pago até ao último dia útil de Agosto através do Documento de Liquidação Provisória.',
      '5. Recuperação: Este montante de 1.600.000 Kz é deduzido integralmente como pagamento por conta na liquidação definitiva do Modelo 1 em Maio do ano seguinte.'
    ],
    baseLegal: 'Código do Imposto Industrial (Lei n.º 19/14 republicada com a Lei n.º 26/20), Art.º 66.º e 67.º.',
    lancamentos: [
      { conta: '34.1.2 - II Pagamentos por Conta / Liq. Provisória', descricao: 'Pagamento antecipado de 2% sobre vendas do 1º Semestre', debito: 1600000, credito: 0 },
      { conta: '43.1 - Depósitos à Ordem', descricao: 'Saída de tesouraria para liquidação à AGT', debito: 0, credito: 1600000 }
    ],
    dicaPratica: 'Se a empresa estiver no setor agrícola a taxa é de 2% ou adaptada às regras sectoriais. Guarde o comprovativo DLI de pagamento de Agosto; sem ele a AGT não valida a dedução no campo 34 do Modelo 1.'
  },
  {
    id: 'case-3',
    titulo: 'Tratamento de Despesas Confidenciais e Não Documentadas (Tributação Autónoma)',
    categoria: 'IMPOSTO_INDUSTRIAL',
    dificuldade: 'Avançado',
    cenario: 'Durante o fecho de contas de 2025, o auditor identificou 1.200.000 Kz de despesas sem documento comprovativo idóneo e 800.000 Kz de despesas confidenciais (sem indicação de beneficiário nem finalidade comprovada). O Resultado Contabilístico Antes de Impostos (RAI) foi de 20.000.000 Kz.',
    valoresExemplo: {
      'Despesas Não Documentadas': '1.200.000 Kz',
      'Despesas Confidenciais': '800.000 Kz',
      'Tributação Autónoma (50% ou 70%)': '1.000.000 Kz a 1.400.000 Kz',
      'Impacto no Modelo 1': 'Acréscimo ao Lucro Tributável no Quadro de Reconciliação'
    },
    resolucaoPassoAPasso: [
      '1. Desconsideração Contabilística/Fiscal: As despesas não documentadas e confidenciais são expressamente NÃO DEDUTÍVEIS para efeitos de apuramento da matéria coletável do Imposto Industrial (Art.º 18.º do CII).',
      '2. Acréscimo no Modelo 1: São somadas de volta ao RAI: + 2.000.000 Kz de correção positiva.',
      '3. Tributação Autónoma Especial: Além de não dedutíveis, incide Tributação Autónoma à taxa de 50% (se o sujeito passivo não beneficiar de isenção) ou 70% (se beneficiar de isenção ou não pagamento) sobre o valor destas despesas.',
      '4. Valor da Tributação Autónoma: 2.000.000 Kz × 50% = 1.000.000 Kz a pagar independentemente de haver lucro ou prejuízo fiscal no exercício!'
    ],
    baseLegal: 'CII (Lei n.º 26/20), Art.º 18.º (Custos Não Dedutíveis) e Art.º 72.º / RGT sobre Despesas Confidenciais.',
    lancamentos: [
      { conta: '88.1 - Imposto Industrial do Exercício', descricao: 'Reconhecimento da Tributação Autónoma devida', debito: 1000000, credito: 0 },
      { conta: '34.1.1 - Imposto Industrial a Pagar', descricao: 'Obrigação de Tributação Autónoma devida à AGT', debito: 0, credito: 1000000 }
    ],
    dicaPratica: 'Evite a todo o custo despesas sem fatura certificada com NIF. As multas e tributação autónoma tornam essa despesa extremamente ruinosa para o contribuinte.'
  },
  {
    id: 'case-4',
    titulo: 'Amortização Fiscal de Viatura Ligeira de Passageiros e Limite do Custo Fiscal',
    categoria: 'FECHO_CONTAS',
    dificuldade: 'Intermédio',
    cenario: 'A empresa adquiriu uma viatura ligeira de passageiros para a administração por 24.000.000 Kz. A contabilidade amortizou a viatura a uma taxa de 25% (6.000.000 Kz de quota do ano). O Decreto Executivo n.º 134/13 fixa a taxa máxima em 25% com teto fiscal de aceitação.',
    valoresExemplo: {
      'Custo de Aquisição': '24.000.000 Kz',
      'Quota de Amortização Contabilística (25%)': '6.000.000 Kz',
      'Limite Aceite Fiscalmente': 'Teto aplicável pela tabela oficial',
      'Excesso Não Dedutível': 'Requer preenchimento do Mapa Modelo 2 de Amortizações'
    },
    resolucaoPassoAPasso: [
      '1. Análise da Tabela Oficial: O Decreto Executivo n.º 134/13 estabelece as taxas máximas de amortização admitidas fiscalmente.',
      '2. Viaturas Ligeiras de Passageiros: Custos de aquisição superiores aos limites estabelecidos sofrem limitação fiscal na dedução da quota.',
      '3. Preenchimento do Modelo 2: O Mapa de Reintegrações e Amortizações deve segregar as quotas contabilísticas das quotas fiscais aceites.',
      '4. Correção no Modelo 1: Qualquer amortização praticada acima do limite fiscal ou para além da vida útil regulamentar deve ser acrescida no Quadro de Apuramento do Lucro Tributável (Art.º 18.º n.º 1 alínea c) do CII).'
    ],
    baseLegal: 'Decreto Executivo n.º 134/13 (Tabela de Amortizações e Reintegrações); CII Lei 26/20 Art.º 18.º.',
    lancamentos: [
      { conta: '65.2 - Amortizações do Exercício - Corpóreas', descricao: 'Quota de amortização registada no exercício', debito: 6000000, credito: 0 },
      { conta: '18.2 - Amortizações Acumuladas - Meios de Transporte', descricao: 'Depreciação acumulada do veículo', debito: 0, credito: 6000000 }
    ],
    dicaPratica: 'O Mapa de Amortizações (Modelo 2) é peça obrigatória do Dossier Fiscal. Sem ele assinado por Perito Contabilista, a AGT pode desconsiderar a totalidade das amortizações em sede de inspeção.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    categoria: 'CIVA',
    pergunta: 'Qual é a taxa geral normal do Imposto sobre o Valor Acrescentado (CIVA) em vigor na República de Angola?',
    opcoes: [
      '10%',
      '14%',
      '17%',
      '20%'
    ],
    respostaCorreta: 1,
    explicacao: 'A taxa geral do IVA em Angola é de 14%, aplicável a todas as transmissões de bens e prestações de serviços efetuadas no território nacional, bem como às importações, salvo as operações com taxas especiais (ex: 7% ou 5% para produtos da cesta básica e 1% em Cabinda).',
    artigoLegal: 'Código do IVA (Lei n.º 7/19 com alterações posteriores), Art.º 12.º.'
  },
  {
    id: 'q2',
    categoria: 'CIVA',
    pergunta: 'Quando uma empresa presta serviços a um Órgão da Administração Pública do Estado Angolano, qual a percentagem de IVA que deve ser cativada (retida na fonte)?',
    opcoes: [
      'Não há cativação para entidades públicas',
      '50% do IVA faturado',
      '100% do IVA faturado',
      '14% do valor base'
    ],
    respostaCorreta: 2,
    explicacao: 'O Estado e os organismos públicos têm a obrigação de cativar 100% do IVA constante das faturas de bens e serviços adquiridos, nos termos do Decreto Presidencial n.º 180/19 e da Lei n.º 42/20.',
    artigoLegal: 'Decreto Presidencial n.º 180/19 e Lei n.º 42/20 (Regime de Cativação do IVA).'
  },
  {
    id: 'q3',
    categoria: 'IMPOSTO_INDUSTRIAL',
    pergunta: 'Com a republicação do Código do Imposto Industrial pela Lei n.º 26/20, qual é a taxa geral do Imposto Industrial aplicável à generalidade dos sujeitos passivos do Regime Geral?',
    opcoes: [
      '30%',
      '25%',
      '35%',
      '20%'
    ],
    respostaCorreta: 1,
    explicacao: 'A taxa geral do Imposto Industrial foi reduzida de 30% para 25% pela Lei n.º 26/20. As atividades do sector bancário, segurador e telecomunicações mantêm a taxa de 35%, e o sector agrícola beneficia da taxa bonificada de 10%.',
    artigoLegal: 'Código do Imposto Industrial (Lei n.º 19/14 republicada com a Lei n.º 26/20), Art.º 53.º.'
  },
  {
    id: 'q4',
    categoria: 'IMPOSTO_INDUSTRIAL',
    pergunta: 'Em que mês e sob que taxa os contribuintes do Regime Geral do Imposto Industrial devem pagar a Liquidação Provisória sobre Vendas?',
    opcoes: [
      'No mês de Maio, à taxa de 5%',
      'No mês de Agosto, à taxa de 2% sobre as vendas do 1.º Semestre',
      'No mês de Dezembro, à taxa de 1% sobre as vendas anuais',
      'No mês de Julho, à taxa de 6,5% sobre o lucro líquido'
    ],
    respostaCorreta: 1,
    explicacao: 'A Liquidação Provisória do Imposto Industrial é devida no mês de Agosto, calculada à taxa de 2% sobre o volume total de vendas e prestações de serviços auferidos nos primeiros 6 meses do ano (Janeiro a Junho).',
    artigoLegal: 'Código do Imposto Industrial (Lei n.º 26/20), Art.º 66.º e 67.º.'
  },
  {
    id: 'q5',
    categoria: 'RETENCOES',
    pergunta: 'Qual a taxa de Retenção na Fonte de Imposto Industrial aplicável ao pagamento de prestações de serviços entre entidades residentes em Angola?',
    opcoes: [
      '2%',
      '5%',
      '6,5%',
      '10%'
    ],
    respostaCorreta: 2,
    explicacao: 'Nos termos do Art.º 71.º do Código do Imposto Industrial, as entidades que paguem remunerações por prestações de serviços de qualquer natureza a sujeitos passivos residentes devem reter na fonte a taxa definitiva de 6,5%.',
    artigoLegal: 'Código do Imposto Industrial (Lei n.º 26/20), Art.º 71.º.'
  },
  {
    id: 'q6',
    categoria: 'PGC',
    pergunta: 'No Plano Geral de Contabilidade Angolano (PGC), em que subconta é registado o IVA liquidado nas vendas e prestações de serviços?',
    opcoes: [
      'Conta 34.2.1',
      'Conta 34.2.2',
      'Conta 34.2.3',
      'Conta 34.2.4'
    ],
    respostaCorreta: 2,
    explicacao: 'No PGC Angolano com o desdobramento do IVA, a Conta 34.2.3 destina-se ao "IVA Liquidado", a 34.2.1 ao "IVA Suportado", a 34.2.2 ao "IVA Dedutível", a 34.2.4 ao "IVA a Pagar" e a 34.2.6 ao "IVA Cativado".',
    artigoLegal: 'Plano Geral de Contabilidade Angolano (Decreto n.º 82/01) e Diretrizes OCPCA.'
  },
  {
    id: 'q7',
    categoria: 'IMPOSTO_INDUSTRIAL',
    pergunta: 'Qual o tratamento fiscal das despesas confidenciais ou não documentadas em sede de Imposto Industrial?',
    opcoes: [
      'São dedutíveis até ao limite de 5% da faturação',
      'Não são dedutíveis e estão sujeitas a Tributação Autónoma de 50% ou 70%',
      'São dedutíveis apenas com autorização expressa do Diretor da AGT',
      'Não sofrem qualquer penalização se pagas por transferência bancária'
    ],
    respostaCorreta: 1,
    explicacao: 'As despesas confidenciais ou não documentadas não são dedutíveis (são acrescidas ao lucro tributável) e estão adicionalmente sujeitas a Tributação Autónoma de 50% (ou 70% se o sujeito passivo usufruir de isenção fiscal).',
    artigoLegal: 'CII Lei n.º 26/20 Art.º 18.º e Regime Geral Tributário.'
  },
  {
    id: 'q8',
    categoria: 'CIVA',
    pergunta: 'Qual é o prazo limite para a submissão da Declaração Periódica do IVA (Modelo 7) e do ficheiro SAF-T (AO) da faturação?',
    opcoes: [
      'Até ao dia 10 do mês seguinte',
      'O SAF-T até ao dia 15 do mês seguinte e a Declaração de IVA até ao último dia do mês seguinte',
      'Até ao dia 5 de cada trimestre',
      'Ambos até ao último dia útil do ano civil'
    ],
    respostaCorreta: 1,
    explicacao: 'O ficheiro de auditoria SAF-T (AO) de faturação deve ser submetido no portal da AGT até ao dia 15 do mês seguinte ao período a que se refere. A Declaração Periódica do IVA (Modelo 7) e respetivo pagamento devem ser entregues até ao último dia útil do mês seguinte.',
    artigoLegal: 'Decreto Executivo n.º 399/19 (SAF-T) e CIVA Art.º 43.º.'
  }
];

export const FISCAL_DEADLINES: FiscalDeadline[] = [
  {
    id: 'dl-1',
    dia: 15,
    mes: 1,
    periodicidade: 'Mensal',
    imposto: 'SAFT',
    titulo: 'Submissão do Ficheiro SAF-T (AO) de Faturação',
    descricao: 'Exportação e validação no portal da AGT de todas as faturas, recibos e notas de crédito emitidas no mês anterior via software certificado.',
    modeloDeclaracao: 'Ficheiro XML SAF-T (AO)',
    baseLegal: 'Decreto Executivo n.º 399/19',
    prioridade: 'alta'
  },
  {
    id: 'dl-2',
    dia: 31,
    mes: 1,
    periodicidade: 'Mensal',
    imposto: 'IVA',
    titulo: 'Declaração Periódica de IVA (Modelo 7) e Pagamento',
    descricao: 'Entrega da declaração mensal de apuramento do IVA referente às operações do mês anterior e pagamento do imposto apurado.',
    modeloDeclaracao: 'Modelo 7 - Declaração Periódica do IVA',
    baseLegal: 'CIVA Art.º 43.º e 44.º',
    prioridade: 'alta'
  },
  {
    id: 'dl-3',
    dia: 31,
    mes: 1,
    periodicidade: 'Mensal',
    imposto: 'RETENCOES',
    titulo: 'Entrega das Retenções na Fonte de Imposto Industrial (6,5%)',
    descricao: 'Pagamento das quantias retidas na fonte sobre remunerações de serviços prestados no mês anterior, acompanhado do mapa discriminativo.',
    modeloDeclaracao: 'Documento de Liquidação de Impostos (DLI) - Retenção II',
    baseLegal: 'CII Lei n.º 26/20 Art.º 71.º n.º 4',
    prioridade: 'alta'
  },
  {
    id: 'dl-4',
    dia: 31,
    mes: 1,
    periodicidade: 'Mensal',
    imposto: 'IRT',
    titulo: 'Liquidação e Entrega do IRT (Grupos A, B e C)',
    descricao: 'Entrega do Imposto sobre o Rendimento do Trabalho retido aos trabalhadores dependentes e remunerações de colaboradores eventuais.',
    modeloDeclaracao: 'Modelo 2 do IRT / DLI',
    baseLegal: 'Código do IRT (Lei n.º 28/20)',
    prioridade: 'alta'
  },
  {
    id: 'dl-5',
    dia: 31,
    mes: 3,
    periodicidade: 'Anual',
    imposto: 'MODELO_1',
    titulo: 'Aprovação de Contas e Preparação dos Balancetes Definitivos',
    descricao: 'Reunião da Assembleia Geral dos sócios/acionistas para apreciação do Relatório de Gestão e Contas do exercício findo.',
    modeloDeclaracao: 'Ata de Aprovação de Contas',
    baseLegal: 'Lei das Sociedades Comerciais (Lei n.º 1/04)',
    prioridade: 'media'
  },
  {
    id: 'dl-6',
    dia: 31,
    mes: 5,
    periodicidade: 'Anual',
    imposto: 'MODELO_1',
    titulo: 'Declaração Modelo 1 do Imposto Industrial (Grupo A)',
    descricao: 'Prazo limite oficial para submissão eletrónica da Declaração Modelo 1 de Rendimentos com Balanço, DRE, Mapa de Amortizações e Dossier Fiscal.',
    modeloDeclaracao: 'Modelo 1 do Imposto Industrial + Anexos Fiscais',
    baseLegal: 'CII Lei n.º 26/20 Art.º 58.º',
    prioridade: 'alta'
  },
  {
    id: 'dl-7',
    dia: 30,
    mes: 6,
    periodicidade: 'Anual',
    imposto: 'MODELO_1',
    titulo: 'Depósito do Relatório e Contas e Certificação OCPCA',
    descricao: 'Entrega obrigatória das contas certificadas pelo Perito Contabilista ou Sociedade de Auditores e arquivamento no Dossier Fiscal.',
    modeloDeclaracao: 'Certificação Legal de Contas OCPCA',
    baseLegal: 'Estatuto da OCPCA e RGT',
    prioridade: 'alta'
  },
  {
    id: 'dl-8',
    dia: 31,
    mes: 8,
    periodicidade: 'Anual',
    imposto: 'II',
    titulo: 'Liquidação Provisória sobre Vendas do Imposto Industrial (2%)',
    descricao: 'Cálculo de 2% sobre as vendas e prestações de serviços faturadas no primeiro semestre (Jan-Jun) e liquidação via DLI.',
    modeloDeclaracao: 'Documento de Liquidação Provisória do II',
    baseLegal: 'CII Lei n.º 26/20 Art.º 66.º e 67.º',
    prioridade: 'alta'
  }
];

export const DOSSIER_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    fase: 'Preparação e Balancete',
    titulo: 'Balancete de Verificação Geral e Balancete após Apuramento',
    descricao: 'Emissão e conciliação de todos os saldos das Classes 1 a 8 do PGC Angolano.',
    baseLegal: 'PGC Decreto 82/01',
    obrigatorio: true,
    concluido: true
  },
  {
    id: 'chk-2',
    fase: 'Preparação e Balancete',
    titulo: 'Contagem Física de Inventários e Folhas de Stock (Classe 2)',
    descricao: 'Auto de contagem física de existências a 31 de Dezembro assinado por equipa independente.',
    baseLegal: 'PGC Classe 2 / RGT',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-3',
    fase: 'Preparação e Balancete',
    titulo: 'Circularização e Conciliação Bancária com Extratos',
    descricao: 'Reconciliação de todas as contas 43 (Depósitos à Ordem) e aplicações financeiras.',
    baseLegal: 'Normas de Auditoria OCPCA',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-4',
    fase: 'IVA e Retenções',
    titulo: 'Reconciliação Anual do Mapa de IVA vs Faturação SAF-T',
    descricao: 'Conferência cruzada entre as 12 Declarações Modelo 7 e o total do SAF-T anual.',
    baseLegal: 'CIVA Art. 43º',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-5',
    fase: 'IVA e Retenções',
    titulo: 'Recolha dos Comprovativos de IVA Cativado e Retenções de 6,5%',
    descricao: 'Arquivar todos os DLIs de retenções na fonte emitidos pelos clientes para deduzir no Modelo 1.',
    baseLegal: 'CII Art. 71º / Dec. Presidencial 180/19',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-6',
    fase: 'Imposto Industrial e Modelo 1',
    titulo: 'Mapa Oficial de Amortizações e Reintegrações (Modelo 2)',
    descricao: 'Cálculo das quotas de amortização de acordo com a tabela do Decreto Executivo n.º 134/13.',
    baseLegal: 'Decreto Executivo n.º 134/13',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-7',
    fase: 'Imposto Industrial e Modelo 1',
    titulo: 'Quadro de Apuramento do Lucro Tributável (Custos Não Dedutíveis Art. 18º)',
    descricao: 'Levantamento de multas, despesas confidenciais, representação em excesso e acréscimos ao RAI.',
    baseLegal: 'CII Lei 26/20 Art. 18º',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-8',
    fase: 'Imposto Industrial e Modelo 1',
    titulo: 'Comprovativo do Pagamento da Liquidação Provisória de Agosto',
    descricao: 'Verificação do DLI de 2% de Agosto para dedução no Campo do Modelo 1.',
    baseLegal: 'CII Art. 66º e 67º',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-9',
    fase: 'Dossier Fiscal e Auditoria',
    titulo: 'Relatório e Contas com Balanço e Demonstração de Resultados (DRE)',
    descricao: 'Peças contabilísticas completas elaboradas em conformidade com o PGC Angolano.',
    baseLegal: 'Lei das Sociedades Comerciais / PGC',
    obrigatorio: true,
    concluido: false
  },
  {
    id: 'chk-10',
    fase: 'Dossier Fiscal e Auditoria',
    titulo: 'Certificação Legal de Contas assinada por Perito Contabilista OCPCA',
    descricao: 'Assinatura e número de inscrição do Perito Contabilista ou Sociedade de Peritos Contabilistas.',
    baseLegal: 'Estatuto da OCPCA',
    obrigatorio: true,
    concluido: false
  }
];

export const SAFT_EXEMPTION_CODES = [
  { codigo: 'M00', mencao: 'Isento nos termos da alínea a) do n.º 1 do artigo 12.º do CIVA', descricao: 'Transmissão de bens e serviços de saúde e medicamentos essenciais' },
  { codigo: 'M02', mencao: 'Transmissão de bens e serviços não sujeitos', descricao: 'Operações fora do campo de incidência do IVA' },
  { codigo: 'M04', mencao: 'Isento nos termos do Código do IVA', descricao: 'Isenções gerais contempladas no artigo 12.º (ensino, banca, seguros, locação habitacional)' },
  { codigo: 'M10', mencao: 'IVA - Regime de Exclusão', descricao: 'Volume anual <= 10.000.000 Kz (não liquida IVA, sujeito a 1% de Selo)' },
  { codigo: 'M11', mencao: 'IVA - Regime Simplificado', descricao: 'Sujeitos passivos enquadrados no regime simplificado (taxa 7% sobre faturado)' },
  { codigo: 'M12', mencao: 'Isento nos termos da alínea b) do n.º 1 do artigo 12.º do CIVA', descricao: 'Serviços de cariz social e humanitário' },
  { codigo: 'M13', mencao: 'Isento nos termos da alínea c) do n.º 1 do artigo 12.º do CIVA', descricao: 'Educação e formação profissional' },
  { codigo: 'M14', mencao: 'Isenção de IVA para Bens da Cesta Básica (OGE)', descricao: 'Taxa zero transitória ou benefícios específicos' },
  { codigo: 'M15', mencao: 'Isento nos termos do Regime Especial de Cabinda', descricao: 'DLP 2/19 da Província de Cabinda' },
  { codigo: 'M16', mencao: 'IVA - Autoliquidação (Reverse Charge)', descricao: 'Operações em que o devedor do imposto é o adquirente' }
];

export const IRT_BRACKETS = [
  { limiteInferior: 0, limiteSuperior: 100000, parcelaFixa: 0, taxa: 0, excesso: 0, desc: 'Até 100.000 Kz: Isento' },
  { limiteInferior: 100001, limiteSuperior: 150000, parcelaFixa: 0, taxa: 0.13, excesso: 100000, desc: 'De 100.001 a 150.000 Kz: 13% sobre o excesso de 100.000 Kz' },
  { limiteInferior: 150001, limiteSuperior: 200000, parcelaFixa: 6500, taxa: 0.16, excesso: 150000, desc: 'De 150.001 a 200.000 Kz: 6.500 Kz + 16% sobre o excesso de 150.000 Kz' },
  { limiteInferior: 200001, limiteSuperior: 300000, parcelaFixa: 14500, taxa: 0.18, excesso: 200000, desc: 'De 200.001 a 300.000 Kz: 14.500 Kz + 18% sobre o excesso de 200.000 Kz' },
  { limiteInferior: 300001, limiteSuperior: 500000, parcelaFixa: 32500, taxa: 0.19, excesso: 300000, desc: 'De 300.001 a 500.000 Kz: 32.500 Kz + 19% sobre o excesso de 300.000 Kz' },
  { limiteInferior: 500001, limiteSuperior: 1000000, parcelaFixa: 70500, taxa: 0.20, excesso: 500000, desc: 'De 500.001 a 1.000.000 Kz: 70.500 Kz + 20% sobre o excesso de 500.000 Kz' },
  { limiteInferior: 1000001, limiteSuperior: 1500000, parcelaFixa: 170500, taxa: 0.21, excesso: 1000000, desc: 'De 1.000.001 a 1.500.000 Kz: 170.500 Kz + 21% sobre o excesso de 1.000.000 Kz' },
  { limiteInferior: 1500001, limiteSuperior: 2000000, parcelaFixa: 275500, taxa: 0.22, excesso: 1500000, desc: 'De 1.500.001 a 2.000.000 Kz: 275.500 Kz + 22% sobre o excesso de 1.500.000 Kz' },
  { limiteInferior: 2000001, limiteSuperior: 2500000, parcelaFixa: 385500, taxa: 0.23, excesso: 2000000, desc: 'De 2.000.001 a 2.500.000 Kz: 385.500 Kz + 23% sobre o excesso de 2.000.000 Kz' },
  { limiteInferior: 2500001, limiteSuperior: 3000000, parcelaFixa: 500500, taxa: 0.24, excesso: 2500000, desc: 'De 2.500.001 a 3.000.000 Kz: 500.500 Kz + 24% sobre o excesso de 2.500.000 Kz' },
  { limiteInferior: 3000001, limiteSuperior: Infinity, parcelaFixa: 620500, taxa: 0.25, excesso: 3000000, desc: 'Mais de 3.000.000 Kz: 620.500 Kz + 25% sobre o excesso de 3.000.000 Kz' }
];

export const TAX_RATES_SUMMARY = {
  iva: [
    { taxa: '14%', descricao: 'Taxa Geral Normal (Transmissão de bens, serviços e importações gerais)' },
    { taxa: '7%', descricao: 'Taxa Reduzida (Bens da cesta básica e insumos agropecuários - Lei 27/21)' },
    { taxa: '5%', descricao: 'Taxa Super Reduzida (Produtos agrícolas de produção nacional)' },
    { taxa: '1%', descricao: 'Regime Especial da Província de Cabinda (DLP n.º 2/19)' },
    { taxa: '0%', descricao: 'Isenção completa com direito à dedução (Exportações de mercadorias)' },
    { taxa: 'Isenção sem dedução', descricao: 'Operações financeiras, imobiliárias habitacionais, saúde e ensino (Art. 12º CIVA)' }
  ],
  impostoIndustrial: [
    { taxa: '25%', regime: 'Regime Geral', descricao: 'Taxa geral para comércio, indústria e serviços em geral (Lei 26/20)' },
    { taxa: '10%', regime: 'Sector Agrícola e Pescas', descricao: 'Sector agrícola, pecuária, silvicultura e exploração florestal' },
    { taxa: '35%', regime: 'Sector Financeiro e Telecom', descricao: 'Bancos, seguradoras, operadoras de telecomunicações móveis e fixas' },
    { taxa: '2%', regime: 'Liquidação Provisória de Vendas', descricao: 'Pago em Agosto sobre o volume de vendas do 1º Semestre (dedutível no Mod. 1)' },
    { taxa: '6,5%', regime: 'Retenção na Fonte de Serviços', descricao: 'Retido em todas as prestações de serviços entre sujeitos passivos (Art. 71º)' },
    { taxa: '50% / 70%', regime: 'Tributação Autónoma', descricao: 'Incide sobre despesas confidenciais e encargos não devidamente documentados' }
  ]
};
