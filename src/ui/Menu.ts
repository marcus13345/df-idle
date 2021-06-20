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
			} else this.view.keypress(key);

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

			// TODO add colortest debug screen!

			Game.current.sync();
		});
	}

	renderTopBar() {
		const idlers = Game.current.pawns.filter(pawn => pawn.idle);
		return ` ${Game.current.clock.render()}{|}${getTheme().normal(`Idle: ${idlers.length}`)} `;
	}

	renderView() {
		const colSpace = ((menuPanel.width - 2) / 2);
		return `{center}${(() => {
			return Object.values(this.views).map((view, idx) => {
				if(idx === this.viewIndex) {
					return getTheme().tab.selected(` ${view.name} `);
				} else {
					return getTheme().tab.normal(` ${view.name} `);
				}
			}).join('');
		})()}{/center}\n\n${
			this.view.render()
		}`;
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