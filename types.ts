export interface CreditInputData {
  income: number;           // Annual Income
  loanAmount: number;       // Requested Loan Amount
  employmentLength: number; // Years employed
  debtToIncomeRatio: number; // 0.0 to 1.0
  creditHistoryLength: number; // Years of credit history
  delinquencyCount: number;    // Number of past late payments
}

export enum Decision {
  APPROVE = 'Approve',
  REJECT = 'Reject',
  REVIEW = 'Manual Review'
}

export interface ShapValue {
  feature: string;
  value: number; // The contribution amount (+ or -)
  displayValue: string; // The formatted original value (e.g., "$50,000")
  description: string;
}

export interface PredictionResult {
  score: number; // 300 to 850
  decision: Decision;
  probability: number; // 0 to 1 (Risk probability)
  baseValue: number; // The base score before features are applied
  shapValues: ShapValue[];
}

export const DEFAULT_INPUTS: CreditInputData = {
  income: 60000,
  loanAmount: 15000,
  employmentLength: 5,
  debtToIncomeRatio: 0.3,
  creditHistoryLength: 8,
  delinquencyCount: 0
};