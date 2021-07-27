import { Serializable } from 'frigid';
import { getTheme } from '@themes';
import { osrsNumber } from '../Util.js';

export type ItemID = string;

const items = new Map<ItemID, Item<any>>();

// ITEMS SHALL BE SINGULAR
export class Item<Data = any> {

  name = {
    singular: '',
    plural: ''
  }
  id: ItemID = '';
  props: Map<string, any> = new Map();

  setName(name: string) {
    this.name.singular = name;
    this.name.plural = name;
    this.register(false);
    return this;
  }

  plural(name: string) {
    this.name.plural = name;
    return this;
  }

  setId(id: ItemID) {
    this.id = id;
    this.register(false);
    return this;
  }

  register(force = true) {
    if((!this.id || !this.name) && !force) return;
    // console.log('Added item', (this.name.singular ?? "[No Name]").padStart(20, ' '), `| (${this.id})`)
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

export class ItemState<Data> extends Serializable {
  qty: number;
  itemId: ItemID;
  data: Data;

  take(qty: number) {
    if(this.qty < qty) throw new Error('cant split more than stack from stack...');
    this.qty -= qty;
    return new ItemState<Data>(this.item, qty, this.data);
  }

  get name() {
    return this.qty === 1 ? this.item.name.singular : this.item.name.plural;
  }

  get item() {
    if(!items.has(this.itemId))
      throw new Error('unknown item: ' + this.itemId);
    return items.get(this.itemId);
  }

  constructor(item: Item<Data>, amount: number, data: Data = null) {
    super();
    this.qty = amount;
    this.itemId = item.id;
    this.data = data;
  }

  render() {
    return getTheme().normal(` ${osrsNumber(this.qty)} ${(() => {
      if(this.qty === 1) return this.item.name.singular;
      else return this.item.name.plural;
    })()} `);
  }
}

export class ItemProperty {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export type ItemFilter = (itemState: ItemState<any>) => boolean;
