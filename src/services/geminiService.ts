import { GoogleGenerativeAI } from "@google/generative-ai";

export default class GeminiService {
  token_api: string;

  constructor(token_api: string) {
    this.token_api = token_api;
  }

  async sendToGemini(dataText: string) {
    const gemini = new GoogleGenerativeAI(this.token_api || "Sem key");

    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Você deve pegar as informações desse texto e fazer de 1-5 ou de 5-10 perguntas rápidas para o ANKI. Coloque titulos aleatórios para o anki não dá o erro de arquivo já existe : ${dataText}`,
    });

    const result = await model.generateContent(dataText);

    return result.response.text();
  }
}
