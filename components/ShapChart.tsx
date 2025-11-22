import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { ShapValue } from '../types';

interface ShapChartProps {
  baseValue: number;
  values: ShapValue[];
  finalScore: number;
}

const ShapChart: React.FC<ShapChartProps> = ({ baseValue, values, finalScore }) => {
    // Prepare Data for Waterfall Logic
    let currentTotal = baseValue;
    
    const waterfallData = values.map(v => {
        const prev = currentTotal;
        currentTotal += v.value;
        const isPos = v.value >= 0;
        
        // For a waterfall bar:
        // If positive (Green): Bottom is 'prev', Height is 'value'
        // If negative (Red): Bottom is 'currentTotal' (the new lower value), Height is abs(value) (reaching up to prev)
        return {
            name: v.feature.split(' ')[0], // Short name for axis
            fullName: v.feature,
            val: v.value,
            // 'bottom' is the invisible stack base
            bottom: isPos ? prev : currentTotal,
            // 'height' is the visible bar segment
            height: Math.abs(v.value),
            color: isPos ? '#22c55e' : '#ef4444' // Green for +, Red for -
        };
    });

    // Add Base (Starting Point) and Final (Ending Point) columns
    const chartData = [
        { 
            name: 'Base', 
            fullName: 'Base Score (起始分)', 
            val: baseValue, 
            bottom: 0, 
            height: baseValue, 
            color: '#94a3b8' // Slate-400
        },
        ...waterfallData,
        { 
            name: 'Final', 
            fullName: 'Final Score (最終分)', 
            val: finalScore, 
            bottom: 0, 
            height: finalScore, 
            color: finalScore >= 700 ? '#22c55e' : finalScore < 650 ? '#ef4444' : '#eab308' 
        }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            // Payload[1] corresponds to the visible 'height' bar usually, but let's find the one with data
            const data = payload.find((p: any) => p.dataKey === 'height')?.payload;
            if (!data) return null;

            return (
                 <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm z-50">
                    <p className="font-bold text-slate-800 mb-1">{data.fullName}</p>
                    <div className="flex justify-between gap-4 text-slate-600">
                        <span>Impact:</span>
                        <span className={`font-bold ${data.val >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.name === 'Base' || data.name === 'Final' ? Math.round(data.val) : (data.val > 0 ? `+${Math.round(data.val)}` : Math.round(data.val))}
                        </span>
                    </div>
                 </div>
            );
        }
        return null;
    };

    return (
         <div className="w-full h-[350px] mt-2">
            <div className="flex justify-between items-end px-2 mb-2">
                <h4 className="text-sm font-bold text-slate-700">特徵貢獻度分析 (SHAP Waterfall)</h4>
                <div className="flex gap-3 text-xs text-slate-500">
                    <div className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>正向加分</div>
                    <div className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>負向扣分</div>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 11, fill: '#64748b'}} 
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                    />
                    <YAxis 
                        domain={[300, 850]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 11, fill: '#94a3b8'}} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} />
                    
                    {/* Stack 1: Invisible bottom spacer */}
                    <Bar dataKey="bottom" stackId="a" fill="transparent" isAnimationActive={false} />
                    
                    {/* Stack 2: Visible value bar */}
                    <Bar dataKey="height" stackId="a" radius={[3, 3, 3, 3]} maxBarSize={60}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList 
                            dataKey="val" 
                            position="top" 
                            formatter={(v: number) => Math.round(v)} 
                            style={{fontSize: 11, fontWeight: 'bold', fill: '#64748b'}} 
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
    );
}

export default ShapChart;