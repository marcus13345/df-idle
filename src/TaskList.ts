import { Serializable } from 'frigid';
import { ChopTreeTask } from "./tasks/ChopTreeTask.js";
import { Game } from './Game.js';
import { Task } from "./tasks/Task.js";
import { render, Renderable, tasksPanel } from './ui/UI.js';

export class TaskList extends Serializable implements Renderable {
	tasks: Task[] = [];

	clear() {
		for(const task of this.tasks) {
			this.removeTask(task);
		}
	}

	static serializationDependencies() {
		return [ChopTreeTask, Task];
	}

	addTask(task) {
		this.tasks = [...this.tasks, task];
	}

	removeTask(task) {
		this.tasks = this.tasks.filter(v => v !== task);
	}

	render() {
		// const width = tasksPanel.width;
		tasksPanel.setContent(`${this.tasks.map(task => {
			return task.toString();
		}).join('\n')}`);
		// return this.tasks.map(task => task.toString()).join('\n');
	}
}
