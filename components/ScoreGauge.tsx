import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Decision } from '../types';

interface ScoreGaugeProps {
  score: number;
  decision: Decision;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, decision }) => {
  // Score range 300 - 850. Normalized to 0 - 100 for the chart.
  const percentage = Math.min(Math.max(((score - 300) / 550) * 100, 0), 100);
  
  const data = [
    { name: 'Score', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  // Align colors with Decision logic:
  // Reject (< 650) -> Red
  // Review (650 - 699) -> Yellow
  // Approve (>= 700) -> Green
  let color = '#eab308'; // Default Yellow
  if (score >= 700) color = '#22c55e'; // Green
  else if (score < 650) color = '#ef4444'; // Red

  const decisionStyle = decision === Decision.APPROVE 
    ? 'text-green-700 border-green-600 bg-green-50' 
    : decision === Decision.REJECT 
      ? 'text-red-700 border-red-600 bg-red-50' 
      : 'text-yellow-700 border-yellow-500 bg-yellow-50';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Chart & Score Wrapper */}
      {/* This relative container holds the chart and positions the score absolute relative to IT, not the whole card */}
      <div className="relative w-full h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="75%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-score" fill={color} />
              <Cell key="cell-bg" fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score Display - Positioned at the bottom center of the chart arc */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
           <span className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-0.5">Credit Score</span>
           <span className="text-4xl sm:text-5xl font-bold text-slate-800 leading-none tracking-tight">{score}</span>
        </div>
      </div>

      {/* Decision Badge - Placed below the chart in normal flow to prevent overlap */}
      <div className={`mt-4 px-6 py-2 rounded-full border-2 text-sm sm:text-base font-bold uppercase tracking-widest shadow-sm whitespace-nowrap ${decisionStyle}`}>
        {decision}
      </div>
    </div>
  );
};

export default ScoreGauge;