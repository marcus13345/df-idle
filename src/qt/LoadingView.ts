import { QGridLayout, QLabel, QWidget } from "@nodegui/nodegui";
import { View } from "./View.js";

export class LoadingView extends View {
  label: QLabel;

  addComponents(): void {
    this.addLayout();

    this.label = new QLabel();
    this.label.setText('Loading World...');
    this.layout.addWidget(this.label);
  }

  destory() {

  }
}