import { registerAction } from '@actions';
import { Game } from '@game';

registerAction('Gather Flint', (qty) => {
  Game.current.board.addTask({
    taskId: 'core:gather-flint',
    options: {}
  })
});

registerAction('Gather Slate', (qty) => {
  Game.current.board.addTask({
    taskId: 'core:gather-slate',
    options: {}
  })
});

registerAction('Fetch Sticks', (qty) => {
  Game.current.board.addTask({
    taskId: "core:fetch-sticks",
    options: {}
  })
});