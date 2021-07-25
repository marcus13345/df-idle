import { Game } from '@game';
import {
  QLabel,
  QTabWidget,
  QWidget,
  QIcon
} from '@nodegui/nodegui';
import { View } from './View.js';

// 40x30
const w = 40;
const h = 30;
export class GameView extends View {
  game: Game;
  title: QLabel;
  left: QWidget;
  right: QTabWidget;

  addComponents(): void {
    this.addLayout();

    this.title = new QLabel();
    this.left = new QWidget();
    this.right = new QTabWidget();

    this.title.setText(this.game.name);

    this.left.setInlineStyle('border: 1px solid white;')
    this.right.setInlineStyle('border: 1px solid white;')

    // this.layout.addWidget(this.left, 1, 0, 29, 20);
    // this.layout.addWidget(this.right, 1, 21, 29, 20);
    
    this.layout.addWidget(this.title, 0, 0, 1, w);
    this.layout.addWidget(this.left, 1, 0, h - 1, w / 2);
    this.layout.addWidget(this.right, 1, w / 2, h - 1, w / 2);

    const page1 = new QLabel();
    page1.setText('Page 1');
    const page2 = new QLabel();
    page2.setText('Page 2');

    this.right.addTab(page1, new QIcon(), "Page 1");
    this.right.addTab(page2, new QIcon(), "Page 2");
  }

  constructor(game: Game) {
    super();
    this.game = game;
  }
}

