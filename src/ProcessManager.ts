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
      console.log('client sending quit event')
      ipc.of[name].emit(IPC_QUIT_EVENT);
      process.exit(0);
    } else {
      process.exit(0);
    }
  }

  restart() {
    if (connected) {
      console.log('client emitting ipc restart')
      ipc.of[name].emit(IPC_RESTART_EVENT);
      process.exit(0);
    } else {
      console.log('eh?! not connected to tower... closing')
      process.exit(0);
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

/////////////