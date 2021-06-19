import { View } from "../Menu.js";

export default class PawnsView extends View {
	constructor() {
		super();
		this.name = 'Pawns';
	}
	keypress: (key: { full: string; }) => void;
	render() { void 0 };
}