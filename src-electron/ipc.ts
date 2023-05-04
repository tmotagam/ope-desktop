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
import { app, ipcMain, BrowserWindow, IpcMainEvent, shell } from 'electron';
import { existsSync, promises } from 'fs';
import EventSource from 'eventsource';
import { dirname, join } from 'path';
import { execFile } from 'child_process';

import { sendRequest } from './fetch';
import { split, urlcheck } from './urlchecking';

export interface IPCMessage {
  id: number;
  type: string;
  method: string;
  data: string;
}

interface option {
  can_navigate: boolean;
  can_skip: boolean;
  submit_means_final: boolean;
  can_end_test: boolean;
  see_question_list: boolean;
}

interface paper {
  type: 'multiple' | 'single';
  marks: number;
  index: number;
  section: string;
  questionnumber: number;
  question: string;
  option: string[];
  answered: boolean;
  skipped: boolean;
  markedoption: string | string[];
  obtainmarks: number | null;
}

let RefreshToken: string | null = null;
let AccessToken: string | null = null;
let eventSource: EventSource | null = null;
export let paper: paper[] | null = null;
let instructions: option | null = null;
let quesi = -1;
let header: Blob | undefined = undefined;
let offset = -1;
let examid: string;
let isdup = false;

export class IPCHandlers {
  private static methodMap = {
    ope_method_quit: IPCHandlers.quit,
    ope_method_minimize: IPCHandlers.minimize,
    ope_method_init: IPCHandlers.init,
    ope_method_saveurl: IPCHandlers.saveurl,
    ope_method_login: IPCHandlers.login,
    ope_method_account_getcommAPI: IPCHandlers.account_getcommAPI,
    ope_method_account_commidAPI: IPCHandlers.account_commidAPI,
    ope_method_logout: IPCHandlers.logout,
    ope_method_accountNameAPI: IPCHandlers.accountNameAPI,
    ope_method_accountpasswordAPI: IPCHandlers.accountpasswordAPI,
    ope_method_refreshtoken: IPCHandlers.refreshtoken,
    ope_method_startexamAPI: IPCHandlers.startexamAPI,
    ope_method_sendimagesAPI: IPCHandlers.sendimagesAPI,
    ope_method_activatesse: IPCHandlers.activatesse,
    ope_method_getfirstquestionAPI: IPCHandlers.getfirstquestionAPI,
    ope_method_getnextquestionAPI: IPCHandlers.getnextquestionAPI,
    ope_method_getpreviousquestionAPI: IPCHandlers.getpreviousquestionAPI,
    ope_method_getquestionslistAPI: IPCHandlers.getquestionslistAPI,
    ope_method_submitanswerAPI: IPCHandlers.submitanswerAPI,
    ope_method_skipanswerAPI: IPCHandlers.skipanswerAPI,
    ope_method_endexamAPI: IPCHandlers.endexamAPI,
    ope_method_getevalAPI: IPCHandlers.getevalAPI,
  };

  private static async quit(): Promise<void> {
    app.quit();
  }

  private static minimize(): void {
    const win = BrowserWindow.getFocusedWindow();
    win?.minimize();
  }

  private static async init(): Promise<string> {
    if (existsSync(join('./data.ope'))) {
      return 'true';
    }
    throw 'false';
  }

  private static async saveurl(data: string): Promise<string> {
    if (!isvalid(data)) {
      throw 'URL is not correct';
    } else {
      try {
        await promises.writeFile('./data.ope', data);
        return 'Data Saved';
      } catch (error) {
        throw 'URL is not correct';
      }
    }
  }

  private static async login(): Promise<void> {
    try {
      const data = await promises.readFile('./data.ope', { encoding: 'utf8' });
      shell.openExternal(data);
    } catch (error) {
      return;
    }
  }

