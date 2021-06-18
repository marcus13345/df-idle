import { Serializable } from 'frigid';
import { getTheme } from './ui/Theme.js';
import { Renderable } from './ui/UI.js';

export type ItemID = string;

const items = new Map<ItemID, Item>();

// ITEMS SHALL BE SINGULAR
export class Item extends Serializable {
	static LOG = new Item().setName("Log").setId('resources:log');

	name = '';
	id: ItemID = '';

	setName(name) {
		this.name = name;
		return this;
	}

	setId(id: ItemID) {
		this.id = id;
		items.set(this.id, this);
		return this;
	}
}

export class ItemState extends Serializable implements Renderable {
	qty: number;
	itemId: ItemID;
	data: any;

	get item() {
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