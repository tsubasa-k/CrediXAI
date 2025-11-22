import React from 'react';
import { CreditInputData } from '../types';

interface InputPanelProps {
  data: CreditInputData;
  onChange: (newData: CreditInputData) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ data, onChange }) => {
  
  const handleChange = (field: keyof CreditInputData, value: number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        參數設定 (Parameters)
      </h2>
      
      <div className="space-y-6">
        {/* Income */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">年收入 (Income)</label>
            <span className="text-sm font-bold text-blue-600">${data.income.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="20000"
            max="200000"
            step="1000"
            value={data.income}
            onChange={(e) => handleChange('income', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Loan Amount */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">貸款金額 (Loan Amount)</label>
            <span className="text-sm font-bold text-blue-600">${data.loanAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={data.loanAmount}
            onChange={(e) => handleChange('loanAmount', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Debt to Income */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">負債比 (DTI Ratio)</label>
            <span className={`text-sm font-bold ${data.debtToIncomeRatio > 0.4 ? 'text-red-500' : 'text-blue-600'}`}>
              {(data.debtToIncomeRatio * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={data.debtToIncomeRatio}
            onChange={(e) => handleChange('debtToIncomeRatio', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-xs text-slate-400 mt-1">建議低於 40% (Recommended &lt; 40%)</p>
        </div>

        {/* Employment Length */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">就業年資 (Employment)</label>
            <span className="text-sm font-bold text-blue-600">{data.employmentLength} 年</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={data.employmentLength}
            onChange={(e) => handleChange('employmentLength', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Credit History */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">信用歷史長度 (History)</label>
            <span className="text-sm font-bold text-blue-600">{data.creditHistoryLength} 年</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={data.creditHistoryLength}
            onChange={(e) => handleChange('creditHistoryLength', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Delinquency */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">違約/遲繳次數 (Delinquency)</label>
            <span className={`text-sm font-bold ${data.delinquencyCount > 0 ? 'text-red-500' : 'text-blue-600'}`}>
              {data.delinquencyCount} 次
            </span>
          </div>
          <div className="flex gap-2">
             {[0, 1, 2, 3, 4].map((val) => (
               <button
                key={val}
                onClick={() => handleChange('delinquencyCount', val)}
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                  data.delinquencyCount === val 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
               >
                 {val}{val === 4 ? '+' : ''}
               </button>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InputPanel;