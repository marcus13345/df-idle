import { Task } from "@tasks";
import { Game } from '@game';
import { ARROWHEAD, FLINT_NORMAL, SLATE, STICK } from '../items/CoreItems.js';
import { ItemState } from "@items";
import { Popup } from "../../../src/ui/Popup.js";
import { inspect } from 'util';
import { Place, ResourceNode } from "@world";

// export const GATHER_FLINT = new Task('core:gather-flint')
//   .setName('Gather Flint')
//   .setStatus('SCAVENGING')
//   .setWork(1000)
//   .setTasklistVisibility(true)
//   .setCategory("work")
//   .setCompletionEvent(() => {
//     const qty = Math.floor(Math.random() * 5) + 1;
//     Game.current.inv.add(new ItemState(FLINT_NORMAL, 1, null));
//   });

// export const MAKE_ARROWHEAD = new Task<{
//   baseMaterial: ItemState<any>
// }>('core:gather-slate')
//   .setName('Craft Arrowhead')
//   .setStatus('CRAFTING')
//   .setWork(1000)
//   .setTasklistVisibility(true)
//   .setCategory("craft")
//   .setCompletionEvent((data) => {
//     const itemState = new ItemState(ARROWHEAD, 1, {
//       baseMaterial: data.baseMaterial
//     });
//     Game.current.inv.add(itemState);
//   });

export const Forest = new Place()
  .setName('Forest')
  .setId('core:forest')
  .setFrequency(1)
  .setHabitable(true)
  .populateResources(() => [
    new ResourceNode(new ItemState(STICK, 10_000))
  ])