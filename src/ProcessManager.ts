import chalk from 'chalk';
import EventEmitter from 'events';
import ipc from 'node-ipc';
import {
  IPC_CLIENT_CONNECT_NAME,
  IPC_CLIENT_APPSPACE,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT,
  IPC_REQUEST_RESTART
} from './Constants.js';

ipc.config.appspace = IPC_CLIENT_APPSPACE;
ipc.config.silent = true;

const oldConsoleLog = console.log;

const patchLog = () => console.log = console.log.bind(console, chalk.cyan('[CLIENT]'));
const restoreLog = () => console.log = oldConsoleLog;

// const log = (...args: any[]) => console.log(chalk.cyan('[CLIENT]'), ...args);

class ProcessManagerClass extends EventEmitter {

  processLock = Promise.resolve();
  // TODO replace this with an async sortof
  // event emitter, to wait for all clean up

  connected = false;

  constructor() {
    super();
    ipc.connectTo(IPC_CLIENT_CONNECT_NAME, () => {
      ipc.of[IPC_CLIENT_CONNECT_NAME].on('connect', this.onConnect.bind(this));
      ipc.of[IPC_CLIENT_CONNECT_NAME].on('disconnect', this.onDisconnect.bind(this));
      ipc.of[IPC_CLIENT_CONNECT_NAME].on(IPC_REQUEST_RESTART, this.onReloadRequested.bind(this));
    });
  }

  private onReloadRequested() {
    this.emit('reload');
  }

  private onConnect() {
    this.connected = true;
    this.emit('change');
    patchLog();
  }

  private onDisconnect() {
    this.connected = false;
    this.emit('change');
    restoreLog();
  }

  quit() {
    this.emit('shutdown');
    this.processLock.then(() => {
      process.exit(0);
    })
  }

  restart() {
    this.emit('shutdown');
    if (this.connected) {
      ipc.of[IPC_CLIENT_CONNECT_NAME].emit(IPC_RESTART_EVENT);
    }
    setTimeout(() => {
      process.exit(0);
    })
  }
}

export const ProcessManager = new ProcessManagerClass();

process.on('SIGTERM', () => ProcessManager.quit());
process.on('SIGINT', () => ProcessManager.quit());
process.on('beforeExit', () => ProcessManager.quit());

// HACK dumbass hack hahahah :)
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