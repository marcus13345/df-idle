
import blessed from 'neo-blessed';
import ansi from 'sisteransi';
import { getTheme } from './Theme.js';

export const screen = blessed.screen({
	smartCSR: true,
	terminal: 'xterm-256color'
});

export interface Renderable {
	render(): void
}

// TODO move this to theme
export const boxStyle = () => {
	return {
		style: {
			border: {
				fg: getTheme().border.normal
			},
			focus: {
				border: {
					fg: getTheme().border.focused
				}
			}
		},
		border: {
			type: 'line'
		}
	};
};

let currentRenderable = null;
export function render(thing?: Renderable) {
	if(!!thing) currentRenderable = thing;
	currentRenderable.render();
	screen.render();
}

export const tasksPanel = blessed.box({
	top: 1,
	left: 0,
	width: '50%+1',
	height: '100%-1',
	...boxStyle(),
	tags: true
});

export const menuPanel = blessed.box({
	top: 1,
	left: '50%+1',
	width: '50%',
	height: '100%-1',
	...boxStyle(),
	tags: true
});

const titleBar = blessed.box({
	top: 0,
	left: 0,
	width: '100%',
	height: 1,
	tags: true,
});

export function setTitle(title) {
	titleBar.setContent(`  ${getTheme().header(title)}{|}${getTheme().subheader('v0.1.0')}      {/}`);
}

setTitle('');

menuPanel.focus();

screen.append(tasksPanel);
screen.append(menuPanel);
screen.append(titleBar);

process.stdout.write(ansi.cursor.hide);

screen.key(['C-c'], function(ch, key) {
	process.stdout.write(ansi.cursor.show);
	setTimeout(_ => {
		process.exit(0);
	})
});

tasksPanel.key('f2', () => {
	menuPanel.focus();
});

menuPanel.key('f1', () => {
	tasksPanel.focus();
});