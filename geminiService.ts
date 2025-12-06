import { GoogleGenAI } from "@google/genai";
import { WaterEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeWaterData = async (entries: WaterEntry[]): Promise<string> => {
  if (entries.length === 0) {
    return "Нет данных для анализа. Пожалуйста, добавьте записи в журнал.";
  }

  // Formatting data for the prompt to save tokens and be clear
  const dataSummary = entries.slice(-10).map(e => 
    `- Дата: ${new Date(e.date).toLocaleDateString()}
     - Место: ${e.locationName}
     - Вода: T=${e.temperature}°C, pH=${e.ph}, TDS=${e.tds}, Radon=${e.radon} Bq/L
     - Метео: T.возд=${e.airTemperature || 'N/A'}°C, Влажн=${e.humidity || 'N/A'}%, Давл=${e.pressure || 'N/A'} mmHg`
  ).join('\n');

  const prompt = `
    Ты - опытный гидролог и эколог. Проанализируй следующие последние записи из полевого дневника качества воды и метеоусловий:

    ${dataSummary}

    Пожалуйста, предоставь краткий отчет (на русском языке) в формате Markdown, включающий:
    1. Общую оценку качества воды и влияние метеоусловий (температура воздуха, давление, осадки/влажность) на показатели воды, если прослеживается связь.
    2. Выявление любых тревожных тенденций или аномалий (особенно обрати внимание на уровни Радона-222 и pH). Норма радона в питьевой воде обычно до 60 Бк/л. Норма pH 6.5-8.5.
    3. Рекомендации по дальнейшим замерам или мерам безопасности.
    
    Будь краток, профессионален и структурируй ответ.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Не удалось сгенерировать анализ.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Ошибка при обращении к сервису AI. Проверьте соединение или API ключ.";
  }
};