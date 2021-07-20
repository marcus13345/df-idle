import { Serializable } from 'frigid';
import { Game } from './Game.js';
import { Item, ItemState } from './registries/Items.js';
import { Popup } from './ui/Popup.js';
import { Renderable } from '@ui';

export class Inventory extends Serializable implements Renderable {
  items: ItemState<any>[];

  ctor() {
    this.items ??= [];
  }

  validate() {
    const invalid: ItemState<any>[] = [];
    for(const itemState of this.items) {
      try {
        itemState.item;
      } catch {
        invalid.push(itemState);
      }
    }
    if(invalid.length === 0) return;
    
    for(const itemState of invalid) {
      this.remove(itemState);
    }
    Popup.show('Invalid ItemStates removed:\n\n' + invalid.map(itemState => itemState.qty + 'x ' + itemState.itemId).join('\n'));
  }

  static serializationDependencies() {
    return [ItemState];
  }

  remove(itemState: ItemState<any>) {
    this.items = this.items.filter(test => test !== itemState);
  }

  add(itemState: ItemState<any>) {
    this.items.push(itemState);
    this.reduceInv();
  }

  private reduceInv() {
    this.items = this.items.reduce((items, itemState) => {

      // TODO at some point, be able to merge data items?

      const existing = items.find(testItemState => {
        return itemState.itemId === testItemState.itemId
          && itemState.data === testItemState.data;
      });

      if(existing) {
        existing.qty += itemState.qty;
      } else {
        items.push(itemState);
      }
      return items
    }, [] as ItemState<any>[])
  }

  render() {
    return this.items.map(item => item.render()).join('\n');
  }
}
