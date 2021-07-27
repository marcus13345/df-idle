import { QGridLayout, QMainWindow, QWidget, WindowState } from "@nodegui/nodegui";
import { QEvent } from "@nodegui/nodegui/dist/lib/QtGui/QEvent/QEvent";
import { win } from "@ui";

export abstract class View {
  root: QWidget;
  layout: QGridLayout;

  addLayout() {
    this.root = new QWidget();
    this.root.setObjectName("root");
    win.setCentralWidget(this.root);

    this.layout = new QGridLayout();
    this.root.setLayout(this.layout);
  }

  abstract addComponents(): void;
}
