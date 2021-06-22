import { Serializable } from 'frigid';
import { Task, taskClasses } from './registries/Tasks.js';
import { render, Renderable, panels } from './ui/UI.js';

export class TaskList extends Serializable implements Renderable {
	tasks: Task[] = [];

	clear() {
		for(const task of this.tasks) {
			this.removeTask(task);
		}
	}

	static serializationDependencies() {
		return Array.from(taskClasses.values());
	}

	addTask({taskId, options}: TaskOptions) {
    if(!taskClasses.has(taskId))
      throw new Error('unknown task: ' + taskId);

    const taskClass = taskClasses.get(taskId);
    const task = new taskClass();
    
		this.tasks = [...this.tasks, task];
	}

	removeTask(task) {
		this.tasks = this.tasks.filter(v => v !== task);
	}

	render() {
		// const width = tasksPanel.width;
		panels.left.setContent(`${this.tasks.map(task => {
			return task.toString();
		}).join('\n')}`);
		// return this.tasks.map(task => task.toString()).join('\n');
	}
}

const taskTypes = {};
export function registerTask(name, clazz) {
  taskTypes[name] = clazz;
}

export type TaskOptions = {
  taskId: string,
  options: any
}