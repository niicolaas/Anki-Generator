import { Plugin } from "obsidian";
import { SettingsTab } from "./config/settings";
import GenerateAnkiService from "./services/generateAnkiService";

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

    const generateAnkiService = new GenerateAnkiService(this);

    this.addRibbonIcon("bot", "Anki Generator", async () => {
      await generateAnkiService.generateAnki();
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
            generateAnkiService.generateAnki();
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

    //this.registerDomEvent(document, "click", (evt: MouseEvent) => {
    //  console.log("click", evt);
    //});

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
