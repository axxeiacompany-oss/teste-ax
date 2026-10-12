import React, { useState } from 'react';
import { 
  Zap, 
  Receipt, 
  Calculator, 
  Calendar, 
  Users, 
  Building2, 
  ArrowRight, 
  Copy, 
  Check, 
  HelpCircle,
  FileCheck2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatKz } from '../utils/taxCalculators';

interface QuickActionsHubProps {
  onNavigateTab: (tab: string) => void;
}

export const QuickActionsHub: React.FC<QuickActionsHubProps> = ({ onNavigateTab }) => {
  // 1. Quick Invoice Tool State
  const [invoiceAmount, setInvoiceAmount] = useState<number>(1000000);
  const [invoiceType, setInvoiceType] = useState<'servico' | 'bens'>('servico');
  const [clientProfile, setClientProfile] = useState<'banco_gc' | 'estado' | 'empresa_normal'>('banco_gc');
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // Quick invoice math
  const taxaIva = 0.14;
  const valorIva = invoiceAmount * taxaIva;
  const totalFaturado = invoiceAmount + valorIva;

  let retencaoIvaPercent = 0;
  if (clientProfile === 'estado') retencaoIvaPercent = 1.0; // 100%
  else if (clientProfile === 'banco_gc') retencaoIvaPercent = 0.5; // 50%
  const valorIvaCativado = valorIva * retencaoIvaPercent;

  let retencaoIiPercent = 0;
  if (invoiceType === 'servico') {
    retencaoIiPercent = 0.065; // 6.5% Art 71 CII
  }
  const valorRetencaoIi = invoiceAmount * retencaoIiPercent;

  const valorLiquidoReceber = totalFaturado - valorIvaCativado - valorRetencaoIi;

  // Copy text for WhatsApp
  const invoiceSummaryText = `📄 *RESUMO DE FATURAÇÃO FISCAL (ANGOLA)*
• Valor Base: ${formatKz(invoiceAmount)}
• IVA (14%): +${formatKz(valorIva)}
• Total Faturado: ${formatKz(totalFaturado)}
${valorIvaCativado > 0 ? `• Cativação de IVA (${retencaoIvaPercent * 100}% retido pelo cliente): -${formatKz(valorIvaCativado)}\n` : ''}${valorRetencaoIi > 0 ? `• Retenção na Fonte II (6,5% retido pelo cliente): -${formatKz(valorRetencaoIi)}\n` : ''}💰 *VALOR LÍQUIDO A RECEBER NA CONTA:* ${formatKz(valorLiquidoReceber)}
(Base legal: CIVA Art. 12º/15º, Dec. Pres. 180/19 e CII Art. 71º)`;

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceSummaryText);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  // 2. Quick IVA 30-sec Check
  const [quickVendas, setQuickVendas] = useState<number>(5000000);
  const [quickCompras, setQuickCompras] = useState<number>(3000000);
  const quickIvaLiquidado = quickVendas * 0.14;
  const quickIvaDedutivel = quickCompras * 0.14;
  const quickSaldoIva = quickIvaLiquidado - quickIvaDedutivel;

  // 3. Quick August 2% Tool
  const [vendasSemestre, setVendasSemestre] = useState<number>(20000000);
  const valorAgosto2 = vendasSemestre * 0.02;

  // 4. Quick Salary Tool
  const [quickSalario, setQuickSalario] = useState<number>(250000);
  const inss3 = quickSalario * 0.03;
  const matColetavel = quickSalario - inss3;
  let quickIrt = 0;
  if (matColetavel <= 100000) quickIrt = 0;
  else if (matColetavel <= 150000) quickIrt = (matColetavel - 100000) * 0.13;
  else if (matColetavel <= 200000) quickIrt = 6500 + (matColetavel - 150000) * 0.16;
  else if (matColetavel <= 300000) quickIrt = 14500 + (matColetavel - 200000) * 0.18;
  else quickIrt = 32500 + (matColetavel - 300000) * 0.19;
  const quickLiquido = quickSalario - inss3 - quickIrt;

  return (
    <div className="space-y-6">
      {/* Friendly Guide Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl p-5 sm:p-6 shadow-sm border border-amber-400">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>MODO SIMPLIFICADO • CÁLCULOS EM 1 SEGUNDO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Sem complicações: O que você precisa de calcular agora?
          </h2>
          <p className="text-slate-900 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
            Elimine as dúvidas fiscais do dia a dia. Selecione a operação abaixo, insira o valor e obtenha na hora o resultado líquido, os descontos da AGT e o texto pronto para enviar.
          </p>
        </div>
      </div>

      {/* FERRAMENTA 1: SIMULADOR DE FATURAÇÃO COM CATIVAÇÃO E RETENÇÃO */}
      <div className="bg-white rounded-xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Simulador Rápido: Faturar a um Cliente (com Cativação e Retenção)
              </h3>
              <p className="text-xs text-slate-500">
                Veja quanto cobrar, quanto o cliente vai reter e quanto cai na sua conta bancária.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyInvoice}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded cursor-pointer transition-colors"
          >
            {copiedInvoice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedInvoice ? 'Copiado para WhatsApp!' : 'Copiar Resumo'}</span>
          </button>
        </div>

        {/* Inputs Simplificados */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Valor Base do Serviço ou Produto (Kz)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="w-full text-base font-bold font-mono bg-slate-50 border-2 border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">Kz</span>
              </div>
              {/* Botões de predefinição rápida */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[200000, 500000, 1000000, 2500000, 5000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInvoiceAmount(val)}
                    className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer"
                  >
                    {formatKz(val).replace(',00 Kz', '')} Kz
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                O que você está a vender?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceType('servico')}
                  className={`py-2 px-3 text-xs font-bold rounded border cursor-pointer text-left transition-all ${
                    invoiceType === 'servico'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🛠️ Prestação de Serviço
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">Tem retenção de 6,5%</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceType('bens')}
                  className={`py-2 px-3 text-xs font-bold rounded border cursor-pointer text-left transition-all ${
                    invoiceType === 'bens'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  📦 Venda de Mercadoria
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">Sem retenção de 6,5%</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quem é o seu cliente?
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'banco_gc', title: '🏦 Banco, Seguradora, Petrolífera ou Grande Contribuinte', desc: 'Retém 50% do seu IVA (Dec. Pres. 180/19)' },
                  { id: 'estado', title: '🏛️ Estado, Ministério ou Empresa Pública', desc: 'Retém 100% do seu IVA (Dec. Pres. 180/19)' },
                  { id: 'empresa_normal', title: '🏢 Empresa Privada Normal / PME', desc: 'Paga o IVA todo diretamente a si' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setClientProfile(item.id as any)}
                    className={`w-full text-left p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      clientProfile === item.id
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>{item.title}</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resultado Visual Claro e Intuitivo */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Resultado Direto para o seu Bolso
              </span>

              {/* Destaque Principal do Valor Líquido */}
              <div className="bg-emerald-600 text-white rounded-lg p-4 shadow-sm mb-4">
                <span className="text-xs font-bold uppercase tracking-wider block opacity-90">
                  Valor Líquido que vai Cair na sua Conta Bancária:
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
                  {formatKz(valorLiquidoReceber)}
                </div>
                <span className="text-[11px] block mt-1 opacity-90">
                  Total já livre de retenções e cativações retidas na fonte.
                </span>
              </div>

              {/* Discriminação Simples */}
              <div className="space-y-2 text-xs bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Valor Base Faturado:</span>
                  <span className="font-mono font-bold text-slate-900">{formatKz(invoiceAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                  <span>(+) IVA a 14% que você fatura:</span>
                  <span className="font-mono font-semibold text-slate-900">+{formatKz(valorIva)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-slate-900 bg-slate-50 px-2 rounded">
                  <span>(=) Total Bruto da Fatura:</span>
                  <span className="font-mono">{formatKz(totalFaturado)}</span>
                </div>

                {valorIvaCativado > 0 && (
                  <div className="flex justify-between py-1 text-amber-800 bg-amber-50 px-2 rounded">
                    <span>(-) Cativação de IVA ({retencaoIvaPercent * 100}% retido pelo cliente):</span>
                    <span className="font-mono font-semibold">-{formatKz(valorIvaCativado)}</span>
                  </div>
                )}

                {valorRetencaoIi > 0 && (
                  <div className="flex justify-between py-1 text-red-800 bg-red-50 px-2 rounded">
                    <span>(-) Retenção II de 6,5% (retido pelo cliente para a AGT):</span>
                    <span className="font-mono font-semibold">-{formatKz(valorRetencaoIi)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* O que o contabilista tem de fazer */}
            <div className="mt-4 p-3 bg-slate-900 text-white rounded-lg text-xs space-y-1">
              <span className="font-bold text-amber-400 block text-[11px]">
                👉 O que fazer com estes valores:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {valorIvaCativado > 0
                  ? `Peça ao cliente o comprovativo de entrega dos ${formatKz(valorIvaCativado)} de IVA para abater no seu Modelo 7 do IVA.`
                  : 'Você terá de entregar o IVA apurado na sua Declaração Modelo 7 até ao fim do mês seguinte.'}
                {valorRetencaoIi > 0
                  ? ` Exija o DAR/DLI dos ${formatKz(valorRetencaoIi)} retidos para deduzir no seu Modelo 1 do Imposto Industrial em Maio!`
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Ferramentas Rápidas: IVA 30 seg, Agosto 2%, Salários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* FERRAMENTA 2: APURAMENTO DO IVA EM 30 SEGUNDOS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                Apurar IVA do Mês em 30 Segundos
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Insira o total de vendas e compras do mês para ver se tem imposto a pagar ou a recuperar.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Total de Vendas do Mês (Kz)</label>
                <input
                  type="number"
                  value={quickVendas}
                  onChange={(e) => setQuickVendas(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Total de Compras c/ IVA (Kz)</label>
                <input
                  type="number"
                  value={quickCompras}
                  onChange={(e) => setQuickCompras(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              quickSaldoIva > 0 ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <span className="font-bold block text-[10px] uppercase">Resultado do Apuramento:</span>
              <div className="text-lg font-black font-mono mt-0.5">
                {formatKz(Math.abs(quickSaldoIva))}
              </div>
              <span className="text-[11px] font-medium block mt-0.5">
                {quickSaldoIva > 0 ? '🔴 A Pagar à AGT até ao fim do mês' : '🟢 Crédito Fiscal de IVA a reportar'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('civa')}
            className="mt-4 text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center justify-between pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Abrir Modelo 7 Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FERRAMENTA 3: LIQUIDAÇÃO PROVISÓRIA DE AGOSTO (2%) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                Imposto Industrial: Agosto (2%)
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Liquidação Provisória sobre as vendas de Janeiro a Junho (Art.º 66º e 67º do CII).
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Vendas do 1.º Semestre (Jan-Jun)</label>
              <input
                type="number"
                value={vendasSemestre}
                onChange={(e) => setVendasSemestre(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="mt-4 p-3 rounded-lg border bg-indigo-50 border-indigo-200 text-indigo-950 text-xs">
              <span className="font-bold block text-[10px] uppercase">Valor a Pagar até 31 de Agosto:</span>
              <div className="text-lg font-black font-mono mt-0.5 text-indigo-950">
                {formatKz(valorAgosto2)}
              </div>
              <span className="text-[11px] block mt-0.5 text-indigo-800">
                Taxa de 2% • Deduzido no Modelo 1 em Maio
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('imposto_industrial')}
            className="mt-4 text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center justify-between pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Ver Reconciliação Anual</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FERRAMENTA 4: SALÁRIO LÍQUIDO & IRT */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                Simulador Rápido de Salário Líquido
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Cálculo com tabela do IRT (Lei 28/20) e desconto da Segurança Social (3%).
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Salário Base Mensal (Kz)</label>
              <input
                type="number"
                value={quickSalario}
                onChange={(e) => setQuickSalario(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="mt-4 p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-950 text-xs">
              <span className="font-bold block text-[10px] uppercase">Salário Líquido a Transferir:</span>
              <div className="text-lg font-black font-mono mt-0.5">
                {formatKz(quickLiquido)}
              </div>
              <div className="text-[11px] text-emerald-800 flex justify-between mt-1 pt-1 border-t border-emerald-200">
                <span>INSS (3%): {formatKz(inss3)}</span>
                <span>IRT: {formatKz(quickIrt)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('folha_irt')}
            className="mt-4 text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center justify-between pt-2 border-t border-slate-100 cursor-pointer"
          >
            <span>Ver Folha com Subsídios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
