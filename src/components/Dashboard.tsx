import React from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Calculator,
  FileCheck
} from 'lucide-react';
import { formatKz } from '../utils/taxCalculators';
import { FISCAL_DEADLINES, PRACTICAL_CASES } from '../data/angolaTaxKnowledge';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  currentIvaAPagar: number;
  currentCreditoFiscal: number;
  currentIIEstimado: number;
  currentLiqProvisoria: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  currentIvaAPagar,
  currentCreditoFiscal,
  currentIIEstimado,
  currentLiqProvisoria,
}) => {
  const nextDeadlines = FISCAL_DEADLINES.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome / Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 mb-3">
            <span>SISTEMA TRIBUTÁRIO ANGOLANO</span>
            <span>•</span>
            <span>LEGISLAÇÃO ATUALIZADA AGT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Gestão Fiscal & Formação Contabilística de Alto Rendimento
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
            Automatize o apuramento mensal do CIVA (Lei n.º 7/19), controle as retenções e cativações de IVA, 
            calcule a matéria coletável do Imposto Industrial (Lei n.º 26/20) e mantenha conformidade com o Dossier Fiscal da AGT.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('civa')}
              className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md shadow transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4 mr-1.5" />
              Apurar IVA do Mês
            </button>
            <button
              onClick={() => onNavigate('imposto_industrial')}
              className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-md border border-slate-600 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 mr-1.5 text-amber-400" />
              Reconciliação Modelo 1
            </button>
            <button
              onClick={() => onNavigate('assistente_ia')}
              className="inline-flex items-center px-4 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-md border border-slate-600 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
              Consultar Assistente IA
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IVA a Pagar */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Apuramento Mensal IVA</span>
            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] border border-amber-200">Modelo 7</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {currentIvaAPagar > 0 ? formatKz(currentIvaAPagar) : '0,00 Kz'}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Saldo Devedor do Mês</span>
            {currentIvaAPagar > 0 ? (
              <span className="text-red-600 font-medium">A pagar à AGT</span>
            ) : (
              <span className="text-emerald-600 font-medium">Sem dívida direta</span>
            )}
          </div>
        </div>

        {/* Crédito Fiscal de IVA */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Crédito Fiscal IVA</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-200">A Reportar</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tracking-tight">
            {formatKz(currentCreditoFiscal)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Direito à Dedução/Reporte</span>
            <span className="text-emerald-600 font-medium">Conta 34.2.5</span>
          </div>
        </div>

        {/* Imposto Industrial Estimado */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Imposto Industrial Estimado</span>
            <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">Taxa 25%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {formatKz(currentIIEstimado)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Provisão Anual Modelo 1</span>
            <span className="text-slate-600 font-medium">Conta 88.1 PGC</span>
          </div>
        </div>

        {/* Liquidação Provisória de Agosto */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Liq. Provisória Vendas</span>
            <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] border border-indigo-200">Agosto 2%</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 font-mono tracking-tight">
            {formatKz(currentLiqProvisoria)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Art. 66º e 67º CII</span>
            <span className="text-indigo-600 font-medium">Pagamento por Conta</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & Practical Case Highlight */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Access Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-amber-600" />
              Módulos Operacionais & Automação de Cálculos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('civa')}
                className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Apuramento Mensal Modelo 7</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Taxas de 14%, 7%, 5%, regularizações, cativações retidas e saldo apurado para a AGT.
                </p>
              </button>

              <button
                onClick={() => onNavigate('civa')}
                className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Simulador de Faturação & Cativação</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cálculo com 50% ou 100% de cativação e retenção de 6,5% com lançamentos no PGC.
                </p>
              </button>

              <button
                onClick={() => onNavigate('imposto_industrial')}
                className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Reconciliação Fiscal Modelo 1</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Custos não dedutíveis (Art. 18º), tributação autónoma e liquidação definitiva anual.
                </p>
              </button>

              <button
                onClick={() => onNavigate('formador')}
                className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Academia & Casos Práticos PGC</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Exemplos reais resolvidos passo a passo com contas de Débito e Crédito do PGC.
                </p>
              </button>
            </div>
          </div>

          {/* Practical Case Spotlight */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                Caso Prático em Destaque
              </span>
              <span className="text-xs text-slate-500">Módulo de Formação Contabilística</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">
              {PRACTICAL_CASES[0].titulo}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {PRACTICAL_CASES[0].cenario}
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 text-xs space-y-1 mb-3">
              <div className="font-semibold text-slate-800">Principais valores apurados:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div>Base: <span className="font-bold">5.000.000 Kz</span></div>
                <div>IVA Cativado (50%): <span className="font-bold text-amber-700">350.000 Kz</span></div>
                <div>Retenção II (6,5%): <span className="font-bold text-red-700">325.000 Kz</span></div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => onNavigate('formador')}
                className="text-xs font-semibold text-slate-900 hover:text-amber-700 inline-flex items-center transition-colors cursor-pointer"
              >
                Ver resolução completa e lançamentos PGC
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines & Compliance Status */}
        <div className="space-y-6">
          {/* Official AGT Deadlines Widget */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-700" />
                Prazos Fiscais Iminentes AGT
              </h2>
              <button
                onClick={() => onNavigate('conformidade')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-3">
              {nextDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{dl.titulo}</span>
                    <span className="font-mono font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] border border-amber-200">
                      Dia {dl.dia}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-1.5">
                    {dl.descricao}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">{dl.modeloDeclaracao}</span>
                    <span className="font-medium text-slate-600">{dl.baseLegal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Checklist Preview */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
              <FileCheck className="w-4 h-4 mr-2 text-emerald-600" />
              Dossier Fiscal de Fecho de Contas
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Requisitos legais obrigatórios para arquivamento e certificação por Perito Contabilista OCPCA.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Balancetes de Verificação Geral e Após Apuramento</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mapa Modelo 2 de Reintegrações e Amortizações (Dec. 134/13)</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Comprovativos DLI das Retenções na Fonte e Liq. Provisória</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-700">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Certificação Legal de Contas emitida por Perito OCPCA</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('conformidade')}
              className="mt-4 w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer text-center"
            >
              Abrir Checklist Completa do Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
