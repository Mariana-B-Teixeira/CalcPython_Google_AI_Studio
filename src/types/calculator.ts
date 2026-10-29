export type MathOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'percentage';

export interface OperationConfig {
  id: MathOperation;
  symbol: string;
  name: string;
  pyOperator: string;
  description: string;
  shortcut: string;
}

export interface CalculationRecord {
  id: string;
  sequence: number;
  num1: number;
  num2: number;
  operation: MathOperation;
  symbol: string;
  expression: string;
  result: number | null;
  error?: string | null;
  timestamp: Date;
}

export interface SessionStats {
  totalCalculations: number;
  successfulCalculations: number;
  errorsCount: number;
}
