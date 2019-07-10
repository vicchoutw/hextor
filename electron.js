'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  let appUrl = `file://${__dirname}/dist/app.html`;
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600
  });

  mainWindow.loadURL(appUrl);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});