import { Serializable } from 'frigid';
import { getTheme } from '@themes';
import { Renderable } from '../ui/UI.js';

export type ItemID = string;

const items = new Map<ItemID, Item<any>>();

export type PropertyValue = number | boolean;

// ITEMS SHALL BE SINGULAR
export class Item<Data> extends Serializable {

  name = '';
  id: ItemID = '';
  props: Map<string, PropertyValue> = new Map();

  setName(name: string) {
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

  setProperty(prop: ItemProperty, value: any) {
    this.props.set(prop.name, value);
    return this;
  }

  getProperty(prop: ItemProperty) {
    if(this.props.has(prop.name)) return this.props.get(prop.name);
    else return null;
  }
}

export class ItemState<Data> extends Serializable implements Renderable {
  qty: number;
  itemId: ItemID;
  data: Data;

  get item() {
    if(!items.has(this.itemId))
      throw new Error('unknown item: ' + this.itemId);
    return items.get(this.itemId);
  }

  constructor(item: Item<Data>, amount: number, data: Data) {
    super();
    this.qty = amount;
    this.itemId = item.id;
    this.data = data;
  }

  render() {
    return getTheme().normal(` ${this.item.name}{|}${this.qty} `);
  }
}

export class ItemProperty {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export type ItemFilter = (itemState: ItemState<any>) => boolean;
