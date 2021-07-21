import cluster from 'cluster';
import chokidar from 'chokidar';
import watch from 'watch';

let init: Function = null;
const hotReload = true;
let restartTimer: NodeJS.Timeout = null;

let worker: cluster.Worker = null;
function createWorker() {
  start();

  function start() {
    if (cluster.isMaster) {
      worker = cluster.fork();
      // console.log(worker);
      // worker.process.stdout.pipe(process.stdout);
      // worker.process.stderr.pipe(process.stderr);
      worker.on('message', (message) => {
        if(message === 'ipc-restart') {
          worker.on('exit', () => {
            setTimeout(createWorker, 0);
          });
          worker.kill();
        } else if (message === 'ipc-quit') {
          worker.on('exit', () => {
            process.exit(0);
          })
          worker.kill();
        }
      });
    }
  }
}

// from any cluster context, gracefully exit if needed, and begin anew!
export function restart() {
  if (cluster.isWorker) {
    process.send('ipc-restart');
  } else if(worker) {
    worker.on('exit', () => {
      setTimeout(createWorker, 0);
    })
    worker.kill();
  } else {
    createWorker();
  }
}

export function quit() {
  if (cluster.isWorker) {
    process.send('ipc-quit');
  }
}

export function start() {
  if(init) {
    if (cluster.isWorker) {
      init();
    } else {
      // TODO make hotreload actually bring a popup on the client
      // so that the user should press enter to enable a reload.
      if(hotReload) {
        function fileChange(f: watch.FileOrFiles) {
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
      } else {
        createWorker();
      }
    }
  }
}


export function setInitialize(fn: Function) {
  init = fn;
}