import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { stringify } from '../Memory.js';
import { Pawn } from '../Pawn.js';
import Time from '../Time.js';
import { panels } from '@ui';
import { boxStyle } from '@themes';

export class PawnDetails {
	box;
	pawn: Pawn;

	constructor(pawn: Pawn) {
		this.pawn = pawn;
		this.box = blessed.box({
			top: 0,
			left: 'center',
			width: 'shrink',
			height: 'shrink',
			tags: true,
			...boxStyle(),
		});
		this.box.on('keypress', (evt: {}, key: {full: string}) => {
			if(key.full === 'escape' || key.full === 'enter') {
				Game.current.clock.start();
				panels.screen.remove(this.box);
			} else if (key.full === 'up') {
				// this.selected --;
			} else if (key.full === 'down') {
				// this.selected ++;
			} else if (key.full === 'right') {
				// this.pawns.set(Game.current.pawns[this.selected], 1);
			} else if (key.full === 'left') {
				// this.pawns.set(Game.current.pawns[this.selected], 0);
			} 
			this.render();
		});
		this.render();
		panels.screen.append(this.box);
		this.box.focus();
		Game.current.clock.pause();
	}

	render() {
		let i = 0;
		this.box.setContent(`${
			this.pawn.toString()
		}{|}${
			(this.pawn.sex ? "female" : "male") +
			', ' + new Time(this.pawn.age).asAge()
		}\n${(() => {
			return this.pawn.memories.map(memory => stringify(memory)).join('\n')
		})()}\n\n{|}${
			chalk.green('escape')
		}: Cancel \n{|}${
			chalk.green('enter')
		}: Okay `);
		panels.screen.render();
	}
}