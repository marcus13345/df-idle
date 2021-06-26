import { Task } from "@tasks";
import { Game } from '@game';
import { FLINT_NORMAL, SLATE_NORMAL } from '../items/CoreItems.js';
import { ItemState } from "@items";
import { Popup } from "../../../src/ui/Popup.js";
import { inspect } from 'util';

export const GATHER_FLINT = new Task('core:gather-flint')
  .setName('Gather Flint')
  .setStatus('SCAVENGING')
  .setWork(1000)
  .setTasklistVisibility(true)
  .setCategory("work")
  .setCompletionEvent(() => {
    const qty = Math.floor(Math.random() * 5) + 1;
    Game.current.inv.add(new ItemState(FLINT_NORMAL, 1, null));
  });

export const MAKE_ARROWHEAD = new Task<{
  baseMaterial: ItemState
}>('core:gather-slate')
  .setName('Gather Slate')
  .setStatus('SCAVENGING')
  .setWork(1)
  .setTasklistVisibility(true)
  .setCategory("work")
  .setCompletionEvent((data) => {
    Popup.show(inspect(data));
  });