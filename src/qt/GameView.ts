import { Game } from '@game';
import { ItemState } from '@items';
import {
  QLabel,
  QTabWidget,
  QWidget,
  QIcon,
  QGridLayout,
  FocusPolicy,
  AlignmentFlag,
  QBoxLayout,
  Direction,
  QScrollArea,
} from '@nodegui/nodegui';
import network from '../multiplayer/mDNS.js';
import { Player } from '../multiplayer/Player.js';
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

    this.layout.addWidget(this.title, 0, 0);
    this.layout.addWidget(this.timeLabel, 0, 1);
    this.layout.addWidget(this.left, 1, 0);
    this.layout.addWidget(this.right, 1, 1);
    this.layout.setRowStretch(0, 0);
    this.layout.setRowStretch(1, 1);
    this.layout.setColumnStretch(0, 3);
    this.layout.setColumnStretch(1, 2);

    this.right.addTab(new PawnPageWidget(), new QIcon(), 'Pawns');
    this.right.addTab(new InventoryPageWidget(), new QIcon(), 'Inventory');
    this.right.addTab(new MultiplayerPageWidget(), new QIcon(), 'Multiplayer');
  }

  constructor(game: Game) {
    super();
    this.game = game;
  }
}

class GridItem extends QWidget {

  rootLayout: QGridLayout;

  get layout(): QGridLayout {
    return this.rootLayout;
  }

  constructor() {
    super();

    this.rootLayout = new QGridLayout()
    this.setLayout(this.rootLayout);
    this.setInlineStyle(`
      width: \'100%\';
      background: coral;
      margin: 0px;
      padding: 0px;
    `);
    
    this.setFocusPolicy(FocusPolicy.ClickFocus);
  }
}

function addSplitText(layout: QGridLayout, left: string, right: string, row: number) {
  layout.setSpacing(0);

  const nameLabel = new QLabel();
  nameLabel.setText(left);
  nameLabel.setAlignment(AlignmentFlag.AlignLeft | AlignmentFlag.AlignTop);
  const activityLabel = new QLabel();
  activityLabel.setText(right);
  activityLabel.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignTop);

  layout.addWidget(nameLabel, row, 0, 1, 1);
  layout.addWidget(activityLabel, row, 1, 1, 1);
  layout.setRowStretch(row, 1);

  // in theory this is redundant, calling this
  // function on the same layout multiple times...
  layout.setColumnStretch(0, 1);
  layout.setColumnStretch(1, 1);
}

class PawnWidget extends GridItem {
  constructor(pawn: Pawn) {
    super();

    addSplitText(
      this.layout,
      pawn.name.first + ' ' + pawn.name.last,
      pawn.status,
      0
    );
  }
}

class ItemWidget extends GridItem {
  constructor(itemState: ItemState<unknown>) {
    super();
    
    addSplitText(
      this.layout,
      itemState.name,
      '' + (itemState.qty),
      0
    );
  }
}

abstract class ScrollPanel extends QScrollArea {
  centralWidget: QWidget;
  vLayout: QBoxLayout;

  widgets: QWidget[] = [];

  constructor() {
    super();
    this.setInlineStyle(`
      background: rgba(0, 0, 0, 0);
      border: none;
    `)
    this.centralWidget = new QWidget();
    this.centralWidget.setInlineStyle(`
      background: rgba(0, 0, 0, 0);
    `)
    // this.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOn);
    this.setWidgetResizable(true);
    this.setWidget(this.centralWidget);
    this.vLayout = new QBoxLayout(Direction.TopToBottom);
    this.centralWidget.setLayout(this.vLayout);

    this.fill();

    this.vLayout.addStretch(1);
  }

  refill() {
    for(const component of this.widgets) {
      // component.hide();
      component.close();
      // component.nodeParent = null;
      // this.vLayout.removeWidget(component);
    }
    this.widgets = [];
    this.fill();
  }

  addWidget(widget: QWidget) {
    this.widgets.push(widget);
    this.vLayout.insertWidget(0, widget);
  }

  abstract fill(): void;
}

class PawnPageWidget extends ScrollPanel {
  fill() {
    for(const pawn of Game.current.pawns) {
      this.addWidget(new PawnWidget(pawn));
    }
  }
}

// class PawnPageWidget extends QListWidget {
//   constructor() {
//     super();
//     for (const pawn of Game.current.pawns) {
//       const pawnWidget = new PawnWidget(pawn);
//       const item = new QListWidgetItem();
//       this.addItem(item);
//       this.setItemWidget(item, pawnWidget);
//     }
//   }
// }

// class PawnPageWidget extends QWidget {

//   constructor() {
//     super();
//     this.setLayout(new QBoxLayout(Direction.TopToBottom));
//     // this.setLayout(new FlexLayout());

//     for(const pawn of Game.current.pawns) {
//       this.layout.addWidget(new PawnWidget(pawn));
//     }
//   }
// }

class TimeWidget extends QLabel {

  constructor() {
    super();
    this.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignVCenter);
    setInterval(() => {
      this.setText(Game.current.clock.toString());
    }, 100)
  }
}



class InventoryPageWidget extends ScrollPanel {
  fill() {
    for(const itemState of Game.current.inv.items) {
      this.addWidget(new ItemWidget(itemState))
    }
  }
}

class MultiplayerPlayerWidget extends GridItem {
  constructor(player: Player) {
    super();
    addSplitText(
      this.layout,
      player.name,
      player.host + ':' + player.port,
      0
    )
  }
}

class MultiplayerPageWidget extends ScrollPanel {
  constructor() {
    super();
    network.on('change', () => {
      this.refill();
    })
  }
  fill(): void {
    for(const player of network.players) {
      this.addWidget(new MultiplayerPlayerWidget(player))
    }
  }
}