import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { formatKz } from '../utils/taxCalculators';

interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ivaAPagar: number;
  creditoFiscal: number;
  iiEstimado: number;
  liqProvisoria: number;
}

export const TaxReportModal: React.FC<TaxReportModalProps> = ({
  isOpen,
  onClose,
  ivaAPagar,
  creditoFiscal,
  iiEstimado,
  liqProvisoria,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Not printed */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-900">
              Relatório Oficial de Apuramento & Dossier Fiscal
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
              AGT & PGC Angolano
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 overflow-y-auto print:p-0 space-y-6 text-slate-900 font-sans" id="printable-report">
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 uppercase">
                FiscalAngola Pro • Sistema de Gestão Tributária
              </div>
              <div className="text-xs text-slate-600 mt-1">
                República de Angola • Administração Geral Tributária (AGT)
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Dossiê Fiscal do Exercício • {currentDate}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded border border-slate-300">
                MODELO AGT-CONFORMIDADE
              </span>
              <div className="text-[11px] text-slate-500 mt-1">
                PGC Decreto n.º 82/01
              </div>
            </div>
          </div>

          {/* Section 1: IVA Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>1. Resumo do Apuramento do Imposto sobre o Valor Acrescentado (CIVA)</span>
              <span className="text-[10px] text-slate-500 font-normal">Modelo 7 Mensal</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-sans">IVA a Pagar à AGT</span>
                <span className="text-lg font-bold text-slate-900">
                  {ivaAPagar > 0 ? formatKz(ivaAPagar) : '0,00 Kz'}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-1">
                  Obrigação de entrega até ao último dia do mês seguinte
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-sans">Crédito Fiscal de IVA a Reportar</span>
                <span className="text-lg font-bold text-emerald-700">
                  {formatKz(creditoFiscal)}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-1">
                  Conta 34.2.5 - Dedutível em períodos subsequentes
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Imposto Industrial Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>2. Apuramento do Imposto Industrial (Código do Imposto Industrial - Lei 26/20)</span>
              <span className="text-[10px] text-slate-500 font-normal">Modelo 1 Anual</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-sans">Coleta Estimada do Exercício (25%)</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatKz(iiEstimado)}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-1">
                  Reconciliação com custos não dedutíveis (Art. 18º)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-sans">Liquidação Provisória sobre Vendas (2%)</span>
                <span className="text-lg font-bold text-indigo-900">
                  {formatKz(liqProvisoria)}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans mt-1">
                  Art. 66º e 67º do CII • Liquidação de Agosto
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Normative Declarations */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Declaração de Conformidade Técnica & Fiscal</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Os cálculos apresentados foram efetuados com base nas tabelas vigentes da República de Angola, 
              respeitando as diretrizes do CIVA (Lei n.º 7/19 e Lei n.º 27/21), do Código do Imposto Industrial (Lei n.º 26/20),
              do Decreto Presidencial n.º 180/19 sobre a cativação de IVA e do Decreto Executivo n.º 134/13 para limites de amortizações.
            </p>
          </div>

          {/* Signature Area */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
              <span className="font-bold block">O Responsável da Contabilidade</span>
              <span className="text-slate-500 text-[11px]">Perito Contabilista / Técnico de Contas OCPCA</span>
            </div>

            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
              <span className="font-bold block">A Gerência / Administração</span>
              <span className="text-slate-500 text-[11px]">Sujeito Passivo / Representante Legal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
