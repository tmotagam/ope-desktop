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
  <q-page v-if="slide === 1" class="row items-center justify-center">
    <q-card flat class="q-gutter-md my-card">
      <div class="text-h6">Examinee Verification</div>
      <div class="q-pt-none">
        Please have your face in front of the camera and take the picture
      </div>
      <video
        width="720"
        height="400"
        autoplay
        :srcObject="store.videostream"
      ></video>
      <canvas width="720" height="400" style="display: none"></canvas>
      <div v-if="!captured" class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          color="white"
          @click="captureimage"
          text-color="positive"
          label="Capture Image"
        />
      </div>
      <div v-else-if="captured" class="row justify-center">
        <q-btn
          class="col-4 on-left"
          style="font-size: 120%"
          push
          color="white"
          @click="back"
          text-color="primary"
          label="Recapture"
        />
        <q-btn
          class="col-4 on-right"
          style="font-size: 120%"
          push
          color="white"
          @click="save"
          text-color="positive"
          label="Send for verification"
        />
      </div>
    </q-card>
  </q-page>
  <q-page v-else-if="slide === 2" class="row items-center justify-center">
    <q-card flat class="q-gutter-md my-card">
      <div class="text-h6">Examinee Verification</div>
      <div class="q-pt-none">
        Now, please have your proof ID and your face in front of the camera and
        take the picture
      </div>
      <video
        width="720"
        height="400"
        autoplay
        :srcObject="store.videostream"
      ></video>
      <canvas width="720" height="400" style="display: none"></canvas>
      <div v-if="!captured" class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          color="white"
          @click="captureimage"
          text-color="positive"
          label="Capture Image"
        />
      </div>
      <div v-else-if="captured" class="row justify-center">
        <q-btn
          class="col-4 on-left"
          style="font-size: 120%"
          push
          color="white"
          @click="back"
          text-color="primary"
          label="Recapture"
        />
        <q-btn
          class="col-4 on-right"
          style="font-size: 120%"
          push
          color="white"
          @click="save"
          text-color="positive"
          label="Send for verification"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Loading } from 'quasar';
import { OPE } from 'src/stores/ope';
import { defineComponent, watch } from 'vue';
export default defineComponent({
  name: 'verificationPage',

  setup() {
    const store = OPE();
    watch(
      () => store.loading,
      (newValue) => {
        if (newValue === true) {
          Loading.show({
            message: 'Verifying please wait...',
            messageColor: 'primary',
            customClass: 'text-subtitle2',
            boxClass: 'bg-grey-2 text-grey-9',
            spinnerColor: 'primary',
          });
        } else {
          if (Loading.isActive) {
            Loading.hide();
          }
        }
      }
    );
    return {
      store,
    };
  },

  data() {
    return {
      slide: 1,
      captured: false,
      images: <Array<string>>[],
    };
  },

  methods: {
    captureimage() {
      const videoelement = document.querySelector('video');
      const canvaselement = document.querySelector('canvas');
      if (videoelement === null || canvaselement === null) {
        return;
      }
      videoelement.setAttribute('style', 'display: none;');
      const canvasContext = canvaselement.getContext('2d');
      if (canvasContext === null) {
        return;
      }
      canvasContext.drawImage(
        videoelement,
        0,
        0,
        videoelement.width,
        videoelement.height
      );
      canvaselement.setAttribute('style', 'display: block;');
      this.captured = true;
    },
    back() {
      const videoelement = document.querySelector('video');
      const canvaselement = document.querySelector('canvas');
      if (videoelement === null || canvaselement === null) {
        return;
      }
      videoelement.setAttribute('style', 'display: block;');
      canvaselement.setAttribute('style', 'display: none;');
      this.captured = false;
    },
    save() {
      if (this.slide === 1) {
        const canvaselement = document.querySelector('canvas');
        if (canvaselement === null) {
          return;
        }
        const is = canvaselement.toDataURL();
        this.images.push(is.split('data:image/png;base64,')[1]);
        this.slide = 2;
        this.captured = false;
      } else {
        const canvaselement = document.querySelector('canvas');
        if (canvaselement === null) {
          return;
        }
        const is = canvaselement.toDataURL();
        this.images.push(is.split('data:image/png;base64,')[1]);
        this.store.loading = true;
        this.store.sendverificationimage(this.images);
      }
    },
  },
});
</script>
