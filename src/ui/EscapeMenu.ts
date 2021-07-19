import { Game } from "@game";
import { boxStyle, getTheme } from "@themes";
import { panels } from "@ui";
import blessed from 'neo-blessed';

// TODO convert all these popup-y things to be View based
// make them be boxes that have a view
export class EscapeMenu {

  options = [
    'RESUME',
    'QUIT'
  ];
  selected = 0;
  box;

  static show() {
    new EscapeMenu();
  }

  protected constructor() {
    this.box = blessed.box({
      top: 3,
      left: 'center',
      width: 30,
      height: 'shrink',
      content: '',
      tags: true,
      ...boxStyle(),
    });
    this.box.on('keypress', (evt: {}, key: {full: string}) => {
      if(key.full === 'up') {
        this.selected --;
        if(this.selected === -1) this.selected = this.options.length - 1;
      } else if (key.full === 'down') {
        this.selected ++;
        if(this.selected === this.options.length) this.selected = 0;
      } else if (key.full === 'enter') {
        switch(this.selected) {
          case 0: {
            Game.current.clock.start();
            panels.screen.remove(this.box);
            break;
          }
          case 1: {
            Game.current.sync();
            process.exit(0);
          }
        }
      } else if(key.full === 'escape') {
        Game.current.clock.start();
        panels.screen.remove(this.box);
      }
      this.render();
    });
    panels.screen.append(this.box);
    this.box.focus();
    Game.current.clock.pause();
    this.render();
  }

  render() {
    this.box.setContent(' Paused\n\n' + this.options.map((v, i) => {
      if(i === this.selected) {
        return ` ${getTheme().bright(v)} `;
      } else {
        return ` ${getTheme().normal(v)} `;
      }
    }).join('\n'));
    panels.screen.render();
  }
}