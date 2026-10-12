import {
  IvaMonthlySettlement,
  InvoiceCalculationResult,
  ImpostoIndustrialCalculation,
  LancamentoContabilistico,
  IndustrialTaxRegime
} from '../types/tax';

export function formatKz(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '0,00 Kz';
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val) + ' Kz';
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function calculateIvaMonthlySettlement(
  input: Partial<IvaMonthlySettlement>
): IvaMonthlySettlement {
  const regime = input.regime || 'geral';
  const mes = input.mes || 1;
  const ano = input.ano || new Date().getFullYear();

  const vendas14 = Math.max(0, input.vendas14 || 0);
  const vendas7 = Math.max(0, input.vendas7 || 0);
  const vendas5 = Math.max(0, input.vendas5 || 0);
  const vendasIsentas = Math.max(0, input.vendasIsentas || 0);

  const totalVendas = vendas14 + vendas7 + vendas5 + vendasIsentas;

  let ivaLiquidado14 = 0;
  let ivaLiquidado7 = 0;
  let ivaLiquidado5 = 0;
  let totalIvaLiquidado = 0;

  if (regime === 'geral') {
    ivaLiquidado14 = Number((vendas14 * 0.14).toFixed(2));
    ivaLiquidado7 = Number((vendas7 * 0.07).toFixed(2));
    ivaLiquidado5 = Number((vendas5 * 0.05).toFixed(2));
    totalIvaLiquidado = ivaLiquidado14 + ivaLiquidado7 + ivaLiquidado5;
  } else if (regime === 'simplificado') {
    // No Regime Simplificado, a taxa de 7% incide sobre o volume de receitas faturadas
    totalIvaLiquidado = Number((totalVendas * 0.07).toFixed(2));
  } else {
    // Regime de Exclusão não liquida IVA
    totalIvaLiquidado = 0;
  }

  const comprasExistencias = Math.max(0, input.comprasExistencias || 0);
  const comprasImobilizado = Math.max(0, input.comprasImobilizado || 0);
  const comprasServicos = Math.max(0, input.comprasServicos || 0);
  const totalCompras = comprasExistencias + comprasImobilizado + comprasServicos;

  let ivaDedutivelExistencias = 0;
  let ivaDedutivelImobilizado = 0;
  let ivaDedutivelServicos = 0;
  let totalIvaDedutivel = 0;

  if (regime === 'geral') {
    ivaDedutivelExistencias = Number((input.ivaDedutivelExistencias ?? (comprasExistencias * 0.14)).toFixed(2));
    ivaDedutivelImobilizado = Number((input.ivaDedutivelImobilizado ?? (comprasImobilizado * 0.14)).toFixed(2));
    ivaDedutivelServicos = Number((input.ivaDedutivelServicos ?? (comprasServicos * 0.14)).toFixed(2));
    totalIvaDedutivel = ivaDedutivelExistencias + ivaDedutivelImobilizado + ivaDedutivelServicos;
  } else if (regime === 'simplificado') {
    // Permite deduzir 7% do IVA incorrido nas aquisições documentadas
    totalIvaDedutivel = Number(((totalCompras * 0.14) * 0.07).toFixed(2));
  } else {
    totalIvaDedutivel = 0;
  }

  const regularizacoesFavorEstado = Math.max(0, input.regularizacoesFavorEstado || 0);
  const regularizacoesFavorSujeitoPassivo = Math.max(0, input.regularizacoesFavorSujeitoPassivo || 0);
  const ivaCativadoPorClientes = Math.max(0, input.ivaCativadoPorClientes || 0);
  const creditoAnteriorReportado = Math.max(0, input.creditoAnteriorReportado || 0);

  // Total Débito (Obrigação): IVA Liquidado + Regularizações a favor do Estado
  const debitoFiscal = totalIvaLiquidado + regularizacoesFavorEstado;

  // Total Crédito (Direito): IVA Dedutível + Regularizações a favor do SP + IVA Cativado retido + Crédito anterior
  const creditoFiscal = totalIvaDedutivel + regularizacoesFavorSujeitoPassivo + ivaCativadoPorClientes + creditoAnteriorReportado;

  const saldoApuramento = Number((debitoFiscal - creditoFiscal).toFixed(2));

  let ivaAPagar = 0;
  let creditoFiscalParaReporte = 0;

  if (saldoApuramento > 0) {
    ivaAPagar = saldoApuramento;
  } else {
    creditoFiscalParaReporte = Math.abs(saldoApuramento);
  }

  return {
    mes,
    ano,
    regime,
    vendas14,
    ivaLiquidado14,
    vendas7,
    ivaLiquidado7,
    vendas5,
    ivaLiquidado5,
    vendasIsentas,
    totalVendas,
    totalIvaLiquidado,
    comprasExistencias,
    ivaDedutivelExistencias,
    comprasImobilizado,
    ivaDedutivelImobilizado,
    comprasServicos,
    ivaDedutivelServicos,
    totalCompras,
    totalIvaDedutivel,
    regularizacoesFavorEstado,
    regularizacoesFavorSujeitoPassivo,
    ivaCativadoPorClientes,
    creditoAnteriorReportado,
    saldoApuramento,
    ivaAPagar,
    creditoFiscalParaReporte,
  };
}

