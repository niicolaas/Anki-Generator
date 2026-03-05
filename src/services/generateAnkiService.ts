import { Notice } from "obsidian";
import AnkiGenerator from "../main";
import GenerateAnki from "../commands/generateAnki";

export default class GenerateAnkiService {
  plugin: AnkiGenerator;

  constructor(plugin: AnkiGenerator) {
    this.plugin = plugin;
  }

  async generateAnki() {
    try {
      new Notice("Generating your Anki...");

      const activeFile = this.plugin.app.workspace.getActiveFile();
      const appVault = this.plugin.app.vault;

      if (!activeFile) {
        new Notice(`You need to have some note open!`);
        return;
      }

      const activeFileContents = await appVault.read(activeFile);
      const generateAnki = new GenerateAnki(this.plugin);
      const generatedContent =
        await generateAnki.generateAnki(activeFileContents);

      const baseName = activeFile.path.replace(/\.md$/, "");
      let newPath = `${baseName} (Anki).md`;
      let counter = 1;

      while (appVault.getAbstractFileByPath(newPath)) {
        newPath = `${baseName} (Anki) ${counter}.md`;
        counter++;
      }

      await appVault.create(newPath, generatedContent);

      new Notice(`Anki Questions created with success!`);
    } catch (error) {
      console.log(error);
      new Notice("Error generating Anki. Check console.");
    }
  }
}
