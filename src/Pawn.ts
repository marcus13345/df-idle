import { Serializable } from 'frigid';
import faker from 'faker';
import { Task, TaskState } from './registries/Tasks.js';
import Time, { Tickable } from './Time.js';
import { Game } from './Game.js';
import { render, Renderable, RenderMode } from './ui/UI.js';
import { Memory } from './Memory.js';
import { getTheme } from '@themes';

// TODO add stats getter to return % of all stats

export class Pawn extends Serializable implements Tickable, Renderable {
  name: {
    first: string,
    last: string
  };
  sex: number;
  age: number;
  memories: Memory[];

  job: TaskState<unknown, unknown>;

  async tick() {
    this.age ++;
  }

  get idle() {
    return !this.job;
  }

  ctor() {
    this.name ??= {
      first: faker.name.firstName(),
      last: faker.name.lastName()
    };
    if(!this.sex) {
      this.sex = Math.round(Math.random());
      this.name.first = faker.name.firstName(this.sex);
    }
    this.memories ??= [];
    if(!this.age) {
      this.age = Math.floor(525600 * (16 + Math.random() * 9));
      this.memories.push({
        type: "birth",
        location: Game.current.name,
        time: {
          age: 0,
          locale: new Time(Game.current.clock.stamp - this.age).toString()
        }
      })
    }


    // if(this.job?.completed) {
    //   this.stopWorking();
    // }
  }

  taskCompleted() {
    this.job = null
  }

  stopWorking() {
    if(this.job) {
      // this.job.unclaim(this);
      this.job = null;
    }
  }

  get status() {
    return 'SEMETHING';
    // if(this.job) {
    //   return this.job.task.status;
    // } else {
    //   return this.awake ? getTheme().status.idle('IDLE') : getTheme().status.self('RESTING')
    // }
  }

  static serializationDependencies() {
    return [TaskState]
  }

  toString() {
    return this.render(RenderMode.ONELINE);
  }

  render(mode: RenderMode): string {
    if(mode === RenderMode.ONELINE) {
      if(this.name) {
        return this.name.first + ' ' + this.name.last;
      } else {
        return '[Object Pawn]';
      }
    } else if (mode === RenderMode.DETAILS) {
      return `${
        this.toString()
      }{|}${
        this.status
      }\nDETAILS\nDETAILS`
    }
  }
}

// const task = 