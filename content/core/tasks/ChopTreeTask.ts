import chalk from 'chalk';
import { Game } from '@game';
import { registerTask, Task } from '@tasks';
import { LOG } from '../items/Items.js';

// TODO cleanup imports, use aliases

class ChopTreeTask extends Task {
  work = 100;

  reward() {
    Game.current.inv.add(LOG, 1);
  }

  get title() {
    return chalk.yellow('Chop Trees');
  }

  get status() {
    return chalk.yellow('LOGGING');
  }
}


registerTask('core:chop-trees', ChopTreeTask);