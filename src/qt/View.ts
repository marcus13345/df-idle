import { QGridLayout, QMainWindow, QWidget } from "@nodegui/nodegui";
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
