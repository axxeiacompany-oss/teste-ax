export type IvaRegime = 'geral' | 'simplificado' | 'exclusao';

export type IndustrialTaxRegime = 'geral_25' | 'agricola_10' | 'bancario_telecom_35';

export interface LancamentoContabilistico {
  conta: string;
  descricao: string;
  debito: number;
  credito: number;
}

export interface IvaMonthlySettlement {
  mes: number;
  ano: number;
  regime: IvaRegime;
  // Vendas
  vendas14: number;
  ivaLiquidado14: number;
  vendas7: number;
  ivaLiquidado7: number;
  vendas5: number;
  ivaLiquidado5: number;
  vendasIsentas: number;
  totalVendas: number;
  totalIvaLiquidado: number;
  // Aquisições
  comprasExistencias: number;
  ivaDedutivelExistencias: number;
  comprasImobilizado: number;
  ivaDedutivelImobilizado: number;
  comprasServicos: number;
  ivaDedutivelServicos: number;
  totalCompras: number;
  totalIvaDedutivel: number;
  // Ajustes e Cativações
  regularizacoesFavorEstado: number;
  regularizacoesFavorSujeitoPassivo: number;
  ivaCativadoPorClientes: number; // Sujeito à cativação 50% ou 100% que foi retido pelo cliente
  creditoAnteriorReportado: number;
  // Resultados
  saldoApuramento: number; // positivo = a pagar ao Estado, negativo = crédito fiscal
  ivaAPagar: number;
  creditoFiscalParaReporte: number;
}

export interface InvoiceCalculationResult {
  valorBase: number;
  taxaIva: number;
  motivoIsencao?: string;
  valorIvaBruto: number;
  taxaCativacaoIva: number; // 0, 50, 100
  valorIvaCativado: number;
  taxaRetencaoFonte: number; // 0 ou 6.5
  valorRetencaoFonte: number;
  taxaImpostoSelo: number; // 0 ou 1
  valorImpostoSelo: number;
  totalFaturado: number;
  totalLiquidoAReceber: number;
  lancamentosPgc: LancamentoContabilistico[];
}

export interface ImpostoIndustrialCalculation {
  anoExercicio: number;
  regime: IndustrialTaxRegime;
  resultadoAntesImpostos: number;
  variacoesPatrimoniaisPositivas: number;
  variacoesPatrimoniaisNegativas: number;
  // Custos não dedutíveis (Art. 18º do CII)
  multasCoimas: number;
  despesasRepresentacaoExcesso: number; // > 1% das vendas totais
  amortizacoesExcesso: number;
  despesasConfidenciais: number; // Sujeitas a tributação autónoma
  despesasNaoDocumentadas: number;
  donativosNaoAutorizados: number;
  encargosSegurosNaoGerais: number;
  outrosCustosNaoAceites: number;
  totalAcrescimos: number;
  // Deduções ao lucro
  rendimentosIsentosOuIAC: number;
  totalDeducoes: number;
  // Matéria Coletável
  materiaColetavel: number;
  taxaPercentual: number; // 25, 10, 35
  coletaExercicio: number;
  // Deduções à coleta
  liquidacaoProvisoriaAgosto: number; // 2% vendas 1º semestre
  retencoesFonteSofridas: number; // 6.5% de serviços
  beneficiosFiscais: number;
  totalDeducoesColeta: number;
  // Saldo
  saldoImpostoIndustrial: number;
  // Tributação Autónoma sobre despesas confidenciais/não documentadas
  taxaTributacaoAutonoma: number; // 50% ou 70%
  valorTributacaoAutonoma: number;
  // Total a pagar à AGT
  totalAPagarAGT: number;
  lancamentosPgc: LancamentoContabilistico[];
}

export interface PracticalCase {
  id: string;
  titulo: string;
  categoria: 'CIVA' | 'IMPOSTO_INDUSTRIAL' | 'RETENCOES' | 'FECHO_CONTAS';
  dificuldade: 'Iniciante' | 'Intermédio' | 'Avançado';
  cenario: string;
  valoresExemplo: Record<string, number | string>;
  resolucaoPassoAPasso: string[];
  baseLegal: string;
  lancamentos: LancamentoContabilistico[];
  dicaPratica: string;
}

export interface QuizQuestion {
  id: string;
  categoria: 'CIVA' | 'IMPOSTO_INDUSTRIAL' | 'RETENCOES' | 'PGC';
  pergunta: string;
  opcoes: string[];
  respostaCorreta: number; // índice 0..3
  explicacao: string;
  artigoLegal: string;
}

export interface FiscalDeadline {
  id: string;
  dia: number;
  mes: number; // 1-12
  periodicidade: 'Mensal' | 'Anual' | 'Trimestral';
  imposto: 'IVA' | 'II' | 'IRT' | 'SELO' | 'SAFT' | 'MODELO_1' | 'RETENCOES';
  titulo: string;
  descricao: string;
  modeloDeclaracao: string;
  baseLegal: string;
  prioridade: 'alta' | 'media' | 'normal';
}

export interface ChecklistItem {
  id: string;
  fase: 'Preparação e Balancete' | 'IVA e Retenções' | 'Imposto Industrial e Modelo 1' | 'Dossier Fiscal e Auditoria';
  titulo: string;
  descricao: string;
  baseLegal: string;
  obrigatorio: boolean;
  concluido: boolean;
}

export interface AssetDepreciationItem {
  id: string;
  descricao: string;
  grupoContabilistico: string; // ex: Meios de Transporte, Equipamento Informático
  anoAquisicao: number;
  valorAquisicao: number;
  taxaContabilistica: number;
  taxaFiscalMaxima: number;
  quotaContabilistica: number;
  quotaFiscalAceite: number;
  excessoNaoDedutivel: number;
}

export interface PayrollCalculationResult {
  salarioBase: number;
  subsidioAlimentacao: number;
  subsidioAlimentacaoTributavel: number;
  subsidioTransporte: number;
  subsidioTransporteTributavel: number;
  outrosSubsidiosTributaveis: number;
  remuneracaoIliquidaTotal: number;
  descontoInssTrabalhador: number; // 3%
  encargoInssEntidadeEmpregadora: number; // 8%
  materiaColetavelIrt: number;
  escalaoIrtDescricao: string;
  valorIrtRetido: number;
  salarioLiquido: number;
  custoTotalEmpresa: number;
  lancamentosPgc: LancamentoContabilistico[];
}

export interface SaftValidationIssue {
  tipo: 'erro' | 'alerta' | 'conformidade';
  campo: string;
  mensagem: string;
  baseLegal: string;
}

