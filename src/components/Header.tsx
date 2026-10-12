import React from 'react';
import { 
  Zap,
  Calculator, 
  FileText, 
  Users, 
  CalendarClock, 
  GraduationCap, 
  Bot, 
  Printer,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReport: () => void;
  onOpenOfficialForms: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenReport,
  onOpenOfficialForms
}) => {
  const tabs = [
    { id: 'rapido', label: '⚡ Calculadoras Rápidas', icon: Zap, isPrimary: true },
    { id: 'civa', label: '🧾 IVA Mensal (Mod. 7)', icon: Calculator },
    { id: 'imposto_industrial', label: '🏢 Imposto Industrial', icon: FileText },
    { id: 'folha_irt', label: '👥 Salários & IRT', icon: Users },
    { id: 'conformidade', label: '📅 Prazos da AGT', icon: CalendarClock },
    { id: 'formador', label: '🎓 Casos Práticos & Aulas', icon: GraduationCap },
    { id: 'assistente_ia', label: '🤖 Tirar Dúvidas com IA', icon: Bot, highlight: true },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
      {/* Top Banner / System Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('rapido')}>
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-lg shadow-sm">
              AO
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  FiscalAngola Pro
                </span>
                <span className="text-[11px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded border border-amber-300">
                  Fácil & Automatizado
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cálculos de Impostos em Segundos • IVA, Retenções e Imposto Industrial
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenOfficialForms}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors cursor-pointer"
              title="Visualizar Declaração Modelo 7 e Modelo 1 Oficiais da AGT"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Modelos Oficiais AGT</span>
              <span className="sm:hidden">Modelos AGT</span>
            </button>
            <button
              onClick={onOpenReport}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
              title="Gerar e Imprimir Relatório do Dossier Fiscal"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Imprimir Relatório</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="border-t border-slate-200 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : tab.isPrimary
                      ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
                      : tab.highlight
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mr-1.5 ${isActive ? 'text-amber-400' : 'text-current'}`} />
                  {tab.label}
                  {tab.highlight && !isActive && (
                    <Sparkles className="w-3 h-3 ml-1 text-amber-600 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
