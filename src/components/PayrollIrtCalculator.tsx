import React, { useState } from 'react';
import { 
  Users, 
  Calculator, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign,
  Info
} from 'lucide-react';
import { calculatePayroll, formatKz } from '../utils/taxCalculators';
import { IRT_BRACKETS } from '../data/angolaTaxKnowledge';

export const PayrollIrtCalculator: React.FC = () => {
  const [salarioBase, setSalarioBase] = useState<number>(350000);
  const [subsidioAlimentacao, setSubsidioAlimentacao] = useState<number>(50000);
  const [subsidioTransporte, setSubsidioTransporte] = useState<number>(45000);
  const [outrosSubsidios, setOutrosSubsidios] = useState<number>(20000);

  const payrollResult = calculatePayroll({
    salarioBase,
    subsidioAlimentacao,
    subsidioTransporte,
    outrosSubsidios,
  });

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center">
          <Users className="w-4 h-4 mr-1.5 text-amber-700" />
          Simulador de Folha de Salários, IRT & Segurança Social (INSS)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Em Angola, a tributação dos rendimentos do trabalho dependente (Grupo A) é regulada pelo 
          <strong> Código do IRT (Lei n.º 28/20)</strong> e pelas regras do <strong>INSS (Decreto Presidencial n.º 227/18)</strong>, 
          com isenção de IRT para rendimentos até 100.000 Kz e limites de isenção de 30.000 Kz para subsídios sociais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Elementos Retributivos Mensais
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Salário Base Mensal
            </label>
            <div className="relative">
              <input
                type="number"
                value={salarioBase}
                onChange={(e) => setSalarioBase(Number(e.target.value))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded px-3 py-2 font-bold focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Kz</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">Subsídio de Alimentação</span>
              <span className="text-[10px] text-slate-400 font-mono">Isento até 30.000 Kz</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={subsidioAlimentacao}
                onChange={(e) => setSubsidioAlimentacao(Number(e.target.value))}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-1.5 text-xs font-bold text-slate-400">Kz</span>
            </div>
            {subsidioAlimentacao > 30000 && (
              <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                Tributável em IRT e INSS: {formatKz(subsidioAlimentacao - 30000)} (excesso de 30.000 Kz)
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">Subsídio de Transporte</span>
              <span className="text-[10px] text-slate-400 font-mono">Isento até 30.000 Kz</span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={subsidioTransporte}
                onChange={(e) => setSubsidioTransporte(Number(e.target.value))}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-1.5 text-xs font-bold text-slate-400">Kz</span>
            </div>
            {subsidioTransporte > 30000 && (
              <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                Tributável em IRT e INSS: {formatKz(subsidioTransporte - 30000)} (excesso de 30.000 Kz)
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Outros Subsídios Tributáveis (Chefia, Isenção Horário, Falhas)
            </label>
            <div className="relative">
              <input
                type="number"
                value={outrosSubsidios}
                onChange={(e) => setOutrosSubsidios(Number(e.target.value))}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-1.5 text-xs font-bold text-slate-400">Kz</span>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recibo de Vencimento & Descontos Fiscais
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Escalão: {payrollResult.escalaoIrtDescricao}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Remuneração Ilíquida Global:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatKz(payrollResult.remuneracaoIliquidaTotal)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-slate-700">
                <span>(-) Segurança Social do Trabalhador (3% INSS):</span>
                <span className="font-mono font-semibold text-slate-900">
                  -{formatKz(payrollResult.descontoInssTrabalhador)}
                </span>
              </div>

              <div className="flex justify-between py-1 bg-slate-50 px-2 rounded text-slate-800 font-semibold">
                <span>(=) Matéria Coletável para IRT:</span>
                <span className="font-mono font-bold">
                  {formatKz(payrollResult.materiaColetavelIrt)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-red-800 bg-red-50/70 px-2 rounded">
                <span>(-) IRT Retido na Fonte (Grupo A - Tabela Progressiva):</span>
                <span className="font-mono font-bold">
                  -{formatKz(payrollResult.valorIrtRetido)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-slate-500 text-[11px] pt-2 border-t border-slate-100">
                <span>(+) Encargo Patronal da Empresa (8% INSS):</span>
                <span className="font-mono font-semibold">
                  +{formatKz(payrollResult.encargoInssEntidadeEmpregadora)}
                </span>
              </div>
            </div>
          </div>

          {/* Salário Líquido Total */}
          <div className="mt-6 pt-4 border-t-2 border-slate-900 bg-emerald-50/60 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                  Salário Líquido a Pagar ao Colaborador
                </span>
                <span className="text-[11px] text-emerald-700">
                  Valor transferido para a conta bancária
                </span>
              </div>
              <span className="text-2xl font-black font-mono text-emerald-950">
                {formatKz(payrollResult.salarioLiquido)}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-200/80 flex justify-between text-xs text-slate-700 font-mono">
              <span>Custo Total Global da Empresa:</span>
              <span className="font-bold">{formatKz(payrollResult.custoTotalEmpresa)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lançamentos no PGC Angolano */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
          Lançamentos Contabilísticos de Salários no PGC Angolano
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2 px-3">Conta PGC</th>
                <th className="py-2 px-3">Designação da Conta</th>
                <th className="py-2 px-3 text-right">Débito (Kz)</th>
                <th className="py-2 px-3 text-right">Crédito (Kz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollResult.lancamentosPgc.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{entry.conta}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">{entry.descricao}</td>
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

      {/* Tabela dos Escalões Oficiais do IRT */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Tabela Progressiva Oficial do IRT - Grupo A (Lei n.º 28/20)
          </h4>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            AGT Atualizada
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2 px-3">Escalão de Rendimento Mensal</th>
                <th className="py-2 px-3 text-right">Parcela Fixa</th>
                <th className="py-2 px-3 text-right">Taxa Marginal</th>
                <th className="py-2 px-3">Aplicação sobre o Excesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {IRT_BRACKETS.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-semibold text-slate-800">
                    {b.desc.split(':')[0]}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-700">
                    {b.parcelaFixa > 0 ? formatKz(b.parcelaFixa) : 'Isento'}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-800">
                    {b.taxa > 0 ? `${(b.taxa * 100).toFixed(0)}%` : '0%'}
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-600 text-[11px]">
                    {b.desc.split(':')[1] || 'Isento de retenção na fonte'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
