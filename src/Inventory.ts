import { Serializable } from 'frigid';
import { Game } from './Game.js';
import { Item, ItemState } from './Item.js';
import { Renderable } from './ui/UI.js';

export class Inventory extends Serializable implements Renderable {
	items: ItemState[];

	ctor() {
		this.items ??= [];
	}

	static serializationDependencies() {
		return [ItemState];
	}

	add(item: Item, qty: number = 1) {
		const id = item.id;
		const existingArr = this.items.filter(itemState => {
			return itemState.itemId === id;
		});
		let existing: ItemState = null;
		if(existingArr.length === 1) {
			existing = existingArr[0];
		}
		if(existing) {
			existing.qty += qty;
		} else {
			this.items.push(new ItemState(item, qty, {}));
		}
		Game.current.sync();
	}

	render() {
		return this.items.map(item => item.render()).join('\n');
	}
}
