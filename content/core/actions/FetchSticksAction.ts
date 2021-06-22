import { registerAction } from '@actions';
import { Game } from '@game';

registerAction('Fetch Sticks', (qty) => {
  Game.current.board.addTask({
    taskId: "core:fetch-sticks",
    options: {}
  })
});