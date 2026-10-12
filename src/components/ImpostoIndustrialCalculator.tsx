import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle, 
  HelpCircle, 
  BookOpen,
  Table
} from 'lucide-react';
import { 
  ImpostoIndustrialCalculation, 
  IndustrialTaxRegime 
} from '../types/tax';
import { 
  calculateImpostoIndustrialCalculation, 
  formatKz 
} from '../utils/taxCalculators';

interface ImpostoIndustrialCalculatorProps {
  onUpdateIIState?: (iiEstimado: number, liqProvisoria: number) => void;
}

export const ImpostoIndustrialCalculator: React.FC<ImpostoIndustrialCalculatorProps> = ({
  onUpdateIIState,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'modelo1' | 'provisoria' | 'amortizacoes'>('modelo1');

  // State for Modelo 1 calculation
  const [calcData, setCalcData] = useState<Partial<ImpostoIndustrialCalculation>>({
    anoExercicio: new Date().getFullYear(),
    regime: 'geral_25',
    resultadoAntesImpostos: 45000000,
    variacoesPatrimoniaisPositivas: 0,
    variacoesPatrimoniaisNegativas: 0,
    multasCoimas: 450000,
    despesasRepresentacaoExcesso: 800000,
    amortizacoesExcesso: 1200000,
    despesasConfidenciais: 1500000,
    despesasNaoDocumentadas: 900000,
    donativosNaoAutorizados: 300000,
    encargosSegurosNaoGerais: 250000,
    outrosCustosNaoAceites: 100000,
    rendimentosIsentosOuIAC: 500000,
    liquidacaoProvisoriaAgosto: 1800000,
    retencoesFonteSofridas: 1950000,
    beneficiosFiscais: 0,
    taxaTributacaoAutonoma: 50,
  });

  const calculationResult = calculateImpostoIndustrialCalculation(calcData);

  // Sync to parent dashboard
  React.useEffect(() => {
    if (onUpdateIIState) {
      onUpdateIIState(
        calculationResult.coletaExercicio,
        calcData.liquidacaoProvisoriaAgosto || 0
      );
    }
  }, [calcData]);

  // State for Provisional Liquidation (August)
  const [vendasPrimeiroSemestre, setVendasPrimeiroSemestre] = useState<number>(90000000);
  const valorLiqProvisoriaCalculada = Number((vendasPrimeiroSemestre * 0.02).toFixed(2));

  // Tabela oficial de amortizações (Decreto Executivo 134/13)
  const amortizacoesTabela = [
    { grupo: 'Edifícios e Construções', item: 'Edifícios industriais e fabris', taxa: '5%', vidaUtil: '20 anos' },
    { grupo: 'Edifícios e Construções', item: 'Edifícios de habitação e comerciais / escritórios', taxa: '2%', vidaUtil: '50 anos' },
    { grupo: 'Equipamento Básico / Maquinaria', item: 'Máquinas e aparelhos para indústria transformadora', taxa: '12.5%', vidaUtil: '8 anos' },
    { grupo: 'Equipamento Básico / Maquinaria', item: 'Aparelhos de precisão e laboratório', taxa: '20%', vidaUtil: '5 anos' },
    { grupo: 'Meios de Transporte', item: 'Viaturas ligeiras de passageiros ou mistas', taxa: '25%', vidaUtil: '4 anos' },
    { grupo: 'Meios de Transporte', item: 'Viaturas pesadas de carga e mercadorias', taxa: '20%', vidaUtil: '5 anos' },
    { grupo: 'Equipamento Informático & TI', item: 'Computadores, servidores e periféricos', taxa: '33.33%', vidaUtil: '3 anos' },
    { grupo: 'Equipamento Informático & TI', item: 'Software adquirido e licenças de exploração', taxa: '33.33%', vidaUtil: '3 anos' },
    { grupo: 'Mobiliário e Outros', item: 'Mobiliário de escritório e secretárias', taxa: '10%', vidaUtil: '10 anos' },
    { grupo: 'Mobiliário e Outros', item: 'Aparelhos de climatização e ar condicionado', taxa: '16.66%', vidaUtil: '6 anos' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Nav */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('modelo1')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'modelo1'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Reconciliação Fiscal & Apuramento Modelo 1 (Lei 26/20)
        </button>
        <button
          onClick={() => setActiveSubTab('provisoria')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'provisoria'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Liquidação Provisória sobre Vendas (2% em Agosto)
        </button>
        <button
          onClick={() => setActiveSubTab('amortizacoes')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'amortizacoes'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Tabela Oficial de Amortizações (Dec. 134/13)
        </button>
      </div>

      {/* SUB-TAB 1: RECONCILIAÇÃO FISCAL MODELO 1 */}
      {activeSubTab === 'modelo1' && (
        <div className="space-y-6">
          {/* Top Options Bar */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Exercício Económico</label>
                <input
                  type="number"
                  value={calcData.anoExercicio}
                  onChange={(e) => setCalcData({ ...calcData, anoExercicio: Number(e.target.value) })}
                  className="mt-0.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 w-24 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Sector / Taxa Aplicável</label>
                <select
                  value={calcData.regime}
                  onChange={(e) => setCalcData({ ...calcData, regime: e.target.value as IndustrialTaxRegime })}
                  className="mt-0.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="geral_25">Regime Geral (25% - Lei 26/20)</option>
                  <option value="agricola_10">Sector Agrícola, Pecuária e Pescas (10%)</option>
                  <option value="bancario_telecom_35">Bancos, Seguros e Telecomunicações (35%)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Tributação Autónoma</label>
                <select
                  value={calcData.taxaTributacaoAutonoma}
                  onChange={(e) => setCalcData({ ...calcData, taxaTributacaoAutonoma: Number(e.target.value) })}
                  className="mt-0.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option value={50}>50% (Geral sobre despesas confidenciais)</option>
                  <option value={70}>70% (Entidade com isenção total/parcial)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCalcData({
                  anoExercicio: 2026,
                  regime: 'geral_25',
                  resultadoAntesImpostos: 30000000,
                  variacoesPatrimoniaisPositivas: 0,
                  variacoesPatrimoniaisNegativas: 0,
                  multasCoimas: 350000,
                  despesasRepresentacaoExcesso: 600000,
                  amortizacoesExcesso: 800000,
                  despesasConfidenciais: 1000000,
                  despesasNaoDocumentadas: 500000,
                  donativosNaoAutorizados: 200000,
                  encargosSegurosNaoGerais: 150000,
                  outrosCustosNaoAceites: 0,
                  rendimentosIsentosOuIAC: 400000,
                  liquidacaoProvisoriaAgosto: 1400000,
                  retencoesFonteSofridas: 1200000,
                  beneficiosFiscais: 0,
                  taxaTributacaoAutonoma: 50,
                })}
                className="text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded border border-amber-300 transition-colors cursor-pointer"
              >
                ✨ Preencher Exemplo Real de Fecho
              </button>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 block">Prazo Legal Limite de Entrega</span>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  Até 31 de Maio (Art. 58º CII)
                </span>
              </div>
            </div>
          </div>

          {/* Reconciliação: Inputs & Custos Não Dedutíveis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Esquerda: Base Contabilística e Deduções */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Resultado Contabilístico & Ajustes Patrimoniais
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resultado Contabilístico Antes de Impostos (RAI - Saldo da Conta 88)
                </label>
                <input
                  type="number"
                  value={calcData.resultadoAntesImpostos || 0}
                  onChange={(e) => setCalcData({ ...calcData, resultadoAntesImpostos: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-2 font-bold focus:ring-1 focus:ring-slate-900"
                  placeholder="Lucro ou Prejuízo Contabilístico"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Valor apurado na Demonstração de Resultados antes do imposto sobre rendimento.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Variações Patrimoniais Negativas (+)
                  </label>
                  <input
                    type="number"
                    value={calcData.variacoesPatrimoniaisNegativas || 0}
                    onChange={(e) => setCalcData({ ...calcData, variacoesPatrimoniaisNegativas: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Variações Patrimoniais Positivas (-)
                  </label>
                  <input
                    type="number"
                    value={calcData.variacoesPatrimoniaisPositivas || 0}
                    onChange={(e) => setCalcData({ ...calcData, variacoesPatrimoniaisPositivas: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rendimentos Não Sujeitos / Tributados em IAC (-)
                </label>
                <input
                  type="number"
                  value={calcData.rendimentosIsentosOuIAC || 0}
                  onChange={(e) => setCalcData({ ...calcData, rendimentosIsentosOuIAC: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  placeholder="ex: Dividendos auferidos já sujeitos a IAC"
                />
              </div>

              {/* Deduções à Coleta */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Deduções à Coleta do Exercício (Pagamentos Antecipados)
                </h4>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Liquidação Provisória de Agosto (2% das Vendas)</span>
                    <span className="font-mono text-indigo-700 font-semibold">{formatKz(calcData.liquidacaoProvisoriaAgosto)}</span>
                  </div>
                  <input
                    type="number"
                    value={calcData.liquidacaoProvisoriaAgosto || 0}
                    onChange={(e) => setCalcData({ ...calcData, liquidacaoProvisoriaAgosto: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Retenções na Fonte Suportadas no Ano (6,5% de Serviços)</span>
                    <span className="font-mono text-red-700 font-semibold">{formatKz(calcData.retencoesFonteSofridas)}</span>
                  </div>
                  <input
                    type="number"
                    value={calcData.retencoesFonteSofridas || 0}
                    onChange={(e) => setCalcData({ ...calcData, retencoesFonteSofridas: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Benefícios Fiscais de Investimento (AIPEX)</span>
                    <span className="font-mono text-emerald-700 font-semibold">{formatKz(calcData.beneficiosFiscais)}</span>
                  </div>
                  <input
                    type="number"
                    value={calcData.beneficiosFiscais || 0}
                    onChange={(e) => setCalcData({ ...calcData, beneficiosFiscais: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Direita: Custos Não Dedutíveis (Art. 18º do CII) */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  Custos Não Dedutíveis • Acréscimos ao Lucro (Art.º 18.º)
                </h3>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Total: {formatKz(calculationResult.totalAcrescimos)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Multas, Coimas e Encargos por Infrações Fiscais/Laborais
                </label>
                <input
                  type="number"
                  value={calcData.multasCoimas || 0}
                  onChange={(e) => setCalcData({ ...calcData, multasCoimas: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Despesas de Representação em Excesso (&gt; 1% das Vendas)
                </label>
                <input
                  type="number"
                  value={calcData.despesasRepresentacaoExcesso || 0}
                  onChange={(e) => setCalcData({ ...calcData, despesasRepresentacaoExcesso: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Amortizações do Exercício Acima das Taxas Oficiais (Dec. 134/13)
                </label>
                <input
                  type="number"
                  value={calcData.amortizacoesExcesso || 0}
                  onChange={(e) => setCalcData({ ...calcData, amortizacoesExcesso: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="bg-amber-50/50 p-2.5 rounded border border-amber-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Encargos Sujeitos a Tributação Autónoma ({calcData.taxaTributacaoAutonoma}%)
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900">
                    Despesas Confidenciais (sem indicação do beneficiário)
                  </label>
                  <input
                    type="number"
                    value={calcData.despesasConfidenciais || 0}
                    onChange={(e) => setCalcData({ ...calcData, despesasConfidenciais: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-white border border-amber-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900">
                    Despesas Não Documentadas (sem fatura/recibo idóneo)
                  </label>
                  <input
                    type="number"
                    value={calcData.despesasNaoDocumentadas || 0}
                    onChange={(e) => setCalcData({ ...calcData, despesasNaoDocumentadas: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-white border border-amber-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Donativos Não Autorizados / Acima da Lei do Mecenato
                </label>
                <input
                  type="number"
                  value={calcData.donativosNaoAutorizados || 0}
                  onChange={(e) => setCalcData({ ...calcData, donativosNaoAutorizados: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700">
                  Seguros de Saúde e Vida Não Generalizados a Todos os Colaboradores
                </label>
                <input
                  type="number"
                  value={calcData.encargosSegurosNaoGerais || 0}
                  onChange={(e) => setCalcData({ ...calcData, encargosSegurosNaoGerais: Number(e.target.value) })}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Resultado da Apuração da Matéria Coletável & Coleta */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  Apuramento Definitivo Modelo 1 • Exercício {calculationResult.anoExercicio}
                </span>
                <h4 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Liquidação do Imposto Industrial e Tributações Autónomas
                </h4>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Geral a Entregar à AGT</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-amber-400">
                  {formatKz(calculationResult.totalAPagarAGT)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Matéria Coletável</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">
                  {formatKz(calculationResult.materiaColetavel)}
                </span>
                <span className="text-[11px] text-slate-400">Lucro Tributável Ajustado</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Coleta Bruta ({calculationResult.taxaPercentual}%)</span>
                <span className="text-base font-bold font-mono text-amber-400 mt-1 block">
                  {formatKz(calculationResult.coletaExercicio)}
                </span>
                <span className="text-[11px] text-slate-400">Antes das Deduções</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Deduções à Coleta</span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                  -{formatKz(calculationResult.totalDeducoesColeta)}
                </span>
                <span className="text-[11px] text-slate-400">Liq. Provisória + Retenções</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Tributação Autónoma ({calcData.taxaTributacaoAutonoma}%)</span>
                <span className="text-base font-bold font-mono text-red-400 mt-1 block">
                  +{formatKz(calculationResult.valorTributacaoAutonoma)}
                </span>
                <span className="text-[11px] text-slate-400">Despesas sem comprovativo</span>
              </div>
            </div>

            {/* Esquema de Lançamento no PGC Angolano */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Lançamento Contabilístico de Fecho do Imposto Industrial (PGC Angolano)
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400 font-semibold grid grid-cols-12 pb-1 border-b border-slate-800 text-[11px]">
                  <span className="col-span-3">Conta PGC</span>
                  <span className="col-span-5">Descrição do Movimento</span>
                  <span className="col-span-2 text-right">Débito</span>
                  <span className="col-span-2 text-right">Crédito</span>
                </div>
                {calculationResult.lancamentosPgc.map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-slate-200">
                    <span className="col-span-3 text-amber-300">{entry.conta}</span>
                    <span className="col-span-5 text-slate-300">{entry.descricao}</span>
                    <span className="col-span-2 text-right text-emerald-400">
                      {entry.debito > 0 ? formatKz(entry.debito) : '-'}
                    </span>
                    <span className="col-span-2 text-right text-amber-300">
                      {entry.credito > 0 ? formatKz(entry.credito) : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LIQUIDAÇÃO PROVISÓRIA DE AGOSTO */}
      {activeSubTab === 'provisoria' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Liquidação Provisória sobre as Vendas (Art.º 66.º e 67.º do Código do Imposto Industrial)
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Os contribuintes do Regime Geral do Imposto Industrial devem proceder, no mês de <strong>Agosto</strong> de cada ano, 
              ao pagamento provisório do imposto, à taxa de <strong>2%</strong> calculada sobre o volume total de vendas e prestações 
              de serviços faturadas no primeiro semestre do exercício (Janeiro a Junho).
            </p>

            <div className="max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Volume de Vendas e Serviços Faturados no 1.º Semestre (1 Jan a 30 Jun)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={vendasPrimeiroSemestre}
                    onChange={(e) => setVendasPrimeiroSemestre(Number(e.target.value))}
                    className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded px-3 py-2 font-bold focus:ring-1 focus:ring-slate-900"
                  />
                  <span className="font-mono text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {formatKz(vendasPrimeiroSemestre)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-900">
                    Montante Devido em Agosto (Taxa de 2%):
                  </span>
                  <span className="font-mono font-extrabold text-lg text-indigo-950">
                    {formatKz(valorLiqProvisoriaCalculada)}
                  </span>
                </div>

                <div className="text-xs text-indigo-800 space-y-1 pt-2 border-t border-indigo-200">
                  <div className="flex justify-between">
                    <span>Prazo Limite:</span>
                    <span className="font-bold">31 de Agosto do ano em curso</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documento de Liquidação:</span>
                    <span className="font-mono">DLI - Imposto Industrial Provisório</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tratamento no Modelo 1:</span>
                    <span>Deduzido integralmente como pagamento por conta em Maio</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800 block mb-1">Registo Contabilístico em Agosto (PGC):</span>
                <div className="font-mono text-[11px] space-y-1">
                  <div>Débito: <span className="font-bold text-slate-900">34.1.2 - II Pagamentos por Conta / Liq. Provisória</span> ({formatKz(valorLiqProvisoriaCalculada)})</div>
                  <div>Crédito: <span className="font-bold text-slate-900">43.1 - Depósitos à Ordem (Banco)</span> ({formatKz(valorLiqProvisoriaCalculada)})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TABELA DE AMORTIZAÇÕES */}
      {activeSubTab === 'amortizacoes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tabela Oficial de Taxas Máximas de Amortização Aceites pela AGT
                </h3>
                <p className="text-xs text-slate-500">
                  Decreto Executivo n.º 134/13 • Utilizada obrigatoriamente no Mapa Modelo 2 do Dossier Fiscal.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Dossier Fiscal Mod. 2
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Grupo de Activo Fixo</th>
                    <th className="py-2.5 px-3">Descrição do Bem / Activo</th>
                    <th className="py-2.5 px-3 text-center">Taxa Máxima Anual</th>
                    <th className="py-2.5 px-3 text-center">Vida Útil Estimada</th>
                    <th className="py-2.5 px-3">Consequência de Excesso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {amortizacoesTabela.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{item.grupo}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">{item.item}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">{item.taxa}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{item.vidaUtil}</td>
                      <td className="py-2.5 px-3 font-sans text-[11px] text-red-600">
                        Acréscimo no Mod. 1 (Art. 18º CII)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
