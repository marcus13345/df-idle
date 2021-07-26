import { Game } from '@game';
import {
  QLabel,
  QTabWidget,
  QWidget,
  QIcon,
  FlexLayout,
  QGridLayout,
  FocusPolicy,
  WidgetEventTypes,
  AlignmentFlag
} from '@nodegui/nodegui';
import { Pawn } from '../Pawn.js';
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

    this.right.addTab(new PawnPageWidget(), new QIcon(), 'Pawns');
    this.right.addTab(page2, new QIcon(), 'Inventory');
  }

  constructor(game: Game) {
    super();
    this.game = game;
  }
}

class PawnWidget extends QWidget {
  constructor(pawn: Pawn) {
    super();
    this.setLayout(new QGridLayout());
    this.setInlineStyle(`
      height: 64px;
      background: cyan;
      width: \'100%\';
      margin-bottom: 4px;
    `);
    const nameLabel = new QLabel();
    nameLabel.setText(pawn.name.first + ' ' + pawn.name.last);
    nameLabel.setAlignment(AlignmentFlag.AlignLeft | AlignmentFlag.AlignTop);
    const activityLabel = new QLabel();
    activityLabel.setText(pawn.status);
    activityLabel.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignTop);
    this.layout.addWidget(nameLabel, 0, 0, 1, 1);
    this.layout.addWidget(activityLabel, 0, 1, 1, 1);
    this.setFocusPolicy(FocusPolicy.ClickFocus);
  }
}

class PawnPageWidget extends QWidget {
  
  constructor() {
    super();
    this.setLayout(new FlexLayout());
    // this.setInlineStyle('width: 100%; height: 100%;');

    for(const pawn of Game.current.pawns) {
      // const label = new QLabel();
      // label.setText(pawn.name.first);
      // this.layout.addWidget(label);
      this.layout.addWidget(new PawnWidget(pawn));
    }
  }
}