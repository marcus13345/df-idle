import ipc from 'node-ipc';
import {
  IPC_PATH,
  IPC_QUIT_EVENT,
  IPC_RESTART_EVENT,
  IPC_REQUEST_RESTART
} from './Constants.js';
import { spawn, ChildProcess } from 'child_process';
import watch from 'watch';
import chokidar from 'chokidar';
import chalk from 'chalk';

// ipc.config.silent = true;

const exec = 'qode' + (process.platform === "win32" ? '.cmd' : '');
const args = [
  'bin/app.bundle.cjs'
]

ipc.serve(IPC_PATH, () => {
  ipc.server.on(IPC_QUIT_EVENT, async () => {
    await killProcess();
    ipc.server.stop();
    process.exit(0);
  });
  ipc.server.on(IPC_RESTART_EVENT, restart)
});

console.log('started ipc tower server!')
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
      proc.on('exit', (code, sig) => {
        res(code || sig);
      })
    })
    proc.kill();
    console.log('process died with code', await killedPromise);
    proc = null;
    console.log()
  }
}

async function restart() {
  console.log('received restart event');
  await killProcess();
  console.log('')
  startProcess();
}

startProcess();

let restartTimer: NodeJS.Timeout = null;

function fileChange() {
  // appendFileSync('log.log', evt + ' ' + path + '\n');
  // console.log(cluster.isMaster, evt, path);
  if(restartTimer) clearTimeout(restartTimer)
  restartTimer = setTimeout(() => {
    console.log('changes detected');
    if(proc) {
      ipc.server.broadcast(IPC_REQUEST_RESTART);
    } else {
      startProcess();
    }
    restartTimer = null;
  }, 100);
}
chokidar.watch('./out').on('all', fileChange);
// watch.watchTree('./bin', fileChange);


