import { MathOperation, OperationConfig, CalculationRecord } from '../types/calculator';

export const OPERATIONS: Record<MathOperation, OperationConfig> = {
  add: {
    id: 'add',
    symbol: '+',
    name: 'Soma',
    pyOperator: '+',
    description: 'Adiciona dois valores (num1 + num2)',
    shortcut: '1',
  },
  subtract: {
    id: 'subtract',
    symbol: '−',
    name: 'Subtração',
    pyOperator: '-',
    description: 'Subtrai o segundo valor do primeiro (num1 - num2)',
    shortcut: '2',
  },
  multiply: {
    id: 'multiply',
    symbol: '×',
    name: 'Multiplicação',
    pyOperator: '*',
    description: 'Multiplica os dois fatores (num1 * num2)',
    shortcut: '3',
  },
  divide: {
    id: 'divide',
    symbol: '÷',
    name: 'Divisão',
    pyOperator: '/',
    description: 'Divide o dividendo pelo divisor (num1 / num2)',
    shortcut: '4',
  },
  percentage: {
    id: 'percentage',
    symbol: '%',
    name: 'Porcentagem',
    pyOperator: '%',
    description: 'Calcula a porcentagem de um valor ((num1 * num2) / 100)',
    shortcut: '5',
  },
};

/**
 * Normalizes input string converting commas to dots and trimming whitespace
 */
export function sanitizeNumberInput(value: string): string {
  return value.trim().replace(',', '.');
}

/**
 * Validates if a string is a valid finite number
 */
export function isValidNumber(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const sanitized = sanitizeNumberInput(value);
  const parsed = Number(sanitized);
  return !isNaN(parsed) && isFinite(parsed);
}

/**
 * Formats numbers gracefully avoiding floating point inaccuracies (e.g. 0.1 + 0.2 = 0.3)
 */
export function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString('pt-BR');
  }
  // Round to max 10 decimal digits to prevent binary floating point anomalies
  const rounded = Math.round(num * 1e10) / 1e10;
  return rounded.toLocaleString('pt-BR', { maximumFractionDigits: 8 });
}

export interface CalculationResult {
  success: boolean;
  result?: number;
  error?: string;
  expression: string;
}

/**
 * Performs arithmetic calculation following Python behavior and friendly errors
 */
export function calculate(
  num1Str: string,
  num2Str: string,
  operation: MathOperation
): CalculationResult {
  if (!isValidNumber(num1Str)) {
    return {
      success: false,
      error: 'Entrada inválida: O primeiro valor não é um número válido.',
      expression: `${num1Str || '?'} ${OPERATIONS[operation].symbol} ${num2Str || '?'}`,
    };
  }

  if (!isValidNumber(num2Str)) {
    return {
      success: false,
      error: 'Entrada inválida: O segundo valor não é um número válido.',
      expression: `${num1Str} ${OPERATIONS[operation].symbol} ${num2Str || '?'}`,
    };
  }

  const n1 = Number(sanitizeNumberInput(num1Str));
  const n2 = Number(sanitizeNumberInput(num2Str));
  const op = OPERATIONS[operation];

  switch (operation) {
    case 'add': {
      const res = n1 + n2;
      return {
        success: true,
        result: res,
        expression: `${formatNumber(n1)} + ${formatNumber(n2)} = ${formatNumber(res)}`,
      };
    }
    case 'subtract': {
      const res = n1 - n2;
      return {
        success: true,
        result: res,
        expression: `${formatNumber(n1)} − ${formatNumber(n2)} = ${formatNumber(res)}`,
      };
    }
    case 'multiply': {
      const res = n1 * n2;
      return {
        success: true,
        result: res,
        expression: `${formatNumber(n1)} × ${formatNumber(n2)} = ${formatNumber(res)}`,
      };
    }
    case 'divide': {
      if (n2 === 0) {
        return {
          success: false,
          error: 'Erro matemático (ZeroDivisionError): Não é possível dividir um número por zero.',
          expression: `${formatNumber(n1)} ÷ 0 = Indefinido`,
        };
      }
      const res = n1 / n2;
      return {
        success: true,
        result: res,
        expression: `${formatNumber(n1)} ÷ ${formatNumber(n2)} = ${formatNumber(res)}`,
      };
    }
    case 'percentage': {
      const res = (n1 * n2) / 100;
      return {
        success: true,
        result: res,
        expression: `${formatNumber(n1)}% de ${formatNumber(n2)} = ${formatNumber(res)}`,
      };
    }
    default:
      return {
        success: false,
        error: 'Operação não reconhecida.',
        expression: 'Operação inválida',
      };
  }
}
