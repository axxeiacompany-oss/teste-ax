import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Printer,
  Table
} from 'lucide-react';
import { AssetDepreciationItem } from '../types/tax';
import { formatKz } from '../utils/taxCalculators';

export const Modelo2Amortizacoes: React.FC = () => {
  const [assets, setAssets] = useState<AssetDepreciationItem[]>([
    {
      id: 'ast-1',
      descricao: 'Viatura Ligeira de Passageiros (Administração)',
      grupoContabilistico: 'Meios de Transporte',
      anoAquisicao: 2024,
      valorAquisicao: 25000000,
      taxaContabilistica: 30, // 30% registada na contabilidade
      taxaFiscalMaxima: 25, // 25% máxima legal (Dec. 134/13)
      quotaContabilistica: 7500000,
      quotaFiscalAceite: 6250000,
      excessoNaoDedutivel: 1250000,
    },
    {
      id: 'ast-2',
      descricao: 'Servidores & Infraestrutura de TI',
      grupoContabilistico: 'Equipamento Informático',
      anoAquisicao: 2025,
      valorAquisicao: 12000000,
      taxaContabilistica: 33.33,
      taxaFiscalMaxima: 33.33,
      quotaContabilistica: 4000000,
      quotaFiscalAceite: 4000000,
      excessoNaoDedutivel: 0,
    },
    {
      id: 'ast-3',
      descricao: 'Camião Pesado de Distribuição',
      grupoContabilistico: 'Meios de Transporte',
      anoAquisicao: 2023,
      valorAquisicao: 45000000,
      taxaContabilistica: 20,
      taxaFiscalMaxima: 20,
      quotaContabilistica: 9000000,
      quotaFiscalAceite: 9000000,
      excessoNaoDedutivel: 0,
    },
    {
      id: 'ast-4',
      descricao: 'Mobiliário e Divisórias de Escritório',
      grupoContabilistico: 'Mobiliário e Equipamento Social',
      anoAquisicao: 2024,
      valorAquisicao: 8000000,
      taxaContabilistica: 15,
      taxaFiscalMaxima: 10, // 10% máxima
      quotaContabilistica: 1200000,
      quotaFiscalAceite: 800000,
      excessoNaoDedutivel: 400000,
    },
  ]);

  // Form for new asset
  const [descricao, setDescricao] = useState('');
  const [grupo, setGrupo] = useState('Meios de Transporte');
  const [ano, setAno] = useState(2025);
  const [valor, setValor] = useState<number>(5000000);
  const [taxaConta, setTaxaConta] = useState<number>(25);
  const [taxaFisc, setTaxaFisc] = useState<number>(20);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    const quotaContabilistica = Number(((valor * taxaConta) / 100).toFixed(2));
    const quotaFiscalAceite = Number(((valor * taxaFisc) / 100).toFixed(2));
    const excessoNaoDedutivel = Math.max(0, Number((quotaContabilistica - quotaFiscalAceite).toFixed(2)));

    const newItem: AssetDepreciationItem = {
      id: `ast-${Date.now()}`,
      descricao,
      grupoContabilistico: grupo,
      anoAquisicao: ano,
      valorAquisicao: valor,
      taxaContabilistica: taxaConta,
      taxaFiscalMaxima: taxaFisc,
      quotaContabilistica,
      quotaFiscalAceite,
      excessoNaoDedutivel,
    };

    setAssets([...assets, newItem]);
    setDescricao('');
    setValor(5000000);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const totalValorAquisicao = assets.reduce((acc, a) => acc + a.valorAquisicao, 0);
  const totalQuotaContabilistica = assets.reduce((acc, a) => acc + a.quotaContabilistica, 0);
  const totalQuotaFiscalAceite = assets.reduce((acc, a) => acc + a.quotaFiscalAceite, 0);
  const totalExcessoNaoDedutivel = assets.reduce((acc, a) => acc + a.excessoNaoDedutivel, 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center">
          <Building className="w-4 h-4 mr-1.5 text-amber-700" />
          Mapa Oficial Modelo 2 de Reintegrações e Amortizações
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Documento fiscal e contabilístico obrigatório do <strong>Dossier Fiscal (Art.º 58.º do CII)</strong> regulado 
          pelo <strong>Decreto Executivo n.º 134/13</strong>. As quotas de amortização praticadas acima das taxas fixadas 
          são expressamente consideradas <strong>custos não dedutíveis</strong> (Art.º 18.º do Código do Imposto Industrial) 
          e devem acrescer ao Lucro Tributável no Modelo 1.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Activo Bruto</span>
          <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
            {formatKz(totalValorAquisicao)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block">Quota Contabilística</span>
          <span className="text-lg font-bold font-mono text-slate-800 mt-1 block">
            {formatKz(totalQuotaContabilistica)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase block">Quota Aceite Fiscalmente</span>
          <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
            {formatKz(totalQuotaFiscalAceite)}
          </span>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-900 uppercase block">Excesso Não Dedutível (Mod. 1)</span>
          <span className="text-lg font-bold font-mono text-amber-900 mt-1 block">
            {formatKz(totalExcessoNaoDedutivel)}
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">Acréscimo no Campo [05] do Mod. 1</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <Table className="w-3.5 h-3.5 mr-1.5 text-slate-700" />
            Discriminação dos Activos Imobilizados Corpóreos e Incorpóreos
          </h4>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {assets.length} Activos Registados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-sans">Descrição do Activo</th>
                <th className="py-2.5 px-3 font-sans">Grupo</th>
                <th className="py-2.5 px-3 text-right">Valor Aquisição (Kz)</th>
                <th className="py-2.5 px-3 text-center">Tx. Contab.</th>
                <th className="py-2.5 px-3 text-center">Tx. Fiscal</th>
                <th className="py-2.5 px-3 text-right">Quota Contab.</th>
                <th className="py-2.5 px-3 text-right">Quota Fiscal</th>
                <th className="py-2.5 px-3 text-right text-amber-800">Excesso Não Ded.</th>
                <th className="py-2.5 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-sans font-semibold text-slate-900">{asset.descricao}</td>
                  <td className="py-2 px-3 font-sans text-slate-600 text-[11px]">{asset.grupoContabilistico}</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{formatKz(asset.valorAquisicao)}</td>
                  <td className="py-2 px-3 text-center text-slate-700">{asset.taxaContabilistica}%</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-800">{asset.taxaFiscalMaxima}%</td>
                  <td className="py-2 px-3 text-right text-slate-800">{formatKz(asset.quotaContabilistica)}</td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-800">{formatKz(asset.quotaFiscalAceite)}</td>
                  <td className="py-2 px-3 text-right font-bold text-amber-800">
                    {asset.excessoNaoDedutivel > 0 ? formatKz(asset.excessoNaoDedutivel) : '-'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remover Activo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form to Add Asset */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">
          <Plus className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
          Adicionar Novo Activo Fixo ao Mapa Modelo 2
        </h4>

        <form onSubmit={handleAddAsset} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Designação do Activo Fixo
            </label>
            <input
              type="text"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="ex: Gerador Industrial 250kVA"
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Grupo Contabilístico
            </label>
            <select
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-900"
            >
              <option>Meios de Transporte</option>
              <option>Equipamento Básico</option>
              <option>Equipamento Informático</option>
              <option>Edifícios e Construções</option>
              <option>Mobiliário e Equipamento Social</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Valor Aquisição (Kz)
            </label>
            <input
              type="number"
              required
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className="w-full font-mono bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tx. Contab. (%)
            </label>
            <input
              type="number"
              required
              value={taxaConta}
              onChange={(e) => setTaxaConta(Number(e.target.value))}
              className="w-full font-mono bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tx. Fiscal Dec.134 (%)
            </label>
            <input
              type="number"
              required
              value={taxaFisc}
              onChange={(e) => setTaxaFisc(Number(e.target.value))}
              className="w-full font-mono bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="sm:col-span-3 lg:col-span-6 flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded shadow transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Inserir no Modelo 2</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
