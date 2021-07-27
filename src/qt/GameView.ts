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
  AlignmentFlag,
  QListView,
  QListWidget,
  QListWidgetItem
} from '@nodegui/nodegui';
import { Pawn } from '../Pawn.js';
import { View } from './View.js';

export class GameView extends View {
  game: Game;
  title: QLabel;
  timeLabel: QLabel;
  left: QWidget;
  right: QTabWidget;

  addComponents(): void {
    this.addLayout();

    this.title = new QLabel();
    this.left = new QWidget();
    this.right = new QTabWidget();
    this.timeLabel = new TimeWidget();

    this.title.setText(this.game.name);

    this.left.setInlineStyle('border: 1px solid white;')
    this.right.setInlineStyle('border: 1px solid white;')

    this.layout.addWidget(this.title, 0, 0);
    this.layout.addWidget(this.timeLabel, 0, 1);
    this.layout.addWidget(this.left, 1, 0);
    this.layout.addWidget(this.right, 1, 1);
    this.layout.setRowStretch(0, 0);
    this.layout.setRowStretch(1, 1);
    this.layout.setColumnStretch(0, 3);
    this.layout.setColumnStretch(1, 2);

    this.right.addTab(new PawnPageWidget(), new QIcon(), 'Pawns');
    this.right.addTab(new InventoryWidget(), new QIcon(), 'Inventory')
  }

  constructor(game: Game) {
    super();
    this.game = game;
  }
}

class PawnWidget extends QWidget {
  constructor(pawn: Pawn) {
    super();
    let layout: QGridLayout;
    this.setLayout(layout = new QGridLayout());
    // this.setInlineStyle(`
    //   margin-bottom: 4px;
    // `);

    const nameLabel = new QLabel();
    nameLabel.setText(pawn.name.first + ' ' + pawn.name.last);
    nameLabel.setAlignment(AlignmentFlag.AlignLeft | AlignmentFlag.AlignTop);

    const activityLabel = new QLabel();
    activityLabel.setText(pawn.status);
    activityLabel.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignTop);

    this.layout.addWidget(nameLabel, 0, 0, 1, 1);
    this.layout.addWidget(activityLabel, 0, 1, 1, 1);
    layout.setColumnStretch(0, 1);
    layout.setColumnStretch(1, 1);
    layout.setRowStretch(0, 1);
    // this.setFocusPolicy(FocusPolicy.ClickFocus);
  }
}

class PawnPageWidget extends QListWidget {
  
  constructor() {
    super();
    // this.setLayout(new FlexLayout());
    this.setInlineStyle('background: purple;');
    // this.layout.addWidget(new PawnWidget(Game.current.pawns[0]));

    for(const pawn of Game.current.pawns) {
      // const label = new QLabel();
      // label.setText(pawn.name.first);
      // this.layout.addWidget(label);
      // this.layout.addWidget(new PawnWidget(pawn));
      const item = new QListWidgetItem();
      this.addItem(item);
      this.setItemWidget(item, new PawnWidget(pawn));
    }
  }
}

class TimeWidget extends QLabel {

  constructor() {
    super();
    this.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignVCenter);
    setInterval(() => {
      this.setText(Game.current.clock.toString());
    }, 100)
  }
}

class InventoryWidget extends QWidget {

}