import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PRACTICAL_CASES, QUIZ_QUESTIONS } from '../data/angolaTaxKnowledge';
import { PracticalCase } from '../types/tax';
import { formatKz } from '../utils/taxCalculators';

export const TrainingAcademy: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'casos' | 'quiz' | 'pgc'>('casos');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PRACTICAL_CASES[0].id);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const selectedCase = PRACTICAL_CASES.find((c) => c.id === selectedCaseId) || PRACTICAL_CASES[0];

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (selectedAnswers[questionIdx] !== undefined) return; // already answered
    setSelectedAnswers({ ...selectedAnswers, [questionIdx]: optionIdx });
    setShowExplanation({ ...showExplanation, [questionIdx]: true });
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentQuizIndex(0);
    setQuizFinished(false);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.respostaCorreta) {
        score += 1;
      }
    });
    return score;
  };

  // PGC Accounts reference list
  const pgcFiscais = [
    { conta: '34.1.1', desc: 'Imposto Industrial a Pagar', tipo: 'Passivo (Crédito)', uso: 'Saldo devedor apurado na Declaração Modelo 1 e tributações autónomas devidas à AGT.' },
    { conta: '34.1.2', desc: 'II Pagamentos por Conta / Liq. Provisória', tipo: 'Activo (Débito)', uso: 'Pagamento antecipado de 2% sobre as vendas em Agosto (Art. 66º CII).' },
    { conta: '34.1.3', desc: 'II Retenções na Fonte Suportadas', tipo: 'Activo (Débito)', uso: 'Retenção de 6,5% sofrida nos recebimentos de prestações de serviços (Art. 71º CII).' },
    { conta: '34.1.4', desc: 'Imposto Industrial a Recuperar / Reembolso', tipo: 'Activo (Débito)', uso: 'Crédito fiscal quando as retenções e pagamentos excedem a coleta definitiva do ano.' },
    { conta: '34.2.1', desc: 'IVA Suportado', tipo: 'Transitória', uso: 'IVA constante das faturas de compras antes da validação do direito à dedução.' },
    { conta: '34.2.2', desc: 'IVA Dedutível', tipo: 'Activo (Débito)', uso: 'IVA de aquisições de mercadorias, imobilizado e serviços legalmente dedutíveis.' },
    { conta: '34.2.3', desc: 'IVA Liquidado', tipo: 'Passivo (Crédito)', uso: 'IVA debitado aos clientes nas faturas de vendas e serviços (14%, 7%, 5%).' },
    { conta: '34.2.4', desc: 'IVA a Pagar', tipo: 'Passivo (Crédito)', uso: 'Saldo devedor apurado no fecho do Modelo 7 a liquidar à AGT.' },
    { conta: '34.2.5', desc: 'IVA a Recuperar / Crédito de IVA', tipo: 'Activo (Débito)', uso: 'Crédito fiscal apurado para reporte nos períodos subsequentes.' },
    { conta: '34.2.6', desc: 'IVA Cativado por Terceiros', tipo: 'Activo (Débito)', uso: '50% ou 100% de IVA retido por bancos, petrolíferas ou entidades públicas.' },
    { conta: '34.3', desc: 'Imposto sobre o Rendimento do Trabalho (IRT)', tipo: 'Passivo (Crédito)', uso: 'IRT retido aos colaboradores por conta de outrem ou prestadores do Grupo B.' },
    { conta: '34.5', desc: 'Imposto de Selo', tipo: 'Passivo (Crédito)', uso: 'Selo de 1% sobre recibos de quitação e operações financeiras.' },
    { conta: '88.1', desc: 'Imposto Industrial do Exercício', tipo: 'Resultados (Débito)', uso: 'Custo do imposto sobre rendimento apurado no fecho de contas do exercício.' },
    { conta: '88.2', desc: 'Tributação Autónoma de Encargos Não Aceites', tipo: 'Resultados (Débito)', uso: 'Encargo fiscal autónomo de 50%/70% sobre despesas confidenciais e não documentadas.' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('casos')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'casos'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Casos Práticos Reais & Lançamentos PGC
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Quiz de Avaliação & Certificação OCPCA
        </button>
        <button
          onClick={() => setActiveSubTab('pgc')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'pgc'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Plano de Contas Fiscais (PGC Angolano)
        </button>
      </div>

      {/* SUB-TAB 1: CASOS PRÁTICOS REAIS */}
      {activeSubTab === 'casos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu Lateral de Casos */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Selecione o Caso Prático:
            </span>
            {PRACTICAL_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={`font-mono px-1.5 py-0.5 rounded ${
                    selectedCaseId === c.id
                      ? 'bg-slate-800 text-amber-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.categoria}
                  </span>
                  <span className={selectedCaseId === c.id ? 'text-slate-400' : 'text-slate-500'}>
                    Nível: {c.dificuldade}
                  </span>
                </div>
                <h4 className="font-semibold text-xs leading-snug line-clamp-2">
                  {c.titulo}
                </h4>
              </button>
            ))}
          </div>

          {/* Área de Visualização e Resolução do Caso */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2 text-xs text-amber-700 font-semibold mb-1">
                <span>ESTUDO DE CASO PRÁTICO</span>
                <span>•</span>
                <span>{selectedCase.categoria}</span>
                <span>•</span>
                <span>Nível {selectedCase.dificuldade}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {selectedCase.titulo}
              </h3>
            </div>

            {/* Cenário */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Cenário Operacional
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedCase.cenario}
              </p>
            </div>

            {/* Valores envolvidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(selectedCase.valoresExemplo).map(([k, v]) => (
                <div key={k} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-500 block truncate">{k}</span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block">{v}</span>
                </div>
              ))}
            </div>

            {/* Resolução Passo a Passo */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Resolução Técnica Passo-a-Passo
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                {selectedCase.resolucaoPassoAPasso.map((step, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-50/70 border border-slate-100 flex items-start space-x-2">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fundamentação Legal */}
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-950">
              <span className="font-bold block mb-0.5">Base Legal Aplicável (República de Angola):</span>
              <span>{selectedCase.baseLegal}</span>
            </div>

            {/* Lançamentos no PGC */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-700" />
                Lançamentos Contabilísticos no PGC Angolano
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Conta PGC</th>
                      <th className="py-2 px-3">Designação</th>
                      <th className="py-2 px-3 text-right">Débito (Kz)</th>
                      <th className="py-2 px-3 text-right">Crédito (Kz)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedCase.lancamentos.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">{entry.conta}</td>
                        <td className="py-2 px-3 text-slate-700">{entry.descricao}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">
                          {entry.debito > 0 ? formatKz(entry.debito) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-amber-700">
                          {entry.credito > 0 ? formatKz(entry.credito) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dica Prática */}
            <div className="p-3 bg-slate-900 text-white rounded-lg text-xs flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400 block mb-0.5">Dica Prática de Auditoria & Conformidade:</span>
                <p className="text-slate-300">{selectedCase.dicaPratica}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: QUIZ DE CERTIFICAÇÃO */}
      {activeSubTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Award className="w-4 h-4 mr-2 text-amber-600" />
                Simulador de Exame & Certificação Fiscal (CIVA & II)
              </h3>
              <p className="text-xs text-slate-500">
                Avalie o seu domínio da legislação tributária angolana com questões baseadas em casos práticos reais.
              </p>
            </div>
            <button
              onClick={handleResetQuiz}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reiniciar
            </button>
          </div>

          {/* Progresso */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Questão {currentQuizIndex + 1} de {QUIZ_QUESTIONS.length}</span>
              <span>Respondidas: {Object.keys(selectedAnswers).length}/{QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-slate-900 h-1.5 transition-all duration-300"
                style={{ width: `${((currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Questão Atual */}
          {(() => {
            const question = QUIZ_QUESTIONS[currentQuizIndex];
            const hasAnswered = selectedAnswers[currentQuizIndex] !== undefined;
            const chosenAnswer = selectedAnswers[currentQuizIndex];
            const isCorrect = chosenAnswer === question.respostaCorreta;

            return (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1.5">
                    {question.categoria}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {question.pergunta}
                  </h4>
                </div>

                {/* Opções */}
                <div className="space-y-2">
                  {question.opcoes.map((opcao, optIdx) => {
                    let btnStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';

                    if (hasAnswered) {
                      if (optIdx === question.respostaCorreta) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (optIdx === chosenAnswer) {
                        btnStyle = 'bg-red-50 border-red-500 text-red-900 font-bold';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(currentQuizIndex, optIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span className="leading-relaxed">{opcao}</span>
                        {hasAnswered && optIdx === question.respostaCorreta && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2 mt-0.5" />
                        )}
                        {hasAnswered && optIdx === chosenAnswer && optIdx !== question.respostaCorreta && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explicação e Artigo Legal */}
                {hasAnswered && (
                  <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                    isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-center space-x-1.5 font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Resposta Correta!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Resposta Incorreta!</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">{question.explicacao}</p>
                    <div className="pt-2 border-t border-current/20 font-mono text-[11px]">
                      <strong>Base Legal:</strong> {question.artigoLegal}
                    </div>
                  </div>
                )}

                {/* Paginação do Quiz */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    disabled={currentQuizIndex === 0}
                    onClick={() => setCurrentQuizIndex(currentQuizIndex - 1)}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    Anterior
                  </button>

                  {currentQuizIndex < QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuizIndex(currentQuizIndex + 1)}
                      className="px-4 py-1.5 text-xs font-bold rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Próxima Questão
                    </button>
                  ) : (
                    <button
                      onClick={() => setQuizFinished(true)}
                      className="px-4 py-1.5 text-xs font-bold rounded bg-amber-500 text-slate-950 hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                      Finalizar & Ver Resultado
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Modal / Painel de Resultado Final */}
          {quizFinished && (
            <div className="p-5 bg-slate-900 text-white rounded-xl text-center space-y-3">
              <Award className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-base font-bold">Resultado da Avaliação Fiscal</h4>
              <div className="text-3xl font-extrabold font-mono text-amber-400">
                {calculateScore()} / {QUIZ_QUESTIONS.length}
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {calculateScore() >= 6
                  ? 'Excelente domínio das normas tributárias da AGT e PGC Angolano! Apto para fecho de contas de alto nível.'
                  : 'Recomenda-se a revisão dos artigos do CIVA (Decreto Presidencial 180/19) e do Código do Imposto Industrial (Lei 26/20).'}
              </p>
              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Repetir Teste
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PLANO DE CONTAS FISCAIS PGC */}
      {activeSubTab === 'pgc' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Contas do Estado e Fiscais no PGC Angolano (Decreto n.º 82/01)
              </h3>
              <p className="text-xs text-slate-500">
                Guia de desdobramento das subcontas da Conta 34 (Estado) e Conta 88 (Imposto sobre Rendimento).
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              PGC Oficial
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-mono">Código Conta</th>
                  <th className="py-2.5 px-3">Designação Oficial</th>
                  <th className="py-2.5 px-3">Natureza Contabilística</th>
                  <th className="py-2.5 px-3">Aplicação Normativa em Angola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pgcFiscais.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.conta}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{c.desc}</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.tipo}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed">{c.uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
