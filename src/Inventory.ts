import { Serializable } from 'frigid';
import { Item } from './Item.js';
import { SMap } from './SMap.js';
import { ItemID } from './index.js';

export class Inventory extends Serializable {
	items = new SMap<ItemID, number>();

	static serializationDependencies() {
		return [SMap];
	}

	add(item: Item, qty: number = 1) {
		const id = item.id;
		this.ditem(id, qty);
	}

	remove(item: Item, qty: number = 1) {
		const id = item.id;
		this.ditem(id, -qty);
	}

	ditem(id, n) {
		if (this.items.has(id))
			this.items.set(id, this.items.get(id) + n);
		else
			this.items.set(id, n);
	}
}
