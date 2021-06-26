import { Serializable } from 'frigid';
import { Game } from './Game.js';
import { Item, ItemState } from './registries/Items.js';
import { Popup } from './ui/Popup.js';
import { Renderable } from './ui/UI.js';

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
    // TODO deduplicate itemstates...
    // use a reduce to reconstruct the array.
    // REMEMBER TO MAINTAIN THE OBJECTs!
    // dont do immutability to it, as the objects
    // may have crossreferences! (maybe)
  }

  // add(item: Item, qty: number = 1) {
  //   const id = item.id;
  //   const existingArr = this.items.filter(itemState => {
  //     return itemState.itemId === id;
  //   });
  //   let existing: ItemState = null;
  //   if(existingArr.length === 1) {
  //     existing = existingArr[0];
  //   }
  //   if(existing) {
  //     existing.qty += qty;
  //   } else {
  //     this.items.push(new ItemState(item, qty, {}));
  //   }
  //   Game.current.sync();
  // }

  render() {
    return this.items.map(item => item.render()).join('\n');
  }
}
