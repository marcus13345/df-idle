import { getTheme } from "@themes";
import { Game } from "../../Game.js";
import { progressbar } from "../../Progressbar.js";
import { PawnDetails } from "../PawnDetails.js";
import { panels } from "../UI.js";
import { View } from "../View.js";

export default class PawnsView extends View {
	constructor() {
		super();
		this.name = 'Pawns';
	}

	keypress(key: { full: string; }) {
		if (key.full === 'delete') {
			Game.current.removePawn(Game.current.selected);
		} else if (key.full === 'up') {
			Game.current.advanceSelection(-1);
		} else if (key.full === 'down') {
			Game.current.advanceSelection(1);
		} else if (key.full === 'enter') {
			new PawnDetails(Game.current.selected);
		}
	}

	render() {
		return `${
			Game.current.pawns.map(pawn => `${(function() {
				const selected = pawn === Game.current.selected;
				let str = '';
				if(selected) {
					str += ` ${getTheme().selected(` ❯ ${pawn.toString()}`)}{|}${pawn.status} \n`;
					str += `    ${getTheme().normal('Energy')}{|}${progressbar(pawn.energy / 100, (panels.right.width - 4) / 2)} \n`;
				} else {
					str += `    ${getTheme().normal(pawn.toString())}{|}${pawn.status} `;
				}
				return str;
			})()}`).join('\n')
		}`;
	}
}