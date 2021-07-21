import chokidar from 'chokidar';
import cluster from 'cluster';
import { QMainWindow } from '@nodegui/nodegui';
import { watchFile } from 'fs';
import watch from 'watch';

if(cluster.isMaster) {
  cluster.fork();
} else {
  // chokidar.watch('test.js', {
  //   useFsEvents: false,
  //   usePolling: false,
  //   ""
  // }).on('all', (a, b) => console.log(a, b));
  watch.watchTree('out', console.log);
  // watchFile('test.js', console.log)
}

