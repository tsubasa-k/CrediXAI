import { GoogleGenAI } from "@google/genai";
import { PredictionResult } from "../types";

export const getAiExplanation = async (result: PredictionResult): Promise<string> => {
  if (!process.env.API_KEY) {
    return "請配置 API Key 以啟用 AI 智慧解釋功能。 (Please configure API_KEY to enable AI explanation.)";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Sort features by absolute impact to highlight the most important ones
  const sortedShap = [...result.shapValues].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  
  const prompt = `
    你是一個專業的銀行信貸風險分析師。請根據以下「個人信貸審批模擬器」的模型輸出結果，為客戶產生一段簡短、友善且具建設性的解釋。
    
    請使用繁體中文 (Traditional Chinese)。
    
    **模型結果:**
    - 最終信用評分: ${result.score} (範圍 300-850)
    - 審批結果: ${result.decision === 'Approve' ? '核准' : result.decision === 'Reject' ? '拒絕' : '需人工審查'}
    
    **SHAP 特徵重要性分析 (影響分數的關鍵因素):**
    ${sortedShap.map(s => `- ${s.feature}: ${s.displayValue} (對分數影響: ${s.value > 0 ? '+' : ''}${Math.round(s.value)} 分)`).join('\n')}
    
    **任務:**
    1. 總結為什麼客戶獲得這個結果。
    2. 強調對結果影響最大的前兩個正面或負面因素。
    3. 如果是被拒絕或分數較低，給出具體的改善建議（例如降低負債比、保持良好還款紀錄）。
    4. 語氣要專業但平易近人，避免過於生硬的技術術語。
    5. 回覆長度控制在 200 字以內。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "無法產生解釋，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務暫時無法使用。請檢查 API Key 或網路連線。";
  }
};