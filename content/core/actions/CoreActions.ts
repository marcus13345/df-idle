import { registerAction } from '@actions';
import { Game } from '@game';
import { ItemState } from '@items';
import { TaskState } from '@tasks';
import { FLINT_NORMAL } from '../items/CoreItems.js';
import { GATHER_FLINT, MAKE_ARROWHEAD } from '../tasks/CoreTasks.js';

// registerAction('Gather Flint', (qty) => {
//   Game.current.board.addTask({
//     taskId: 'core:gather-flint',
//     options: {}
//   })
// });

// registerAction('Gather Slate', (qty) => {
//   Game.current.board.addTask({
//     taskId: 'core:gather-slate',
//     options: {}
//   })
// });

registerAction('Gather Flint', () => {
  const taskState = new TaskState(GATHER_FLINT);
  Game.current.board.addTask(taskState);
});

registerAction('Create Arrowhead', (qty) => {
  const rock = new ItemState(FLINT_NORMAL, 1, null);
  const task = new TaskState(MAKE_ARROWHEAD, {
    baseMaterial: rock
  });

  Game.current.board.addTask(task);
});

