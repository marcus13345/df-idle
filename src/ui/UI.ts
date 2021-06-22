
import blessed from 'neo-blessed';
import ansi from 'sisteransi';
import { getTheme } from '../registries/Themes.js';

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

let leftPanel: any;
let rightPanel: any;
let titleBar: any;
let screen: any;
let currentRenderable: Renderable = null;
let started = false;

function assertStarted() {
  if(!started) throw new Error('Attempted accessing UI before starting it!');
}

function assertNotStarted() {
  if(started) throw new Error('Attempted starting UI when already started!');
}

export function isStarted() {
  return started;
}

export const panels = {
  get left() {
    assertStarted()
    return leftPanel;
  },
  get right() {
    assertStarted()
    return rightPanel;
  },
  get screen() {
    assertStarted()
    return screen;
  }
}

export function setTitle(title: string) {
  assertStarted();
  titleBar.setContent(`  ${getTheme().header(title)}{|}${getTheme().subheader('v0.1.0')}      {/}`);
}

export function render(thing?: Renderable) {
  assertStarted();
  if(!!thing) currentRenderable = thing;

  currentRenderable.render();
  screen.render();
}

export function start() {
  assertNotStarted();
  screen = blessed.screen({
    smartCSR: true,
    terminal: 'xterm-256color'
  });

  leftPanel = blessed.box({
    top: 1,
    left: 0,
    width: '50%',
    height: '100%-1',
    ...boxStyle(),
    tags: true
  });

  rightPanel = blessed.box({
    top: 1,
    right: 0,
    width: '50%',
    height: '100%-1',
    ...boxStyle(),
    tags: true
  });

  titleBar = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    tags: true,
  });

  screen.append(leftPanel);
  screen.append(rightPanel);
  screen.append(titleBar);
  rightPanel.focus();

  process.stdout.write(ansi.cursor.hide);

  screen.key(['C-c'], function(ch, key) {
    process.stdout.write(ansi.cursor.show);
    setTimeout(_ => {
      process.exit(0);
    })
  });

  screen.key('f2', () => {
    rightPanel.focus();
  });

  screen.key('f1', () => {
    leftPanel.focus();
  });

  started = true;
  setTitle('');
}