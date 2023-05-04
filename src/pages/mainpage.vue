<!-- OPE Desktop Application
Copyright (C) 2020-2023  Motagamwala Taha Arif Ali

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. -->
<template>
  <q-page class="row items-center justify-center">
    <div v-if="!store.devicedetection" class="q-gutter-md" style="width: 60%">
      <q-input
        color="primary"
        autocomplete="on"
        rounded
        v-model="examid"
        outlined
        placeholder="Enter your test id"
        :rules="[(val) => !!val || 'Field is required']"
      />
      <q-input
        color="primary"
        autocomplete="on"
        rounded
        v-model="code"
        outlined
        placeholder="Enter your test code"
        :rules="[(val) => !!val || 'Field is required']"
      />
      <div class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          color="white"
          text-color="positive"
          @click.stop="change()"
          label="Start Exam"
        />
      </div>
    </div>
    <div v-if="store.devicedetection" class="q-gutter-md" style="width: 60%">
      <div class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          color="white"
          @click.stop="check"
          text-color="positive"
          label="Detect audio and video devices"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Notify } from 'quasar';
import { OPE } from 'src/stores/ope';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'mainPage',

  setup() {
    return {
      store: OPE(),
    };
  },

  data() {
    return {
      examid: <string | null>null,
      code: <string | null>null,
    };
  },

  methods: {
    async check() {
      try {
        this.store.camera = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (this.examid === null || this.examid.trim().length === 0) {
          this.store.devicedetection = false;
          return Notify.create({
            message: 'Please enter your exam Id correctly',
            position: 'top',
            type: 'negative',
          });
        }
        if (this.code === null || this.code.trim().length === 0) {
          this.store.devicedetection = false;
          return Notify.create({
            message: 'Please enter your code correctly',
            position: 'top',
            type: 'negative',
          });
        }
        if (this.examid.length !== 24) {
          this.store.devicedetection = false;
          return Notify.create({
            message: 'Please enter your exam Id correctly',
            position: 'top',
            type: 'negative',
          });
        }
        Notify.create({
          message: 'Audio and video device detected',
          position: 'top',
          type: 'positive',
        });
        this.store.videostream = new MediaStream(
          this.store.camera.getVideoTracks()
        );
        this.store.startexam(this.examid, this.code);
      } catch (err) {
        return Notify.create({
          message: 'Please check audio and video device',
          position: 'top',
          type: 'negative',
        });
      }
    },
    async change() {
      this.store.devicedetection = true;
    },
  },
});
</script>
