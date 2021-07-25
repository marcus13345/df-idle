import { Frigid, Serializable } from 'frigid';
import { Pawn } from './Pawn.js';
import { TaskList } from './TaskList.js';
import { Inventory } from './Inventory.js';
import Time, { Tickable } from './Time.js';
import { setTitle, start, update } from '@ui';
import { ready } from './multiplayer/mDNS.js';
import faker from 'faker';
import { World } from '@world';

let game: Game = null;

export class Game extends Frigid implements Tickable {
  pawns: Pawn[] = [];
  selected: Pawn;
  inventory: Inventory;
  board: TaskList;
  clock: Time;
  name: string;
  world: World;

  static get current(): Game {
    if (!game) throw new Error('Somehow called a game before it existed?');
    return game;
  }

  async tick() {
    for(const pawn of this.pawns) {
      pawn.tick();
    }
    update();
  }

  get inv() { return this.inventory; }

  removePawn(pawn: Pawn) {
    if(pawn === this.selected) {
      if(this.pawns.indexOf(this.selected) === this.pawns.length - 1) this.advanceSelection(-1);
      else this.advanceSelection(1);
    }

    this.pawns = this.pawns.filter(testPawn => {
      return pawn !== testPawn;
    });
  }

  advanceSelection(number: number) {
    let index = this.pawns.indexOf(this.selected);
    this.selected = this.pawns[Math.min(Math.max(index + number, 0), this.pawns.length - 1)];
  }
  
  ctor () {
    game = this;
    start();
    this.name ??= faker.address.city();
    setTitle(this.name);
    this.world ??= new World();
    this.pawns ??= [];
    this.selected ??= this.pawns[0] || null;
    this.board ??= new TaskList();
    this.inventory ??= new Inventory();
    this.inventory.validate();
    this.clock ??= new Time();
    this.clock.thing = this;
    this.clock.start();
    ready(this.name);
  }

  static serializationDependencies() {
    return [ Pawn, Inventory, TaskList, Time, World ];
  }
}
