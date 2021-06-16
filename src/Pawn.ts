import { Serializable } from 'frigid';
import faker from 'faker';
import chalk from 'chalk';
import log from './log.js';
import { Task } from './tasks/Task.js';
import { Tickable } from './Time.js';
import { ChopTreeTask } from './tasks/ChopTreeTask.js';
import { Game } from './Game.js';
import { render } from './ui/UI.js';
import { Memory } from './Memory.js';

const LABORS = {
	CUT_TREE: Symbol('CUT_TREE'),
	MINING: Symbol('CUT_TREE'),
}

const SKILLS = {
	PICKAXE: Symbol('PICKAXE'),
	HATCHET: Symbol('HATCHET')
}

// const STATUS = {
// 	IDLE: Symbol('IDLE')
// }

const energyScale = 0.1;

export class Pawn extends Serializable implements Tickable {
	name: {
		first: string,
		last: string
	};
	job: Task;
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
			if(this.energy >= 100) {
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
		log.info('Pawn::ctor')
		this.name ??= {
			first: faker.name.firstName(),
			last: faker.name.lastName()
		};
		if(!this.sex) {
			this.sex = Math.round(Math.random());
			this.name.first = faker.name.firstName(this.sex);
		}
		this.awake ??= true;
		this.energy ??= 100;
		this.memories ??= [];
		if(!this.age) {
			this.age = 0;
			this.memories.push({
				type: "birth",
				location: Game.current.name,
				time: {
					stamp: Game.current.clock.stamp,
					locale: Game.current.clock.toString()
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

	assignJob(task: Task) {
		this.job?.stopJob()
		this.job = task;
		this.job.claim(this);
	}

	get status() {
		if(this.job) {
			return this.job.status;
		} else {
			return this.awake ? chalk.bold.black('IDLE') : chalk.blue('RESTING')
		}
	}

	static serializationDependencies() {
		return [Task, ChopTreeTask]
	}

	toString() {
		if(this.name) {
			return this.name.first + ' ' + this.name.last;
		} else {
			return '[Object Pawn]';
		}
	}
}
