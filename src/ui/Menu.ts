import { Pawn } from '../Pawn.js';
import log from '../log.js';
import { menuPanel, Renderable } from './UI.js';
import { Game } from '../Game.js';
import { ChopTreeTask } from '../tasks/ChopTreeTask.js';
import { progressbar, stats, barCache } from '../Progressbar.js';
import { Popup } from './Popup.js';
import mdns from '../multiplayer/mDNS.js';
import { GiftPopup } from './GiftPopup.js';
import { PawnDetails } from './PawnDetails.js';
import { defaultTheme, getTheme } from './Theme.js';
import { inspect } from 'util';

enum SubMenu {
	NONE = 'NONE',
	TREES = 'TREES'
};

enum View {
	PAWNS = 'Pawns',
	INVENTORY = 'Inventory',
	MULTIPLAYER = 'Multiplayer',
};

export class Menu implements Renderable {

	trees: number = 10;
	subMenu: SubMenu = SubMenu.NONE;
	view: View = View.PAWNS;

	constructor() {
		menuPanel.on('keypress', (evt, key) => {
			log.info('keypress', key);
			
			if (key.full === 'left') {
				this.view = View[Object.keys(View)[Math.min(Math.max(Object.values(View).indexOf(this.view) - 1, 0), Object.keys(View).length - 1)]]
			} else if (key.full === 'right') {
				this.view = View[Object.keys(View)[Math.min(Math.max(Object.values(View).indexOf(this.view) + 1, 0), Object.keys(View).length - 1)]]
			} else if (key.full === 'q') {
				this.subMenu = SubMenu.TREES;
			} else if (key.full === '1') {
				Popup.show(inspect(stats));
			} else if (key.full === '2') {
				Popup.show('Etiam hendrerit elit sit amet metus congue dictum nec eu lacus. Sed aliquam in justo efficitur faucibus. Duis tellus diam, congue volutpat lorem et, semper consectetur erat. Nunc ac velit dignissim, tincidunt augue eget, tristique orci. Duis lacus sapien, bibendum id pharetra vel, semper et nunc. Vestibulum eu tellus imperdiet, lacinia ante ac, porta nisl. Donec at eleifend risus, ac dictum odio.');
			} else if (key.full === 'escape') {
				this.subMenu = SubMenu.NONE;
			}

			if(this.view === View.PAWNS) {
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

			if(this.view === View.MULTIPLAYER) {
				if (key.full === 'enter') {
					new GiftPopup(mdns.players[this.multiplayerSelected]);
					// mdns.players[this.multiplayerSelected].sendItem(null);
				} else if (key.full === 'up') {
					this.multiplayerSelected --;
				} else if (key.full === 'down') {
					this.multiplayerSelected ++;
				}
			}

			if(this.subMenu === SubMenu.TREES) {
				if (key.full === '=') {
					this.trees ++;
				} else if (key.full === '-') {
					this.trees --;
					this.trees = Math.max(this.trees, 1);
				} else if (key.full === '+') {
					this.trees += 10;
				} else if (key.full === '_') {
					this.trees -= 10;
					this.trees = Math.max(this.trees, 1);
				} else if (key.full === 'enter') {
					for(let i = 0; i < this.trees; i ++) {
						Game.current.board.addTask(new ChopTreeTask(1));
					}
					this.subMenu = SubMenu.NONE;
				}
			} else if(this.subMenu === SubMenu.NONE) {
				if (key.full === 'z') {
					Game.current.pawns.push(new Pawn());
				} else if (key.full === 'x') {
					Game.current.board.clear();
				}
			}

			// const pawn = new Pawn();
			// Game.current.pawns.push(pawn);
			Game.current.sync();
		});
	}

	renderJobs() {

		const colSpace = ((menuPanel.width - 2) / 2);

		return (`    ${getTheme().header('Menus')}${getTheme().normal(':')}${
			' '.repeat(colSpace - 8)
		}${getTheme().header('Actions')}${getTheme().normal(':')}\n  ${
			getTheme().hotkey('q')
		}${getTheme().normal(': ')}${
			(this.subMenu !== SubMenu.TREES ? getTheme().normal : getTheme().selected)('Chop Trees')
		}${
			' '.repeat(colSpace - 15)
		}${getTheme().hotkey('z')}${getTheme().normal(': ')}${
			(this.subMenu !== SubMenu.NONE ? getTheme().normal : getTheme().selected)('Create Pawn')

		}\n${
			' '.repeat(colSpace)
		}${
			getTheme().hotkey('x')
		}${getTheme().normal(': ')}${
			(this.subMenu !== SubMenu.NONE ? getTheme().normal : getTheme().selected)('Clear Tasks')
		}`);

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
			switch(this.view) {
				case View.PAWNS: return this.renderPawns();
				case View.INVENTORY: return this.renderInv();
				case View.MULTIPLAYER: return this.renderMultiplayer();
			}
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

	renderSubMenu() {
		return `${(() => {
			switch(this.subMenu) {
				case SubMenu.NONE:
					return `{center}${getTheme().normal('* Select a menu above for options *')}{/center}`;
				case SubMenu.TREES:
					return this.renderTreesSubMenu();
			}
		})()}`;
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
			hr,
			this.renderJobs(),
			hr,
			this.renderSubMenu()
		].join('\n');
		menuPanel.setContent(content);
	}
}