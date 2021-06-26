
import chalk from 'chalk';
import blessed from 'neo-blessed';
import ansi from 'sisteransi';
import { boxStyle, getTheme } from '@themes';
export { Popup } from './Popup.js';

export interface Renderable {
	render(): void
}

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

  process.stdout.write('\x1b[?1049h');

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

export function stop() {
  screen.destroy();
  process.stdout.write('\x1b[?1049l');
}

// move to some debugging shit, idk
let ansiTestCard = '{center}';
for(let i = 16; i < 34; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 52; i < 70; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 88; i < 106; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 124; i < 142; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 160; i < 178; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 196; i < 214; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
ansiTestCard += '\n';
for(let i = 34; i < 52; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 70; i < 88; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 106; i < 124; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 142; i < 160; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 178; i < 196; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
for(let i = 214; i < 232; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} ${(i-15)%6===0?chalk.reset('     '):''}`); ansiTestCard += '\n';
ansiTestCard += '\n';
for(let i = 232; i < 256; i ++) ansiTestCard += chalk.bgAnsi256(i).black(` ${i.toString().padStart(3, ' ')} `)
ansiTestCard += '{/center}';

export {
  ansiTestCard
};