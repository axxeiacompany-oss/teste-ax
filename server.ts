import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Erro ao inicializar GoogleGenAI:', err);
  }
}

// System instruction specialized in Angolan Tax & Accounting Law
const ANGOLAN_TAX_SYSTEM_PROMPT = `Você é o "Dr. FiscalAngola", um Perito Contabilista Sénior e Consultor Fiscal especialista na legislação tributária da República de Angola e nas normas da AGT (Administração Geral Tributária) e da OCPCA (Ordem dos Contabilistas e Peritos Contabilistas de Angola).

Suas principais bases legais de fundamentação obrigatória:
1. CIVA (Código do Imposto sobre o Valor Acrescentado - Lei n.º 7/19 e alterações Lei 26/20, Lei 27/21 e OGEs):
   - Taxa geral de 14%, taxa reduzida da cesta básica de 7% e 5%, taxa de 1% em Cabinda.
   - Regimes: Geral (>25.000.000 Kz), Simplificado (10M a 25M Kz, taxa 7% sobre faturado com dedução de 7% do IVA incorrido), Exclusão (<=10M Kz, sem IVA, sujeito a 1% de Selo).
   - Cativação de IVA: 100% pelo Estado e Organismos Públicos; 50% por Grandes Contribuintes, Seguradoras, Bancos e Petrolíferas (Dec. Presidencial 180/19 e Lei 42/20).
2. CII (Código do Imposto Industrial - Lei n.º 19/14 republicada com a Lei n.º 26/20):
   - Taxa Geral: 25% (reduzida de 30%).
   - Sector Agrícola, Pecuária, Silvicultura e Pesca: 10%.
   - Telecomunicações, Bancos e Seguros: 35%.
   - Liquidação Provisória de Agosto (Art. 66º e 67º): 2% sobre volume de vendas/serviços do 1º semestre.
   - Retenção na fonte de 6.5% em prestação de serviços (Art. 71º).
   - Custos Não Dedutíveis (Art. 18º): multas, despesas confidenciais (tributação autónoma 50%/70%), despesas de representação em excesso (>1%), amortizações além das tabelas legais.
   - Entrega da Declaração Modelo 1 até 31 de Maio (ou 30 de Junho se Grupo A sem contabilidade organizada ou prorrogado).
3. PGC Angolano (Plano Geral de Contabilidade - Decreto n.º 82/01):
   - Contas 34.1 (Imposto Industrial), 34.2 (IVA - 34.2.1 Suportado, 34.2.2 Dedutível, 34.2.3 Liquidado, 34.2.4 a Pagar, 34.2.5 a Recuperar, 34.2.6 Cativado), 34.5 (Imposto de Selo).
   - Movimentações Débito/Crédito normativas.

Instruções de resposta:
- Forneça sempre fundamentação jurídica com artigos e diplomas legais angolanos concretos.
- Forneça exemplos numéricos em Kwanzas (Kz / AOA) quando aplicável.
- Indique os lançamentos contabilísticos segundo as contas do PGC Angolano (com indicação clara de Conta, Descrição, Débito e Crédito).
- Mantenha tom profissional, rigoroso, pedagógico e claro para contabilistas e gestores em Angola.`;

// API endpoint for Tax AI Assistant & Validation
app.post('/api/gemini/consultant', async (req, res) => {
  try {
    const { prompt, mode, contextData } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'O campo prompt é obrigatório.' });
    }

    let finalPrompt = prompt;
    if (mode === 'validate_transaction' && contextData) {
      finalPrompt = `Analise detalhadamente a seguinte operação comercial em Angola e emita o Enquadramento Fiscal e Contabilístico:
- Tipo de Operação: ${contextData.operationType || 'Não especificado'}
- Valor da Operação: ${contextData.amount || '0'} Kz
- Tipo de Fornecedor: ${contextData.supplierType || 'Geral'}
- Tipo de Cliente: ${contextData.clientType || 'Geral'}
- Descrição dos Bens/Serviços: ${prompt}

Indique:
1. Enquadramento no CIVA (Taxa aplicável, isenção se houver com artigo do CIVA, obrigação de cativação 50% ou 100%).
2. Incidência de Imposto Industrial e Retenção na Fonte (6.5% ou outra taxa, com base no Art. 71º do CII).
3. Incidência de Imposto de Selo (se aplicável, 1% recibo de quitação).
4. Esquema completo de Lançamento Contabilístico no PGC Angolano (Contas Classe 3, 6/7, 4).
5. Cuidados no SAF-T (AO) e arquivamento no Dossier Fiscal.`;
    }

    if (!aiClient) {
      // Fallback response with structured legal analysis if no key is configured
      return res.json({
        response: `[Aviso: Chave de API Gemini não configurada no servidor. Apresentando resposta normativa de contingência baseada nas regras vigentes da AGT]:\n\n` +
          `Para a consulta "${prompt}":\n\n` +
          `• Enquadramento CIVA: As transmissões de bens e prestações de serviços em território nacional estão sujeitas à taxa de 14% (CIVA Art. 12º e ss.), salvo bens da cesta básica (taxa 7%/5%) ou isenções do Art. 12º.\n` +
          `• Cativação de IVA: Se o adquirente for o Estado/Organismo Público a cativação é de 100%; se for Grande Contribuinte/Banco/Seguradora é de 50% (Dec. Presidencial 180/19).\n` +
          `• Retenção na Fonte II: Em prestações de serviços entre sujeitos passivos, aplica-se retenção de 6.5% na fonte (Art. 71º do Código do Imposto Industrial - Lei 26/20).\n` +
          `• Contabilização PGC: Movimentar Conta 34.2.3 (IVA Liquidado), Conta 34.2.6 (IVA Cativado) ou Conta 34.1.3 (II Retenção na Fonte) contra as contas 31 Clientes / 32 Fornecedores.`,
        isOfflineFallback: true
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: finalPrompt,
      config: {
        systemInstruction: ANGOLAN_TAX_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    res.json({
      response: response.text || 'Sem resposta disponível.',
      isOfflineFallback: false
    });
  } catch (error: any) {
    console.error('Erro na chamada Gemini:', error);
    res.status(500).json({
      error: 'Erro ao processar consulta com o modelo Gemini.',
      details: error.message
    });
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Servidor FiscalAngola Pro a correr na porta ${PORT}`);
  });
}

startServer();
