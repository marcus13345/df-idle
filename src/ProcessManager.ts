import EventEmitter from 'events';
import ipc from 'node-ipc';
import {
  IPC_CLIENT_CONNECT_NAME,
  IPC_CLIENT_APPSAPCE,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT,
  IPC_REQUEST_RESTART
} from './Constants.js';

let connected = false;

class ProcessManagerClass extends EventEmitter {
  quit() {
    if (connected) {
      ipc.of[name].emit(IPC_QUIT_EVENT);
    } else {
      process.exit(0);
    }
  }

  restart() {
    if (connected) {
      ipc.of[name].emit(IPC_RESTART_EVENT);
    } else {
      process.exit(1);
    }
  }
}

export const ProcessManager = new ProcessManagerClass();

const name = IPC_CLIENT_CONNECT_NAME;
ipc.config.appspace = IPC_CLIENT_APPSAPCE;
ipc.config.silent = true;

ipc.connectTo(name, () => {
  ipc.of[name].on('connect', () => connected = true);
  ipc.of[name].on('disconnect', () => connected = false);
  ipc.of[name].on(IPC_REQUEST_RESTART, () => {
    ProcessManager.emit('reload');
  })
});