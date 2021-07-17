import { Serializable } from 'frigid';
import EventEmitter from 'events';
import chalk from 'chalk';
import { Pawn } from '../Pawn.js';
import { Game } from '../Game.js';
import { panels } from '../ui/UI.js';
import { progressbar, ProgressbarStyle } from '../Progressbar.js';

const tasks: Map<string, Task<unknown, unknown>> = new Map();
type WorkFunction<Data, State> = (taskState: TaskState<Data, State>, dtime: number) => void;
type InitFunction<Data, State> = (data: Data) => State;

export class Task<Data, State> {
  id: string;
  fn: WorkFunction<Data, State>;
  init: InitFunction<Data, State>;
  name: string;
  toString: (data: Data, state: State) => string;

  constructor(id: string) {
    this.id = id;
    tasks.set(id, this);
  }

  setInitiate(init: InitFunction<Data, State>) {
    this.init = init;
    return this;
  }

  setFunction(fn: WorkFunction<Data, State>) {
    this.fn = fn;
    return this;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setToString(fn: (data: Data, state: State) => string) {
    this.toString = fn;
    return this;
  }
}

export class TaskState<Data, State> extends Serializable {
  taskId: string;
  workFn: WorkFunction<Data, State>;
  x: number;
  y: number;
  data: Data;
  completed: boolean = false;
  worker: Pawn;
  state: State;

  constructor(task: Task<Data, State>, data: Data) {
    super();
    this.data = data;
    this.taskId = task.id;
    this.workFn = this.task.fn.bind(this);
  }

  setLocation(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get task(): Task<Data, State> {
    // casting because the id this is associated with
    // should have the datatype of the task it was
    // created with, but it stored as unknown
    return tasks.get(this.taskId) as Task<Data, State>;
  }

  get name() {
    return this.task.name;
  }

  work(dtime: number) {
    this.workFn(this, dtime);
  }

  claim(pawn: Pawn) {
    this.worker = pawn;
  }

  unclaim() {
    this.worker = null;
  }

  toString() {
    return this.task.toString(this.data, this.state)
  }
}

// export interface TaskProvider {
//   hasTask(): boolean;
//   getTask(): TaskState<unknown, unknown>;
// }
