import chalk from 'chalk';
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
const oldConsoleLog = console.log;

const patchLog = () => console.log = console.log.bind(console, chalk.cyan('[CLIENT]'));
const restoreLog = () => console.log = oldConsoleLog;

// const log = (...args: any[]) => console.log(chalk.cyan('[CLIENT]'), ...args);

class ProcessManagerClass extends EventEmitter {

  processLock = Promise.resolve();
  // TODO replace this with an async sortof
  // event emitter, to wait for all clean up

  quit() {
    this.emit('shutdown');
    this.processLock.then(() => {
      process.exit(0);
    })
  }

  restart() {
    this.emit('shutdown');
    if (connected) {
      ipc.of[name].emit(IPC_RESTART_EVENT);
    }
    setTimeout(() => {
      process.exit(0);
    })
  }

  get connected() {
    return connected;
  }
}

export const ProcessManager = new ProcessManagerClass();

const name = IPC_CLIENT_CONNECT_NAME;
ipc.config.appspace = IPC_CLIENT_APPSAPCE;
ipc.config.silent = true;

ipc.connectTo(name, () => {
  ipc.of[name].on('connect', () => {
    connected = true;
    patchLog();
  });
  ipc.of[name].on('disconnect', () => {
    connected = false
    restoreLog();
  });
  ipc.of[name].on(IPC_REQUEST_RESTART, () => {
    console.log('received restart request');
    // ProcessManager.restart();
    ProcessManager.emit('reload');
  })
});

process.on('SIGKILL', () => ProcessManager.quit());
process.on('SIGTERM', () => ProcessManager.quit());
process.on('SIGINT', () => ProcessManager.quit());
// process.on('exit', () => ProcessManager.quit());
process.on('beforeExit', () => ProcessManager.quit());

// dumbass hack hahahah :)
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    // @ts-ignore dont know why, dont fuckin care
    process.emit("SIGINT");
  });
}
///