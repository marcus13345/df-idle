import { View } from "../View.js";

export default class InventoryView extends View {
	constructor() {
		super();
		this.name = 'Inventory';
	}
	keypress: (key: { full: string; }) => void;
	render() { void 0 };
}