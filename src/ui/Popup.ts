import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { boxStyle, getTheme } from '@themes';
import { panels } from '@ui';

export class Popup {
  box;

  static show(content: string) {
    new Popup(content)
  }

  protected constructor(content: string) {
    this.box = blessed.box({
      top: 'center',
      left: 'center',
      width: 'shrink',
      height: 'shrink',
      content: getTheme().normal(content) + `\n\n{right}` + getTheme().hotkey('enter') + getTheme().normal(`: Okay `) + '{/right}',
      tags: true,
      ...boxStyle(),
    });
    this.box.on('keypress', (evt: {}, key: {full: string}) => {
      if(key.full === 'escape' || key.full === 'enter') {
        Game.current.clock.start();
        panels.screen.remove(this.box);
      }
    });
    panels.screen.append(this.box);
    this.box.focus();
    Game.current.clock.pause();
  }
}