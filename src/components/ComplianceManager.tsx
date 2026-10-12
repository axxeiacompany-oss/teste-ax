import React, { useState } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  BookText, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { FISCAL_DEADLINES, DOSSIER_CHECKLIST, TAX_RATES_SUMMARY } from '../data/angolaTaxKnowledge';
import { ChecklistItem } from '../types/tax';

export const ComplianceManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calendario' | 'checklist' | 'legislacao'>('calendario');
  const [selectedFilter, setSelectedFilter] = useState<string>('TODOS');

  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('angola_fiscal_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DOSSIER_CHECKLIST;
      }
    }
    return DOSSIER_CHECKLIST;
  });

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, concluido: !item.concluido } : item
    );
    setChecklist(updated);
    localStorage.setItem('angola_fiscal_checklist', JSON.stringify(updated));
  };

  const completedCount = checklist.filter((i) => i.concluido).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Deadlines filtering
  const filteredDeadlines = FISCAL_DEADLINES.filter((d) => {
    if (selectedFilter === 'TODOS') return true;
    return d.imposto === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Nav */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('calendario')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'calendario'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Calendário Fiscal AGT (Prazos Oficiais)
        </button>
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'checklist'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Checklist do Dossier Fiscal & Fecho de Contas
        </button>
        <button
          onClick={() => setActiveSubTab('legislacao')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'legislacao'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Legislação & Diplomas Fiscais em Vigor
        </button>
      </div>

      {/* SUB-TAB 1: CALENDÁRIO FISCAL AGT */}
      {activeSubTab === 'calendario' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-slate-700" />
                  Obrigações Declarativas e Prazos Oficiais de Pagamento (AGT)
                </h3>
                <p className="text-xs text-slate-500">
                  Evite multas e juros de mora previstos no Regime Geral Tributário (Lei n.º 21/14).
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-1.5">
                {['TODOS', 'IVA', 'II', 'SAFT', 'RETENCOES', 'MODELO_1'].map((filtro) => (
                  <button
                    key={filtro}
                    onClick={() => setSelectedFilter(filtro)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                      selectedFilter === filtro
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filtro}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="bg-slate-50/70 rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                        {dl.periodicidade} • {dl.imposto}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Dia {dl.dia} {dl.periodicidade === 'Mensal' ? 'de cada mês' : `do Mês ${dl.mes}`}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                      {dl.titulo}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {dl.descricao}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="truncate mr-2 font-semibold text-slate-700">{dl.modeloDeclaracao}</span>
                    <span className="shrink-0 text-slate-600">{dl.baseLegal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHECKLIST DO DOSSIER FISCAL */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <FileCheck2 className="w-4 h-4 mr-2 text-emerald-600" />
                  Checklist do Dossier Fiscal & Auditoria (Art.º 58.º do Código do Imposto Industrial)
                </h3>
                <p className="text-xs text-slate-500">
                  Documentação legal de guarda obrigatória na sede da empresa pelo período mínimo de 5 anos.
                </p>
              </div>

              {/* Progress pill */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Conformidade do Dossier</span>
                  <span className="text-xs font-bold text-slate-900">
                    {completedCount} de {checklist.length} itens ({progressPercent}%)
                  </span>
                </div>
                <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start space-x-3 ${
                    item.concluido
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.concluido ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                      <span className={`text-xs font-bold ${item.concluido ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.titulo}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.fase}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-1">
                      {item.descricao}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <strong>Base Legal:</strong> {item.baseLegal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LEGISLAÇÃO & DIPLOMAS FISCAIS */}
      {activeSubTab === 'legislacao' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CIVA */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Lei n.º 7/19 e Alterações (Lei 27/21)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CIVA</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Código do Imposto sobre o Valor Acrescentado (CIVA)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regula a incidência objetiva e subjetiva, isenções, regimes de tributação (Geral, Simplificado e Exclusão),
                taxas de 14%, 7%, 5% e 1%, e a mecânica das deduções de IVA incorrido.
              </p>
              <div className="p-2.5 bg-slate-50 rounded text-xs space-y-1">
                <span className="font-semibold text-slate-800 block text-[11px]">Artigos Chave:</span>
                <div>• Art.º 12.º: Isenções nas operações internas</div>
                <div>• Art.º 15.º: Taxas do Imposto</div>
                <div>• Art.º 19.º e 20.º: Direito à Dedução e Exclusões</div>
                <div>• Art.º 43.º: Declaração Periódica Modelo 7</div>
              </div>
            </div>

            {/* CII */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Lei n.º 19/14 republicada com Lei n.º 26/20
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CII</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Código do Imposto Industrial (CII)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incide sobre os lucros obtidos no exercício de quaisquer atividades comerciais ou industriais.
                Fixa a taxa geral em 25%, a bonificada em 10% (agricultura) e a agravada em 35% (financeiro e telecom).
              </p>
              <div className="p-2.5 bg-slate-50 rounded text-xs space-y-1">
                <span className="font-semibold text-slate-800 block text-[11px]">Artigos Chave:</span>
                <div>• Art.º 18.º: Custos Não Dedutíveis para efeitos fiscais</div>
                <div>• Art.º 58.º: Obrigações Declarativas e Dossier Fiscal</div>
                <div>• Art.º 66.º e 67.º: Liquidação Provisória sobre Vendas (Agosto)</div>
                <div>• Art.º 71.º: Retenção na Fonte de 6,5% em Prestações de Serviços</div>
              </div>
            </div>

            {/* Decreto Presidencial 180/19 */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Decreto Presidencial n.º 180/19
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cativação IVA</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Regime Jurídico da Cativação do IVA
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determina a obrigação de retenção de 100% pelo Estado e 50% pelos Grandes Contribuintes, 
                Bancos e Petrolíferas no ato do pagamento de faturas de bens e serviços.
              </p>
            </div>

            {/* Decreto Executivo 134/13 */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Decreto Executivo n.º 134/13
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Amortizações</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Tabela Oficial de Reintegrações e Amortizações
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fixa os limites e taxas máximas de amortização fiscal de activos corpóreos e incorpóreos 
                admitidas como custo fiscal na matéria coletável do Imposto Industrial.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
