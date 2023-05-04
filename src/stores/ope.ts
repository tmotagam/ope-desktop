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
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  account_commidApi,
  account_getcommApi,
  account_nameApi,
  account_passwordApi,
  logoutApi,
  refreshtokenApi,
} from 'src/apis/account';
import {
  endexamApi,
  getevalApi,
  getfirstquestionApi,
  getnextquestionApi,
  getpreviousquestionApi,
  getquestionslistApi,
  sendimagesApi,
  skipanswerApi,
  startexamApi,
  submitanswerApi,
} from 'src/apis/test';
import { IPCService } from 'src/connector';

interface IPCMessage {
  id: number;
  type: string;
  method: string;
  data: string;
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
  markedoption: never;
  obtainmarks: number | null;
}

interface cheat {
  userid: string;
  is: boolean;
  reason: string;
  timestamp: string;
}

export const OPE = defineStore('ope', {
  state: () => ({
    route: '/',
    Service: new IPCService(),
    name: <string | null>null,
    busy: false,
    loading: false,
    expire: false,
    commid: <string | null>null,
    examid: <string | null>null,
    camera: <MediaStream | null>null,
    videostream: <MediaStream | null>null,
    mediarecorder: <MediaRecorder | null>null,
    devicedetection: false,
    timeremaining: <number[]>[],
    totalmarks: <number>0,
    testname: <string | null>null,
    totaltime: <number[]>[],
    totalquestion: <number | null>null,
    eval: <
      {
        totalmarks: number;
        marksobtained: number;
        answers: paper[];
        ischeated: cheat[];
      }
    >{},
    instructions: <
      {
        can_navigate: boolean;
        can_skip: boolean;
        submit_means_final: boolean;
        can_end_test: boolean;
        see_question_list: boolean;
      }
    >{},
    question: <
      {
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
    >{},
    show: false,
  }),
  getters: {},
  actions: {
    setRoute(route: string): void {
      this.route = route;
      this.router.replace(route);
    },
    client_Data() {
      window.addEventListener('message', async (event) => {
        try {
          const msg: IPCMessage = JSON.parse(event.data);
          if (msg.type === 'client_info_push') {
            if (JSON.parse(msg.data).type === 'logindata') {
              const data = JSON.parse(msg.data).data;
              this.name = data.name;
              Notify.create({
                message: 'signin successful',
                position: 'top',
                type: 'positive',
              });
              this.setRoute('/mainpage');
            } else if (JSON.parse(msg.data).type === 'servereventerror') {
              setTimeout(() => {
                this.Service.request('ope_method_activatesse');
              }, 5000);
            } else if (JSON.parse(msg.data).type === 'eventerror') {
              setTimeout(() => {
                this.Service.request('ope_method_activatesse');
              }, 5000);
            } else if (JSON.parse(msg.data).type === 'tokenerror') {
              await this.refreshtoken();
              this.Service.request('ope_method_activatesse');
            } else if (JSON.parse(msg.data).type === 'sse_TT') {
              if (JSON.parse(msg.data).data === 'END TEST') {
                this.mediarecorder?.stop();
                this.camera = null;
                this.examid = null;
                this.videostream = null;
                this.devicedetection = false;
                this.logout();
              } else {
                this.timeremaining = [...JSON.parse(msg.data).data];
              }
            }
          }
        } catch (err) {}
      });
    },
    async editname(name: string) {
      this.busy = !this.busy;
      try {
        const data = await account_nameApi(this.Service, name);
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.editname(name).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'ositive',
        });
        this.name = data.name;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async getcommid() {
      this.busy = !this.busy;
      try {
        const data = await account_getcommApi(this.Service);
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.getcommid().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        this.commid = data.commid;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async editcommid(commid: string) {
      this.busy = !this.busy;
      try {
        const data = await account_commidApi(this.Service, commid);
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.editcommid(commid).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.logout();
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async editpassword(opass: string, npass: string, cnpass: string) {
      this.busy = !this.busy;
      try {
        const data = await account_passwordApi(
          this.Service,
          opass,
          npass,
          cnpass
        );
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.editpassword(opass, npass, cnpass).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        Notify.create({
          message: data.message,
          position: 'top',
          type: 'positive',
        });
        this.logout();
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async refreshtoken() {
      this.busy = !this.busy;
      try {
        const data = await refreshtokenApi(this.Service);
        this.busy = !this.busy;
        if (data.status !== 200) {
          this.logout();
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.expire = false;
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout() {
      this.busy = !this.busy;
      try {
        const payload = await logoutApi(this.Service);
        this.busy = !this.busy;
        if (payload.status !== 200) {
          if (payload.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.logout();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: 'Signout successful',
            position: 'top',
            type: 'positive',
          });
          this.name = null;
          this.setRoute('/');
          return;
        }
        Notify.create({
          message: 'Signout successful',
          position: 'top',
          type: 'positive',
        });
        this.name = null;
        this.setRoute('/');
      } catch (error) {
        return false;
      }
    },
    async startexam(examid: string, code: string) {
      this.busy = !this.busy;
      try {
        this.examid = examid;
        const data = await startexamApi(this.Service, examid, code);
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.startexam(examid, code).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          this.examid = null;
          this.devicedetection = false;
          if (this.camera) {
            this.camera = null;
          }
          return;
        }
        this.busy = !this.busy;
        if (data.datastatus === 'NEW') {
          this.instructions = data.instructions;
          this.setRoute('/test');
        } else if (data.datastatus === 'OLD') {
          this.instructions = data.instructions;
          this.timeremaining = [...data.time];
          this.totaltime = [...data.time];
          this.totalmarks = data.totalmarks;
          this.testname = data.testname;
          this.setRoute('/test/testboard');
          if (this.camera) {
            this.mediarecorder = new MediaRecorder(this.camera, {
              mimeType: 'video/WEBM;codecs=VP8,OPUS',
            });
            this.mediarecorder.start(2000);
            this.mediarecorder.ondataavailable = async (event) => {
              window.postMessage(event.data, '*');
            };
          }
        }
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async sendverificationimage(images: Array<string>) {
      this.busy = !this.busy;
      try {
        if (this.examid === null) {
          return;
        }
        const data = await sendimagesApi(this.Service, images, this.examid);
        if (data.status !== 200) {
          this.busy = !this.busy;
          this.loading = !this.loading;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.sendverificationimage(images).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        this.loading = !this.loading;
        this.timeremaining = [...data.time];
        this.totaltime = [...data.time];
        this.totalmarks = data.totalmarks;
        this.testname = data.testname;
        this.setRoute('/test/testboard');
        if (this.camera) {
          this.mediarecorder = new MediaRecorder(this.camera, {
            mimeType: 'video/WEBM;codecs=VP8,OPUS',
          });
          this.mediarecorder.start(2000);
          this.mediarecorder.ondataavailable = (event) => {
            window.postMessage(event.data, '*');
          };
        }
      } catch (error) {
        this.loading = !this.loading;
        this.busy = !this.busy;
        return;
      }
    },
    async getfirstquestion() {
      this.busy = !this.busy;
      try {
        if (this.examid === null) {
          return;
        }
        const data = await getfirstquestionApi(this.Service);
        if (data.status !== 200) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        this.totalquestion = data.totalquestions;
        this.question = data.question;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async getpreviousquestion() {
      this.busy = !this.busy;
      try {
        if (this.examid === null) {
          return;
        }
        const data = await getpreviousquestionApi(
          this.Service,
          this.question.index
        );
        if (data.status === 400) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'info',
          });
          return;
        } else if (data.status !== 200) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        this.question = data.question;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async getnextquestion() {
      this.busy = !this.busy;
      try {
        if (this.examid === null) {
          return;
        }
        const data = await getnextquestionApi(
          this.Service,
          this.question.index
        );
        if (data.status === 400) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'info',
          });
          return;
        } else if (data.status !== 200) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'info',
          });
          return;
        }
        this.busy = !this.busy;
        this.question = data.question;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async getquestionslist() {
      this.busy = !this.busy;
      try {
        if (this.examid === null) {
          return;
        }
        const data = await getquestionslistApi(this.Service);
        if (data.status !== 200) {
          this.busy = !this.busy;
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'info',
          });
          return;
        }
        this.busy = !this.busy;
        return data.list;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async submitanswer(answer: string | string[]) {
      if (this.examid === null) {
        return Notify.create({
          message: 'Examid is null',
          position: 'top',
          type: 'negative',
        });
      }
      this.busy = !this.busy;
      try {
        const data = await submitanswerApi(
          this.Service,
          this.question.index,
          answer,
          this.examid
        );
        this.busy = !this.busy;
        if (data.status !== 200 && data.status !== 404) {
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.submitanswer(answer).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        } else if (data.status === 404) {
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'info',
          });
          this.question.answered = true;
          return;
        }
        this.question = data.question;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async skipanswer() {
      if (this.examid === null) {
        return Notify.create({
          message: 'Examid is null',
          position: 'top',
          type: 'negative',
        });
      }
      this.busy = !this.busy;
      try {
        const data = await skipanswerApi(
          this.Service,
          this.question.index,
          this.examid
        );
        this.busy = !this.busy;
        if (data.status !== 200 && data.status !== 404) {
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.skipanswer().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        } else if (data.status === 404) {
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'info',
          });
          this.question.answered = true;
          return;
        }
        this.question = data.question;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async endexam() {
      this.busy = !this.busy;
      if (this.examid === null) {
        return Notify.create({
          message: 'Examid not found',
          position: 'top',
          type: 'negative',
        });
      }
      try {
        const data = await endexamApi(this.Service, this.examid);
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.endexam().then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        this.mediarecorder?.stop();
        this.camera = null;
        this.examid = null;
        this.videostream = null;
        this.devicedetection = false;
        this.logout();
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
    async geteval(eid: string) {
      this.busy = !this.busy;
      try {
        const data = await getevalApi(this.Service, eid);
        if (data.status !== 200) {
          this.busy = !this.busy;
          if (data.error === 'Failed to verify token') {
            if (this.expire === false) {
              this.refreshtoken();
              this.expire = true;
            }
            const timer = setInterval(() => {
              if (this.expire === false) {
                this.geteval(eid).then().catch();
                clearInterval(timer);
              }
            }, 1000);
            return;
          }
          Notify.create({
            message: data.error,
            position: 'top',
            type: 'negative',
          });
          return;
        }
        this.busy = !this.busy;
        this.eval = data.eval;
        this.eval.ischeated = data.cheated;
        this.show = true;
      } catch (error) {
        this.busy = !this.busy;
        return;
      }
    },
  },
});
