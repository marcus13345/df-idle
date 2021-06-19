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
			width: '100%',
			height: 'shrink',
			// content: getTheme().normal(content) + `\n\n{|}` + getTheme().hotkey('enter') + getTheme().normal(`: Okay `),
			tags: true,
			...boxStyle(),
		});
    let stuff = '';
    for(let i = 16; i < 232; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%18===0?'\n':''}`)
    this.box.setContent(stuff)
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