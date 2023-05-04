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
/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

interface IPCMessage {
  id: number;
  type: string;
  method: string;
  data: string;
}

import { ipcRenderer } from 'electron';

window.addEventListener('message', async (event) => {
  try {
    if (typeof event.data === 'string') {
      const msg = JSON.parse(event.data);
      if (msg.type === 'request') {
        if (['ope_method_'].some((prefix) => msg.method.startsWith(prefix))) {
          ipcRenderer.send('ipc', msg);
        }
      }
    } else if (event.data instanceof Blob) {
      ipcRenderer.send('MAINRT:Stream:Data', await event.data.arrayBuffer());
    }
  } catch (err) {}
});

ipcRenderer.on('ipc', (_: Electron.IpcRendererEvent, msg: IPCMessage) => {
  try {
    if (msg.type === 'response') {
      window.postMessage(JSON.stringify(msg), '*');
    }
  } catch (err) {}
});

ipcRenderer.on(
  'push_server_msg',
  (_: Electron.IpcRendererEvent, msg: IPCMessage) => {
    try {
      if (msg.type === 'push') {
        window.postMessage(JSON.stringify(msg), '*');
      }
    } catch (err) {}
  }
);

ipcRenderer.on(
  'push_client_msg',
  (_: Electron.IpcRendererEvent, msg: IPCMessage) => {
    try {
      if (msg.type === 'push') {
        window.postMessage(JSON.stringify(msg), '*');
      }
    } catch (err) {}
  }
);
