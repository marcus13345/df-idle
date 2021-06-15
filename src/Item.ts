import { Serializable } from 'frigid';
import { ItemID } from './index.js';

// ITEMS SHALL BE SINGULAR
export class Item extends Serializable {
	static LOG = new Item().setName("Log").setId('resources:log');

	name = '';
	id: ItemID = '';

	setName(name) {
		this.name = name;
		return this;
	}

	setId(id) {
		this.id = id;
		return this;
	}
}
