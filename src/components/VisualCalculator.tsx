import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Minus,
  X,
  Divide,
  Percent,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ArrowDownUp,
  Sparkles,
  PowerOff,
} from 'lucide-react';
import { MathOperation, CalculationRecord } from '../types/calculator';
import { OPERATIONS, calculate, formatNumber, sanitizeNumberInput } from '../utils/calculator';

interface VisualCalculatorProps {
  onAddRecord: (record: CalculationRecord) => void;
  lastResult: number | null;
  onSelectReuse: (value: number) => void;
  onRequestTerminal: () => void;
}

export const VisualCalculator: React.FC<VisualCalculatorProps> = ({
  onAddRecord,
  lastResult,
  onSelectReuse,
  onRequestTerminal,
}) => {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<MathOperation>('add');
  const [currentResult, setCurrentResult] = useState<{
    success: boolean;
    val?: number;
    expression: string;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const num1InputRef = useRef<HTMLInputElement>(null);
  const num2InputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for 1, 2, 3, 4 to switch operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (document.activeElement?.tagName === 'INPUT') {
        if (e.key === 'Enter') {
          handleExecuteCalculation();
        }
        return;
      }

      if (e.key === '1' || e.key === '+') setOperation('add');
      if (e.key === '2' || e.key === '-') setOperation('subtract');
      if (e.key === '3' || e.key === '*') setOperation('multiply');
      if (e.key === '4' || e.key === '/') setOperation('divide');
      if (e.key === '5' || e.key === '%') setOperation('percentage');
      if (e.key === 'Enter') handleExecuteCalculation();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [num1, num2, operation]);

  const handleExecuteCalculation = () => {
    if (sessionEnded) setSessionEnded(false);

    const calcResult = calculate(num1, num2, operation);

    if (calcResult.success && calcResult.result !== undefined) {
      const record: CalculationRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        sequence: 0, // Assigned by parent
        num1: Number(sanitizeNumberInput(num1)),
        num2: Number(sanitizeNumberInput(num2)),
        operation,
        symbol: OPERATIONS[operation].symbol,
        expression: calcResult.expression,
        result: calcResult.result,
        error: null,
        timestamp: new Date(),
      };
      onAddRecord(record);
      setCurrentResult({
        success: true,
        val: calcResult.result,
        expression: calcResult.expression,
      });
    } else {
      const isZeroDiv = operation === 'divide' && Number(sanitizeNumberInput(num2)) === 0;
      if (isZeroDiv) {
        const record: CalculationRecord = {
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          sequence: 0,
          num1: Number(sanitizeNumberInput(num1)) || 0,
          num2: 0,
          operation,
          symbol: OPERATIONS[operation].symbol,
          expression: `${num1 || '0'} ÷ 0 = Indefinido`,
          result: null,
          error: calcResult.error,
          timestamp: new Date(),
        };
        onAddRecord(record);
      }
      setCurrentResult({
        success: false,
        error: calcResult.error,
        expression: calcResult.expression,
      });
    }
  };

  const handleResetFields = () => {
    setNum1('');
    setNum2('');
    setCurrentResult(null);
    num1InputRef.current?.focus();
  };

  const handleUseResultAsNum1 = () => {
    if (currentResult?.val !== undefined) {
      setNum1(String(currentResult.val));
      setNum2('');
      setCurrentResult(null);
      num2InputRef.current?.focus();
    }
  };

  const handleSwapNumbers = () => {
    const temp = num1;
    setNum1(num2);
    setNum2(temp);
  };

  const handleToggleSign = (target: 'num1' | 'num2') => {
    if (target === 'num1') {
      if (!num1) return;
      if (num1.startsWith('-')) setNum1(num1.substring(1));
      else setNum1('-' + num1);
    } else {
      if (!num2) return;
      if (num2.startsWith('-')) setNum2(num2.substring(1));
      else setNum2('-' + num2);
    }
  };

  const handleCopyResult = () => {
    if (currentResult?.val !== undefined) {
      navigator.clipboard.writeText(String(currentResult.val));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (sessionEnded) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl">
          👋
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sessão Finalizada</h2>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          Obrigado por utilizar a <strong>CalcPython</strong>! Seu histórico de cálculos continua preservado para consulta nesta sessão até você optar por limpá-lo ou atualizar a página.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSessionEnded(false);
              handleResetFields();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Iniciar Novo Cálculo</span>
          </button>
          <button
            onClick={onRequestTerminal}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>Ver no Terminal CLI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Operation Selection Menu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              1. Escolha a Operação Matemática
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clique para selecionar ou use as teclas de atalho (1, 2, 3, 4, 5 ou +, -, *, /, %)
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Opção: {OPERATIONS[operation].name} ({OPERATIONS[operation].symbol})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['add', 'subtract', 'multiply', 'divide', 'percentage'] as MathOperation[]).map((opKey) => {
            const op = OPERATIONS[opKey];
            const isSelected = operation === opKey;

            const iconMap = {
              add: <Plus className="w-5 h-5" />,
              subtract: <Minus className="w-5 h-5" />,
              multiply: <X className="w-5 h-5" />,
              divide: <Divide className="w-5 h-5" />,
              percentage: <Percent className="w-5 h-5" />,
            };

            return (
              <button
                key={opKey}
                type="button"
                onClick={() => setOperation(opKey)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {iconMap[opKey]}
                </div>
                <span className="font-semibold text-sm">{op.name}</span>
                <span className="text-xs text-slate-500 mt-0.5 font-mono">
                  Tecla [{op.shortcut}] ou [{op.pyOperator}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Fields */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              2. Digite os Números Desejados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Suporta números inteiros e decimais (utilize vírgula ou ponto)
            </p>
          </div>

          {lastResult !== null && (
            <button
              type="button"
              onClick={() => {
                setNum1(String(lastResult));
                num2InputRef.current?.focus();
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Usar Último Resultado ({formatNumber(lastResult)})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* First Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Primeiro Número (num1)
            </label>
            <div className="relative">
              <input
                ref={num1InputRef}
                type="text"
                inputMode="decimal"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder="Ex: 15 ou 100.5"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleSign('num1')}
                  className="px-2 py-1 text-xs font-mono font-medium text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded transition-colors"
                  title="Inverter Sinal (±)"
                >
                  ±
                </button>
                {num1 && (
                  <button
                    type="button"
                    onClick={() => setNum1('')}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Limpar campo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Operator Symbol & Swap */}
          <div className="flex md:flex-col items-center justify-center gap-2 pt-2 md:pt-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-lg text-blue-700">
              {OPERATIONS[operation].symbol}
            </div>
            <button
              type="button"
              onClick={handleSwapNumbers}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Trocar posição dos números (inverter)"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>

          {/* Second Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Segundo Número (num2) {operation === 'divide' && <span className="text-amber-600 font-normal">(≠ 0)</span>}
            </label>
            <div className="relative">
              <input
                ref={num2InputRef}
                type="text"
                inputMode="decimal"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder={operation === 'divide' ? 'Ex: 4 (diferente de 0)' : 'Ex: 27 ou 35.5'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleSign('num2')}
                  className="px-2 py-1 text-xs font-mono font-medium text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded transition-colors"
                  title="Inverter Sinal (±)"
                >
                  ±
                </button>
                {num2 && (
                  <button
                    type="button"
                    onClick={() => setNum2('')}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Limpar campo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFields}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Campos</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSessionEnded(true)}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Encerrar Programa</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteCalculation}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-xs transition-colors flex items-center gap-2 text-sm"
            >
              <span>Processar Cálculo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Result or Error Display Card */}
      {currentResult && (
        <div className="transition-all animate-fadeIn">
          {currentResult.success && currentResult.val !== undefined ? (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                    Resultado do Cálculo
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-mono tracking-tight mt-1">
                    {formatNumber(currentResult.val)}
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-700 font-mono mt-1">
                    {currentResult.expression}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="px-3 py-2 text-xs font-medium text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseResultAsNum1}
                    className="px-3.5 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Usar no Próximo Cálculo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFields}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    Novo Cálculo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-red-900 text-sm">
                    {currentResult.error || 'Erro ao processar cálculo'}
                  </h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    {operation === 'divide' && (num2 === '0' || num2 === '0,0' || num2 === '0.0')
                      ? 'Na aritmética matemática e no Python, a divisão por zero é indefinida (ZeroDivisionError). Por favor, forneça um divisor diferente de zero para prosseguir.'
                      : 'Verifique se os valores preenchidos contêm apenas dígitos numéricos válidos e tente novamente.'}
                  </p>
                  <p className="text-xs font-mono text-red-800 pt-1">
                    Expressão tentada: {currentResult.expression}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
