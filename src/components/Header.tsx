import React from 'react';
import { Terminal, Calculator, FileCode, CheckCircle2, History, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'visual' | 'terminal' | 'tests' | 'code';
  onTabChange: (tab: 'visual' | 'terminal' | 'tests' | 'code') => void;
  historyCount: number;
  onOpenHistoryMobile: () => void;
  onResetSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  historyCount,
  onOpenHistoryMobile,
  onResetSession,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-sm font-mono font-bold text-lg select-none">
              🐍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">CalcPython</span>
                <span className="text-[11px] font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  v1.0 Python
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Calculadora interativa com histórico e validações amigáveis
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => onTabChange('visual')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'visual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Painel Visual</span>
            </button>

            <button
              onClick={() => onTabChange('terminal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'terminal'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Terminal CLI</span>
            </button>

            <button
              onClick={() => onTabChange('tests')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tests'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Critérios de Teste</span>
              <span className="md:hidden">Testes</span>
            </button>

            <button
              onClick={() => onTabChange('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCode className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline">Código calc.py</span>
              <span className="lg:hidden">calc.py</span>
            </button>
          </nav>

          {/* Mobile history toggle & reset button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistoryMobile}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Abrir Histórico"
            >
              <History className="w-4 h-4 text-slate-600" />
              <span>{historyCount}</span>
            </button>

            <button
              onClick={onResetSession}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
              title="Reiniciar Sessão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
