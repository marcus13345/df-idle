import ipc from 'node-ipc';
import {
  IPC_PATH,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT,
  IPC_REQUEST_RESTART
} from './Constants.js';
import { spawn, ChildProcess } from 'child_process';
import chokidar from 'chokidar';
import chalk from 'chalk';
ipc.config.silent = true;


// should be obtained from process spawn args, but whatever!
const exec = 'qode' +
  (process.platform === "win32" ? '.cmd' : '');
const args = [
  'bin/app.bundle.cjs'
];

const log = console.log.bind(console, chalk.green('[TOWER]'));

// varying state data
let connected = 0;
let proc: ChildProcess = null;
let restartTimer: NodeJS.Timeout = null;

function ensureAlive() {
  if(proc) {
    return;
  }

  proc = spawn(exec, args, {
    stdio: 'inherit'
  });
  proc.once('exit', () => {
    proc = null;
  });
  log(`[${
    proc.pid
  }] ${
    chalk.grey(`${
      exec
    } ${
      args.join(' ')
    }`)
  }`);
}

async function ensureDead() {
  if(!proc) {
    return;
  }
  const killedPromise =
    new Promise(res => proc.once('exit', res));
  proc.kill(9);
  await killedPromise;
  proc = null;
}

async function restart() {
  await ensureDead();
  ensureAlive();
}

function fileChange() {
  if(restartTimer) clearTimeout(restartTimer)
  restartTimer = setTimeout(() => {
    ensureAlive();
    ipc.server.broadcast(IPC_REQUEST_RESTART);
    restartTimer = null;
  }, 100);
}

// start the server, connect events
ipc.serve(IPC_PATH, () => {
  ipc.server.on(IPC_QUIT_EVENT, ensureDead);
  ipc.server.on(IPC_RESTART_EVENT, restart);
  ipc.server.on('connect', () => connected ++);
  ipc.server.on('disconnect', () => connected --);
});
ipc.server.start();

// open the process
ensureAlive();

//begin watching for files, ignore changes on boot.
chokidar.watch('./out', {
  ignoreInitial: true
}).on('all', fileChange);