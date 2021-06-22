import { registerAction } from '@actions';
import { Game } from '@game';

registerAction('Gather Rocks', (qty) => {
  Game.current.board.addTask({
    taskId: 'core:gather-rocks',
    options: {}
  })
});
