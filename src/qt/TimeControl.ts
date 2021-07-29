import { Game } from '@game';
import { QLabel, AlignmentFlag, QPushButton } from '@nodegui/nodegui';
import { GridItem } from './CustomWidgets.js';

export class TimeControl extends GridItem {
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
      if (Game.current.clock.paused)
        Game.current.clock.resume();
      Game.current.clock.targetTPS = this.NORMAL;
      this.updateButtons();
    });

    this.turboSpeedButton.addEventListener('clicked', () => {
      if (Game.current.clock.paused)
        Game.current.clock.resume();
      Game.current.clock.targetTPS = this.TURBO;
      this.updateButtons();
    });

    this.extremeSpeedButton.addEventListener('clicked', () => {
      if (Game.current.clock.paused)
        Game.current.clock.resume();
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
    };

    if (Game.current) {
      if (Game.current.clock.paused)
        return update(false, true, true, true);
      if (Game.current.clock.targetTPS === this.NORMAL)
        return update(true, false, true, true);
      if (Game.current.clock.targetTPS === this.TURBO)
        return update(true, true, false, true);
      if (Game.current.clock.targetTPS === this.EXTREME)
        return update(true, true, true, false);
    } else {
      update(false, false, false, false);
    }
  }
}

export class TimeLabel extends QLabel {

  constructor() {
    super();
    this.setAlignment(AlignmentFlag.AlignRight | AlignmentFlag.AlignVCenter);
    setInterval(() => {
      this.setText(Game.current.clock.toString());
    }, 100);
  }
}
