import { Serializable } from 'frigid';
import EventEmitter from 'events';
import chalk from 'chalk';
import { Pawn } from '../Pawn.js';
import { Game } from '../Game.js';
import { panels } from '../ui/UI.js';
import { progressbar, ProgressbarStyle } from '../Progressbar.js';

export const tasks: Map<string, Task<any>> = new Map();
export type TaskCategory = "self" | "work" | "craft" | "idle";

export class Task<Data> {
  id: string;
  work: number;
  name: string | ((data: Data) => string);
  status: string;
  tasklistVisibility: boolean;
  category: TaskCategory;
  completionEvent: (data: Data) => void;

  setTasklistVisibility(b: boolean) {
    this.tasklistVisibility = b;
    return this;
  }

  setName(name: string | ((data: Data) => string)) {
    this.name = name;
    return this;
  }

  setStatus(s: string) {
    this.status = s;
    return this;
  }

  setCategory(c: TaskCategory) {
    this.category = c;
    return this;
  }

  setWork(n: number) {
    this.work = n;
    return this;
  }

  setCompletionEvent(fn: (data: Data) => void) {
    this.completionEvent = fn;
    return this;
  }

  constructor(id: string) {
    this.id = id;
    this.tasklistVisibility = true;
    this.category = "work";
    tasks.set(this.id, this);
  }
}

export class TaskState<T> extends Serializable {
  taskId: string;
  progress: number;
  worker: Pawn;
  data: T;

  ctor() {
    // retest completion when loaded, JUST IN CASE
    this.testCompletion();
  }

  constructor(task: Task<T>, data: T = {} as T) {
    super();
    this.taskId = task.id;
    this.progress = 0;
    this.worker = null;
    // preset the data to nothing JIC
    this.data = data;
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
    if (this.taskId && this.completed) {
      this.task.completionEvent(this.data);
      Game.current.board.removeTask(this);
    }
  }

  free() {
    this.worker = null;
  }

  claim(pawn: Pawn) {
    this.worker = pawn;
  }

  get completion() {
    return Math.min(1, this.progress / this.task.work);
  }

  get task() {
    return tasks.get(this.taskId);
  }

  get completed() {
    return this.completion >= 1;
  }

  toString() {
    // HACK magic number 2 here, is the border
    // of the panel
    const width = panels.left.width - 2;
    const left = ' ' + this.task.name + ' ' + (this.worker?.toString() || chalk.bold.black('Queued'));
    const bar = width - 2;
    return `${left}\n ${progressbar(this.completion, bar, ProgressbarStyle.progress)}\n`;
  }
}