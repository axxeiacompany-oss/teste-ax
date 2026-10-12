import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { formatKz } from '../utils/taxCalculators';

interface OfficialFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ivaData?: {
    mes: number;
    ano: number;
    vendas14: number;
    iva14: number;
    vendas7: number;
    iva7: number;
    vendas5: number;
    iva5: number;
    vendasIsentas: number;
    comprasExistencias: number;
    ivaDedExistencias: number;
    comprasImobilizado: number;
    ivaDedImobilizado: number;
    comprasServicos: number;
    ivaDedServicos: number;
    ivaCativado: number;
    regularizacoesEstado: number;
    regularizacoesSP: number;
    creditoAnterior: number;
    saldo: number;
  };
  iiData?: {
    ano: number;
    rai: number;
    totalAcrescimos: number;
    totalDeducoes: number;
    materiaColetavel: number;
    taxa: number;
    coleta: number;
    liqProvisoria: number;
    retencoes6_5: number;
    tributacaoAutonoma: number;
    totalDevido: number;
  };
}

export const OfficialFormsModal: React.FC<OfficialFormsModalProps> = ({
  isOpen,
  onClose,
  ivaData,
  iiData,
}) => {
  const [selectedForm, setSelectedForm] = useState<'modelo7' | 'modelo1'>('modelo7');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Navigation Bar - Not Printed */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Formulários Oficiais AGT:
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedForm('modelo7')}
                className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                  selectedForm === 'modelo7'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Modelo 7 • Declaração Periódica do IVA
              </button>
              <button
                onClick={() => setSelectedForm('modelo1')}
                className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                  selectedForm === 'modelo1'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Modelo 1 • Declaração de Rendimentos (II)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded transition-colors inline-flex items-center cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Imprimir / Salvar A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans text-slate-900 print:p-0">
          {/* MODELO 7 DO IVA */}
          {selectedForm === 'modelo7' && (
            <div className="border border-slate-900 p-6 rounded bg-white space-y-5">
              {/* Top Banner AGT */}
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center text-xs">
                <div>
                  <div className="font-extrabold uppercase text-slate-900 tracking-wider">
                    REPÚBLICA DE ANGOLA • MINISTÉRIO DAS FINANÇAS
                  </div>
                  <div className="font-bold text-slate-800">
                    ADMINISTRAÇÃO GERAL TRIBUTÁRIA (AGT)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-mono">MODELO 7</div>
                  <div className="text-[10px] text-slate-600">DECLARAÇÃO PERIÓDICA DO IVA</div>
                </div>
              </div>

              {/* Quadro 01 & 02: Identificação & Período */}
              <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 text-xs bg-slate-50">
                <div>
                  <span className="font-bold block text-slate-700 uppercase text-[10px]">Quadro 01: Identificação</span>
                  <div>NIF do Contribuinte: <span className="font-mono font-bold">5412389102</span></div>
                  <div>Firma / Nome: <span className="font-semibold">EMPRESA ANGOLANA EXEMPLAR, LDA</span></div>
                </div>
                <div>
                  <span className="font-bold block text-slate-700 uppercase text-[10px]">Quadro 02: Período de Tributação</span>
                  <div>Mês de Apuramento: <span className="font-mono font-bold">{ivaData?.mes || 1}</span> / Ano: <span className="font-mono font-bold">{ivaData?.ano || 2026}</span></div>
                  <div>Regime de IVA: <span className="font-semibold">Regime Geral (Art. 12º e 15º CIVA)</span></div>
                </div>
              </div>

              {/* Quadro 03: Operações Ativas (Vendas e IVA Liquidado) */}
              <div className="border border-slate-300 text-xs">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[11px] text-slate-800">
                  Quadro 03: Operações Ativas • Transmissões de Bens e Serviços (IVA Liquidado)
                </div>
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-600">
                    <tr>
                      <th className="p-2">Campo</th>
                      <th className="p-2">Discriminação das Operações</th>
                      <th className="p-2 text-right">Valor Base Tributável (Kz)</th>
                      <th className="p-2 text-right">IVA Liquidado (Kz)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[01]</td>
                      <td className="p-2 font-sans">Transmissões à Taxa Normal de 14%</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.vendas14 || 0)}</td>
                      <td className="p-2 text-right font-bold text-amber-800">{formatKz(ivaData?.iva14 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[02]</td>
                      <td className="p-2 font-sans">Transmissões à Taxa Reduzida Cesta Básica de 7%</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.vendas7 || 0)}</td>
                      <td className="p-2 text-right font-bold text-amber-800">{formatKz(ivaData?.iva7 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[03]</td>
                      <td className="p-2 font-sans">Transmissões à Taxa Especial de 5%</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.vendas5 || 0)}</td>
                      <td className="p-2 text-right font-bold text-amber-800">{formatKz(ivaData?.iva5 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[04]</td>
                      <td className="p-2 font-sans">Operações Isentas sem Direito à Dedução (Art. 12º)</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.vendasIsentas || 0)}</td>
                      <td className="p-2 text-right text-slate-400">0,00 Kz</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quadro 04: Operações Passivas (IVA Dedutível) */}
              <div className="border border-slate-300 text-xs">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[11px] text-slate-800">
                  Quadro 04: Operações Passivas • Aquisições com Direito à Dedução
                </div>
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-600">
                    <tr>
                      <th className="p-2">Campo</th>
                      <th className="p-2">Aquisições de Bens e Serviços</th>
                      <th className="p-2 text-right">Valor das Compras (Kz)</th>
                      <th className="p-2 text-right">IVA Dedutível (Kz)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[20]</td>
                      <td className="p-2 font-sans">Existências / Mercadorias</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.comprasExistencias || 0)}</td>
                      <td className="p-2 text-right font-bold text-emerald-800">{formatKz(ivaData?.ivaDedExistencias || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[21]</td>
                      <td className="p-2 font-sans">Activos Fixos / Imobilizado</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.comprasImobilizado || 0)}</td>
                      <td className="p-2 text-right font-bold text-emerald-800">{formatKz(ivaData?.ivaDedImobilizado || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[22]</td>
                      <td className="p-2 font-sans">Outros Bens e Prestações de Serviços Suportados</td>
                      <td className="p-2 text-right">{formatKz(ivaData?.comprasServicos || 0)}</td>
                      <td className="p-2 text-right font-bold text-emerald-800">{formatKz(ivaData?.ivaDedServicos || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[25]</td>
                      <td className="p-2 font-sans">IVA Cativado por Terceiros (50% / 100% Retido)</td>
                      <td className="p-2 text-right text-slate-400">-</td>
                      <td className="p-2 text-right font-bold text-amber-800">{formatKz(ivaData?.ivaCativado || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quadro 07: Apuramento do Imposto */}
              <div className="border-2 border-slate-900 p-4 bg-slate-50 text-xs">
                <div className="font-extrabold uppercase text-slate-900 mb-2 border-b border-slate-300 pb-1">
                  Quadro 07: Apuramento Final do IVA
                </div>
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div>
                    <div className="text-slate-600 font-sans">Campo [60]: IVA a Pagar ao Estado:</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {ivaData && ivaData.saldo > 0 ? formatKz(ivaData.saldo) : '0,00 Kz'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 font-sans">Campo [70]: Crédito Fiscal a Reportar:</div>
                    <div className="text-xl font-bold text-emerald-700 mt-0.5">
                      {ivaData && ivaData.saldo < 0 ? formatKz(Math.abs(ivaData.saldo)) : '0,00 Kz'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODELO 1 DO IMPOSTO INDUSTRIAL */}
          {selectedForm === 'modelo1' && (
            <div className="border border-slate-900 p-6 rounded bg-white space-y-5">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center text-xs">
                <div>
                  <div className="font-extrabold uppercase text-slate-900 tracking-wider">
                    REPÚBLICA DE ANGOLA • MINISTÉRIO DAS FINANÇAS
                  </div>
                  <div className="font-bold text-slate-800">
                    ADMINISTRAÇÃO GERAL TRIBUTÁRIA (AGT)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-mono">MODELO 1</div>
                  <div className="text-[10px] text-slate-600">DECLARAÇÃO DE RENDIMENTOS • IMPOSTO INDUSTRIAL</div>
                </div>
              </div>

              {/* Quadro 08: Apuramento da Matéria Coletável */}
              <div className="border border-slate-300 text-xs">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[11px] text-slate-800">
                  Quadro 08: Apuramento do Lucro Tributável (Art.º 18.º e ss. do CII)
                </div>
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-600">
                    <tr>
                      <th className="p-2">Linha</th>
                      <th className="p-2">Discriminação das Rubricas</th>
                      <th className="p-2 text-right">Montante (Kz)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[01]</td>
                      <td className="p-2 font-sans">Resultado Líquido do Exercício Antes de Impostos (RAI)</td>
                      <td className="p-2 text-right font-bold">{formatKz(iiData?.rai || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[05]</td>
                      <td className="p-2 font-sans">(+) Custos e Perdas Não Dedutíveis (Art.º 18.º)</td>
                      <td className="p-2 text-right font-bold text-amber-800">+{formatKz(iiData?.totalAcrescimos || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[12]</td>
                      <td className="p-2 font-sans">(-) Rendimentos Isentos / Não Sujeitos a II (IAC)</td>
                      <td className="p-2 text-right font-bold text-emerald-800">-{formatKz(iiData?.totalDeducoes || 0)}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2 text-slate-900">[20]</td>
                      <td className="p-2 font-sans">(=) Matéria Coletável / Lucro Tributável</td>
                      <td className="p-2 text-right text-slate-900">{formatKz(iiData?.materiaColetavel || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quadro 10: Cálculo do Imposto */}
              <div className="border border-slate-300 text-xs">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[11px] text-slate-800">
                  Quadro 10: Liquidação do Imposto Industrial e Deduções à Coleta
                </div>
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-600">
                    <tr>
                      <th className="p-2">Campo</th>
                      <th className="p-2">Elementos de Liquidação</th>
                      <th className="p-2 text-right">Valor (Kz)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[25]</td>
                      <td className="p-2 font-sans">Coleta Bruta do Exercício ({iiData?.taxa || 25}%)</td>
                      <td className="p-2 text-right font-bold">{formatKz(iiData?.coleta || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[30]</td>
                      <td className="p-2 font-sans">(-) Liquidação Provisória sobre Vendas de Agosto (2%)</td>
                      <td className="p-2 text-right text-indigo-700">-{formatKz(iiData?.liqProvisoria || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[32]</td>
                      <td className="p-2 font-sans">(-) Retenções na Fonte de 6,5% Suportadas no Ano</td>
                      <td className="p-2 text-right text-red-700">-{formatKz(iiData?.retencoes6_5 || 0)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-700">[38]</td>
                      <td className="p-2 font-sans">(+) Tributação Autónoma s/ Despesas Confidenciais</td>
                      <td className="p-2 text-right text-amber-700">+{formatKz(iiData?.tributacaoAutonoma || 0)}</td>
                    </tr>
                    <tr className="bg-slate-900 text-white font-bold text-sm">
                      <td className="p-3 text-amber-400">[40]</td>
                      <td className="p-3 font-sans">(=) Total Geral a Pagar à AGT até 31 de Maio</td>
                      <td className="p-3 text-right text-amber-400">{formatKz(iiData?.totalDevido || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
