// OPE Desktop Application
// Copyright (C) 2020-2023  Motagamwala Taha Arif Ali

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';
import { readFileSync } from 'fs';

import { datatransfer, startIPCHandlers } from './ipc';
import { Deeplink } from './deeplink';
import { split, urlcheck } from './urlchecking';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: resolve(__dirname, 'icons/icon.png'),
    width: 1000,
    height: 700,
    show: false,
    useContentSize: true,
    frame: false,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      allowRunningInsecureContent: false,
      webSecurity: true,
      webviewTag: false,
      navigateOnDragDrop: false,
      enableWebSQL: false,
      preload: resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.setContentProtection(true);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  const dl = new Deeplink({
    mainWindow: mainWindow,
    app: app,
    protocol: 'ope',
    isDev: true,
    electronPath: process.execPath,
  });

  dl.on('received', (link) => {
    try {
      readFileSync('./data.ope');
      if (check(link)) {
        const url = new URL(link);
        const payload = {
          accesstoken: '',
          refreshtoken: '',
          userType: '',
          name: '',
        };
        url.searchParams.forEach((v, k) => {
          if (k === 'refreshtoken') payload.refreshtoken = v;
          if (k === 'accesstoken') payload.accesstoken = v;
          if (k === 'user') payload.userType = v;
          if (k === 'name') payload.name = v;
        });
        datatransfer(payload);
      }
    } catch (error) {}
  });
}

app.enableSandbox();

app.whenReady().then(() => {
  startIPCHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

const check = (value: string) => {
  if (!urlcheck(value)) {
    return;
  }

  let splitted: RegExpMatchArray | null = [''];
  let scheme = '';
  let authority = '';
  let path = '';
  let port = '';
  let query = '';
  let out = '';

  splitted = split(value);
  if (splitted === null) return;
  scheme = splitted[1];
  authority = splitted[2];
  path = splitted[3];
  query = splitted[4];

  if (!scheme) return;

  if (scheme.toLowerCase() != 'ope') return;

  if (!authority) {
    return;
  }

  if (/:(\d+)$/.test(authority)) {
    const p_n = authority.match(/:(\d+)$/);
    if (p_n === null) return;
    port = p_n[0];
    authority = authority.replace(/:\d+$/, '');
  }

  out += scheme + ':';
  out += '//' + authority;

  if (port) {
    out += port;
  }

  out += path;

  if (query && query.length) {
    out += '?' + query;
  }

  return out;
};
