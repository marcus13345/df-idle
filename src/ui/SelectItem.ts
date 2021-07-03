import { Game } from "@game";
import { ItemState } from "@items";
import { boxStyle, getTheme } from "@themes";
import { panels } from "@ui";
import EventEmitter from "events";
import blessed from 'neo-blessed';

type ItemFilterFunction = (itemState: ItemState<any>) => boolean;

export class SelectItem {
  box: any;
  emitter: EventEmitter;
  qty: number;
  items: ItemState<any>[];
  selectedIdx: number;

  static show(filter: ItemFilterFunction): Promise<ItemState<any>> {
    const si = new SelectItem(filter, 1);
    return new Promise(res => {
      si.emitter.on('selected', (itemState: ItemState<any>) => {
        res(itemState);
      });
      si.emitter.on('cancel', () => {
        res(null);
      })
    });
  }

  private open() {
    panels.screen.append(this.box);
    this.box.focus();
    Game.current.clock.pause();
  }

  private close() {
    Game.current.clock.start();
    panels.screen.remove(this.box);
  }

  get selectedItem(): ItemState<any> {
    return null;
  }

  private constructor(filter: ItemFilterFunction, qty: number) {
    this.emitter = new EventEmitter();
    this.qty = qty;
    this.box = blessed.box({
      top: 'center',
      left: 'center',
      width: 'shrink',
      height: 'shrink',
      tags: true,
      ...boxStyle(),
    });
    this.box.on('keypress', (evt: {}, key: {full: string}) => {
      if(key.full === 'escape') {
        this.emitter.emit('cancel');
        this.close();
      } else if(key.full === 'enter') {
        this.emitter.emit('selected', this.selectedItem.take(this.qty));
        this.close();
      } else if(key.full === 'down') {

      }
    });
    this.items = Game.current.inv.items.filter(filter);
    this.open();
  }
}