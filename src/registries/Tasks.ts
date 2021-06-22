import { Serializable } from 'frigid';
import EventEmitter from 'events';
import chalk from 'chalk';
import { Pawn } from '../Pawn.js';
import { Game } from '../Game.js';
import { panels } from '../ui/UI.js';
import { progressbar, ProgressbarStyle } from '../Progressbar.js';
import { Class } from '../Reflection.js';

export const taskClasses: Map<string, Class<Task>> = new Map();

export abstract class Task extends Serializable {
  progress = 0;
  worker: Pawn;
  data: any;

  ctor() {
    this.worker ??= null;
    this.testCompletion();
  }

  abstract reward(): void;
  abstract work: number;

  get completed() {
    return this.completion >= 1;
  }

  stopJob() {
    this.worker = null;
  }

  doWork(work = 1, pawn: Pawn) {
    this.worker = pawn;
    this.progress += work;
    this.testCompletion();
  }

  testCompletion() {
    if (this.progress >= this.work) {
      this.reward();
      Game.current.board.removeTask(this);
    }
  }

  claim(pawn: Pawn) {
    this.worker = pawn;
  }

  get completion() {
    return Math.min(1, this.progress / this.work);
  }

  toString() {
    // HACK magic number 2 here, is the border
    // of the panel
    const width = panels.left.width - 2;
    const left = ' ' + this.title + ' ' + (this.worker?.toString() || chalk.bold.black('Queued'));
    const bar = width - 2;
    return `${left}\n ${progressbar(this.completion, bar, ProgressbarStyle.progress)}\n`;
  }

  get title() {
    return chalk.bgRedBright.black('[Abstract Task]');
  }

  get status() {
    return chalk.bgRedBright.black('DOING A TASK');
  }
}

export function registerTask(id: string, taskClass: Class<Task>) {
  console.log('Registered task', id);
  taskClasses.set(id, taskClass)
}