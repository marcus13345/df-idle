import {
  QMainWindow, WidgetEventTypes
} from '@nodegui/nodegui';
import { APPLICATION_NAME } from '../Constants.js';
import { ProcessManager } from '../ProcessManager.js';
import { LoadingView } from './LoadingView.js';
import { RequestReloadPopup } from './RequestReloadPopup.js';
import { View } from './View.js';
export { GameView } from './GameView.js';
export { Popup } from './Popup.js';

export const win = new QMainWindow();
win.setFixedSize(800, 600);
win.setWindowTitle(APPLICATION_NAME);
// win.setStyleSheet(`
//   QTabWidget::tab {
//     bottom: 2px;
//   }
// `);
win.show();
(global as any).win = win;
win.addEventListener(WidgetEventTypes.Paint, _ => _);
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
  return true;
  return win.isVisible();
}

ProcessManager.on('reload', () => {
  RequestReloadPopup.show();
  //
});


// HACK this is bullshit, :)
function f() {
  win.repaint();
  win.update();
  setTimeout(f, 100);
}
f();