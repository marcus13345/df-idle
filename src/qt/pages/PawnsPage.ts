import { Game } from "@game";
import { Pawn } from "../../Pawn";
import { GridItem, ScrollPanel } from "../CustomWidgets";
import { addSplitText } from "../Util";


export class PawnsPage extends ScrollPanel {
  fill() {
    for(const pawn of Game.current.pawns) {
      this.addWidget(new PawnWidget(pawn));
    }
  }
}

class PawnWidget extends GridItem {
  constructor(pawn: Pawn) {
    super();

    addSplitText(
      this.layout,
      pawn.name.first + ' ' + pawn.name.last,
      pawn.status,
      0
    );
  }
}

// TODO remove later, when i know i dont need it
// class PawnPageWidget extends QListWidget {
//   constructor() {
//     super();
//     for (const pawn of Game.current.pawns) {
//       const pawnWidget = new PawnWidget(pawn);
//       const item = new QListWidgetItem();
//       this.addItem(item);
//       this.setItemWidget(item, pawnWidget);
//     }
//   }
// }

// class PawnPageWidget extends QWidget {

//   constructor() {
//     super();
//     this.setLayout(new QBoxLayout(Direction.TopToBottom));
//     // this.setLayout(new FlexLayout());

//     for(const pawn of Game.current.pawns) {
//       this.layout.addWidget(new PawnWidget(pawn));
//     }
//   }
// }