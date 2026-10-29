import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Trash2, RotateCcw, HelpCircle } from 'lucide-react';
import { CalculationRecord, MathOperation } from '../types/calculator';
import { OPERATIONS, calculate, formatNumber, sanitizeNumberInput, isValidNumber } from '../utils/calculator';

interface TerminalLine {
  id: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'success' | 'info';
  text: string;
}

type ScriptStep =
  | 'menu'
  | 'input_num1'
  | 'input_num2'
  | 'ask_next';

interface PythonTerminalProps {
  history: CalculationRecord[];
  onAddRecord: (record: CalculationRecord) => void;
  onClearHistory: () => void;
}

export const PythonTerminal: React.FC<PythonTerminalProps> = ({
  history,
  onAddRecord,
  onClearHistory,
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [step, setStep] = useState<ScriptStep>('menu');
  const [selectedOp, setSelectedOp] = useState<MathOperation | null>(null);
  const [pendingNum1, setPendingNum1] = useState<string>('');
  const [lastResult, setLastResult] = useState<number | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal on mount
  useEffect(() => {
    initTerminal();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()), type, text },
    ]);
  };

  const initTerminal = () => {
    setLines([
      { id: '1', type: 'system', text: '$ python3 calc.py' },
      { id: '2', type: 'system', text: '==================================================' },
      { id: '3', type: 'system', text: '       🐍 CalcPython - Calculadora Interativa       ' },
      { id: '4', type: 'system', text: '==================================================' },
      { id: '5', type: 'info', text: '\n--- OPERAÇÕES DISPONÍVEIS ---' },
      { id: '6', type: 'info', text: '1. [+] Soma' },
      { id: '7', type: 'info', text: '2. [-] Subtração' },
      { id: '8', type: 'info', text: '3. [*] Multiplicação' },
      { id: '9', type: 'info', text: '4. [/] Divisão' },
      { id: '9b', type: 'info', text: '5. [%] Porcentagem' },
      { id: '10', type: 'info', text: '-----------------------------' },
      { id: '11', type: 'info', text: 'H. [H] Ver Histórico da Sessão' },
      { id: '12', type: 'info', text: 'L. [L] Limpar Histórico' },
      { id: '13', type: 'info', text: '0. [S] Sair do Programa' },
      { id: '14', type: 'info', text: '-----------------------------' },
    ]);
    setStep('menu');
    setSelectedOp(null);
    setPendingNum1('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = currentInput.trim();
    setCurrentInput('');

    // Echo user input
    addLine('input', `> ${cmd}`);

    switch (step) {
      case 'menu': {
        const lower = cmd.toLowerCase();
        if (lower === '0' || lower === 's' || lower === 'sair' || lower === 'exit') {
          addLine('output', '\n👋 Obrigado por usar a CalcPython! Sessão finalizada com sucesso.');
          addLine('system', '$ Process finished with exit code 0');
          return;
        }

        if (lower === 'h' || lower === 'historico' || lower === 'histórico') {
          addLine('info', '\n📜 --- HISTÓRICO DA SESSÃO ATUAL ---');
          if (history.length === 0) {
            addLine('output', 'ℹ️  O histórico está vazio. Faça algum cálculo para registrá-lo.');
          } else {
            history.forEach((h) => {
              const time = h.timestamp.toLocaleTimeString('pt-BR');
              addLine('output', `#${h.sequence} [${time}] ${h.expression}`);
            });
            addLine('output', `Total de operações registradas: ${history.length}`);
          }
          addLine('info', '\nSelecione uma opção [1-5, H, L, 0]:');
          return;
        }

        if (lower === 'l' || lower === 'limpar' || lower === 'clear') {
          onClearHistory();
          addLine('success', '🧹 Histórico de cálculos da sessão limpo com sucesso!');
          addLine('info', '\nSelecione uma opção [1-5, H, L, 0]:');
          return;
        }

        // Check arithmetic operations
        let op: MathOperation | null = null;
        if (cmd === '1' || cmd === '+') op = 'add';
        else if (cmd === '2' || cmd === '-') op = 'subtract';
        else if (cmd === '3' || cmd === '*') op = 'multiply';
        else if (cmd === '4' || cmd === '/') op = 'divide';
        else if (cmd === '5' || cmd === '%') op = 'percentage';

        if (!op) {
          addLine(
            'error',
            '⚠️  Opção inválida! Escolha de 1 a 5, ou H para histórico, L para limpar, ou 0 para sair.'
          );
          return;
        }

        setSelectedOp(op);
        addLine('output', `Operação selecionada: ${OPERATIONS[op].name} (${OPERATIONS[op].symbol})`);

        if (lastResult !== null) {
          addLine(
            'info',
            `Dica: Digite 'u' para reaproveitar o último resultado (${formatNumber(lastResult)}).`
          );
        }

        setStep('input_num1');
        break;
      }

      case 'input_num1': {
        if (currentInput.trim().toLowerCase() === 'u' && lastResult !== null) {
          setPendingNum1(String(lastResult));
          addLine('output', `Primeiro número definido como: ${formatNumber(lastResult)}`);
          setStep('input_num2');
          return;
        }

        if (!isValidNumber(cmd)) {
          addLine(
            'error',
            '⚠️  Entrada inválida! Por favor, digite um número válido (ex: 15 ou 2.5).'
          );
          return;
        }

        setPendingNum1(cmd);
        setStep('input_num2');
        break;
      }

      case 'input_num2': {
        if (!isValidNumber(cmd)) {
          addLine(
            'error',
            '⚠️  Entrada inválida! Por favor, digite um número válido (ex: 4 ou 10.5).'
          );
          return;
        }

        if (!selectedOp) {
          setStep('menu');
          return;
        }

        const calcRes = calculate(pendingNum1, cmd, selectedOp);

        if (calcRes.success && calcRes.result !== undefined) {
          const record: CalculationRecord = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            sequence: 0,
            num1: Number(sanitizeNumberInput(pendingNum1)),
            num2: Number(sanitizeNumberInput(cmd)),
            operation: selectedOp,
            symbol: OPERATIONS[selectedOp].symbol,
            expression: calcRes.expression,
            result: calcRes.result,
            error: null,
            timestamp: new Date(),
          };
          onAddRecord(record);
          setLastResult(calcRes.result);

          addLine('system', '===================================');
          addLine('success', `✅ RESULTADO: ${formatNumber(calcRes.result)}`);
          addLine('output', `📝 Expressão: ${calcRes.expression}`);
          addLine('system', '===================================');
        } else {
          // Error in calculation (e.g. division by zero)
          if (selectedOp === 'divide' && Number(sanitizeNumberInput(cmd)) === 0) {
            const record: CalculationRecord = {
              id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
              sequence: 0,
              num1: Number(sanitizeNumberInput(pendingNum1)) || 0,
              num2: 0,
              operation: selectedOp,
              symbol: OPERATIONS[selectedOp].symbol,
              expression: `${pendingNum1} ÷ 0 = Indefinido`,
              result: null,
              error: calcRes.error,
              timestamp: new Date(),
            };
            onAddRecord(record);
          }

          addLine('error', `❌ ${calcRes.error}`);
          if (selectedOp === 'divide') {
            addLine(
              'info',
              '💡 Dica: Na divisão matemática, o divisor (segundo número) deve ser diferente de zero.'
            );
          }
        }

        setStep('ask_next');
        break;
      }

      case 'ask_next': {
        const lower = cmd.toLowerCase();
        if (lower === 'n' || lower === 'nao' || lower === 'não' || lower === '0' || lower === 'sair') {
          addLine('output', '\n👋 Sessão encerrada. Até a próxima!');
          addLine('system', '$ Process finished with exit code 0');
          return;
        }

        if (lower === 'h' || lower === 'historico') {
          addLine('info', '\n📜 --- HISTÓRICO DA SESSÃO ATUAL ---');
          history.forEach((h) => {
            const time = h.timestamp.toLocaleTimeString('pt-BR');
            addLine('output', `#${h.sequence} [${time}] ${h.expression}`);
          });
          addLine('output', `Total de operações: ${history.length}`);
        }

        // Restart flow
        addLine('info', '\n--- NOVO CÁLCULO ---');
        addLine('info', '1. Soma | 2. Subtração | 3. Multiplicação | 4. Divisão | 5. Porcentagem | H. Histórico | 0. Sair');
        setStep('menu');
        setSelectedOp(null);
        setPendingNum1('');
        break;
      }
    }
  };

  const getPromptLabel = () => {
    switch (step) {
      case 'menu':
        return 'Selecione uma opção [1-5, H, L, 0]: ';
      case 'input_num1':
        return 'Digite o primeiro número: ';
      case 'input_num2':
        return selectedOp === 'divide'
          ? 'Digite o segundo número (divisor ≠ 0): '
          : 'Digite o segundo número: ';
      case 'ask_next':
        return 'Deseja novo cálculo? ([S]im / [N]ão / [H]istórico): ';
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px] font-mono text-xs sm:text-sm">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 text-xs font-sans font-medium ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Python 3.11 · calc.py (Console Interativo)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={initTerminal}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Reiniciar console"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLines([])}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Limpar tela"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-1.5 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line) => {
          let colorClass = 'text-slate-300';
          if (line.type === 'system') colorClass = 'text-blue-400';
          if (line.type === 'input') colorClass = 'text-amber-300 font-bold';
          if (line.type === 'success') colorClass = 'text-emerald-400 font-bold';
          if (line.type === 'error') colorClass = 'text-red-400 font-bold';
          if (line.type === 'info') colorClass = 'text-sky-300';

          return (
            <div key={line.id} className={`${colorClass} whitespace-pre-wrap leading-relaxed`}>
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Option Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 text-[11px] font-sans">Atalhos rápidos:</span>
        {step === 'menu' && (
          <>
            <button
              onClick={() => {
                setCurrentInput('1');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            >
              1. Soma (+)
            </button>
            <button
              onClick={() => {
                setCurrentInput('2');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            >
              2. Subtração (-)
            </button>
            <button
              onClick={() => {
                setCurrentInput('3');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            >
              3. Multiplicação (*)
            </button>
            <button
              onClick={() => {
                setCurrentInput('4');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            >
              4. Divisão (/)
            </button>
            <button
              onClick={() => {
                setCurrentInput('5');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            >
              5. Porcentagem (%)
            </button>
            <button
              onClick={() => {
                setCurrentInput('H');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded border border-blue-800 transition-colors"
            >
              H. Histórico
            </button>
          </>
        )}
        {step === 'ask_next' && (
          <>
            <button
              onClick={() => {
                setCurrentInput('s');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded border border-emerald-800 transition-colors"
            >
              Sim (novo cálculo)
            </button>
            <button
              onClick={() => {
                setCurrentInput('n');
                setTimeout(() => inputRef.current?.form?.requestSubmit(), 50);
              }}
              className="px-2 py-0.5 bg-red-950 hover:bg-red-900 text-red-300 rounded border border-red-800 transition-colors"
            >
              Não (encerrar)
            </button>
          </>
        )}
      </div>

      {/* Terminal Input Line */}
      <form
        onSubmit={handleCommandSubmit}
        className="bg-slate-900 border-t border-slate-800 p-3 flex items-center gap-2"
      >
        <span className="text-emerald-400 select-none font-bold">❯</span>
        <span className="text-slate-400 select-none text-xs sm:text-sm">{getPromptLabel()}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="digite o valor e aperte Enter..."
          className="flex-1 bg-transparent text-emerald-300 focus:outline-none font-mono text-sm caret-emerald-400"
          autoFocus
        />
        <button
          type="submit"
          className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
          title="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
