import { Item, ItemState } from "@items";
import { Place, ResourceNode } from "@world";
// import { STICK } from "../items/CoreItems.js";


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


export const STICK = new Item()
  .setName("Stick")
  .plural('Sticks')
  .setId('core:resources/stick')

export const Forest = new Place()
  .setName('Forest')
  .setId('core:forest')
  .setFrequency(1)
  .setHabitable(true)
  .populateResources(() => [
    new ResourceNode(new ItemState(STICK, 10_000))
  ])