import { App, PluginSettingTab, Setting } from "obsidian";
import AnkiGenerator from "../main";

export class SettingsTab extends PluginSettingTab {
  plugin: AnkiGenerator;
  constructor(app: App, plugin: AnkiGenerator) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings for your ANKI Generator" });
    new Setting(containerEl)
      .setName("Gemini Token")
      .setDesc("Your gemini Token")
      .addText((text) =>
        text
          .setPlaceholder("Enter your gemini token")
          .setValue("")
          .onChange(async (value) => {
            console.log("Gemini Token: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