  private static async accountNameAPI(data: string): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let url;
    try {
      url = await promises.readFile('./data.ope', { encoding: 'utf8' });
    } catch (error) {
      throw error;
    }
    return await sendRequest(
      `${url}api/examinee/account_name`,
      'POST',
      data,
      AccessToken
    );
  }

  private static async account_getcommAPI(): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let data = '';
    try {
      data = await promises.readFile('./data.ope', { encoding: 'utf8' });
    } catch (error) {
      throw error;
    }
    return await sendRequest(
      `${data}api/examinee/account_getcomm`,
      'GET',
      undefined,
      AccessToken
    );
  }

  private static async account_commidAPI(data: string): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let url = '';
    try {
      url = await promises.readFile('./data.ope', { encoding: 'utf8' });
    } catch (error) {
      throw error;
    }
    return await sendRequest(
      `${url}api/examinee/account_commid`,
      'POST',
      data,
      AccessToken
    );
  }

  private static async accountpasswordAPI(data: string): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let url = '';
    try {
      url = await promises.readFile('./data.ope', { encoding: 'utf8' });
    } catch (error) {
      throw error;
    }
    return await sendRequest(
      `${url}api/examinee/account_password`,
      'POST',
      data,
      AccessToken
    );
  }

  private static async refreshtoken(): Promise<string> {
    if (RefreshToken === null) {
      throw 'Error';
    }
    let data = '';
    try {
      data = await promises.readFile('./data.ope', { encoding: 'utf8' });
    } catch (error) {
      throw error;
    }
    const payload = await sendRequest(
      `${data}oauth/refresh_token/`,
      'GET',
      undefined,
      RefreshToken
    );
    if (JSON.parse(payload).status === 200) {
      const data = JSON.parse(payload).data;
      RefreshToken = JSON.parse(data).refreshtoken;
      AccessToken = JSON.parse(data).accesstoken;
    }
    return JSON.stringify({
      status: JSON.parse(payload).status,
      data: JSON.parse(JSON.parse(payload).data).error,
    });
  }

  private static async startexamAPI(data: string): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let url = '';
    try {
      examid = JSON.parse(data).examid;
      url = await promises.readFile('./data.ope', { encoding: 'utf8' });
      let payload = await sendRequest(
        `${url}api/examinee/startexam`,
        'POST',
        data,
        AccessToken
      );
      if (JSON.parse(payload).status === 200) {
        const win = BrowserWindow.getAllWindows();
        win[0].kiosk = true;
        const d = JSON.parse(JSON.parse(payload).data);
        instructions = d.instruction;
        if (d.status === 'NEW') {
          payload = JSON.stringify({
            status: JSON.parse(payload).status,
            data: JSON.stringify({
              instructions: d.instruction,
              status: d.status,
            }),
          });
        } else {
          paper = d.paper;
          instructions = d.instruction;
          payload = JSON.stringify({
            status: JSON.parse(payload).status,
            data: JSON.stringify({
              marks: d.marks,
              status: d.status,
              instructions: d.instruction,
              timeremain: d.timeremain,
              testname: d.testname,
            }),
          });
          RTS();
        }
      }
      return payload;
    } catch (error) {
      throw error;
    }
  }

  private static async sendimagesAPI(data: string): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let url = '';
    try {
      const c = await import('formdata-node');
      const parseddata = JSON.parse(data);
      const formdata = new c.FormData();
      const i0 = Buffer.from(parseddata.images[0], 'base64');
      const i1 = Buffer.from(parseddata.images[1], 'base64');
      formdata.append(
        'images',
        new c.File([new c.Blob([i0])], 'image0', { type: 'image/png' })
      );
      formdata.append(
        'images',
        new c.File([new c.Blob([i1])], 'image1', { type: 'image/png' })
      );
      formdata.append('examid', parseddata.examid);
      url = await promises.readFile('./data.ope', { encoding: 'utf8' });
      let payload = await sendRequest(
        `${url}api/examinee/verificationimages`,
        'POST',
        formdata,
        AccessToken
      );
      if (JSON.parse(payload).status === 200) {
        const win = BrowserWindow.getAllWindows();
        win[0].kiosk = true;
        const d = JSON.parse(JSON.parse(payload).data);
        paper = d.paper;
        payload = JSON.stringify({
          status: JSON.parse(payload).status,
          data: JSON.stringify({
            marks: d.marks,
            timeremain: d.timeremain,
            testname: d.testname,
          }),
        });
        RTS();
      }
      return payload;
    } catch (error) {
      throw error;
    }
  }

  private static getfirstquestionAPI(): string {
    try {
      if (paper === null) {
        throw 'Error paper not found';
      }
      let q = paper.find((v) => v.answered === false);
      q = q === undefined ? paper[paper.length - 1] : q;
      quesi = q.index;
      return JSON.stringify({
        status: 200,
        data: JSON.stringify({
          question: q,
          totalquestions: paper.length,
        }),
      });
    } catch (error) {
      throw error;
    }
  }

  private static async getpreviousquestionAPI(data: string): Promise<string> {
    try {
      if (paper === null || instructions === null) {
        throw 'Error paper not found';
      }
      if (instructions.can_navigate === false) {
        throw 'You cannot navigate to another question';
      }
      const pdata = JSON.parse(data).index;
      if (pdata === 0) {
        return JSON.stringify({
          status: 400,
          data: JSON.stringify({
            error: 'You have reached the start of the test sheet',
          }),
        });
      }
      quesi = pdata - 1;
      const url = await promises.readFile('./data.ope', { encoding: 'utf8' });
      const da = await promises.readFile(
        join(dirname(process.execPath), 'stream', `stream_${quesi + 1}.webm`)
      );
      const res = JSON.parse(
        await sendstream(
          da,
          `${url}api/examinee/save_stream/${quesi + 1}`,
          quesi + 1
        )
      );
      if (res.status !== 200) {
        quesi = pdata;
        throw 'error in streaming';
      }
      await promises.unlink(
        join(dirname(process.execPath), 'stream', `stream_${quesi + 1}.webm`)
      );
      return JSON.stringify({
        status: 200,
        data: JSON.stringify({
          question: paper[pdata - 1],
        }),
      });
    } catch (error) {
      throw error;
    }
  }

  private static async getnextquestionAPI(data: string): Promise<string> {
    try {
      if (paper === null || instructions === null) {
        throw 'Error paper not found';
      }
      if (instructions.can_navigate === false) {
        throw 'You cannot navigate to another question';
      }
      const pdata = JSON.parse(data).index;
      if (pdata === paper.length - 1) {
        return JSON.stringify({
          status: 400,
          data: JSON.stringify({
            error: 'You have reached the end of the test sheet',
          }),
        });
      }
      quesi = pdata + 1;
      const url = await promises.readFile('./data.ope', { encoding: 'utf8' });
      const da = await promises.readFile(
        join(dirname(process.execPath), 'stream', `stream_${quesi - 1}.webm`)
      );
      const res = JSON.parse(
        await sendstream(
          da,
          `${url}api/examinee/save_stream/${quesi - 1}`,
          quesi - 1
        )
      );
      if (res.status !== 200) {
        quesi = pdata;
        throw 'error in streaming';
      }
      await promises.unlink(
        join(dirname(process.execPath), 'stream', `stream_${quesi - 1}.webm`)
      );
      return JSON.stringify({
        status: 200,
        data: JSON.stringify({
          question: paper[pdata + 1],
        }),
      });
    } catch (error) {
      throw error;
    }
  }

  private static getquestionslistAPI(): string {
    try {
      if (paper === null || instructions === null) {
        throw 'Error paper not found';
      }
      if (instructions.see_question_list !== true) {
        throw 'Error cannot retrive questions list';
      }
      const quest: { section: string; questions: string[] }[] = [];
      for (let i = 0; i < paper.length; i++) {
        const s = paper[i].section;
        const v = quest.find((v) => v.section === s);
        if (v === undefined) {
          quest.push({
            section: paper[i].section,
            questions: [paper[i].question],
          });
        } else {
          v.questions.push(paper[i].question);
        }
      }
      return JSON.stringify({
        status: 200,
        data: JSON.stringify({
          questionslist: quest,
        }),
      });
    } catch (error) {
      throw error;
    }
  }

  private static async submitanswerAPI(data: string): Promise<string> {
    try {
      if (AccessToken === null || paper === null || instructions === null) {
        throw 'Error paper not found';
      }
      const url = await promises.readFile('./data.ope', { encoding: 'utf8' });
      const pdata = JSON.parse(data);
      if (pdata.index === paper.length - 1) {
        const da = await promises.readFile(
          join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
        );
        const res = JSON.parse(
          await sendstream(da, `${url}api/examinee/save_stream/${quesi}`, quesi)
        );
        if (res.status !== 200) {
          quesi = pdata.index;
          throw 'error in streaming';
        }
      } else {
        quesi = pdata.index + 1;
        const da = await promises.readFile(
          join(dirname(process.execPath), 'stream', `stream_${quesi - 1}.webm`)
        );
        const res = JSON.parse(
          await sendstream(
            da,
            `${url}api/examinee/save_stream/${quesi - 1}`,
            quesi - 1
          )
        );
        if (res.status !== 200) {
          quesi = pdata.index;
          throw 'error in streaming';
        }
        await promises.unlink(
          join(dirname(process.execPath), 'stream', `stream_${quesi - 1}.webm`)
        );
      }
      if (
        instructions.submit_means_final === true &&
        pdata.index <= paper.length - 1
      ) {
        const ans = paper[pdata.index];
        if (ans.answered === true) {
          throw 'Error paper cannot be submitted';
        }
        const payload = await sendRequest(
          `${url}api/examinee/submitanswer`,
          'POST',
          data,
          AccessToken
        );
        if (JSON.parse(payload).status !== 200) {
          if (
            JSON.parse(payload).status === 401 &&
            JSON.parse(JSON.parse(payload).data).error ===
              'Failed to verify token'
          ) {
            return payload;
          }
          throw 'Error in Submission';
        }
        ans.answered = true;
        ans.markedoption = pdata.answer;
        if (pdata.index === paper.length - 1) {
          return JSON.stringify({
            status: 404,
            data: JSON.stringify({
              error: 'You have reached the end of test sheet',
            }),
          });
        }
        return JSON.stringify({
          status: 200,
          data: JSON.stringify({
            question: paper[pdata.index + 1],
          }),
        });
      } else if (
        instructions.submit_means_final === false &&
        pdata.index <= paper.length - 1
      ) {
        const payload = await sendRequest(
          `${url}api/examinee/submitanswer`,
          'POST',
          data,
          AccessToken
        );
        if (JSON.parse(payload).status !== 200) {
          if (
            JSON.parse(payload).status === 401 &&
            JSON.parse(JSON.parse(payload).data).error ===
              'Failed to verify token'
          ) {
            return payload;
          }
          throw 'Error in Submission';
        }
        const ans = paper[pdata.index];
        ans.answered = true;
        ans.markedoption = pdata.answer;
        if (pdata.index === paper.length - 1) {
          return JSON.stringify({
            status: 404,
            data: JSON.stringify({
              error: 'You have reached the end of test sheet',
            }),
          });
        }
        return JSON.stringify({
          status: 200,
          data: JSON.stringify({
            question: paper[pdata.index + 1],
          }),
        });
      } else {
        throw 'Error paper cannot be submitted';
      }
    } catch (error) {
      throw error;
    }
  }

  private static async skipanswerAPI(data: string): Promise<string> {
    try {
      if (AccessToken === null || paper === null || instructions === null) {
        throw 'Error paper not found';
      }
      const url = await promises.readFile('./data.ope', { encoding: 'utf8' });
      const pdata = JSON.parse(data);
      if (instructions.can_skip === true && pdata.index <= paper.length - 1) {
        const ans = paper[pdata.index];
        if (ans.skipped === true || ans.answered === true) {
          throw 'Error paper cannot be submitted';
        }
        if (pdata.index === paper.length - 1) {
          const da = await promises.readFile(
            join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
          );
          const res = JSON.parse(
            await sendstream(
              da,
              `${url}api/examinee/save_stream/${quesi}`,
              quesi
            )
          );
          if (res.status !== 200) {
            quesi = pdata.index;
            throw 'error in streaming';
          }
        } else {
          quesi = pdata.index + 1;
          const da = await promises.readFile(
            join(
              dirname(process.execPath),
              'stream',
              `stream_${quesi - 1}.webm`
            )
          );
          const res = JSON.parse(
            await sendstream(
              da,
              `${url}api/examinee/save_stream/${quesi - 1}`,
              quesi - 1
            )
          );
          if (res.status !== 200) {
            quesi = pdata.index;
            throw 'error in streaming';
          }
          await promises.unlink(
            join(
              dirname(process.execPath),
              'stream',
              `stream_${quesi - 1}.webm`
            )
          );
        }
        const payload = await sendRequest(
          `${url}api/examinee/skipanswer`,
          'POST',
          data,
          AccessToken
        );
        if (JSON.parse(payload).status !== 200) {
          if (
            JSON.parse(payload).status === 401 &&
            JSON.parse(JSON.parse(payload).data).error ===
              'Failed to verify token'
          ) {
            return payload;
          }
          throw 'Error in Submission';
        }
        ans.answered = true;
        ans.skipped = true;
        if (pdata.index === paper.length - 1) {
          return JSON.stringify({
            status: 404,
            data: JSON.stringify({
              error: 'You have reached the end of test sheet',
            }),
          });
        }
        return JSON.stringify({
          status: 200,
          data: JSON.stringify({
            question: paper[pdata.index + 1],
          }),
        });
      } else {
        throw 'Error paper cannot be submitted';
      }
    } catch (error) {
      throw error;
    }
  }

  private static async endexamAPI(data: string): Promise<string> {
    try {
      if (AccessToken === null || instructions === null) {
        throw 'Error paper not found';
      }
      const url = await promises.readFile('./data.ope', {
        encoding: 'utf8',
      });
      const pdata = JSON.parse(data).examid;
      if (instructions.can_end_test === true) {
        const p = await sendRequest(
          `${url}api/examinee/end_test/${pdata}`,
          'GET',
          undefined,
          AccessToken
        );
        if (JSON.parse(p).status === 200) {
          const da = await promises.readFile(
            join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
          );
          await sendstream(da, `${url}api/examinee/end_stream/${quesi}`, quesi);
          await promises.unlink(
            join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
          );
          ipcMain.removeAllListeners('MAINRT:Stream:Data');
          const win = BrowserWindow.getAllWindows();
          win[0].kiosk = false;
          execFile(
            'shutdown /r /t 60 /c "OPE is rolling back the changes made to the system for test the system will restart in 60 seconds please be patient" /d p:2:2',
            { shell: true }
          );
        }
        return p;
      } else {
        throw 'Error paper cannot be ended';
      }
    } catch (error) {
      throw error;
    }
  }

  private static async getevalAPI(data: string): Promise<string> {
    try {
      if (AccessToken === null) {
        throw 'Error evaluation not found';
      }
      const url = await promises.readFile('./data.ope', {
        encoding: 'utf8',
      });
      const pdata = JSON.parse(data).evalid;
      return await sendRequest(
        `${url}api/examinee/showresult/${pdata}`,
        'GET',
        undefined,
        AccessToken
      );
    } catch (error) {
      throw error;
    }
  }

  private static async logout(): Promise<string> {
    if (AccessToken === null) {
      throw 'Error';
    }
    let data = '';
    try {
      data = await promises.readFile('./data.ope', { encoding: 'utf8' });
    } catch (error) {
      throw error;
    }
    const payload = await sendRequest(
      `${data}auth/logout`,
      'GET',
      undefined,
      AccessToken
    );
    if (
      JSON.parse(payload).status === 200 ||
      JSON.parse(JSON.parse(payload).data).error !== 'Failed to verify token'
    ) {
      RefreshToken = null;
      AccessToken = null;
      stopsse();
    }
    return payload;
  }

  private static activatesse(): void {
    sse(AccessToken === null ? '' : AccessToken);
  }

  public static do(
    commandType: keyof typeof IPCHandlers.methodMap,
    params: string | null
  ) {
    const method = IPCHandlers.methodMap[commandType];
    return method(params === null ? '' : params);
  }
}

