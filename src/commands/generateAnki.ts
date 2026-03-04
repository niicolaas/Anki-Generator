import AnkiGenerator from "../main";
import GeminiService from "../services/geminiService";

export default class GenerateAnki {
  plugin: AnkiGenerator;

  constructor(plugin: AnkiGenerator) {
    this.plugin = plugin;
  }

  async generateAnki(textData: string) {
    const token_api = this.plugin.settings.mySetting;
    const geminiService = new GeminiService(token_api);

    const newData = await geminiService.sendToGemini(textData);

    return newData;
  }
}
