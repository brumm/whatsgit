var electron = require('electron');
var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');
var windowStateKeeper = require('electron-window-state');
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  var mainWindowState = windowStateKeeper({
    defaultWidth: 1400,
    defaultHeight: 770
  });

  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      webSecurity: false
    }
  });

  mainWindowState.manage(mainWindow);

  var template = require('./menu-template');
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  var windowUrl = process.env.DEV
    ? 'http://0.0.0.0:8080/'
    : 'file://' + __dirname + '/index.html'

  console.log(windowUrl);
  mainWindow.loadURL(windowUrl);
  // mainWindow.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
