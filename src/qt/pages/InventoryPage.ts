import { Game } from "@game";
import { ItemState } from "@items";
import { GridItem, ScrollPanel } from "../CustomWidgets";
import { addSplitText } from "../Util";


export class InventoryPage extends ScrollPanel {
  fill() {
    for(const itemState of Game.current.inv.items) {
      this.addWidget(new ItemWidget(itemState))
    }
  }
}

class ItemWidget extends GridItem {
  constructor(itemState: ItemState<unknown>) {
    super();
    
    addSplitText(
      this.layout,
      itemState.name,
      '' + (itemState.qty),
      0
    );
  }
}