async function dispatchIPC(
  method: string,
  data: string | null
): Promise<string | void> {
  if (['ope_method_'].some((prefix) => method.startsWith(prefix))) {
    if (
      typeof IPCHandlers[method.substring(11) as keyof IPCHandlers] ===
      'function'
    ) {
      const result: Promise<string> | string | Promise<void> | void =
        IPCHandlers.do(method as keyof IPCHandlers, data);
      return result;
    } else {
      return Promise.reject(`No handler for method: ${method}`);
    }
  } else {
    return Promise.reject(`Invalid method handler namespace for "${method}"`);
  }
}

export function startIPCHandlers() {
  ipcMain.on('ipc', async (event: IpcMainEvent, msg: IPCMessage) => {
    dispatchIPC(msg.method, msg.data)
      .then((result) => {
        if (msg.id !== 0) {
          event.sender.send('ipc', {
            id: msg.id,
            type: 'response',
            method: 'success',
            data: result,
          });
        }
      })
      .catch((err) => {
        if (msg.id !== 0) {
          event.sender.send('ipc', {
            id: msg.id,
            type: 'response',
            method: 'error',
            data: err.toString(),
          });
        }
      });
  });
}

function RTS() {
  ipcMain.on('MAINRT:Stream:Data', savestream);
}

