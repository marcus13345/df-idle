import { Serializable } from 'frigid';
import { Task, TaskState } from './registries/Tasks.js';
import { render, Renderable, panels } from './ui/UI.js';

const taskTypes = {};

export class TaskList extends Serializable implements Renderable {
  tasks: TaskState<any>[] = [];

  clear() {
    for(const task of this.tasks) {
      this.removeTask(task);
    }
  }

  static serializationDependencies() {
    return [TaskState]
  }

  addTask(task: TaskState<any>) {
    this.tasks = [...this.tasks, task];
  }

  removeTask(task: TaskState<any>) {
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

// export function registerTask(name, clazz) {
//   taskTypes[name] = clazz;
// }