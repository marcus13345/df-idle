import { Renderable, RenderMode } from './UI.js';
import { KeypressAcceptor } from './Menu.js';
import { getTheme } from '@themes';

export class SelectionBox implements Renderable, KeypressAcceptor {
  
  selectedIdx = 0;
  stuff: Renderable[] = [];
  height: number;
  offset: number = 0;
  getData: () => Renderable[];

  // buffer = 

  constructor(height: number) {
    this.height = height;
  }

  setGetData(fn: () => Renderable[]) {
    this.getData = fn;
  }

  render() {
    return this.stuff.map((renderable, idx) => {
      if(idx === this.selectedIdx) {
        return ` ${getTheme().bright(` ❯ ${renderable.render(RenderMode.DETAILS)}`)} `;
      } else {
        return ` ${getTheme().normal(`   ${renderable.render(RenderMode.DETAILS)}`)} `;
      }
    }).join('\n')
  }

  up() {
    this.selectedIdx --;
    // if(this.selectedIdx === -1) {

    // }
  }

  down() {
    this.selectedIdx ++;
  }

  keypress(key: { full: string; }) {
    if(key.full === 'up') {

    }
  };
}
