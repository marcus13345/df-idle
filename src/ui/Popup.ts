import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { getTheme } from './Theme.js';
import { boxStyle, screen } from './UI.js';

export class Popup {
	box;

	static show(content) {
		new Popup(content)
	}

	private constructor(content) {
		this.box = blessed.box({
			top: 'center',
			left: 'center',
			width: 'shrink',
			height: 'shrink',
			content: getTheme().normal(content) + `\n\n{|}` + getTheme().hotkey('enter') + getTheme().normal(`: Okay `),
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