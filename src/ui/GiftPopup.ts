import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { ItemState } from '../registries/Items.js';
import { Player } from "../multiplayer/Player";
import { Pawn } from '../Pawn.js';
import { getTheme, boxStyle } from '@themes';
import { panels } from './UI.js';

export class GiftPopup {
	box;

	selected = 0;
	player: Player;

	pawns = new Map<Pawn, number>();

	constructor(player: Player) {
		this.player = player;
		this.box = blessed.box({
			top: 0,
			left: 'center',
			width: 'shrink',
			height: 'shrink',
			tags: true,
			...boxStyle(),
		});
		this.box.on('keypress', (evt: {}, key: {full: string}) => {
			if(key.full === 'enter') {
				this.send();
			} if(key.full === 'escape' || key.full === 'enter') {
				Game.current.clock.start();
				panels.screen.remove(this.box);
			} else if (key.full === 'up') {
				this.selected --;
			} else if (key.full === 'down') {
				this.selected ++;
			} else if (key.full === 'right') {
				this.pawns.set(Game.current.pawns[this.selected], 1);
			} else if (key.full === 'left') {
				this.pawns.set(Game.current.pawns[this.selected], 0);
			} 
			this.render();
		});
		this.render();
		for(const pawn of Game.current.pawns) this.pawns.set(pawn, 0);
		panels.screen.append(this.box);
		this.box.focus();
		Game.current.clock.pause();
	}

	send() {
		const stuffToSend: (Pawn | ItemState<any>)[] = [];
		for(const [pawn, qty] of this.pawns) {
			if(qty === 0) continue;
			stuffToSend.push(pawn);
			pawn.stopWorking();
			// Game.current.removePawn
		}
		this.player.send(stuffToSend).then(_ => {

		}).catch(_ => {
			
		});
	}

	render() {
		let i = 0;
		this.box.setContent(`${(() => {
			let pawns = [];
			for (const [pawn, qty] of this.pawns.entries()) {
				const style = i === this.selected ? getTheme().selected : getTheme().normal;
				if(qty > 0) {
					pawns.push(style(`{|}${pawn.toString()}  `))
				} else {
					pawns.push(style(`  ${pawn.toString()}{|}`))
				}
				// pawns[pawns.length - 1] = chalk.underline(pawns[pawns.length - 1])
				i ++;
			}
			return pawns.join('\n')
		})()}\n\n{|}${getTheme().hotkey('escape')}${getTheme().normal(': Cancel ')}\n{|}${getTheme().hotkey('enter')}${getTheme().normal(': Okay ')}`);
		panels.screen.render();
	}
}