import { Task, registerTask } from "@tasks";
import chalk from 'chalk';
import { Game } from '@game';
import { LOG, STICK } from '../items/Items.js';

class FetchSticksTask extends Task {
  work = 100;
  reward(): void {
    Game.current.inv.add(STICK, 1);
  }

  get title() {
    return chalk.yellow('Chop Trees');
  }

  get status() {
    return chalk.yellow('LOGGING');
  }
}

registerTask('core:fetch-sticks', FetchSticksTask);