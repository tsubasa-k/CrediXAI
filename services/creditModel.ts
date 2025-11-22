import { CreditInputData, PredictionResult, Decision, ShapValue } from '../types';

// This service mimics a trained XGBoost model's inference and TreeExplainer logic.
// In a real-world scenario, this would call a Python backend (FastAPI/Flask).

const BASE_SCORE = 620; // Starting baseline credit score

export const calculateCreditRisk = (data: CreditInputData): PredictionResult => {
  const shapValues: ShapValue[] = [];
  let currentScore = BASE_SCORE;

  // 1. Income Effect (Higher income adds points, but diminishing returns)
  // Logic: (Income - 50000) / 1000 * 1.5, capped.
  let incomeImpact = ((data.income - 50000) / 1000) * 2.5;
  incomeImpact = Math.min(Math.max(incomeImpact, -100), 100); // Cap impact
  shapValues.push({
    feature: '年收入 (Income)',
    value: incomeImpact,
    displayValue: `$${data.income.toLocaleString()}`,
    description: '借款人的年收入水平'
  });
  currentScore += incomeImpact;

  // 2. Loan Amount Effect (High loan amount relative to baseline reduces score)
  // Logic: - (LoanAmount / 2000)
  const loanImpact = -(data.loanAmount / 2000);
  shapValues.push({
    feature: '貸款金額 (Loan Amount)',
    value: loanImpact,
    displayValue: `$${data.loanAmount.toLocaleString()}`,
    description: '申請的貸款總額'
  });
  currentScore += loanImpact;

  // 3. Debt-to-Income Ratio (Critical factor)
  // Logic: if > 0.4, heavy penalty. if < 0.3, bonus.
  let dtiImpact = 0;
  if (data.debtToIncomeRatio > 0.40) {
    dtiImpact = -((data.debtToIncomeRatio - 0.40) * 400); 
  } else if (data.debtToIncomeRatio < 0.30) {
    dtiImpact = (0.30 - data.debtToIncomeRatio) * 150;
  }
  shapValues.push({
    feature: '負債比 (DTI Ratio)',
    value: dtiImpact,
    displayValue: `${(data.debtToIncomeRatio * 100).toFixed(1)}%`,
    description: '每月債務佔收入的比例'
  });
  currentScore += dtiImpact;

  // 4. Employment Length
  // Logic: Stable employment adds points.
  const empImpact = Math.min(data.employmentLength * 3, 30);
  shapValues.push({
    feature: '就業年資 (Employment)',
    value: empImpact,
    displayValue: `${data.employmentLength} 年`,
    description: '目前工作的持續時間'
  });
  currentScore += empImpact;

  // 5. Credit History Length
  // Logic: Longer history is better.
  const historyImpact = Math.min(data.creditHistoryLength * 2, 40);
  shapValues.push({
    feature: '信用歷史 (History)',
    value: historyImpact,
    displayValue: `${data.creditHistoryLength} 年`,
    description: '最早信用帳戶至今的時間'
  });
  currentScore += historyImpact;

  // 6. Delinquency (Major negative factor)
  const delinqImpact = -(data.delinquencyCount * 60);
  shapValues.push({
    feature: '違約次數 (Delinquency)',
    value: delinqImpact,
    displayValue: `${data.delinquencyCount} 次`,
    description: '過去兩年內的遲繳紀錄'
  });
  currentScore += delinqImpact;

  // Finalize Score
  const finalScore = Math.min(Math.max(Math.round(currentScore), 300), 850);

  // Determine Decision
  let decision = Decision.REVIEW;
  if (finalScore >= 700) decision = Decision.APPROVE;
  else if (finalScore < 650) decision = Decision.REJECT;

  // Calculate Risk Probability (Inverse of score approx)
  const probability = 1 - ((finalScore - 300) / 550);

  return {
    score: finalScore,
    decision,
    probability,
    baseValue: BASE_SCORE,
    shapValues
  };
};