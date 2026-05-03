# CrediXAI — 個人信貸審批模擬器

> 互動式個人信貸審批模擬器，結合 SHAP 可解釋性分析 
> Interactive Personal Credit Approval Simulator with SHAP Analysis

---

## 功能特色 (Features)

| 功能 | 說明 |
|------|------|
| 互動式參數調整 | 透過滑桿即時調整六項信用指標，模型分數同步更新 |
| SHAP Waterfall 圖表 | 視覺化呈現每個特徵如何將基礎分數推移至最終分數 |
| AI 說明報告 | 使用 Google Gemini 2.5 Flash 生成繁體中文信用評估報告與改善建議 |
| 模擬 XGBoost 模型 | 前端純 TypeScript 實作的模擬信貸評分模型（無需後端） |

---

##  信用評分模型 (Credit Scoring Model)

本應用使用模擬的 XGBoost + TreeExplainer 邏輯，根據以下六項特徵計算信用分數（範圍 300–850）：

| 特徵 | 說明 | 預設值 |
|------|------|--------|
| 年收入 (Income) | 借款人的年收入水平 | $60,000 |
| 貸款金額 (Loan Amount) | 申請的貸款總額 | $15,000 |
| 負債比 (DTI Ratio) | 每月債務佔收入的比例（建議 < 40%） | 30% |
| 就業年資 (Employment) | 目前工作的持續時間 | 5 年 |
| 信用歷史長度 (History) | 最早信用帳戶至今的時間 | 8 年 |
| 違約/遲繳次數 (Delinquency) | 過去兩年內的遲繳紀錄 | 0 次 |

**審批結果判斷邏輯：**
-  **核准 (Approve)**：最終分數 ≥ 700
-  **人工審查 (Manual Review)**：650 ≤ 分數 < 700
-  **拒絕 (Reject)**：分數 < 650

---

## 技術棧 (Tech Stack)

- **框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **建構工具**：[Vite 6](https://vitejs.dev/)
- **路由**：[React Router DOM v7](https://reactrouter.com/)
- **圖表**：[Recharts v3](https://recharts.org/)（SHAP Waterfall 瀑布圖）
- **AI 整合**：[Google Gemini API (`@google/genai`)](https://ai.google.dev/) — `gemini-2.5-flash` 模型
- **樣式**：Tailwind CSS

---

## 本機執行 (Run Locally)

**前置需求：** Node.js

1. **安裝相依套件：**
   ```bash
   npm install
   ```

2. **設定 Gemini API Key：**

   在專案根目錄建立 `.env.local` 檔案，並填入您的 API Key：
   ```env
   API_KEY=your_gemini_api_key_here
   ```
   > 可至 [Google AI Studio](https://aistudio.google.com/app/apikey) 申請免費 API Key。  
   > 若未設定，SHAP 視覺化功能仍可正常使用，僅 AI 說明報告功能會停用。

3. **啟動開發伺服器：**
   ```bash
   npm run dev
   ```

4. **（選用）建置正式版：**
   ```bash
   npm run build
   npm run preview
   ```

---

## 專案結構 (Project Structure)

```
CrediXAI/
├── App.tsx                  # 主應用程式（Dashboard 頁面）
├── index.tsx                # React 進入點
├── index.html               # HTML 模板
├── types.ts                 # TypeScript 型別定義（CreditInputData, PredictionResult 等）
├── components/
│   ├── InputPanel.tsx       # 左側參數滑桿面板
│   ├── ScoreGauge.tsx       # 信用分數儀表顯示
│   └── ShapChart.tsx        # SHAP Waterfall 瀑布圖（Recharts）
├── services/
│   ├── creditModel.ts       # 模擬 XGBoost 信貸評分邏輯 + SHAP 計算
│   └── geminiService.ts     # Google Gemini AI 說明報告生成
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 使用說明 (How to Use)

1. **調整參數**：在左側面板拖動滑桿，調整年收入、貸款金額、負債比、就業年資、信用歷史及違約次數。
2. **即時查看結果**：右上方「Model Prediction」卡片會即時顯示信用分數與審批結果；「Risk Assessment」卡片列出風險機率與主要影響因素。
3. **SHAP 視覺化**：切換至「SHAP Visualization」分頁，查看各特徵對分數的貢獻度（🟢 綠色 = 加分，🔴 紅色 = 扣分）。
4. **AI 分析報告**：切換至「AI Explainability (Gemini)」分頁，點擊「生成 AI 分析報告」，即可獲得由 Gemini 生成的繁體中文信用說明與改善建議。

---

## 參考資源 (References)

- [SHAP (SHapley Additive exPlanations)](https://github.com/slundberg/shap) — Lundberg & Lee, 2017
- [Google Gemini API](https://ai.google.dev/)
- [Recharts Documentation](https://recharts.org/en-US/)

