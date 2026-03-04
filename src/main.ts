import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { SettingsTab, settingsTab } from "./config/settings";
import GenerateAnki from "./commands/generateAnki";

interface AnkiGeneratorSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: AnkiGeneratorSettings = {
  mySetting: "default",
};

export default class AnkiGenerator extends Plugin {
  settings: AnkiGeneratorSettings;

  async onload() {
    console.log("loading plugin");
    await this.loadSettings();

    this.addRibbonIcon("bot", "Anki Generator", async () => {
      try {
        new Notice("Generating your Anki...");

        const activeFile = this.app.workspace.getActiveFile();

        if (!activeFile) {
          new Notice(`You need to have some note open!`);
          return;
        }

        const activeFileContents = await this.app.vault.read(activeFile);
        const generateAnki = new GenerateAnki(this);
        const generatedContent =
          await generateAnki.generateAnki(activeFileContents);

        const baseName = activeFile.path.replace(/\.md$/, "");
        let newPath = `${baseName} (Anki).md`;
        let counter = 1;

        while (this.app.vault.getAbstractFileByPath(newPath)) {
          newPath = `${baseName} (Anki) ${counter}.md`;
          counter++;
        }

        await this.app.vault.create(newPath, generatedContent);

        new Notice(`Anki Questions created with success!`);
      } catch (error) {
        console.log(error);
        new Notice("Error generating Anki. Check console.");
      }
    });

    //this.addStatusBarItem().setText("Status Bar Text");
    this.addCommand({
      id: "open-sample-modal",
      name: "Generate Anki HotKey",
      // callback: () => {
      // 	console.log('Simple Callback');
      // },
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            //new SampleModal(this.app).open();
          }
          return true;
        }
        return false;
      },
    });

    this.addSettingTab(new SettingsTab(this.app, this));

    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log("codemirror", cm);
    });

    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });

    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
    );
  }

  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
