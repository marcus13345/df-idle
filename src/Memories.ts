import { Game } from "@game";
import { Pawn } from "./Pawn.js";

export function injectTravelMemory(target: Pawn) {
  return {
    type: "travel",
    time: {
      age: target.age,
      locale: Game.current.clock.toString()
    },
    location: Game.current.name
  }
}

function injectMemory(pawn: Pawn, memory: any) {
  pawn.memories.push(memory);
}