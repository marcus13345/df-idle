import ipc from 'node-ipc';
import {
  IPC_PATH,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT
} from './Constants.js';
import { spawn, ChildProcess } from 'child_process';
import watch from 'watch';

ipc.config.silent = true;

const exec = 'qode';
const args = [
  ...process.execArgv,
  'out/src/index.js'
]

ipc.serve(IPC_PATH, () => {
  ipc.server.on(IPC_QUIT_EVENT, async () => {
    await killProcess();
    ipc.server.stop();
    process.exit(0);
  });
  ipc.server.on(IPC_RESTART_EVENT, restart)
});

ipc.server.start();

let proc: ChildProcess = null;

function startProcess() {
  console.log('starting process...');
  proc = spawn(exec, args, {
    stdio: 'inherit'
  });
  proc.on('exit', () => {
    console.log('process died');
    proc = null;
  })
}

async function killProcess() {
  if(proc) {
    console.log('killing process...');
    const killedPromise = new Promise((res) => {
      proc.on('exit', () => {
        res(void 0);
      })
    })
    proc.kill();
    await killedPromise;
    proc = null;
  }
}

async function restart() {
  await killProcess();
  startProcess();
}

startProcess();

let restartTimer: NodeJS.Timeout = null;

function fileChange() {
  console.log('changes detected');
  // appendFileSync('log.log', evt + ' ' + path + '\n');
  // console.log(cluster.isMaster, evt, path);
  if(restartTimer) clearTimeout(restartTimer)
  restartTimer = setTimeout(() => {
    restart();
    restartTimer = null;
  }, 1000);
}
// chokidar.watch('./out').on('all', fileChange);
watch.watchTree('./out', fileChange);