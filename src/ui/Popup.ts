import chalk from 'chalk';
import blessed from 'neo-blessed';
import { Game } from '../Game.js';
import { getTheme } from '@themes';
import { boxStyle, panels } from './UI.js';

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
			content: getTheme().normal(content) + `\n\n{right}` + getTheme().hotkey('enter') + getTheme().normal(`: Okay `) + '{/right}',
			tags: true,
			...boxStyle(),
		});
    // let stuff = '          ';
    // for(let i = 16; i < 34; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 52; i < 70; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 88; i < 106; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 124; i < 142; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 160; i < 178; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 196; i < 214; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
		// stuff += '\n          ';
    // for(let i = 34; i < 52; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 70; i < 88; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 106; i < 124; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 142; i < 160; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 178; i < 196; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
    // for(let i = 214; i < 232; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); stuff += '\n          ';
		// stuff += '\n';
    // for(let i = 232; i < 256; i ++) stuff += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%18===0?'\n':''}`)
    // this.box.setContent(stuff)
		this.box.on('keypress', (evt, key) => {
			if(key.full === 'escape' || key.full === 'enter') {
				Game.current.clock.start();
				panels.screen.remove(this.box);
			}
		});
		panels.screen.append(this.box);
		this.box.focus();
		Game.current.clock.pause();
	}
}