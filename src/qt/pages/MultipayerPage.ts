import network from "../../multiplayer/mDNS";
import { Player } from "../../multiplayer/Player";
import { GridItem, ScrollPanel } from "../CustomWidgets";
import { addSplitText } from "../Util";


class MultiplayerPlayerWidget extends GridItem {
  constructor(player: Player) {
    super();
    addSplitText(
      this.layout,
      player.name,
      player.host + ':' + player.port,
      0
    )
  }
}

export class MultiplayerPage extends ScrollPanel {
  constructor() {
    super();
    network.on('change', () => {
      this.refill();
    })
  }
  fill(): void {
    for(const player of network.players) {
      this.addWidget(new MultiplayerPlayerWidget(player))
    }
  }
}