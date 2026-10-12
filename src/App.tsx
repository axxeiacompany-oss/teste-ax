import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuickActionsHub } from './components/QuickActionsHub';
import { IvaCalculator } from './components/IvaCalculator';
import { ImpostoIndustrialCalculator } from './components/ImpostoIndustrialCalculator';
import { TrainingAcademy } from './components/TrainingAcademy';
import { ComplianceManager } from './components/ComplianceManager';
import { AiTaxConsultant } from './components/AiTaxConsultant';
import { TaxReportModal } from './components/TaxReportModal';
import { OfficialFormsModal } from './components/OfficialFormsModal';
import { PayrollIrtCalculator } from './components/PayrollIrtCalculator';

export default function App() {
  // Default to the fast, easy, 1-click calculator hub
  const [activeTab, setActiveTab] = useState<string>('rapido');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isOfficialFormsModalOpen, setIsOfficialFormsModalOpen] = useState<boolean>(false);

  // Global synchronized state
  const [currentIvaAPagar, setCurrentIvaAPagar] = useState<number>(370000);
  const [currentCreditoFiscal, setCurrentCreditoFiscal] = useState<number>(0);
  const [currentIIEstimado, setCurrentIIEstimado] = useState<number>(11250000);
  const [currentLiqProvisoria, setCurrentLiqProvisoria] = useState<number>(1800000);

  // Data for Official AGT Forms
  const [ivaOfficialData, setIvaOfficialData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    vendas14: 15000000,
    iva14: 2100000,
    vendas7: 2500000,
    iva7: 175000,
    vendas5: 0,
    iva5: 0,
    vendasIsentas: 1000000,
    comprasExistencias: 8000000,
    ivaDedExistencias: 1120000,
    comprasImobilizado: 2000000,
    ivaDedImobilizado: 280000,
    comprasServicos: 1500000,
    ivaDedServicos: 210000,
    ivaCativado: 350000,
    regularizacoesEstado: 0,
    regularizacoesSP: 0,
    creditoAnterior: 120000,
    saldo: 370000,
  });

  const [iiOfficialData, setIiOfficialData] = useState({
    ano: new Date().getFullYear(),
    rai: 45000000,
    totalAcrescimos: 5500000,
    totalDeducoes: 500000,
    materiaColetavel: 50000000,
    taxa: 25,
    coleta: 12500000,
    liqProvisoria: 1800000,
    retencoes6_5: 1950000,
    tributacaoAutonoma: 1200000,
    totalDevido: 9950000,
  });

  const handleUpdateIvaState = (aPagar: number, credito: number) => {
    setCurrentIvaAPagar(aPagar);
    setCurrentCreditoFiscal(credito);
    setIvaOfficialData((prev) => ({
      ...prev,
      saldo: aPagar > 0 ? aPagar : -credito,
    }));
  };

  const handleUpdateIIState = (iiEstimado: number, liqProvisoria: number) => {
    setCurrentIIEstimado(iiEstimado);
    setCurrentLiqProvisoria(liqProvisoria);
    setIiOfficialData((prev) => ({
      ...prev,
      coleta: iiEstimado,
      liqProvisoria: liqProvisoria,
      totalDevido: Math.max(0, iiEstimado - liqProvisoria - prev.retencoes6_5) + prev.tributacaoAutonoma,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenOfficialForms={() => setIsOfficialFormsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. Modo Rápido / Calculadoras de 1 Clique (Padrão) */}
        {activeTab === 'rapido' && (
          <QuickActionsHub onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {/* 2. IVA Mensal (Modelo 7 Completo) */}
        {activeTab === 'civa' && (
          <IvaCalculator onUpdateIvaState={handleUpdateIvaState} />
        )}

        {/* 3. Imposto Industrial & Reconciliação */}
        {activeTab === 'imposto_industrial' && (
          <ImpostoIndustrialCalculator onUpdateIIState={handleUpdateIIState} />
        )}

        {/* 4. Folha de Salários & IRT */}
        {activeTab === 'folha_irt' && (
          <PayrollIrtCalculator />
        )}

        {/* 5. Prazos Oficiais da AGT & Checklist */}
        {activeTab === 'conformidade' && (
          <ComplianceManager />
        )}

        {/* 6. Formador & Casos Práticos */}
        {activeTab === 'formador' && (
          <TrainingAcademy />
        )}

        {/* 7. Assistente de Dúvidas com IA */}
        {activeTab === 'assistente_ia' && (
          <AiTaxConsultant />
        )}
      </main>

      {/* Modal de Impressão do Relatório */}
      <TaxReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        ivaAPagar={currentIvaAPagar}
        creditoFiscal={currentCreditoFiscal}
        iiEstimado={currentIIEstimado}
        liqProvisoria={currentLiqProvisoria}
      />

      {/* Modal dos Formulários Oficiais da AGT */}
      <OfficialFormsModal
        isOpen={isOfficialFormsModalOpen}
        onClose={() => setIsOfficialFormsModalOpen(false)}
        ivaData={ivaOfficialData}
        iiData={iiOfficialData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-slate-900 text-amber-400 font-bold text-[10px] flex items-center justify-center">
              AO
            </div>
            <span className="font-semibold text-slate-700">FiscalAngola Pro</span>
            <span>•</span>
            <span>Facilitador de Cálculo de Impostos & Conformidade AGT</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>CIVA (Lei 7/19)</span>
            <span>·</span>
            <span>Imposto Industrial (Lei 26/20)</span>
            <span>·</span>
            <span>IRT (Lei 28/20)</span>
            <span>·</span>
            <span>PGC Angolano</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
