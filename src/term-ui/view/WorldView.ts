import { Game } from "@game";
import { View } from "../View.js";

export default class WorldResourcesView extends View {
  constructor() {
    super();
    this.name = 'World'
  }
  render(): string {
    return `Explored: ${
      Game.current.world.distanceExplored.toFixed(3)
    } km\n${
      Game.current.world.places?.map(place => `  ${
        place.placeId
      } (${place.x}, ${place.y})\n${
        place.resources.map(resourceNode => `    ${
          resourceNode.resources.render()
        }`)
      }`)
    }`
  }
  keypress(key: { full: string; }): void {
    if(key.full === 'enter') {
      Game.current.world.home.resources[0].request(10);
    }
  }
}