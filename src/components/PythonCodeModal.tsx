import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, CheckCircle2 } from 'lucide-react';
import { PYTHON_SOURCE_CODE } from '../utils/pythonScript';

export const PythonCodeView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_SOURCE_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calc.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = PYTHON_SOURCE_CODE.trim().split('\n');

  return (
    <div className="space-y-6">
      {/* Code Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Código Fonte Original · calc.py
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Script Python 3 puro e autocontido com funções modulares, histórico e tratamento de exceções.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Código Copiado!' : 'Copiar Script'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar calc.py</span>
          </button>
        </div>
      </div>

      {/* Instructions callout */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Terminal className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Como executar em seu computador localmente:</p>
          <p className="text-blue-800">
            Abra seu terminal ou prompt de comando na pasta do arquivo baixado e execute:
            <code className="ml-1.5 px-2 py-0.5 bg-blue-100 rounded font-mono font-bold text-blue-950">
              python3 calc.py
            </code>
          </p>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">calc.py ({lines.length} linhas)</span>
          <span className="font-sans text-[11px] text-slate-500">Python 3.8+ · UTF-8</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="w-10 select-none text-right pr-4 text-slate-600 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre">
                    {/* Basic visual coloring */}
                    {line.startsWith('#') || line.startsWith('"""') || line.endsWith('"""') ? (
                      <span className="text-slate-500 italic">{line}</span>
                    ) : line.includes('def ') ? (
                      <span>
                        <span className="text-pink-400">def </span>
                        <span className="text-blue-300 font-semibold">
                          {line.replace('def ', '').split('(')[0]}
                        </span>
                        {line.substring(line.indexOf('('))}
                      </span>
                    ) : line.includes('print(') ? (
                      <span>
                        {line.substring(0, line.indexOf('print'))}
                        <span className="text-amber-300">print</span>
                        {line.substring(line.indexOf('print') + 5)}
                      </span>
                    ) : line.includes('except ') || line.includes('try:') || line.includes('while ') || line.includes('if ') || line.includes('elif ') || line.includes('else:') ? (
                      <span className="text-purple-300 font-medium">{line}</span>
                    ) : (
                      line
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