export function calculateInvoice(params: {
  valorBase: number;
  tipoOperacao: 'venda_bens' | 'prestacao_servicos';
  taxaIva: number; // 0, 5, 7, 14
  motivoIsencao?: string;
  tipoCliente: 'geral' | 'estado_organismo_publico' | 'grande_contribuinte_banco_petrolifera';
  aplicarRetencao6_5Manual?: boolean;
  aplicarImpostoSelo1?: boolean;
}): InvoiceCalculationResult {
  const { valorBase, tipoOperacao, taxaIva, motivoIsencao, tipoCliente } = params;

  // 1. IVA Bruto
  const valorIvaBruto = Number(((valorBase * taxaIva) / 100).toFixed(2));

  // 2. Cativação de IVA (Retenção pelo adquirente)
  let taxaCativacaoIva = 0;
  if (tipoCliente === 'estado_organismo_publico') {
    taxaCativacaoIva = 100;
  } else if (tipoCliente === 'grande_contribuinte_banco_petrolifera') {
    taxaCativacaoIva = 50;
  }
  const valorIvaCativado = Number(((valorIvaBruto * taxaCativacaoIva) / 100).toFixed(2));

  // 3. Retenção na Fonte de Imposto Industrial (Art. 71º CII)
  // Devida em prestações de serviços quando o cliente for pessoa coletiva ou quando for público/grande contribuinte
  let taxaRetencaoFonte = 0;
  if (tipoOperacao === 'prestacao_servicos') {
    if (tipoCliente !== 'geral' || params.aplicarRetencao6_5Manual) {
      taxaRetencaoFonte = 6.5;
    }
  }
  const valorRetencaoFonte = Number(((valorBase * taxaRetencaoFonte) / 100).toFixed(2));

  // 4. Imposto de Selo (se aplicável, e.g. recibos de quitação 1%)
  const taxaImpostoSelo = params.aplicarImpostoSelo1 ? 1 : 0;
  const valorImpostoSelo = Number(((valorBase * taxaImpostoSelo) / 100).toFixed(2));

  // Totais
  const totalFaturado = Number((valorBase + valorIvaBruto).toFixed(2));
  // O cliente paga: Total Faturado - IVA Cativado (que entrega à AGT) - Retenção II 6,5% (que entrega à AGT)
  const totalLiquidoAReceber = Number(
    (totalFaturado - valorIvaCativado - valorRetencaoFonte).toFixed(2)
  );

  // Esquema de Lançamentos Contabilísticos no PGC Angolano
  const lancamentosPgc: LancamentoContabilistico[] = [];

  // A. Débito a receber na conta 31.1 Clientes
  lancamentosPgc.push({
    conta: '31.1 - Clientes Correntes',
    descricao: 'Valor líquido efetivo a receber do cliente',
    debito: totalLiquidoAReceber,
    credito: 0,
  });

  // B. Débito do IVA Cativado retido pelo adquirente (crédito fiscal para Modelo 7)
  if (valorIvaCativado > 0) {
    lancamentosPgc.push({
      conta: '34.2.6 - IVA Cativado por Terceiros',
      descricao: `Cativação de ${taxaCativacaoIva}% do IVA retido pelo adquirente (Dec. Pres. 180/19)`,
      debito: valorIvaCativado,
      credito: 0,
    });
  }

  // C. Débito da Retenção na Fonte de Imposto Industrial (6,5%)
  if (valorRetencaoFonte > 0) {
    lancamentosPgc.push({
      conta: '34.1.3 - II Retenções na Fonte Suportadas',
      descricao: 'Retenção na fonte de 6,5% a deduzir na coleta do Modelo 1 (Art. 71º CII)',
      debito: valorRetencaoFonte,
      credito: 0,
    });
  }

  // D. Crédito na conta de Proveitos (Classe 7)
  const contaProveito =
    tipoOperacao === 'venda_bens'
      ? '71.1 - Vendas de Mercadorias'
      : '71.2 - Prestação de Serviços';
  lancamentosPgc.push({
    conta: contaProveito,
    descricao: 'Reconhecimento do proveito comercial pelo valor base',
    debito: 0,
    credito: valorBase,
  });

  // E. Crédito de IVA Liquidado (Classe 34.2.3)
  if (valorIvaBruto > 0) {
    lancamentosPgc.push({
      conta: '34.2.3 - IVA Liquidado',
      descricao: `IVA liquidado à taxa de ${taxaIva}% (CIVA Art. 12º)`,
      debito: 0,
      credito: valorIvaBruto,
    });
  }

  return {
    valorBase,
    taxaIva,
    motivoIsencao,
    valorIvaBruto,
    taxaCativacaoIva,
    valorIvaCativado,
    taxaRetencaoFonte,
    valorRetencaoFonte,
    taxaImpostoSelo,
    valorImpostoSelo,
    totalFaturado,
    totalLiquidoAReceber,
    lancamentosPgc,
  };
}

