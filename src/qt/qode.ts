
import {
  QMainWindow,
  QWidget,
  QGridLayout,
  QPushButton
} from '@nodegui/nodegui';
import chokidar from 'chokidar';

import cluster from 'cluster';
import { watchFile } from 'fs';
if (cluster.isMaster) cluster.setupMaster();
import { setInitialize, start } from '../Clustering.js';


setInitialize(() => {

  const win = new QMainWindow();
  win.setFixedSize(800, 600);
  win.setWindowTitle("Hello World");
  const centralWidget = new QWidget();
  centralWidget.setObjectName("myroot");
  win.setCentralWidget(centralWidget);
  const rootLayout = new QGridLayout();
  // rootLayout.addWidget
  
  centralWidget.setLayout(rootLayout);

  

  const button = new QPushButton();
  button.setText('Testing Font Family');
  rootLayout.addWidget(button);
  
  win.setStyleSheet(`
    #myroot {
      background-color: black;
      height: '100%';
    }
    QPushButton {
      background: #333333;
    }
    QPushButton:pressed {
      background: cyan;
      color: black;
    }
    * {
      font-family: 'MxPlus IBM VGA 8x16';
      font-size: 16px;
    }
  `);
  win.show();
});
start();
