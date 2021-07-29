import { QPushButton } from "@nodegui/nodegui";
import { ProcessManager } from "../../ProcessManager.js";
import { ScrollPanel } from "../CustomWidgets.js";


export class DebugPage extends ScrollPanel {
  constructor() {
    super();
  }

  fill(): void {
    const reload = new QPushButton();
    reload.setText('Reload');
    reload.addEventListener('clicked', this.reload.bind(this))
    this.addWidget(reload);
  }

  private reload() {
    ProcessManager.restart();
  }
}