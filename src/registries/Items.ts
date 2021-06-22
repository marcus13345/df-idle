import { Serializable } from 'frigid';
import { getTheme } from './Themes.js';
import { Renderable } from '../ui/UI.js';

export type ItemID = string;

const items = new Map<ItemID, Item>();

// ITEMS SHALL BE SINGULAR
export class Item extends Serializable {

  name = '';
  id: ItemID = '';

  setName(name) {
    this.name = name;
    this.register(false);
    return this;
  }

  setId(id: ItemID) {
    this.id = id;
    this.register(false);
    return this;
  }

  register(force = true) {
    if((!this.id || !this.name) && !force) return;
    console.log('Added item', (this.name ?? "[No Name]").padStart(20, ' '), `| (${this.id})`)
    items.set(this.id, this);
    return this;
  }
}

export class ItemState extends Serializable implements Renderable {
  qty: number;
  itemId: ItemID;
  data: any;

  get item() {
    if(!items.has(this.itemId))
      throw new Error('unknown item: ' + this.itemId);
    return items.get(this.itemId);
  }

  constructor(item: Item, amount: number, data: any) {
    super();
    this.qty = amount;
    this.itemId = item.id;
    this.data = data;
  }

  render() {
    return getTheme().normal(` ${this.item.name}{|}${this.qty} `);
  }
}

