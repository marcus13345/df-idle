import { ensureDirSync } from 'fs-extra';
import { appendFileSync, lstatSync } from 'fs';
import { parse, resolve } from 'path';
import walkSync from 'walk-sync';
import { fileURLToPath } from 'url';
import { Game } from '@game';
import { isStarted, stop, render } from '@ui';
import { writeFileSync } from 'fs';
import ansi from 'sisteransi';
import { spawn } from 'child_process';
import cluster from 'cluster';
import chokidar from 'chokidar';

const hotReload = true;
let restartTimer: NodeJS.Timeout = null;

let worker: cluster.Worker = null;
function createWorker() {
  start();

  function start() {
    if (cluster.isMaster) {
      worker = cluster.fork();
      worker.on('message', (message) => {
        if(message === 'ipc-restart') {
          worker.on('exit', () => {
            setTimeout(createWorker, 0);
          })
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

if (cluster.isWorker) {
  begin();
} else {
  // TODO make hotreload actually bring a popup on the client
  // so that the user should press enter to enable a reload.
  if(hotReload) {
    chokidar.watch('./out').on('all', (evt, path) => {
      appendFileSync('log.log', evt + ' ' + path + '\n');
      if(restartTimer) clearTimeout(restartTimer)
      restartTimer = setTimeout(() => {
        restart();
        restartTimer = null;
      }, 1000);
    })
  } else {
    createWorker();
  }
}

async function begin() {
  console.clear();

  function gracefulShutdown() {
    if (isStarted()) {
      stop();
    }
    console.log('shutting down gracefully...');
    if (Game.current) {
      console.log('saving world...');
      Game.current.sync();
    }
    console.log('exitting');
    process.stdout.write(ansi.cursor.show);

    process.exit(0);
  }

  process.on('exit', gracefulShutdown);

  const saveFile = process.argv[2] || 'data/world01.json';

  ensureDirSync(parse(saveFile).dir);


  // TODO extract extension loading into separate file
  console.log('df-idle: Loading extensions');
  const extensionsPath = resolve(parse(fileURLToPath(import.meta.url)).dir, '../content');

  const extensions = walkSync(extensionsPath)
    .map(path => [path, resolve(extensionsPath, path)])
    .filter(path => lstatSync(path[1]).isFile())
    .filter(path => parse(path[1]).ext === '.js');

  console.log('found', extensions.length, 'extensions');

  for (const path of extensions) {
    console.log('=== [', path[0], '] ===');
    await import(path[1]);
    console.log();
  }

  console.log('Setup Complete.');


  for (let seconds = 2; seconds > 0; seconds--) {
    process.stdout.write('Starting DF-Idle in ' + seconds + '\r');
    await new Promise(res => setTimeout(res, 1000));
  }
  console.clear();

  // TODO move render logic into game, so that the ui doesnt exist until the game does...
  // maybe, i mean, an argument could be made for not that, because the game
  // isnt necessarily the entire thing, its just one instance of a save file.
  // But probably the initial menu screens will be their own thing entirely.
  const game = Game.create(saveFile);

}