import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileSearch, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Loader2,
  BookOpen
} from 'lucide-react';

export const AiTaxConsultant: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'validator'>('validator');

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; isOffline?: boolean }>>([
    {
      sender: 'assistant',
      text: 'Olá! Sou o Dr. FiscalAngola, o seu assistente e consultor normativo especializado em Contabilidade e Fiscalidade Angolana (CIVA, Código do Imposto Industrial - Lei 26/20, PGC e normas da AGT e OCPCA).\n\nComo posso ajudar com um caso prático, apuramento de impostos ou validação de lançamentos contabilísticos hoje?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Validator State
  const [operationDescription, setOperationDescription] = useState('Prestação de serviços de auditoria e consultoria informática a um Banco Comercial em Luanda');
  const [operationAmount, setOperationAmount] = useState('8500000');
  const [supplierType, setSupplierType] = useState('Regime Geral de IVA');
  const [clientType, setClientType] = useState('Grande Contribuinte / Sector Bancário');
  const [validatorResult, setValidatorResult] = useState<string | null>(null);
  const [isLoadingValidator, setIsLoadingValidator] = useState(false);

  // Suggested questions
  const quickQuestions = [
    'Como contabilizar uma fatura com 50% de IVA cativado e retenção de 6,5%?',
    'Quais as despesas expressamente não dedutíveis no Artigo 18º do Código do Imposto Industrial?',
    'Qual o procedimento quando o IVA apurado no Modelo 7 resulta em crédito fiscal?',
    'Qual o teto fiscal máximo de amortização para viaturas ligeiras em Angola?',
  ];

  const handleSendChat = async (promptToSend?: string) => {
    const text = promptToSend || chatInput;
    if (!text.trim() || isLoadingChat) return;

    const userMsg = { sender: 'user' as const, text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/gemini/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, mode: 'chat' }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: data.response || 'Não foi possível obter resposta.', isOffline: data.isOfflineFallback },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Ocorreu um erro ao consultar o assistente de fiscalidade. Verifique a conexão com o servidor.',
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleValidateOperation = async () => {
    if (!operationDescription.trim() || isLoadingValidator) return;
    setIsLoadingValidator(true);
    setValidatorResult(null);

    try {
      const res = await fetch('/api/gemini/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: operationDescription,
          mode: 'validate_transaction',
          contextData: {
            amount: operationAmount,
            supplierType,
            clientType,
            operationType: 'Operação Comercial com Incidência Fiscal',
          },
        }),
      });
      const data = await res.json();
      setValidatorResult(data.response || 'Sem resposta.');
    } catch (err) {
      setValidatorResult('Erro ao conectar com o validador tributário.');
    } finally {
      setIsLoadingValidator(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveMode('validator')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeMode === 'validator'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Validador Rápido de Operação Comercial & Faturação AGT
        </button>
        <button
          onClick={() => setActiveMode('chat')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeMode === 'chat'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Consultor & Tutor Fiscal com IA (Dr. FiscalAngola)
        </button>
      </div>

      {/* MODE 1: VALIDADOR DE OPERAÇÃO COMERCIAL */}
      {activeMode === 'validator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center mb-1">
                <FileSearch className="w-4 h-4 mr-1.5 text-amber-600" />
                Auditoria Prévia & Enquadramento AGT
              </h3>
              <p className="text-xs text-slate-500">
                Submeta uma operação para obter enquadramento no CIVA, retenção na fonte de II, Imposto de Selo e lançamentos PGC.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descrição da Operação ou Fatura
              </label>
              <textarea
                rows={3}
                value={operationDescription}
                onChange={(e) => setOperationDescription(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2.5 focus:ring-1 focus:ring-slate-900"
                placeholder="ex: Venda de equipamento hospitalar / Prestação de serviços de TI / Renda de armazém"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Total da Operação (Kz)
              </label>
              <input
                type="number"
                value={operationAmount}
                onChange={(e) => setOperationAmount(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-2 font-bold focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Enquadramento Emitente
                </label>
                <select
                  value={supplierType}
                  onChange={(e) => setSupplierType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option>Regime Geral de IVA</option>
                  <option>Regime Simplificado (7%)</option>
                  <option>Regime de Exclusão</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Perfil do Adquirente
                </label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option>Grande Contribuinte / Sector Bancário</option>
                  <option>Estado / Órgão da Administração Pública</option>
                  <option>Empresa Privada Normal / PME</option>
                  <option>Consumidor Final Particular</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleValidateOperation}
              disabled={isLoadingValidator || !operationDescription.trim()}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoadingValidator ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>A analisar legislação AGT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Auditar & Enquadrar Operação</span>
                </>
              )}
            </button>
          </div>

          {/* Resultado do Validador */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Parecer Técnico & Auditoria Tributária
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Legislação Angolana Vigente
                </span>
              </div>

              {validatorResult ? (
                <div className="prose prose-xs max-w-none text-slate-800 text-xs leading-relaxed space-y-2 whitespace-pre-line font-sans">
                  {validatorResult}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileSearch className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">
                    Preencha os dados da operação à esquerda e clique em <strong>Auditar & Enquadrar Operação</strong> para obter a análise completa.
                  </p>
                </div>
              )}
            </div>

            {validatorResult && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Fundamentado em: CIVA, CII Lei 26/20, Dec. Pres. 180/19</span>
                <span className="text-emerald-700 font-semibold flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Conforme Normas AGT
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: CHAT COM DR. FISCALANGOLA */}
      {activeMode === 'chat' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col h-[600px]">
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                DF
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Dr. FiscalAngola • Perito e Assistente de Contabilidade
                </h4>
                <p className="text-[11px] text-slate-500">
                  Especializado no CIVA, Imposto Industrial, PGC e Diretrizes da AGT
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Assistente Ativo
            </span>
          </div>

          {/* Quick Questions Banner */}
          <div className="px-4 py-2 bg-slate-100/50 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-slate-400 font-semibold whitespace-nowrap">Exemplos rápidos:</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(q)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-slate-200/80 rounded border border-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-lg p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                  {msg.isOffline && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-amber-700">
                      Resposta normativa de contingência baseada na legislação fiscal angolana.
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoadingChat && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span>A pesquisar legislação e a fundamentar resposta...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Coloque a sua dúvida fiscal ou contabilística angolana..."
                className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                disabled={isLoadingChat || !chatInput.trim()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
