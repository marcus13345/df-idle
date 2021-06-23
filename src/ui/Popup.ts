import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { getTheme } from '@themes';
import { boxStyle, panels } from './UI.js';

export class Popup {
  box;

  static show(content) {
    new Popup(content)
  }

  private constructor(content) {
    this.box = blessed.box({
      top: 'center',
      left: 'center',
      width: '100%',
      height: 'shrink',
      content: getTheme().normal(content) + `\n\n{right}` + getTheme().hotkey('enter') + getTheme().normal(`: Okay `) + '{/right}',
      tags: true,
      ...boxStyle(),
    });
    this.box.on('keypress', (evt, key) => {
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