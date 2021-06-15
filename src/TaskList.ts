import { Serializable } from 'frigid';
import { ChopTreeTask } from "./ChopTreeTask.js";
import { Game } from './Game.js';
import { Task } from "./Task.js";
import { render, Renderable, tasksPanel } from './UI.js';

export class TaskList extends Serializable implements Renderable {
	tasks: Task[] = [];
	game: Game;

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
