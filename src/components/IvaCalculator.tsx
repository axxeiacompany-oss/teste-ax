import React, { useState } from 'react';
import { 
  Calculator, 
  Receipt, 
  ShieldCheck, 
  HelpCircle, 
  Download, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { 
  IvaMonthlySettlement, 
  InvoiceCalculationResult, 
  IvaRegime 
} from '../types/tax';
import { 
  calculateIvaMonthlySettlement, 
  calculateInvoice, 
  formatKz 
} from '../utils/taxCalculators';

interface IvaCalculatorProps {
  onUpdateIvaState?: (aPagar: number, credito: number) => void;
}

export const IvaCalculator: React.FC<IvaCalculatorProps> = ({ onUpdateIvaState }) => {
  const [activeSubTab, setActiveSubTab] = useState<'apuramento' | 'faturacao' | 'regimes'>('apuramento');

  // State for Monthly Settlement
  const [settlementData, setSettlementData] = useState<Partial<IvaMonthlySettlement>>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    regime: 'geral',
    vendas14: 15000000,
    vendas7: 2500000,
    vendas5: 0,
    vendasIsentas: 1000000,
    comprasExistencias: 8000000,
    comprasImobilizado: 2000000,
    comprasServicos: 1500000,
    regularizacoesFavorEstado: 0,
    regularizacoesFavorSujeitoPassivo: 0,
    ivaCativadoPorClientes: 350000,
    creditoAnteriorReportado: 120000,
  });

  const settlementResult = calculateIvaMonthlySettlement(settlementData);

  // Sync to parent dashboard when updated
  React.useEffect(() => {
    if (onUpdateIvaState) {
      onUpdateIvaState(settlementResult.ivaAPagar, settlementResult.creditoFiscalParaReporte);
    }
  }, [settlementData]);

  // State for Invoice Simulator
  const [invoiceInput, setInvoiceInput] = useState<{
    valorBase: number;
    tipoOperacao: 'venda_bens' | 'prestacao_servicos';
    taxaIva: number;
    motivoIsencao: string;
    tipoCliente: 'geral' | 'estado_organismo_publico' | 'grande_contribuinte_banco_petrolifera';
    aplicarRetencao6_5Manual: boolean;
    aplicarImpostoSelo1: boolean;
  }>({
    valorBase: 5000000,
    tipoOperacao: 'prestacao_servicos',
    taxaIva: 14,
    motivoIsencao: '',
    tipoCliente: 'grande_contribuinte_banco_petrolifera',
    aplicarRetencao6_5Manual: true,
    aplicarImpostoSelo1: false,
  });

  const invoiceResult: InvoiceCalculationResult = calculateInvoice(invoiceInput);

  // State for Regime Checker
  const [volumeFaturadoAnual, setVolumeFaturadoAnual] = useState<number>(35000000);
  const [temImportacoes, setTemImportacoes] = useState<boolean>(true);

  const getRegimeClassification = (volume: number) => {
    if (volume > 25000000) {
      return {
        regime: 'Regime Geral de IVA',
        cor: 'text-amber-800 bg-amber-50 border-amber-300',
        descricao: 'Volume anual superior a 25.000.000 Kz. Enquadramento obrigatório no Regime Geral.',
        obrigacoes: [
          'Emissão de faturas em software de faturação certificado pela AGT.',
          'Submissão mensal do ficheiro SAF-T (AO) até dia 15 do mês seguinte.',
          'Entrega mensal da Declaração Periódica Modelo 7 e pagamento até ao último dia do mês.',
          'Direito integral à dedução do IVA suportado em existências, imobilizado e serviços (com regras do Art. 19º e 20º CIVA).'
        ]
      };
    } else if (volume >= 10000000 && volume <= 25000000) {
      return {
        regime: 'Regime Simplificado de IVA',
        cor: 'text-blue-800 bg-blue-50 border-blue-300',
        descricao: 'Volume anual entre 10.000.000 Kz e 25.000.000 Kz (ou opção voluntária).',
        obrigacoes: [
          'Taxa de 7% sobre o volume de receitas faturadas e recebidas.',
          'Possibilidade de deduzir 7% do IVA incorrido nas aquisições devidamente documentadas.',
          'Possibilidade de optar pelo Regime Geral mediante requerimento à AGT (com permanência mínima de 3 anos).',
          'Declaração simplificada de faturação mensal ou trimestral.'
        ]
      };
    } else {
      return {
        regime: 'Regime de Exclusão de IVA',
        cor: 'text-slate-800 bg-slate-100 border-slate-300',
        descricao: 'Volume anual igual ou inferior a 10.000.000 Kz.',
        obrigacoes: [
          'Não liquida IVA nas suas faturas nem fatura com menção a imposto.',
          'Não tem direito à dedução de qualquer IVA suportado nas compras (o IVA é custo).',
          'Sujeito ao pagamento de 1% de Imposto de Selo sobre o valor das faturas/recibos emitidos.',
          'Obrigatoriedade de emitir faturas ou recibos com menção: "IVA - Regime de Exclusão".'
        ]
      };
    }
  };

  const regimeInfo = getRegimeClassification(volumeFaturadoAnual);

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Nav */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('apuramento')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'apuramento'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Mapa de Apuramento Mensal (Modelo 7 AGT)
        </button>
        <button
          onClick={() => setActiveSubTab('faturacao')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'faturacao'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Simulador de Faturação, Cativação & Retenção
        </button>
        <button
          onClick={() => setActiveSubTab('regimes')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'regimes'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Enquadramento nos Regimes de IVA
        </button>
      </div>

      {/* SUB-TAB 1: APURAMENTO MENSAL */}
      {activeSubTab === 'apuramento' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Mês de Referência</label>
                <select
                  value={settlementData.mes}
                  onChange={(e) => setSettlementData({ ...settlementData, mes: Number(e.target.value) })}
                  className="mt-0.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  {[
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                  ].map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Ano Fiscal</label>
                <input
                  type="number"
                  value={settlementData.ano}
                  onChange={(e) => setSettlementData({ ...settlementData, ano: Number(e.target.value) })}
                  className="mt-0.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 w-24 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Regime de IVA</label>
                <select
                  value={settlementData.regime}
                  onChange={(e) => setSettlementData({ ...settlementData, regime: e.target.value as IvaRegime })}
                  className="mt-0.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="geral">Regime Geral (Taxas 14%, 7%, 5%)</option>
                  <option value="simplificado">Regime Simplificado (7% Recebimentos)</option>
                  <option value="exclusao">Regime de Exclusão (Isento CIVA)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSettlementData({
                  mes: new Date().getMonth() + 1,
                  ano: 2026,
                  regime: 'geral',
                  vendas14: 10000000,
                  vendas7: 2000000,
                  vendas5: 0,
                  vendasIsentas: 500000,
                  comprasExistencias: 6000000,
                  comprasImobilizado: 1500000,
                  comprasServicos: 1000000,
                  regularizacoesFavorEstado: 0,
                  regularizacoesFavorSujeitoPassivo: 0,
                  ivaCativadoPorClientes: 280000,
                  creditoAnteriorReportado: 100000,
                })}
                className="text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded border border-amber-300 transition-colors cursor-pointer"
              >
                ✨ Preencher Exemplo Real de Empresa
              </button>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 block">Status da Declaração</span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Modelo 7 • Simulação Automática
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Vendas (Débito) & Compras (Crédito) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QUADRO A: OPERAÇÕES ATIVAS / IVA LIQUIDADO */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <Receipt className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  Quadro A • Vendas & IVA Liquidado (Favor do Estado)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Conta 34.2.3</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Vendas à Taxa Geral (14%)</span>
                    <span className="font-mono text-slate-900 font-semibold">{formatKz(settlementResult.ivaLiquidado14)} IVA</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.vendas14 || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, vendas14: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Valor Base Tributável em Kz"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Vendas à Taxa Cesta Básica (7%)</span>
                    <span className="font-mono text-slate-900 font-semibold">{formatKz(settlementResult.ivaLiquidado7)} IVA</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.vendas7 || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, vendas7: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Valor Base Tributável em Kz"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Vendas à Taxa Reduzida Especial (5%)</span>
                    <span className="font-mono text-slate-900 font-semibold">{formatKz(settlementResult.ivaLiquidado5)} IVA</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.vendas5 || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, vendas5: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Valor Base Tributável em Kz"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Operações Isentas / Isenções do Art. 12º</span>
                    <span className="font-mono text-slate-400 font-semibold">0,00 Kz IVA</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.vendasIsentas || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, vendasIsentas: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Valor Base Isento em Kz"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Regularizações a Favor do Estado</span>
                    <span className="font-mono text-amber-700 font-semibold">+ {formatKz(settlementData.regularizacoesFavorEstado || 0)}</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.regularizacoesFavorEstado || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, regularizacoesFavorEstado: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Erros em faturas ou notas de débito"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Total IVA Gerado a Favor do Estado:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatKz(settlementResult.totalIvaLiquidado + (settlementData.regularizacoesFavorEstado || 0))}
                </span>
              </div>
            </div>

            {/* QUADRO B: OPERAÇÕES PASSIVAS / IVA DEDUTÍVEL & CATIVAÇÕES */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Quadro B • Aquisições & Créditos de IVA (Favor do Sujeito Passivo)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Conta 34.2.2</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Compras de Existências / Mercadorias</span>
                    <span className="font-mono text-emerald-700 font-semibold">{formatKz(settlementResult.ivaDedutivelExistencias)} Dedutível</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.comprasExistencias || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, comprasExistencias: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Valor Base de Compras"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Aquisições de Imobilizado / Activos Fixos</span>
                    <span className="font-mono text-emerald-700 font-semibold">{formatKz(settlementResult.ivaDedutivelImobilizado)} Dedutível</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.comprasImobilizado || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, comprasImobilizado: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Equipamentos, viaturas comerciais, etc."
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Outros Bens e Prestação de Serviços Suportados</span>
                    <span className="font-mono text-emerald-700 font-semibold">{formatKz(settlementResult.ivaDedutivelServicos)} Dedutível</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.comprasServicos || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, comprasServicos: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Consultoria, rendas comerciais, telecomunicações"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">IVA Cativado por Clientes (50% / 100% Retido)</span>
                    <span className="font-mono text-amber-700 font-semibold">{formatKz(settlementData.ivaCativadoPorClientes || 0)}</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.ivaCativadoPorClientes || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, ivaCativadoPorClientes: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Conta 34.2.6 (Retenção sofrida de bancos/Estado)"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Crédito Fiscal Reportado do Mês Anterior</span>
                    <span className="font-mono text-emerald-700 font-semibold">{formatKz(settlementData.creditoAnteriorReportado || 0)}</span>
                  </div>
                  <input
                    type="number"
                    value={settlementData.creditoAnteriorReportado || 0}
                    onChange={(e) => setSettlementData({ ...settlementData, creditoAnteriorReportado: Number(e.target.value) })}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                    placeholder="Saldo credor do Modelo 7 anterior"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Total Deduções & Créditos a Favor do Contribuinte:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {formatKz(
                    settlementResult.totalIvaDedutivel +
                    (settlementData.ivaCativadoPorClientes || 0) +
                    (settlementData.creditoAnteriorReportado || 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* QUADRO C: RESULTADO DO APURAMENTO MENSAL */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  Apuramento Oficial Modelo 7 • Mês {settlementResult.mes}/{settlementResult.ano}
                </span>
                <h4 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  {settlementResult.saldoApuramento > 0
                    ? 'Saldo Devedor: IVA a Pagar à AGT'
                    : 'Saldo Credor: Crédito Fiscal de IVA a Reportar'}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Montante Líquido Apurado</span>
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                  settlementResult.saldoApuramento > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {settlementResult.saldoApuramento > 0
                    ? formatKz(settlementResult.ivaAPagar)
                    : formatKz(settlementResult.creditoFiscalParaReporte)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Total Débito Fiscal (Obrigação)</span>
                <span className="text-base font-bold font-mono text-slate-200 mt-1 block">
                  {formatKz(settlementResult.totalIvaLiquidado + (settlementData.regularizacoesFavorEstado || 0))}
                </span>
                <span className="text-[11px] text-slate-400">IVA Liquidado + Regularizações</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Total Crédito Fiscal (Direito)</span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                  {formatKz(
                    settlementResult.totalIvaDedutivel +
                    (settlementData.ivaCativadoPorClientes || 0) +
                    (settlementData.creditoAnteriorReportado || 0)
                  )}
                </span>
                <span className="text-[11px] text-slate-400">Dedutível + Cativações + Reporte</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block">Prazo Legal Limite de Entrega</span>
                <span className="text-base font-bold text-amber-300 mt-1 block">
                  Último dia útil do mês seguinte
                </span>
                <span className="text-[11px] text-slate-400">CIVA Art. 43º e 44º</span>
              </div>
            </div>

            {/* Esquema de Lançamento no PGC Angolano */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Lançamento Contabilístico de Apuramento do IVA (PGC Angolano)
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400 font-semibold grid grid-cols-12 pb-1 border-b border-slate-800 text-[11px]">
                  <span className="col-span-3">Conta PGC</span>
                  <span className="col-span-5">Descrição da Operação</span>
                  <span className="col-span-2 text-right">Débito</span>
                  <span className="col-span-2 text-right">Crédito</span>
                </div>
                {/* Fecho de IVA Liquidado */}
                <div className="grid grid-cols-12 text-slate-200">
                  <span className="col-span-3 text-amber-300">34.2.3</span>
                  <span className="col-span-5 text-slate-300">IVA Liquidado (Anulação de Saldo)</span>
                  <span className="col-span-2 text-right text-emerald-400">{formatKz(settlementResult.totalIvaLiquidado)}</span>
                  <span className="col-span-2 text-right text-slate-600">-</span>
                </div>
                {/* Fecho de IVA Dedutível */}
                <div className="grid grid-cols-12 text-slate-200">
                  <span className="col-span-3 text-emerald-300">34.2.2</span>
                  <span className="col-span-5 text-slate-300">IVA Dedutível (Transferência)</span>
                  <span className="col-span-2 text-right text-slate-600">-</span>
                  <span className="col-span-2 text-right text-amber-300">{formatKz(settlementResult.totalIvaDedutivel)}</span>
                </div>
                {/* Fecho de IVA Cativado se houver */}
                {settlementData.ivaCativadoPorClientes! > 0 && (
                  <div className="grid grid-cols-12 text-slate-200">
                    <span className="col-span-3 text-amber-300">34.2.6</span>
                    <span className="col-span-5 text-slate-300">IVA Cativado por Terceiros (Transferência)</span>
                    <span className="col-span-2 text-right text-slate-600">-</span>
                    <span className="col-span-2 text-right text-amber-300">{formatKz(settlementData.ivaCativadoPorClientes)}</span>
                  </div>
                )}
                {/* Saldo a pagar ou recuperar */}
                {settlementResult.saldoApuramento > 0 ? (
                  <div className="grid grid-cols-12 font-bold text-white bg-amber-950/40 py-1 rounded">
                    <span className="col-span-3 text-amber-400">34.2.4</span>
                    <span className="col-span-5 text-amber-200">IVA a Pagar à AGT (Obrigação Líquida)</span>
                    <span className="col-span-2 text-right text-slate-600">-</span>
                    <span className="col-span-2 text-right text-amber-400">{formatKz(settlementResult.ivaAPagar)}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 font-bold text-white bg-emerald-950/40 py-1 rounded">
                    <span className="col-span-3 text-emerald-400">34.2.5</span>
                    <span className="col-span-5 text-emerald-200">IVA a Recuperar / Reporte (Direito)</span>
                    <span className="col-span-2 text-right text-emerald-400">{formatKz(settlementResult.creditoFiscalParaReporte)}</span>
                    <span className="col-span-2 text-right text-slate-600">-</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SIMULADOR DE FATURAÇÃO & CATIVAÇÃO */}
      {activeSubTab === 'faturacao' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Simulador de Fatura com Retenções em Angola
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Em Angola, a faturação comercial está sujeita a regras específicas de cativação de IVA (50% ou 100%)
              e de Retenção na Fonte de Imposto Industrial de 6,5% quando se trata de prestação de serviços. 
              Configure os parâmetros para ver o valor líquido a faturar e os lançamentos no PGC.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Parâmetros da Operação
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor Base dos Bens / Serviços (Ilíquido sem impostos)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={invoiceInput.valorBase}
                    onChange={(e) => setInvoiceInput({ ...invoiceInput, valorBase: Number(e.target.value) })}
                    className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-900 font-bold"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Kz (AOA)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Operação
                  </label>
                  <select
                    value={invoiceInput.tipoOperacao}
                    onChange={(e) => setInvoiceInput({ ...invoiceInput, tipoOperacao: e.target.value as any })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-2 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="prestacao_servicos">Prestação de Serviços (Sujeita a Retenção II)</option>
                    <option value="venda_bens">Venda de Mercadorias / Bens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taxa de IVA Aplicável
                  </label>
                  <select
                    value={invoiceInput.taxaIva}
                    onChange={(e) => setInvoiceInput({ ...invoiceInput, taxaIva: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-2 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value={14}>14% - Taxa Geral Normal</option>
                    <option value={7}>7% - Taxa Reduzida Cesta Básica</option>
                    <option value={5}>5% - Taxa Super Reduzida</option>
                    <option value={0}>0% - Isenção (Art. 12º CIVA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perfil do Cliente Adquirente
                </label>
                <select
                  value={invoiceInput.tipoCliente}
                  onChange={(e) => setInvoiceInput({ ...invoiceInput, tipoCliente: e.target.value as any })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-2 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="grande_contribuinte_banco_petrolifera">
                    Grande Contribuinte / Banco / Seguradora / Petrolífera (Cativação 50% de IVA)
                  </option>
                  <option value="estado_organismo_publico">
                    Estado / Organismo Público / Empresa Pública (Cativação 100% de IVA)
                  </option>
                  <option value="geral">
                    Empresa Geral / PME / Particular (Sem Cativação de IVA)
                  </option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                {invoiceInput.tipoOperacao === 'prestacao_servicos' && invoiceInput.tipoCliente === 'geral' && (
                  <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invoiceInput.aplicarRetencao6_5Manual}
                      onChange={(e) => setInvoiceInput({ ...invoiceInput, aplicarRetencao6_5Manual: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span>Aplicar Retenção na Fonte de Imposto Industrial de 6,5% (Art. 71º CII)</span>
                  </label>
                )}

                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invoiceInput.aplicarImpostoSelo1}
                    onChange={(e) => setInvoiceInput({ ...invoiceInput, aplicarImpostoSelo1: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>Aplicar 1% de Imposto de Selo (Tabela Geral do Imposto de Selo)</span>
                </label>
              </div>
            </div>

            {/* Invoice Breakdown Simulation */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Espelho de Fatura & Liquidação Financeira
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    SAF-T (AO) Compliant
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Valor Base dos Serviços / Bens:</span>
                    <span className="font-mono font-bold text-slate-900">{formatKz(invoiceResult.valorBase)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">IVA ({invoiceResult.taxaIva}%):</span>
                    <span className="font-mono font-semibold text-slate-900">+{formatKz(invoiceResult.valorIvaBruto)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 bg-slate-50 px-2 rounded">
                    <span className="font-semibold text-slate-800">Total Faturado Ilíquido:</span>
                    <span className="font-mono font-bold text-slate-900">{formatKz(invoiceResult.totalFaturado)}</span>
                  </div>

                  {invoiceResult.valorIvaCativado > 0 && (
                    <div className="flex justify-between py-1 text-amber-800 bg-amber-50/70 px-2 rounded">
                      <span>(-) Cativação de IVA ({invoiceResult.taxaCativacaoIva}% retido pelo cliente):</span>
                      <span className="font-mono font-semibold">-{formatKz(invoiceResult.valorIvaCativado)}</span>
                    </div>
                  )}

                  {invoiceResult.valorRetencaoFonte > 0 && (
                    <div className="flex justify-between py-1 text-red-800 bg-red-50/70 px-2 rounded">
                      <span>(-) Retenção na Fonte II (6,5% Art. 71º):</span>
                      <span className="font-mono font-semibold">-{formatKz(invoiceResult.valorRetencaoFonte)}</span>
                    </div>
                  )}

                  {invoiceResult.valorImpostoSelo > 0 && (
                    <div className="flex justify-between py-1 text-indigo-800 bg-indigo-50/70 px-2 rounded">
                      <span>(+) Imposto de Selo (1%):</span>
                      <span className="font-mono font-semibold">+{formatKz(invoiceResult.valorImpostoSelo)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Final */}
              <div className="mt-6 pt-4 border-t-2 border-slate-900 bg-slate-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Valor Líquido Efetivo a Cobrar / Receber
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Entrada efetiva em caixa/banco pelo cliente
                    </span>
                  </div>
                  <span className="text-xl font-extrabold font-mono text-slate-900">
                    {formatKz(invoiceResult.totalLiquidoAReceber)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Journal Entries Breakdown */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Lançamentos Contabilísticos no PGC Angolano para este Documento
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Conta PGC</th>
                    <th className="py-2 px-3">Designação da Conta</th>
                    <th className="py-2 px-3">Fundamentação Fiscal</th>
                    <th className="py-2 px-3 text-right">Débito (Kz)</th>
                    <th className="py-2 px-3 text-right">Crédito (Kz)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceResult.lancamentosPgc.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{entry.conta}</td>
                      <td className="py-2.5 px-3 text-slate-700">{entry.descricao}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {entry.conta.includes('34.2.6') ? 'Dec. Pres. 180/19 (Cativação)' : 
                         entry.conta.includes('34.1.3') ? 'CII Art. 71º (Retenção 6,5%)' : 
                         entry.conta.includes('34.2.3') ? 'CIVA Art. 12º (14%)' : 'PGC Normal'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                        {entry.debito > 0 ? formatKz(entry.debito) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-700">
                        {entry.credito > 0 ? formatKz(entry.credito) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REGIMES DE IVA */}
      {activeSubTab === 'regimes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Verificador Automático de Enquadramento nos Regimes de IVA (AGT)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Introduza a estimativa ou histórico de volume de faturação anual para determinar as obrigações normativas da empresa.
            </p>

            <div className="max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Volume Anual de Negócios Faturado (ou Previsão Anual)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={volumeFaturadoAnual}
                    onChange={(e) => setVolumeFaturadoAnual(Number(e.target.value))}
                    className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded px-3 py-2 font-bold focus:ring-1 focus:ring-slate-900"
                  />
                  <span className="font-mono text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {formatKz(volumeFaturadoAnual)}
                  </span>
                </div>
              </div>

              {/* Dynamic Classification Result */}
              <div className={`p-4 rounded-lg border ${regimeInfo.cor} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">{regimeInfo.regime}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded border border-current">
                    Enquadramento Oficial
                  </span>
                </div>
                <p className="text-xs">{regimeInfo.descricao}</p>
                <div className="pt-2 border-t border-current/20">
                  <span className="text-[11px] font-bold block mb-1">Obrigações e Direitos Fiscais:</span>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {regimeInfo.obrigacoes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
