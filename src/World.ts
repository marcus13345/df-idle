import { ItemState } from "@items";
import { Serializable } from "frigid";

export class World extends Serializable {

}

class WorldItemState {
  itemState: ItemState<any>

  constructor() {
    
  }
}