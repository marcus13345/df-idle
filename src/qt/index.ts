import {
  QMainWindow, WidgetEventTypes
} from '@nodegui/nodegui';
import { APPLICATION_NAME } from '../Constants.js';
import { LoadingView } from './LoadingView.js';
import { View } from './View.js';
export { GameView } from './GameView.js';
export { Popup } from './Popup.js';

export const win = new QMainWindow();
win.setFixedSize(800, 600);
win.setWindowTitle(APPLICATION_NAME);
win.setStyleSheet(`
  #root {
    background-color: black;
    height: '100%';
  }
  QPushButton {
    background: #333333;
  }
  QPushButton:pressed {
    background: cyan;
    color: black;
  }
  * {
    font-family: 'MxPlus IBM VGA 8x16';
    font-size: 16px;
  }
`);
win.show();
(global as any).win = win;
win.addEventListener(WidgetEventTypes.Paint, _ => _);
win.addEventListener(WidgetEventTypes.UpdateRequest, () => {
  console.log('sdfghj');
});
win.addEventListener('customContextMenuRequested', console.log)
win.addEventListener('objectNameChanged', console.log)
win.addEventListener('windowIconChanged', console.log)
win.addEventListener('windowTitleChanged', console.log)

setView(new LoadingView());

export function start() {

}

export function stop() {
  win.close();
}

export function setView(view: View) {
  view.addComponents();
}

export function setTitle(title: string) {

}

export function update() {

}

export function isStarted() {
  return win.isVisible();
}


// HACK this is bullshit, :)
function f() {
  win.repaint();
  win.update();
  setTimeout(f, 100);
}
f();