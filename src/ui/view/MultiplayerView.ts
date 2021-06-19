import { View } from "../View.js";

export default class MultiplayerView extends View {
	constructor() {
		super();
		this.name = 'Multiplayer';
	}
	keypress: (key: { full: string; }) => void;
	render() { void 0 };
}