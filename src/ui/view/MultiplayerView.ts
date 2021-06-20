import { GiftPopup } from "../GiftPopup.js";
import { View } from "../View.js"
import mdns from '../../multiplayer/mDNS.js';
import { getTheme } from "@theme";

export default class MultiplayerView extends View {
	
	selected: number = 0;

	constructor() {
		super();
		this.name = 'Multiplayer';
	}

	keypress(key: { full: string; }) {
		if (key.full === 'enter') {
			new GiftPopup(mdns.players[this.selected]);
		} else if (key.full === 'up') {
			this.selected --;
		} else if (key.full === 'down') {
			this.selected ++;
		}
	}

	render() {
		if(mdns.players.length === 0) return `{center}${getTheme().normal('No friends online')}{/center}`;
		return mdns.players.map((player, i) => {
			if(i === this.selected) return ' ' + getTheme().selected(' ❯ ' + player.toString());
			else return '    ' + getTheme().normal(player.toString());
		}).join('\n');
	};
}