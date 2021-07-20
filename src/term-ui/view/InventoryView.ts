import { Game } from "../../Game.js";
import { View } from "../View.js";

export default class InventoryView extends View {
	constructor() {
		super();
		this.name = 'Inventory';
	}
	keypress(key: { full: string; }) {}

	render() {
		return Game.current.inv.render();
	};
}