import React, { useState } from 'react';
import { History, Trash2, Copy, Check, RotateCcw, Calculator, ArrowUpRight, AlertCircle } from 'lucide-react';
import { CalculationRecord } from '../types/calculator';
import { formatNumber } from '../utils/calculator';

interface HistoryPanelProps {
  history: CalculationRecord[];
  onClearHistory: () => void;
  onReuseRecord: (record: CalculationRecord) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onReuseRecord,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full max-h-[750px]">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-slate-900 text-sm">Histórico da Sessão</h2>
          <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1"
            title="Limpar histórico da sessão"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Confirmation banner */}
      {showClearConfirm && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-900">
          <span>Deseja realmente limpar o histórico da sessão?</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleConfirmClear}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
            >
              Sim, limpar
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
        {history.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <Calculator className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Nenhum cálculo recente</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              Faça sua primeira operação matemática e ela será registrada aqui automaticamente.
            </p>
          </div>
        ) : (
          history.map((record) => {
            const isCopied = copiedId === record.id;
            const isError = record.result === null;

            return (
              <div
                key={record.id}
                className={`p-3 rounded-xl border transition-all text-xs group ${
                  isError
                    ? 'bg-red-50/50 border-red-200 text-red-900'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-semibold text-slate-700">#{record.sequence}</span>
                    <span>·</span>
                    <span>
                      {record.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isError && (
                      <button
                        type="button"
                        onClick={() => handleCopy(record.id, String(record.result))}
                        className="p-1 hover:text-blue-600 rounded"
                        title="Copiar resultado"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onReuseRecord(record)}
                      className="p-1 hover:text-blue-600 rounded flex items-center gap-0.5 text-[11px] font-medium"
                      title="Carregar de volta na calculadora"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="hidden sm:inline">Repetir</span>
                    </button>
                  </div>
                </div>

                {isError ? (
                  <div className="flex items-start gap-1.5 text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono font-medium">{record.expression}</p>
                      <p className="text-[11px] text-red-600">{record.error}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-mono text-sm font-semibold text-slate-900">
                      {record.expression}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary */}
      {history.length > 0 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
          <span>Total: {history.length} operações</span>
          <span className="font-mono text-[11px]">Sessão Ativa</span>
        </div>
      )}
    </div>
  );
};
