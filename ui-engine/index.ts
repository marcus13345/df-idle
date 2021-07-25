import ansi from 'sisteransi';
import { Node, TextNode } from './Node.js';


const TERMINAL_HIGH_BUFFER = '\x1b[?1049h';
const TERMINAL_LOW_BUFFER = '\x1b[?1049l'

class Screen extends Node {
  buffer: ArrayBuffer;
  bufferView: Uint8Array;
  paletteBuffer: ArrayBuffer;
  paletteBufferView: Uint8Array;

  constructor() {
    super();
    process.stdout.write(TERMINAL_HIGH_BUFFER);
    process.stdout.write(ansi.cursor.hide);
    this.layout(process.stdout.columns, process.stdout.rows);
  }

  onResize(w: number, h: number) {
    this.buffer = new ArrayBuffer(w * h);
    this.bufferView = new Uint8Array(this.buffer);
    this.paletteBuffer = new ArrayBuffer(w * h);
    this.paletteBufferView = new Uint8Array(this.paletteBuffer);
  }

  // paletteAt(x: number, y: number) {
    
  // }

  offset(x: number, y: number) {
    return y * this.h + x
  }

  updateTerminal() {
    process.stdout.write(ansi.cursor.to(0, 0))
    for(let y = 0; y < this.h; y ++) {
      for(let x = 0; x < this.w; x ++) {

      }
      process.stdout.write('\r\n')
    }
  }

  render(x: number, y: number): [number, string] {
    throw new Error('Method not implemented.');
  }

  destroy() {
    process.stdout.write(TERMINAL_LOW_BUFFER);
    process.stdout.write(ansi.cursor.show);
  }
}

// class Palette {

// }


const screen = new Screen();
screen.append(new TextNode('Test'))