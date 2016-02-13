var electron = window.require('electron');
var ipcRenderer = window.require('electron').ipcRenderer;
var remote = electron.remote;
var BrowserWindow = remote.BrowserWindow;

import { post } from './api'

export default function githubAuth() {
  return new Promise((resolve, reject) => {
    var authWindow = new BrowserWindow({
      width: 800,
      height: 600,
      'web-preferences': {
        'node-integration': false
      }
    });
    authWindow.loadURL('http://whatsgit-auth.apps.railslabs.com/login');

    authWindow.webContents.on('will-navigate', (event, url) => {
      handleCallback.call(this, url);
    });

    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      handleCallback.call(this, newUrl);
    });

    function handleCallback (url) {
      let regex = /token=([a-z0-9]+$)/
      if (regex.test(url)) {
        let [match, token] = url.match(regex)
        if (match) {
          authWindow.destroy()
          authWindow = null
          resolve(token)
        }
      }
    }

    // If "Done" button is pressed, hide "Loading"
    authWindow.on('close', () => {
      reject()
      authWindow.destroy();
    });
  })
}
