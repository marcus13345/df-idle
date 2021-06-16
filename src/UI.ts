
import blessed from 'neo-blessed';
import ansi from 'sisteransi';

export const screen = blessed.screen({
	smartCSR: true
});

export interface Renderable {
	render: () => void
}

const fg = (color) => '{' + color + '-fg}';
const bg = (color) => '{' + color + '-bg}';
const color = (color) => { return { fg: fg(color), bg: bg(color) } }

export const tags = {
	black: color('black'),
	red: color('red'),
	green: color('green'),
	yellow: color('yellow'),
	blue: color('blue'),
	magenta: color('magenta'),
	cyan: color('cyan'),
	white: color('white'),
	reset: '{/}',
	bright: '{bold}'
};

export const boxStyle = () => {
	return {
		style: {
			border: {
				fg: 'white'
			},
			focus: {
				border: {
					fg: 'cyan'
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
	titleBar.setContent(`  ${title}{|}{bold}{black-fg}v0.1.0      {/}`);
}

setTitle('');

menuPanel.focus();

screen.append(tasksPanel);
screen.append(menuPanel);
screen.append(titleBar);

process.stdout.write(ansi.cursor.hide);

screen.key(['C-c'], function(ch, key) {
	process.stdout.write(ansi.cursor.show);
  return process.exit(0);
});