import { getTheme } from "@themes";
import { Renderable } from "../ui/UI.js";

export const actions: Action[] = [];

export function registerAction(name: string, invoke: (qty: number) => void) {
  console.log('Registered action', name);
  actions.push(new Action(name, invoke))  
}

export class Action {
  name: string;
  qty: number;
  invoke: (qty: number) => void;
  
  constructor(name: string, done: (qty: number) => void) {
    this.name = name;
    this.invoke = done;
  }
}