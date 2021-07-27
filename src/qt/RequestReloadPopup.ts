import { FocusReason, QGridLayout, QLabel, QMainWindow, QPushButton, QWidget } from "@nodegui/nodegui";
import { ProcessManager } from "../ProcessManager";

export class RequestReloadPopup {
  static exists = false;

  static show() {
    if(this.exists) return;
    this.exists = true;
    const window = new QMainWindow();
    window.setFixedSize(200, 100);
    const root = new QWidget();
    window.setCentralWidget(root);
    const layout = new QGridLayout();
    root.setLayout(layout);
    const label = new QLabel();
    label.setText('A reload has been requested');
    layout.addWidget(label, 0, 0, 4, 3);
    const reloadButton = new QPushButton();
    reloadButton.setText('Reload');
    layout.addWidget(reloadButton, 4, 2, 1, 1);
    window.show();
    window.setWindowTitle('Reload?');

    reloadButton.addEventListener('clicked', () => {
      ProcessManager.restart();
    })
  }
}

//////