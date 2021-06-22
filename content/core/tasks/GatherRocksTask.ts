import { Task, registerTask } from "@tasks";
import chalk from 'chalk';
import { Game } from '@game';
import { ROCK } from '../items/Items.js';

class GatherRocksTask extends Task {
  work = 100;
  
  reward(): void {
    Game.current.inv.add(ROCK, 1);
  }

  get title() {
    return chalk.yellow('Chop Trees');
  }

  get status() {
    return chalk.yellow('LOGGING');
  }
}

registerTask('core:gather-rocks', GatherRocksTask);