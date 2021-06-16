import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { boxStyle, screen } from './UI.js';

export class Popup {
	box;

	constructor(content) {
		this.box = blessed.box({
			top: 'center',
			left: 'center',
			width: 'shrink',
			height: 'shrink',
			content: content + `\n\n{|}` + chalk.green('enter') + `: Okay `,
			tags: true,
			...boxStyle(),
		});
		this.box.on('keypress', (evt, key) => {
			if(key.full === 'escape' || key.full === 'enter') {
				Game.current.clock.start();
				screen.remove(this.box);
			}
		});
		screen.append(this.box);
		this.box.focus();
		Game.current.clock.pause();
	}
}