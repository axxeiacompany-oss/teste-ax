import React, { useState } from 'react';
import { 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { SAFT_EXEMPTION_CODES } from '../data/angolaTaxKnowledge';

export const SaftValidator: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'validador' | 'motivos' | 'geradorXml'>('validador');
  const [nifInput, setNifInput] = useState('5412389102');
  const [invoiceType, setInvoiceType] = useState('FT');
  const [invoiceTotal, setInvoiceTotal] = useState('5700000');
  const [taxPercent, setTaxPercent] = useState('14');
  const [selectedExemptionCode, setSelectedExemptionCode] = useState('M04');
  const [softwareCertNo, setSoftwareCertNo] = useState('123/AGT/2023');
  const [hashSignature, setHashSignature] = useState('kL9x');

  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Validate fields
  const validateForm = () => {
    const issues: Array<{ tipo: 'erro' | 'alerta' | 'sucesso'; msg: string }> = [];

    // NIF Check
    if (!/^\d{10}$/.test(nifInput.trim())) {
      issues.push({
        tipo: 'erro',
        msg: 'NIF inválido: Em Angola o NIF deve conter exatamente 10 dígitos numéricos.',
      });
    } else {
      issues.push({
        tipo: 'sucesso',
        msg: 'NIF válido e em conformidade estrutural com a AGT.',
      });
    }

    // Hash signature check
    if (!hashSignature || hashSignature.length < 4) {
      issues.push({
        tipo: 'erro',
        msg: 'Assinatura RSA / Hash ausente: São obrigatórios os 4 caracteres de controlo (HashControl) da fatura.',
      });
    } else {
      issues.push({
        tipo: 'sucesso',
        msg: `Assinatura de Hash válida: "${hashSignature}".`,
      });
    }

    // Exemption reason check
    if (taxPercent === '0') {
      if (!selectedExemptionCode) {
        issues.push({
          tipo: 'erro',
          msg: 'Taxa de 0% ou isenção exige obrigatoriamente a indicação do Código e Motivo de Isenção (M00 a M16).',
        });
      } else {
        issues.push({
          tipo: 'sucesso',
          msg: `Motivo de Isenção associado: ${selectedExemptionCode}.`,
        });
      }
    } else {
      if (!['14', '7', '5', '1'].includes(taxPercent)) {
        issues.push({
          tipo: 'alerta',
          msg: `A taxa de ${taxPercent}% não corresponde às taxas padrão vigentes (14%, 7%, 5%, 1%).`,
        });
      }
    }

    // Software Certificate
    if (!softwareCertNo.includes('AGT')) {
      issues.push({
        tipo: 'alerta',
        msg: 'O número de validação do software deve conter a menção oficial da AGT (ex: 123/AGT/2023).',
      });
    }

    return issues;
  };

  const validationResults = validateForm();

  // Generated XML Sample
  const generatedXml = `<?xml version="1.0" encoding="Windows-1252"?>
<AuditFile xmlns="urn:OECD:StandardAuditFile-Tax:AO_1.01_01">
  <Header>
    <AuditFileVersion>1.01_01</AuditFileVersion>
    <CompanyID>${nifInput}</CompanyID>
    <TaxAccountingBasis>F</TaxAccountingBasis>
    <CompanyName>EMPRESA EXEMPLAR ANGOLA LDA</CompanyName>
    <TaxRegistrationNumber>${nifInput}</TaxRegistrationNumber>
    <FiscalYear>2026</FiscalYear>
    <StartDate>2026-01-01</StartDate>
    <EndDate>2026-01-31</EndDate>
    <CurrencyCode>AOA</CurrencyCode>
    <DateCreated>${new Date().toISOString().split('T')[0]}</DateCreated>
    <TaxEntity>Global</TaxEntity>
    <ProductCompanyTaxID>5400000000</ProductCompanyTaxID>
    <SoftwareValidationNumber>${softwareCertNo}</SoftwareValidationNumber>
    <ProductID>ERP Pro Angola</ProductID>
    <ProductVersion>2026.1</ProductVersion>
  </Header>
  <SourceDocuments>
    <SalesInvoices>
      <NumberOfEntries>1</NumberOfEntries>
      <TotalPartnerDiscount>0.00</TotalPartnerDiscount>
      <TotalDebit>0.00</TotalDebit>
      <TotalCredit>${Number(invoiceTotal).toFixed(2)}</TotalCredit>
      <Invoice>
        <InvoiceNo>${invoiceType} 2026/1</InvoiceNo>
        <DocumentStatus>
          <InvoiceStatus>N</InvoiceStatus>
          <InvoiceStatusDate>${new Date().toISOString()}</InvoiceStatusDate>
          <SourceID>Operador01</SourceID>
          <SourceBilling>P</SourceBilling>
        </DocumentStatus>
        <Hash>${hashSignature}...</Hash>
        <HashControl>1</HashControl>
        <Period>1</Period>
        <InvoiceDate>${new Date().toISOString().split('T')[0]}</InvoiceDate>
        <InvoiceType>${invoiceType}</InvoiceType>
        <SpecialRegimes>
          <SelfBillingIndicator>0</SelfBillingIndicator>
          <CashVATSchemeIndicator>0</CashVATSchemeIndicator>
          <ThirdPartiesBillingIndicator>0</ThirdPartiesBillingIndicator>
        </SpecialRegimes>
        <SourceID>Admin</SourceID>
        <SystemEntryDate>${new Date().toISOString()}</SystemEntryDate>
        <CustomerID>ConsumidorFinal</CustomerID>
        <Line>
          <LineNumber>1</LineNumber>
          <ProductCode>SRV001</ProductCode>
          <ProductDescription>Prestação de Serviços</ProductDescription>
          <Quantity>1.00</Quantity>
          <UnitOfMeasure>Unidade</UnitOfMeasure>
          <UnitPrice>${Number(invoiceTotal).toFixed(2)}</UnitPrice>
          <TaxPointDate>${new Date().toISOString().split('T')[0]}</TaxPointDate>
          <Description>Serviços Técnicos Faturados</Description>
          <CreditAmount>${Number(invoiceTotal).toFixed(2)}</CreditAmount>
          <Tax>
            <TaxType>IVA</TaxType>
            <TaxCountryRegion>AO</TaxCountryRegion>
            <TaxCode>${taxPercent === '0' ? 'ISE' : taxPercent === '7' ? 'RED' : 'NOR'}</TaxCode>
            <TaxPercentage>${taxPercent}</TaxPercentage>
          </Tax>
          ${taxPercent === '0' ? `<TaxExemptionReason>${SAFT_EXEMPTION_CODES.find(c => c.codigo === selectedExemptionCode)?.mencao}</TaxExemptionReason>
          <TaxExemptionCode>${selectedExemptionCode}</TaxExemptionCode>` : ''}
        </Line>
      </Invoice>
    </SalesInvoices>
  </SourceDocuments>
</AuditFile>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredExemptions = SAFT_EXEMPTION_CODES.filter(
    (item) =>
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mencao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('validador')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'validador'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Validador de Estrutura SAF-T (AO)
        </button>
        <button
          onClick={() => setActiveSubTab('motivos')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'motivos'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Tabela de Motivos de Isenção (M00 a M16)
        </button>
        <button
          onClick={() => setActiveSubTab('geradorXml')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'geradorXml'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Gerador de Snippet XML SAF-T Certificado
        </button>
      </div>

      {/* SUB-TAB 1: VALIDADOR DE REGRAS SAF-T */}
      {activeSubTab === 'validador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center mb-1">
                <FileCode className="w-4 h-4 mr-1.5 text-amber-600" />
                Auditor de Faturação e Parâmetros SAF-T (AO)
              </h3>
              <p className="text-xs text-slate-500">
                Decreto Executivo n.º 399/19 • Entrega mensal obrigatória até ao dia 15 de cada mês.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIF do Sujeito Passivo (10 dígitos)
              </label>
              <input
                type="text"
                value={nifInput}
                onChange={(e) => setNifInput(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-2 font-bold focus:ring-1 focus:ring-slate-900"
                placeholder="ex: 5412389102"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Documento (InvoiceType)
                </label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="FT">FT - Fatura</option>
                  <option value="FR">FR - Fatura-Recibo</option>
                  <option value="ND">ND - Nota de Débito</option>
                  <option value="NC">NC - Nota de Crédito</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taxa de IVA (%)
                </label>
                <select
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="14">14% (Taxa Normal)</option>
                  <option value="7">7% (Cesta Básica)</option>
                  <option value="5">5% (Taxa Reduzida)</option>
                  <option value="0">0% (Isenção Art. 12º)</option>
                </select>
              </div>
            </div>

            {taxPercent === '0' && (
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">
                  Código de Motivo de Isenção (Obrigatório em 0%)
                </label>
                <select
                  value={selectedExemptionCode}
                  onChange={(e) => setSelectedExemptionCode(e.target.value)}
                  className="w-full text-xs bg-amber-50 border border-amber-300 rounded px-2.5 py-1.5 font-bold focus:ring-1 focus:ring-amber-500"
                >
                  {SAFT_EXEMPTION_CODES.map((c) => (
                    <option key={c.codigo} value={c.codigo}>
                      {c.codigo} - {c.mencao}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hash de Controlo (HashControl)
                </label>
                <input
                  type="text"
                  value={hashSignature}
                  onChange={(e) => setHashSignature(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                  placeholder="ex: kL9x"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Certificado do Software (AGT)
                </label>
                <input
                  type="text"
                  value={softwareCertNo}
                  onChange={(e) => setSoftwareCertNo(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Validation Feedback Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Relatório de Conformidade com o Portal AGT
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Schema AO_1.01_01
                </span>
              </div>

              <div className="space-y-2.5">
                {validationResults.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs flex items-start space-x-2 ${
                      item.tipo === 'erro'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : item.tipo === 'alerta'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    {item.tipo === 'erro' && <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                    {item.tipo === 'alerta' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                    {item.tipo === 'sucesso' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    <span className="leading-relaxed">{item.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Dica: Erros de estrutura no ficheiro SAF-T geram rejeição imediata no Portal da AGT e sujeitam o contribuinte a multas por incumprimento da obrigação acessória (Decreto Executivo 399/19).
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MOTIVOS DE ISENÇÃO (M00 a M16) */}
      {activeSubTab === 'motivos' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tabela Oficial de Motivos de Isenção do IVA (AGT SAF-T)
              </h3>
              <p className="text-xs text-slate-500">
                Códigos padronizados exigidos nos softwares de faturação certificados em Angola.
              </p>
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar código ou artigo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3 font-mono">Código</th>
                  <th className="py-2 px-3">Menção Obrigatória na Fatura</th>
                  <th className="py-2 px-3">Enquadramento Legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExemptions.map((item) => (
                  <tr key={item.codigo} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-800 bg-amber-50/50">
                      {item.codigo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.mencao}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GERADOR DE XML SAF-T */}
      {activeSubTab === 'geradorXml' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Snippet XML SAF-T (AO) Válido para Testes
              </h3>
              <p className="text-xs text-slate-500">
                Exemplo estruturado de acordo com o Schema XML da AGT (AO_1.01_01).
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar XML'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
            {generatedXml}
          </pre>
        </div>
      )}
    </div>
  );
};
