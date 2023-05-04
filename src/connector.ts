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
import { Subject } from 'rxjs';

interface IPCMessage {
  id: number;
  type: string;
  method: string;
  data: string;
}

export class IPCService {
  private _ipcResponse$ = new Subject<IPCMessage>();

  constructor() {
    window.addEventListener('message', (ipcEvent) => {
      try {
        const msg: IPCMessage = JSON.parse(ipcEvent.data);
        if (msg.type === 'response') {
          this._ipcResponse$.next(msg);
        } else if (msg.type === 'push' && msg.method === 'ope_method_server') {
          window.postMessage(
            JSON.stringify({
              id: msg.id,
              type: 'server_log_push',
              method: msg.method,
              data: msg.data,
            }),
            '*'
          );
        } else if (msg.type === 'push' && msg.method === 'ope_method_client') {
          window.postMessage(
            JSON.stringify({
              id: msg.id,
              type: 'client_info_push',
              method: msg.method,
              data: msg.data,
            }),
            '*'
          );
        }
      } catch (err) {}
    });
  }

  request(method: string, data?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const msgId = this.randomId();
      const subscription = this._ipcResponse$.subscribe((msg: IPCMessage) => {
        if (msg.id === msgId) {
          subscription.unsubscribe();
          if (msg.method !== 'error') {
            resolve(msg.data);
          } else {
            reject(msg.data);
          }
        }
      });
      window.postMessage(
        JSON.stringify({
          id: msgId,
          type: 'request',
          method: method,
          data: data,
        }),
        '*'
      );
    });
  }

  private randomId(): number {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    const bufView = new DataView(
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    );
    return bufView.getUint32(0, true) || 1;
  }
}