export function calculateImpostoIndustrialCalculation(
  input: Partial<ImpostoIndustrialCalculation>
): ImpostoIndustrialCalculation {
  const anoExercicio = input.anoExercicio || new Date().getFullYear();
  const regime: IndustrialTaxRegime = input.regime || 'geral_25';

  const resultadoAntesImpostos = input.resultadoAntesImpostos || 0;
  const variacoesPatrimoniaisPositivas = Math.max(0, input.variacoesPatrimoniaisPositivas || 0);
  const variacoesPatrimoniaisNegativas = Math.max(0, input.variacoesPatrimoniaisNegativas || 0);

  // Custos não dedutíveis (Art. 18º do CII)
  const multasCoimas = Math.max(0, input.multasCoimas || 0);
  const despesasRepresentacaoExcesso = Math.max(0, input.despesasRepresentacaoExcesso || 0);
  const amortizacoesExcesso = Math.max(0, input.amortizacoesExcesso || 0);
  const despesasConfidenciais = Math.max(0, input.despesasConfidenciais || 0);
  const despesasNaoDocumentadas = Math.max(0, input.despesasNaoDocumentadas || 0);
  const donativosNaoAutorizados = Math.max(0, input.donativosNaoAutorizados || 0);
  const encargosSegurosNaoGerais = Math.max(0, input.encargosSegurosNaoGerais || 0);
  const outrosCustosNaoAceites = Math.max(0, input.outrosCustosNaoAceites || 0);

  const totalAcrescimos = Number((
    multasCoimas +
    despesasRepresentacaoExcesso +
    amortizacoesExcesso +
    despesasConfidenciais +
    despesasNaoDocumentadas +
    donativosNaoAutorizados +
    encargosSegurosNaoGerais +
    outrosCustosNaoAceites
  ).toFixed(2));

  // Deduções
  const rendimentosIsentosOuIAC = Math.max(0, input.rendimentosIsentosOuIAC || 0);
  const totalDeducoes = Number((variacoesPatrimoniaisPositivas + rendimentosIsentosOuIAC).toFixed(2));

  // Matéria Coletável
  // = RAI + Variacoes Negativas + Custos Nao Dedutiveis - Variacoes Positivas - Rendimentos Isentos
  const materiaCalculada =
    resultadoAntesImpostos +
    variacoesPatrimoniaisNegativas +
    totalAcrescimos -
    totalDeducoes;

  const materiaColetavel = Math.max(0, Number(materiaCalculada.toFixed(2)));

  // Taxa percentual
  let taxaPercentual = 25;
  if (regime === 'agricola_10') {
    taxaPercentual = 10;
  } else if (regime === 'bancario_telecom_35') {
    taxaPercentual = 35;
  }

  // Coleta
  const coletaExercicio = Number(((materiaColetavel * taxaPercentual) / 100).toFixed(2));

  // Deduções à coleta
  const liquidacaoProvisoriaAgosto = Math.max(0, input.liquidacaoProvisoriaAgosto || 0);
  const retencoesFonteSofridas = Math.max(0, input.retencoesFonteSofridas || 0);
  const beneficiosFiscais = Math.max(0, input.beneficiosFiscais || 0);

  const totalDeducoesColeta = Number((
    liquidacaoProvisoriaAgosto +
    retencoesFonteSofridas +
    beneficiosFiscais
  ).toFixed(2));

  const saldoImpostoIndustrial = Number((coletaExercicio - totalDeducoesColeta).toFixed(2));

  // Tributação Autónoma sobre despesas confidenciais e despesas não documentadas
  const taxaTributacaoAutonoma = input.taxaTributacaoAutonoma || 50; // 50% geral ou 70% isento
  const baseTributacaoAutonoma = despesasConfidenciais + despesasNaoDocumentadas;
  const valorTributacaoAutonoma = Number(
    ((baseTributacaoAutonoma * taxaTributacaoAutonoma) / 100).toFixed(2)
  );

  // Total Geral a pagar à AGT
  const totalAPagarAGT = Number(
    (Math.max(0, saldoImpostoIndustrial) + valorTributacaoAutonoma).toFixed(2)
  );

  // Lançamentos no PGC
  const lancamentosPgc: LancamentoContabilistico[] = [];

  // 1. Estimativa do Imposto do Exercício
  lancamentosPgc.push({
    conta: '88.1 - Imposto Industrial Corrente',
    descricao: `Imposto Industrial apurado sobre a matéria coletável (${taxaPercentual}%)`,
    debito: coletaExercicio,
    credito: 0,
  });

  if (liquidacaoProvisoriaAgosto > 0) {
    lancamentosPgc.push({
      conta: '34.1.2 - II Pagamentos por Conta / Liq. Provisória',
      descricao: 'Anulação do pagamento provisório efetuado em Agosto',
      debito: 0,
      credito: liquidacaoProvisoriaAgosto,
    });
  }

  if (retencoesFonteSofridas > 0) {
    lancamentosPgc.push({
      conta: '34.1.3 - II Retenções na Fonte Suportadas',
      descricao: 'Anulação das retenções na fonte de 6,5% suportadas no ano',
      debito: 0,
      credito: retencoesFonteSofridas,
    });
  }

  if (saldoImpostoIndustrial > 0) {
    lancamentosPgc.push({
      conta: '34.1.1 - Imposto Industrial a Pagar',
      descricao: 'Saldo devedor definitivo da Declaração Modelo 1 a pagar até 31 de Maio',
      debito: 0,
      credito: saldoImpostoIndustrial,
    });
  } else if (saldoImpostoIndustrial < 0) {
    lancamentosPgc.push({
      conta: '34.1.4 - Imposto Industrial a Recuperar / Reembolso',
      descricao: 'Crédito de imposto industrial por retenções/pagamentos em excesso',
      debito: Math.abs(saldoImpostoIndustrial),
      credito: 0,
    });
  }

  if (valorTributacaoAutonoma > 0) {
    lancamentosPgc.push({
      conta: '88.2 - Tributação Autónoma de Encargos Não Aceites',
      descricao: `Tributação autónoma de ${taxaTributacaoAutonoma}% sobre despesas confidenciais e não documentadas`,
      debito: valorTributacaoAutonoma,
      credito: 0,
    });
    lancamentosPgc.push({
      conta: '34.1.1 - Imposto Industrial a Pagar (Trib. Autónoma)',
      descricao: 'Obrigação de pagamento de tributação autónoma à AGT',
      debito: 0,
      credito: valorTributacaoAutonoma,
    });
  }

  return {
    anoExercicio,
    regime,
    resultadoAntesImpostos,
    variacoesPatrimoniaisPositivas,
    variacoesPatrimoniaisNegativas,
    multasCoimas,
    despesasRepresentacaoExcesso,
    amortizacoesExcesso,
    despesasConfidenciais,
    despesasNaoDocumentadas,
    donativosNaoAutorizados,
    encargosSegurosNaoGerais,
    outrosCustosNaoAceites,
    totalAcrescimos,
    rendimentosIsentosOuIAC,
    totalDeducoes,
    materiaColetavel,
    taxaPercentual,
    coletaExercicio,
    liquidacaoProvisoriaAgosto,
    retencoesFonteSofridas,
    beneficiosFiscais,
    totalDeducoesColeta,
    saldoImpostoIndustrial,
    taxaTributacaoAutonoma,
    valorTributacaoAutonoma,
    totalAPagarAGT,
    lancamentosPgc,
  };
}

