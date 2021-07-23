import ipc from 'node-ipc';
import {
  IPC_CLIENT_CONNECT_NAME,
  IPC_CLIENT_APPSAPCE,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT
} from './Constants.js';

const name = IPC_CLIENT_CONNECT_NAME;
ipc.config.appspace = IPC_CLIENT_APPSAPCE;
ipc.config.silent = true;

let connected = false;

ipc.connectTo(name, () => {
  ipc.of[name].on('connect', () => connected = true);
  ipc.of[name].on('disconnect', () => connected = false);
});

export function quit() {
  if (connected) {
    ipc.of[name].emit(IPC_QUIT_EVENT);
  } else {
    process.exit(0);
  }
}

export function restart() {
  if (connected) {
    ipc.of[name].emit(IPC_RESTART_EVENT);
  } else {
    process.exit(1);
  }
}