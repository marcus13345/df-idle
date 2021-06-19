import { Pawn } from '../Pawn.js';
import log from '../log.js';
import { menuPanel, Renderable } from './UI.js';
import { Game } from '../Game.js';
import { progressbar, stats } from '../Progressbar.js';
import { Popup } from './Popup.js';
import mdns from '../multiplayer/mDNS.js';
import { getTheme } from './Theme.js';
import { inspect } from 'util';
import PawnsView from './view/PawnsView.js';
import InventoryView from './view/InventoryView.js';
import MultiplayerView from './view/MultiplayerView.js';
import { View } from './View.js';

const clamp = (min, max, value) => Math.min(Math.max(value, min), max);

// TODO move KeypressAcceptor to ui something idk
export interface KeypressAcceptor {
	keypress(key: {full: string}): void
}

export class Menu implements Renderable {

	trees: number = 10;
	viewIndex: number = 0;
	views: View[] = [
		new PawnsView(),
		new InventoryView(),
		new MultiplayerView()
	]

	get view() {
		return this.views[this.viewIndex];
	}

	advanceView() {
		this.viewIndex ++;
		this.viewIndex = clamp(0, this.views.length - 1, this.viewIndex);
	}

	regressView() {
		this.viewIndex --;
		this.viewIndex = clamp(0, this.views.length - 1, this.viewIndex);
	}

	constructor() {
		menuPanel.on('keypress', (evt, key) => {
			log.info('keypress', key);
			
			if (key.full === 'left') {
				this.regressView();
			} else if (key.full === 'right') {
				this.advanceView();
			
			// debugging hotkeys
			} else if (key.full === '1') {
				Popup.show(inspect(stats));
			} else if (key.full === 'z') {
				Game.current.pawns.push(new Pawn());
			} else if (key.full === 'x') {
				Game.current.board.clear();
			}

			// if(this.view === View.PAWNS) {
			// 	if (key.full === 'delete') {
			// 		Game.current.removePawn(Game.current.selected);
			// 	} else if (key.full === 'up') {
			// 		Game.current.advanceSelection(-1);
			// 	} else if (key.full === 'down') {
			// 		Game.current.advanceSelection(1);
			// 	} else if (key.full === 'enter') {
			// 		new PawnDetails(Game.current.selected);
			// 	}
			// }

			// if(this.view === View.MULTIPLAYER) {
			// 	if (key.full === 'enter') {
			// 		new GiftPopup(mdns.players[this.multiplayerSelected]);
			// 		// mdns.players[this.multiplayerSelected].sendItem(null);
			// 	} else if (key.full === 'up') {
			// 		this.multiplayerSelected --;
			// 	} else if (key.full === 'down') {
			// 		this.multiplayerSelected ++;
			// 	}
			// }

			Game.current.sync();
		});
	}

	renderTopBar() {
		const idlers = Game.current.pawns.filter(pawn => pawn.idle);
		return ` ${Game.current.clock.render()}{|}${getTheme().normal(`Idle: ${idlers.length}`)} `;
	}

	renderPawns() {
		return `${
			Game.current.pawns.map(pawn => `${(function() {
				const selected = pawn === Game.current.selected;
				let str = '';
				if(selected) {
					str += ` ${getTheme().selected(` ❯ ${pawn.toString()}`)}{|}${pawn.status} \n`;
					str += `    ${getTheme().normal('Energy')}{|}${progressbar(pawn.energy / 100, (menuPanel.width - 4) / 2)} \n`;
				} else {
					str += `    ${getTheme().normal(pawn.toString())}{|}${pawn.status} `;
				}
				return str;
			})()}`).join('\n')
		}`;
	}

	renderView() {
		const colSpace = ((menuPanel.width - 2) / 2);
		return `${
			// ' '.repeat(colSpace - 20)
			'{center}'
		}${(() => {
			return Object.values(View).map(view => {
				if(view === this.view) {
					return getTheme().tab.selected(` ${view} `);
				} else {
					return getTheme().tab.normal(` ${view} `);
				}
			}).join('');
		})()}{/center}\n\n${(() => {
			this.view.render();
		})()}`
	}

	multiplayerSelected = 0;

	renderMultiplayer() {
		if(mdns.players.length === 0) return `{center}${getTheme().normal('No friends online')}{/center}`;
		return mdns.players.map((player, i) => {
			if(i === this.multiplayerSelected) return ' ' + getTheme().selected(' ❯ ' + player.toString());
			else return '    ' + getTheme().normal(player.toString());
		}).join('\n');
	}

	renderInv() {
		return Game.current.inv.render();
	}

	renderTreesSubMenu() {
		return [
			`{center}Chop Trees`,
			`{left}  ${getTheme().hotkey('-=_+')}: ${this.trees}`,
			`{left}  ${getTheme().hotkey('enter')}: Create Task`,
			`{left}  ${getTheme().hotkey('escape')}: Cancel`
		].join('\n');
	}

	render() {
		const width = menuPanel.width - 2;
		const hr = getTheme().normal('━'.repeat(width));
		const content = [
			this.renderTopBar(),
			hr,
			this.renderView(),
		].join('\n');
		menuPanel.setContent(content);
	}
}