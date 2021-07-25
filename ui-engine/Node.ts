export abstract class Node {
  x: number;
  y: number;
  w: number;
  h: number;
  children: Node[]

  constructor() {
    this.children = [];
  }

  layout(w: number, h: number) {
    this.w = w;
    this.h = h;

    this.onResize(w, h);

    this.children.forEach(node => node.layout(w, h));
  }

  append(child: Node) {
    this.children.push(child);
    this.layout(this.w, this.h);
  }

  abstract render(x: number, y: number): [number, string];

  abstract onResize(w: number, h: number): void
}


export class TextNode extends Node {
  _content: string;

  constructor(content: string) {
    super();
    this.content = content;
  }

  set content(val: string) {
    this._content = val
    this.layout(this.w, this.h);
  }

  onResize(w: number, h: number): void {
    return;
  }

  render(x: number, y: number): [number, string] {
    if(y !== this.y) return null;
    if(x < this.x) return null;
    if(x > this.x + this.content.length) return null;
    return [0, this.content[x - this.x]];
  }
}