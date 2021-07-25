import ipc from 'node-ipc';
import {
  IPC_PATH,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT,
  IPC_REQUEST_RESTART
} from './Constants.js';
import { spawn, ChildProcess } from 'child_process';
import watch from 'watch';
import chalk from 'chalk';

ipc.config.silent = true;

const exec = 'yarn';
const args = [
  'start'
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
  proc = spawn(exec, args, {
    stdio: 'inherit'
  });
  console.log(`[${proc.pid}] ${chalk.grey(`${exec} ${args.join(' ')}`)}`);
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
    ipc.server.broadcast(IPC_REQUEST_RESTART);
    restartTimer = null;
  }, 1000);
}
// chokidar.watch('./out').on('all', fileChange);
watch.watchTree('./bin', fileChange);