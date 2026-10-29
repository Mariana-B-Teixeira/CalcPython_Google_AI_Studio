/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { VisualCalculator } from './components/VisualCalculator';
import { HistoryPanel } from './components/HistoryPanel';
import { PythonTerminal } from './components/PythonTerminal';
import { TestSuitesView } from './components/TestSuitesModal';
import { PythonCodeView } from './components/PythonCodeModal';
import { CalculationRecord } from './types/calculator';
import { X, History } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visual' | 'terminal' | 'tests' | 'code'>('visual');
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [seqCounter, setSeqCounter] = useState<number>(1);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [isHistoryMobileOpen, setIsHistoryMobileOpen] = useState(false);

  const handleAddRecord = (record: CalculationRecord) => {
    const updatedRecord: CalculationRecord = {
      ...record,
      sequence: seqCounter,
    };
    setSeqCounter((prev) => prev + 1);
    setHistory((prev) => [updatedRecord, ...prev]);

    if (record.result !== null) {
      setLastResult(record.result);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleResetSession = () => {
    setHistory([]);
    setLastResult(null);
    setSeqCounter(1);
  };

  const handleReuseRecord = (record: CalculationRecord) => {
    if (record.result !== null) {
      setLastResult(record.result);
    }
    setActiveTab('visual');
    setIsHistoryMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsHistoryMobileOpen(false);
        }}
        historyCount={history.length}
        onOpenHistoryMobile={() => setIsHistoryMobileOpen(true)}
        onResetSession={handleResetSession}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Main Workspace Column */}
          <div className="min-w-0">
            {activeTab === 'visual' && (
              <VisualCalculator
                onAddRecord={handleAddRecord}
                lastResult={lastResult}
                onSelectReuse={(val) => setLastResult(val)}
                onRequestTerminal={() => setActiveTab('terminal')}
              />
            )}

            {activeTab === 'terminal' && (
              <PythonTerminal
                history={history}
                onAddRecord={handleAddRecord}
                onClearHistory={handleClearHistory}
              />
            )}

            {activeTab === 'tests' && (
              <TestSuitesView
                currentHistory={history}
                onClearHistory={handleClearHistory}
              />
            )}

            {activeTab === 'code' && <PythonCodeView />}
          </div>

          {/* Persistent Desktop Sidebar: Session History */}
          <div className="hidden lg:block sticky top-22">
            <HistoryPanel
              history={history}
              onClearHistory={handleClearHistory}
              onReuseRecord={handleReuseRecord}
            />
          </div>
        </div>
      </main>

      {/* Mobile History Drawer / Modal */}
      {isHistoryMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsHistoryMobileOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm">Histórico da Sessão</span>
              </div>
              <button
                onClick={() => setIsHistoryMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <HistoryPanel
                history={history}
                onClearHistory={handleClearHistory}
                onReuseRecord={handleReuseRecord}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CalcPython · Calculadora Interativa em Python</span>
          <span className="font-mono text-slate-400 text-[11px]">
            Sessão Local · Histórico Volátil Preservado
          </span>
        </div>
      </footer>
    </div>
  );
}
