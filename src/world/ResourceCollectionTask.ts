import { Task } from "@tasks"
import { ResourceNode } from "@world";

type Data = {
  qty: number,
  node: ResourceNode
};

type State = {
  workCounter: number
}

export const RESOURCE_COLLECTION_TASK =
  new Task<Data, State>('core:resource-collection-task')
  .setName('Collect Resources')
  .setFunction(((taskState, dTime) => {
    
  }))
  .setToString((data, state) => {
    return 'Collect ' +
      data.qty +
      ' ' +
      (data.qty === 1 ? data.node.resources.item.name.singular : 
        data.node.resources.item.name.plural) +
      ' from ' +
      data.node.place.place.name;
  })
  .setInitiate((data: Data) => {
    return {
      workCounter: 0
    }
  });