const header_extractor = async (firstChunk: Blob) => {
  let value = 0;
  const premn = '0x1F43B675'.match(/[a-fA-F0-9]{2}/g);
  if (premn === null) {
    throw 'error';
  }
  const magicNumber = parseInt(premn.reverse().join(''), 16);
  while (value !== magicNumber) {
    offset = offset + 1;

    try {
      const arr = await firstChunk
        .slice(offset, offset + 4)
        .arrayBuffer()
        .then((buffer) => new Int32Array(buffer));
      value = arr[0];
    } catch (error) {
      throw error;
    }
  }
  offset = offset + 4;
  return firstChunk.slice(0, offset);
};

async function savestream(event: IpcMainEvent, blob: ArrayBuffer) {
  try {
    let i = 0;
    const c = await import('formdata-node');
    if (header === undefined) {
      header = await header_extractor(new c.Blob([blob]));
      i = 1;
    }
    if (!existsSync(join(dirname(process.execPath), 'stream')))
      await promises.mkdir(join(dirname(process.execPath), 'stream'));
    if (
      !existsSync(
        join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
      ) &&
      i === 1
    ) {
      await promises.appendFile(
        join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`),
        Buffer.from(blob)
      );
    } else if (
      !existsSync(
        join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
      )
    ) {
      await promises.appendFile(
        join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`),
        Buffer.concat([
          Buffer.from(await header.arrayBuffer()),
          Buffer.from(blob),
        ])
      );
    } else {
      if (i === 1 || isdup === true) {
        if (i === 1) isdup = true;
        await promises.appendFile(
          join(
            dirname(process.execPath),
            'stream',
            `stream_${quesi}_duplicate.webm`
          ),
          Buffer.from(blob)
        );
      } else {
        await promises.appendFile(
          join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`),
          Buffer.from(blob)
        );
      }
    }
  } catch (error) {}
}

async function sendstream(data: Buffer, url: string, quesi: number) {
  if (AccessToken === null) {
    throw 'Error';
  }
  const c = await import('formdata-node');
  const formdata = new c.FormData();
  formdata.append(
    'stream',
    new c.File([new c.Blob([data])], 'stream', {
      type: 'video/webm',
    })
  );
  formdata.append('examid', examid);
  let res = JSON.parse(await sendRequest(url, 'POST', formdata, AccessToken));
  if (res.status !== 200) {
    throw 'error';
  }
  if (isdup === true) {
    isdup = false;
    const da = await promises.readFile(
      join(
        dirname(process.execPath),
        'stream',
        `stream_${quesi}_duplicate.webm`
      )
    );
    res = JSON.parse(await sendstream(da, url, 0));
    if (res.status !== 200) {
      isdup = true;
      throw 'error';
    }
    await promises.unlink(
      join(
        dirname(process.execPath),
        'stream',
        `stream_${quesi}_duplicate.webm`
      )
    );
  }
  return JSON.stringify(res);
}

export const datatransfer = (payload: {
  accesstoken: string;
  refreshtoken: string;
  userType: string;
  name: string;
}) => {
  if (
    payload.userType !== 'EXAMINEE' &&
    payload.accesstoken === '' &&
    payload.refreshtoken === '' &&
    payload.name === ''
  ) {
    return;
  }
  RefreshToken = payload.refreshtoken;
  AccessToken = payload.accesstoken;
  sse(payload.accesstoken);
  const win = BrowserWindow.getAllWindows();
  win[0].webContents.send('push_client_msg', {
    id: 0,
    type: 'push',
    method: 'ope_method_client',
    data: JSON.stringify({
      data: {
        name: payload.name,
      },
      type: 'logindata',
    }),
  });
};

const isvalid = (value: string) => {
  if (!urlcheck(value)) {
    return;
  }

  let splitted: RegExpMatchArray | null = [''];
  let scheme = '';
  let authority = '';
  let path = '';
  let port = '';
  let query = '';
  let fragment = '';
  let out = '';

  splitted = split(value);
  if (splitted === null) return;
  scheme = splitted[1];
  authority = splitted[2];
  path = splitted[3];
  query = splitted[4];
  fragment = splitted[5];

  if (!scheme) return;

  if (scheme.toLowerCase() !== 'https') {
    if (scheme.toLowerCase() !== 'http') {
      return;
    }
  }

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

  if (fragment && fragment.length) {
    out += '#' + fragment;
  }

  return out;
};

const sse = async (accesstoken: string) => {
  const win = BrowserWindow.getAllWindows();
  let url = '';
  try {
    url = await promises.readFile('./data.ope', { encoding: 'utf8' });
  } catch (error) {
    return;
  }
  const events = new EventSource(
    `${url}api/examinee/examinee-event/Bearer ${accesstoken}`
  );
  eventSource = events;
  events.onerror = () => {
    eventSource = null;
    win[0].webContents.send('push_client_msg', {
      id: 0,
      type: 'push',
      method: 'ope_method_client',
      data: JSON.stringify({
        error: 'Cannot connect to the server',
        type: 'servereventerror',
      }),
    });
    events.close();
  };
  events.addEventListener('EXAMINEE', async (e) => {
    const data = JSON.parse(e.data);
    if (data.status === 'TIMER' && data.time === 'END TEST') {
      const da = await promises.readFile(
        join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
      );
      await sendstream(da, `${url}api/examinee/end_stream/${quesi}`, quesi);
      await promises.unlink(
        join(dirname(process.execPath), 'stream', `stream_${quesi}.webm`)
      );
      win[0].webContents.send('push_client_msg', {
        id: 0,
        type: 'push',
        method: 'ope_method_client',
        data: JSON.stringify({
          data: data.time,
          type: 'sse_TT',
        }),
      });
      ipcMain.removeAllListeners('MAINRT:Stream:Data');
      win[0].kiosk = false;
      execFile(
        'shutdown /r /t 60 /c "OPE is rolling back the changes made to the system for test the system will restart in 60 seconds please be patient" /d p:2:2',
        { shell: true }
      );
    } else if (data.status === 'TIMER') {
      win[0].webContents.send('push_client_msg', {
        id: 0,
        type: 'push',
        method: 'ope_method_client',
        data: JSON.stringify({
          data: [...data.time],
          type: 'sse_TT',
        }),
      });
    }
  });
  events.addEventListener('ERROR', (e) => {
    if (e.data === 'Failed to verify token') {
      win[0].webContents.send('push_client_msg', {
        id: 0,
        type: 'push',
        method: 'ope_method_client',
        data: JSON.stringify({
          error: 'ERROR',
          type: 'tokenerror',
        }),
      });
      events.close();
      eventSource = null;
    }
    win[0].webContents.send('push_client_msg', {
      id: 0,
      type: 'push',
      method: 'ope_method_client',
      data: JSON.stringify({
        error: e.data,
        type: 'eventerror',
      }),
    });
    events.close();
    eventSource = null;
  });
};

const stopsse = () => {
  if (eventSource === null) {
    throw new Error('Event Source is empty');
  }
  eventSource.close();
  eventSource = null;
};
