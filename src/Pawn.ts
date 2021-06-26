import { Serializable } from 'frigid';
import faker from 'faker';
import { TaskState } from './registries/Tasks.js';
import Time, { Tickable } from './Time.js';
import { Game } from './Game.js';
import { render } from './ui/UI.js';
import { Memory } from './Memory.js';
import { getTheme } from '@themes';

// const STATUS = {
// 	IDLE: Symbol('IDLE')
// }

const energyScale = 0.1;
const MAX_ENERGY = 100;

// TODO add stats getter to return % of all stats

export class Pawn extends Serializable implements Tickable {
  name: {
    first: string,
    last: string
  };
  job: TaskState<any>;
  awake: boolean;
  sex: number;

  energy: number;
  fun: number;

  age: number;

  memories: Memory[];

  async tick() {
    this.age ++;

    this.energy -= energyScale;

    if(this.awake === false) {
      this.energy += energyScale * 4;
      if(this.energy >= MAX_ENERGY) {
        this.awake = true;
      }
    } else {
      if(this.job) {
        this.job.doWork(1, this);
        this.energy -= energyScale;
        if(this.job?.completed) {
          this.stopWorking();
        }
      } else {
        const inactive = Game.current.board.tasks.filter(task => {
          return task.worker === null;
        });
        if(inactive.length > 0) {
          const task = inactive[0];
          // const task = inactive[Math.floor(Math.random() * inactive.length)];
          this.assignJob(task);
        }
      }
      if(this.energy <= 0) {
        this.stopWorking();
        this.awake = false;
      }
    }

  }

  get idle() {
    return !this.job && this.awake;
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
    this.awake ??= true;
    this.energy ??= MAX_ENERGY;
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


    if(this.job?.completed) {
      this.stopWorking();
    }
  }

  stopWorking() {
    if(this.job) {
      this.job.stopJob();
      this.job = null;
    }
  }

  assignJob(task: TaskState<any>) {
    this.job?.stopJob()
    this.job = task;
    this.job.claim(this);
  }

  get status() {
    if(this.job) {
      return this.job.task.status;
    } else {
      return this.awake ? getTheme().status.idle('IDLE') : getTheme().status.self('RESTING')
    }
  }

  static serializationDependencies() {
    return [TaskState]
  }

  toString() {
    if(this.name) {
      return this.name.first + ' ' + this.name.last;
    } else {
      return '[Object Pawn]';
    }
  }
}
