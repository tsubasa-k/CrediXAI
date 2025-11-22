import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import InputPanel from './components/InputPanel';
import ScoreGauge from './components/ScoreGauge';
import ShapChart from './components/ShapChart';
import { calculateCreditRisk } from './services/creditModel';
import { getAiExplanation } from './services/geminiService';
import { CreditInputData, DEFAULT_INPUTS, PredictionResult } from './types';

const Dashboard: React.FC = () => {
  const [inputData, setInputData] = useState<CreditInputData>(DEFAULT_INPUTS);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'viz' | 'ai'>('viz');

  // Recalculate model result immediately when inputs change (Interactive)
  useEffect(() => {
    const calc = calculateCreditRisk(inputData);
    setResult(calc);
    // Clear AI explanation when data changes to avoid mismatch
    setAiExplanation(""); 
  }, [inputData]);

  const handleGenerateAiExplanation = async () => {
    if (!result) return;
    setIsLoadingAi(true);
    setActiveTab('ai');
    const explanation = await getAiExplanation(result);
    setAiExplanation(explanation);
    setIsLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold">C</div>
             <h1 className="text-xl font-bold tracking-tight text-slate-900">CrediXAI <span className="text-slate-400 font-normal text-sm ml-2">個人信貸審批模擬器</span></h1>
          </div>
          <a href="https://github.com/slundberg/shap" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-blue-600 transition-colors hidden sm:block">
            Based on SHAP (SHapley Additive exPlanations)
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4">
            <InputPanel data={inputData} onChange={setInputData} />
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Score Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-4">Model Prediction</h3>
                {result && <ScoreGauge score={result.score} decision={result.decision} />}
                <div className="mt-4 text-center text-xs text-slate-400">
                  Based on Mock XGBoost Model
                </div>
              </div>

              {/* Key Metrics Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-4">Risk Assessment</h3>
                {result && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-slate-600">Risk Probability</span>
                            <span className="font-mono font-bold text-slate-800">{(result.probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                             <span className="text-slate-600">Base Score</span>
                             <span className="font-mono text-slate-500">{result.baseValue}</span>
                        </div>
                        <div className="pt-2">
                           <p className="text-sm text-slate-600 mb-2 font-medium">Top Contributing Factors:</p>
                           <ul className="space-y-1">
                               {result.shapValues
                                .sort((a,b) => Math.abs(b.value) - Math.abs(a.value))
                                .slice(0, 3)
                                .map((s, i) => (
                                   <li key={i} className="text-xs flex justify-between">
                                       <span>{s.feature}</span>
                                       <span className={s.value > 0 ? 'text-green-600' : 'text-red-600 font-bold'}>
                                           {s.value > 0 ? '+' : ''}{Math.round(s.value)}
                                       </span>
                                   </li>
                               ))}
                           </ul>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* Tabs for Visuals vs AI */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 flex">
                    <button 
                        onClick={() => setActiveTab('viz')}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'viz' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        SHAP Visualization
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z" opacity="0.5"></path><path strokeLinecap="round" strokeLinejoin="round" d="M21 12h-9"></path></svg>
                        AI Explainability (Gemini)
                    </button>
                </div>

                <div className="p-6 min-h-[400px]">
                    {activeTab === 'viz' && result && (
                        <div className="animate-fadeIn">
                            <p className="text-sm text-slate-600 mb-4">
                                下圖展示了各個特徵如何將基本分數（Base Value）推移至最終分數。綠色代表提升信用的因素，紅色代表降低信用的風險因素。
                            </p>
                            <ShapChart baseValue={result.baseValue} values={result.shapValues} finalScore={result.score} />
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="animate-fadeIn">
                             {!aiExplanation ? (
                                 <div className="flex flex-col items-center justify-center h-64 text-center">
                                     <div className="bg-indigo-50 p-4 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                     </div>
                                     <h3 className="text-lg font-medium text-slate-900 mb-2">讓 AI 分析您的信用報告</h3>
                                     <p className="text-slate-500 text-sm max-w-md mb-6">
                                         使用 Google Gemini 模型，根據目前的 SHAP 數據生成一份易懂的信用評估報告與改善建議。
                                     </p>
                                     <button 
                                        onClick={handleGenerateAiExplanation}
                                        disabled={isLoadingAi}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-all flex items-center gap-2 disabled:opacity-70"
                                     >
                                         {isLoadingAi ? (
                                             <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing...
                                             </>
                                         ) : (
                                             "生成 AI 分析報告"
                                         )}
                                     </button>
                                 </div>
                             ) : (
                                 <div className="prose prose-indigo max-w-none">
                                     <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded">Gemini Analysis</span>
                                        <button onClick={() => setAiExplanation("")} className="text-xs text-slate-400 hover:text-slate-600 underline ml-auto">Clear</button>
                                     </div>
                                     <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                                         {aiExplanation}
                                     </div>
                                 </div>
                             )}
                        </div>
                    )}
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
};

export default App;