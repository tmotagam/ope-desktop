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
import path from 'path';
import { App, BrowserWindow } from 'electron';
import { EventEmitter } from 'events';

interface Process extends NodeJS.Process {
  mas: boolean;
}

declare const process: Process;

interface DeeplinkConfig {
  protocol: string;
  app: App;
  mainWindow: BrowserWindow;
  isDev?: boolean;
  electronPath?: string;
}

interface InstanceConfig {
  protocol: string;
  isDev: boolean;
  electronPath: string;
}

class Deeplink extends EventEmitter {
  private appPath?: string;
  private electronPath?: string;
  private app: App;
  private mainWindow: BrowserWindow;
  private config: InstanceConfig;

  constructor(config: DeeplinkConfig) {
    super();
    const {
      app,
      mainWindow,
      protocol,
      isDev = false,
      electronPath = '/node_modules/electron/dist/Electron.app',
    } = config;

    this.checkConfig(config);

    this.config = { protocol, isDev, electronPath };
    this.app = app;
    this.mainWindow = mainWindow;

    const instanceLock = app.requestSingleInstanceLock();

    if (!instanceLock) {
      app.quit();
      return;
    }

    let args: Array<string> = [];

    if (isDev) {
      args = [
        '\\.quasar\\electron\\electron-main.js',
      ];
    } else {
      args = process.argv[1] ? [path.resolve(process.argv[1])] : [];
    }

    app.setAsDefaultProtocolClient(protocol, process.execPath, args);

    app.on('second-instance', this.secondInstanceEvent);
  }

  private checkConfig = (config: DeeplinkConfig) => {
    const expectedKeys = ['app', 'mainWindow', 'protocol'];
    const configKeys = Object.keys(config);

    const missingKeys = expectedKeys.filter((expectedKey) => {
      return !configKeys.includes(expectedKey);
    });

    if (missingKeys.length > 0) {
      throw new Error(
        `electron-deeplink: missing config attributes: ${missingKeys.join(
          ', '
        )}`
      );
    }
  };

  private secondInstanceEvent = (event: Event, argv: string[]) => {
    this.emit('received', argv.slice(-1).join(''));

    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.focus();
    }
  };

  public getProtocol = () => this.config.protocol;
}

export { Deeplink };
