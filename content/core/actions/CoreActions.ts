import { registerAction } from '@actions';
import { Game } from '@game';
import { ItemState } from '@items';
import { TaskState } from '@tasks';
import { SelectItem } from '../../../src/ui/SelectItem.js';
import { FLINT_NORMAL } from '../items/CoreItems.js';
import { GATHER_FLINT, MAKE_ARROWHEAD } from '../tasks/CoreTasks.js';

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

registerAction('Create Arrowhead', () => {
  // const rock = new ItemState(FLINT_NORMAL, 1, null);
  const item = SelectItem.show()
  const task = new TaskState(MAKE_ARROWHEAD, {
    baseMaterial: rock
  });

  Game.current.board.addTask(task);
});

