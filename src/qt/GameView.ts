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
  WidgetEventTypes,
  QPaintEvent,
  QPainter,
  QFrame,
  QPushButton
} from '@nodegui/nodegui';
import network from '../multiplayer/mDNS.js';
import { Player } from '../multiplayer/Player.js';
import { Pawn } from '../Pawn.js';
import { ProcessManager } from '../ProcessManager.js';
import { View } from './View.js';

export class GameView extends View {
  game: Game;
  title: QLabel;
  timeLabel: QLabel;
  left: QWidget;
  right: QTabWidget;
  timeControl: TimeControl;
  debugPage: DebugPageWidget;

  addComponents(): void {
    this.addLayout();

    this.title = new QLabel();
    this.left = new QWidget();
    this.right = new QTabWidget();
    this.timeLabel = new TimeWidget();
    this.timeControl = new TimeControl();

    this.title.setText(this.game.name);

    this.layout.addWidget(this.title, 0, 0, 1, 5);
    this.layout.addWidget(this.timeControl, 0, 5, 1, 5)
    this.layout.addWidget(this.timeLabel, 0, 10, 1, 5);
    this.layout.addWidget(this.left, 1, 0, 1, 9);
    this.layout.addWidget(this.right, 1, 9, 1, 6);
    this.layout.setRowStretch(0, 0);
    this.layout.setRowStretch(1, 1);
    for(let i = 0; i < 15; i ++) {
      this.layout.setColumnStretch(i, 1);
    }

    this.debugPage = new DebugPageWidget();

    this.right.addTab(new PawnPageWidget(), new QIcon(), 'Pawns');
    this.right.addTab(new InventoryPageWidget(), new QIcon(), 'Inventory');
    this.right.addTab(new MultiplayerPageWidget(), new QIcon(), 'Multiplayer');

    ProcessManager.on('change', this.onProcessManagerChange.bind(this));
  }

  onProcessManagerChange() {
    if(ProcessManager.connected) {
      this.right.addTab(this.debugPage, new QIcon(), 'Debug');
    } else {
      this.right.removeTab(this.right.tabs.indexOf(this.debugPage))
    }
  }

  constructor(game: Game) {
    super();
    this.game = game;
  }
}

class GridItem extends QFrame {

  rootLayout: QGridLayout;

  get layout(): QGridLayout {
    return this.rootLayout;
  }

  constructor() {
    super();

    this.rootLayout = new QGridLayout()
    this.setLayout(this.rootLayout);
    this.setInlineStyle(`
      width: '100%';
      margin: 0px;
      padding: 0px;
    `);
    this.rootLayout.setContentsMargins(0, 0, 0, 0);
    this.rootLayout.setSpacing(0);
    this.rootLayout.setVerticalSpacing(0);
    this.rootLayout.setHorizontalSpacing(0);
    // this.rootLayout.

    this.setFocusPolicy(FocusPolicy.ClickFocus);
  }
}

function addSplitText(layout: QGridLayout, left: string, right: string, row: number) {
  layout.setSpacing(0);

  const nameLabel = new QLabel();
  nameLabel.setText(left);
  nameLabel.setAlignment(AlignmentFlag.AlignLeft | AlignmentFlag.AlignTop);
  // nameLabel.setInlineStyle('padding: 0px; margin: 0px;');
  const activityLabel = new QLabel();
  activityLabel.setText(right);
  activityLabel.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignTop);
  // activityLabel.setInlineStyle('padding: 0px; margin: 0px;');

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
    this.centralWidget = new QFrame();
    this.centralWidget.setInlineStyle(`
      background: rgba(0, 0, 0, 0);
    `);
    // this.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOn);
    this.setWidgetResizable(true);
    this.setWidget(this.centralWidget);
    this.vLayout = new QBoxLayout(Direction.TopToBottom);
    const a = 12;
    this.vLayout.setContentsMargins(a, a, a, a);
    this.vLayout.setSpacing(0);
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


// TODO remove later, when i know i dont need it
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

class DebugPageWidget extends ScrollPanel {
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

class TimeControl extends GridItem {
  pauseButton: QPushButton;
  normalSpeedButton: QPushButton;
  turboSpeedButton: QPushButton;
  extremeSpeedButton: QPushButton;
  
  NORMAL = 60;
  TURBO = 180;
  EXTREME = 360;

  constructor() {
    super();
    
    this.pauseButton = new QPushButton();
    this.pauseButton.setText('❚❚');

    this.normalSpeedButton = new QPushButton();
    this.normalSpeedButton.setText('❯');

    this.turboSpeedButton = new QPushButton();
    this.turboSpeedButton.setText('❯'.repeat(2));

    this.extremeSpeedButton = new QPushButton();
    this.extremeSpeedButton.setText('❯'.repeat(3));

    this.layout.addWidget(this.pauseButton, 0, 0);
    this.layout.addWidget(this.normalSpeedButton, 0, 1);
    this.layout.addWidget(this.turboSpeedButton, 0, 2);
    this.layout.addWidget(this.extremeSpeedButton, 0, 3);

    this.updateButtons();

    this.pauseButton.addEventListener('clicked', () => {
      Game.current.clock.pause();
      this.updateButtons();
    });

    this.normalSpeedButton.addEventListener('clicked', () => {
      if(Game.current.clock.paused) Game.current.clock.resume();
      Game.current.clock.targetTPS = this.NORMAL;
      this.updateButtons();
    });

    this.turboSpeedButton.addEventListener('clicked', () => {
      if(Game.current.clock.paused) Game.current.clock.resume();
      Game.current.clock.targetTPS = this.TURBO;
      this.updateButtons();
    });

    this.extremeSpeedButton.addEventListener('clicked', () => {
      if(Game.current.clock.paused) Game.current.clock.resume();
      Game.current.clock.targetTPS = this.EXTREME;
      this.updateButtons();
    });
  }

  updateButtons() {

    const update = (a: boolean, b: boolean, c: boolean, d: boolean) => {
      this.pauseButton.setEnabled(a);
      this.normalSpeedButton.setEnabled(b);
      this.turboSpeedButton.setEnabled(c);
      this.extremeSpeedButton.setEnabled(d);
    }

    if(Game.current) {
      if(Game.current.clock.paused) return update(false, true, true, true);
      if(Game.current.clock.targetTPS === this.NORMAL) return update(true, false, true, true);
      if(Game.current.clock.targetTPS === this.TURBO) return update(true, true, false, true);
      if(Game.current.clock.targetTPS === this.EXTREME) return update(true, true, true, false);
    } else {
      update(false, false, false, false);
    }
  }
}