export function calculatePayroll(params: {
  salarioBase: number;
  subsidioAlimentacao: number;
  subsidioTransporte: number;
  outrosSubsidios: number;
}): import('../types/tax').PayrollCalculationResult {
  const { salarioBase, subsidioAlimentacao, subsidioTransporte, outrosSubsidios } = params;

  // Limites de isenção previstos no Código do IRT (Lei n.º 28/20):
  // 30.000 Kz para alimentação e 30.000 Kz para transporte
  const limiteIsencaoAlimentacao = 30000;
  const limiteIsencaoTransporte = 30000;

  const subsidioAlimentacaoTributavel = Math.max(0, subsidioAlimentacao - limiteIsencaoAlimentacao);
  const subsidioTransporteTributavel = Math.max(0, subsidioTransporte - limiteIsencaoTransporte);

  const remuneracaoIliquidaTotal = salarioBase + subsidioAlimentacao + subsidioTransporte + outrosSubsidios;

  // Base para Segurança Social (INSS): Salário Base + outros complementos fixos
  const baseInss = salarioBase + subsidioAlimentacaoTributavel + subsidioTransporteTributavel + outrosSubsidios;
  const descontoInssTrabalhador = Number((baseInss * 0.03).toFixed(2));
  const encargoInssEntidadeEmpregadora = Number((baseInss * 0.08).toFixed(2));

  // Matéria Coletável do IRT: Remuneração sujeita menos os 3% de segurança social
  const materiaColetavelIrt = Math.max(0, Number((baseInss - descontoInssTrabalhador).toFixed(2)));

  // Cálculo da Tabela Progressiva de IRT (Lei n.º 28/20)
  let valorIrtRetido = 0;
  let escalaoIrtDescricao = 'Isento (até 100.000 Kz)';

  if (materiaColetavelIrt <= 100000) {
    valorIrtRetido = 0;
    escalaoIrtDescricao = 'Isento (até 100.000 Kz)';
  } else if (materiaColetavelIrt <= 150000) {
    valorIrtRetido = (materiaColetavelIrt - 100000) * 0.13;
    escalaoIrtDescricao = '13% sobre excesso de 100.000 Kz';
  } else if (materiaColetavelIrt <= 200000) {
    valorIrtRetido = 6500 + (materiaColetavelIrt - 150000) * 0.16;
    escalaoIrtDescricao = '6.500 Kz + 16% sobre excesso de 150.000 Kz';
  } else if (materiaColetavelIrt <= 300000) {
    valorIrtRetido = 14500 + (materiaColetavelIrt - 200000) * 0.18;
    escalaoIrtDescricao = '14.500 Kz + 18% sobre excesso de 200.000 Kz';
  } else if (materiaColetavelIrt <= 500000) {
    valorIrtRetido = 32500 + (materiaColetavelIrt - 300000) * 0.19;
    escalaoIrtDescricao = '32.500 Kz + 19% sobre excesso de 300.000 Kz';
  } else if (materiaColetavelIrt <= 1000000) {
    valorIrtRetido = 70500 + (materiaColetavelIrt - 500000) * 0.20;
    escalaoIrtDescricao = '70.500 Kz + 20% sobre excesso de 500.000 Kz';
  } else if (materiaColetavelIrt <= 1500000) {
    valorIrtRetido = 170500 + (materiaColetavelIrt - 1000000) * 0.21;
    escalaoIrtDescricao = '170.500 Kz + 21% sobre excesso de 1.000.000 Kz';
  } else if (materiaColetavelIrt <= 2000000) {
    valorIrtRetido = 275500 + (materiaColetavelIrt - 1500000) * 0.22;
    escalaoIrtDescricao = '275.500 Kz + 22% sobre excesso de 1.500.000 Kz';
  } else if (materiaColetavelIrt <= 2500000) {
    valorIrtRetido = 385500 + (materiaColetavelIrt - 2000000) * 0.23;
    escalaoIrtDescricao = '385.500 Kz + 23% sobre excesso de 2.000.000 Kz';
  } else if (materiaColetavelIrt <= 3000000) {
    valorIrtRetido = 500500 + (materiaColetavelIrt - 2500000) * 0.24;
    escalaoIrtDescricao = '500.500 Kz + 24% sobre excesso de 2.500.000 Kz';
  } else {
    valorIrtRetido = 620500 + (materiaColetavelIrt - 3000000) * 0.25;
    escalaoIrtDescricao = '620.500 Kz + 25% sobre excesso de 3.000.000 Kz';
  }

  valorIrtRetido = Number(valorIrtRetido.toFixed(2));
  const salarioLiquido = Number((remuneracaoIliquidaTotal - descontoInssTrabalhador - valorIrtRetido).toFixed(2));
  const custoTotalEmpresa = Number((remuneracaoIliquidaTotal + encargoInssEntidadeEmpregadora).toFixed(2));

  // Lançamentos no PGC Angolano
  const lancamentosPgc: LancamentoContabilistico[] = [
    {
      conta: '62.1 - Remunerações do Pessoal',
      descricao: 'Vencimentos ilíquidos devidos aos colaboradores',
      debito: remuneracaoIliquidaTotal,
      credito: 0,
    },
    {
      conta: '62.2 - Encargos Sociais Obrigatórios (INSS 8%)',
      descricao: 'Quota patronal da Segurança Social',
      debito: encargoInssEntidadeEmpregadora,
      credito: 0,
    },
    {
      conta: '34.3 - IRT Retido na Fonte (Grupo A)',
      descricao: 'Imposto sobre o Rendimento do Trabalho retido para entrega à AGT',
      debito: 0,
      credito: valorIrtRetido,
    },
    {
      conta: '34.4 - Segurança Social / INSS (11%)',
      descricao: 'INSS Global a pagar ao INSS (3% trabalhador + 8% entidade empregadora)',
      debito: 0,
      credito: Number((descontoInssTrabalhador + encargoInssEntidadeEmpregadora).toFixed(2)),
    },
    {
      conta: '36.1 - Pessoal - Remunerações a Pagar',
      descricao: 'Líquido a pagar aos trabalhadores em depósito bancário',
      debito: 0,
      credito: salarioLiquido,
    },
  ];

  return {
    salarioBase,
    subsidioAlimentacao,
    subsidioAlimentacaoTributavel,
    subsidioTransporte,
    subsidioTransporteTributavel,
    outrosSubsidiosTributaveis: outrosSubsidios,
    remuneracaoIliquidaTotal,
    descontoInssTrabalhador,
    encargoInssEntidadeEmpregadora,
    materiaColetavelIrt,
    escalaoIrtDescricao,
    valorIrtRetido,
    salarioLiquido,
    custoTotalEmpresa,
    lancamentosPgc,
  };
}

