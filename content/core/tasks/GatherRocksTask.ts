import { Task, registerTask } from "@tasks";
import chalk from 'chalk';
import { Game } from '@game';
import { FLINT_NORMAL, SLATE_NORMAL } from '../items/Items.js';

registerTask('core:gather-flint', class GatherFlintTask extends Task {
  work = 1000;
  
  reward(): void {
    Game.current.inv.add(FLINT_NORMAL, 1);
  }

  get title() {
    return 'Gather Flint';
  }

  get status() {
    return 'SCAVENGING';
  }
});

registerTask('core:gather-slate', class GatherSlateTask extends Task {
  work = 1000;
  
  reward(): void {
    Game.current.inv.add(SLATE_NORMAL, 1);
  }

  get title() {
    return 'Gather Slate';
  }

  get status() {
    return 'SCAVENGING';
  }
});