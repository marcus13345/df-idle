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
  QPushButton,
  TabPosition
} from '@nodegui/nodegui';
import network from '../multiplayer/mDNS.js';
import { Player } from '../multiplayer/Player.js';
import { Pawn } from '../Pawn.js';
import { ProcessManager } from '../ProcessManager.js';
import { GridItem, ScrollPanel } from './CustomWidgets.js';
import { DebugPage, PawnsPage, InventoryPage, MultiplayerPage } from './pages/Pages.js';
import { TimeControl, TimeLabel } from './TimeControl.js';
import { View } from './View.js';

export class GameView extends View {
  game: Game;
  title: QLabel;
  timeLabel: QLabel;
  left: QWidget;
  right: QTabWidget;
  timeControl: TimeControl;
  debugPage: DebugPage;

  addComponents(): void {
    this.addLayout();

    this.title = new QLabel();
    this.left = new QWidget();
    this.right = new QTabWidget();
    this.timeLabel = new TimeLabel();
    this.timeControl = new TimeControl();

    this.title.setText(this.game.name);
    this.right.setTabPosition(TabPosition.West)

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

    this.debugPage = new DebugPage();

    this.right.addTab(new PawnsPage(), new QIcon(), 'Pawns');
    this.right.addTab(new InventoryPage(), new QIcon(), 'Inventory');
    this.right.addTab(new MultiplayerPage(), new QIcon(), 'Multiplayer');

    ProcessManager.on('change', this.onProcessManagerChange.bind(this));
  }

  onProcessManagerChange() {
    if(ProcessManager.connected) {
      this.right.addTab(this.debugPage, new QIcon(), 'Debug');
    } else {
      if(this.right.tabs.indexOf(this.debugPage) > -1)
        this.right.removeTab(this.right.tabs.indexOf(this.debugPage))
    }
  }

  constructor(game: Game) {
    super();
    this.game = game;
  }
}

