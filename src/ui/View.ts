import { Renderable } from './UI.js';
import { KeypressAcceptor } from './Menu.js';

export abstract class View implements Renderable, KeypressAcceptor {
  abstract render(): void;
  abstract keypress(key: { full: string; }): void;

  name: string;
}
