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
  <q-header class="bg-white text-black" elevated>
    <q-toolbar>
      <q-toolbar-title>
        <q-img
          class="on-right on-left"
          src="icons/favicon-128x128.png"
          style="height: 30px; width: 50px"
        />
      </q-toolbar-title>
    </q-toolbar>
    <q-toolbar>
      <q-scroll-area
        :bar-style="barStyle"
        :horizontal-thumb-style="horizontalthumbStyle"
        visible
        style="height: 50px; width: 100%"
      >
        <div class="row no-wrap">
          <q-chip
            icon="quiz"
            outline
            size="20px"
            color="primary"
            text-color="primary"
          >
            Test Name: {{ store.testname }}
          </q-chip>
          <q-chip
            icon="scoreboard"
            outline
            size="20px"
            color="primary"
            text-color="primary"
          >
            Total Points: {{ store.totalmarks }}
          </q-chip>
          <q-chip
            icon="schedule"
            outline
            size="20px"
            color="primary"
            text-color="primary"
          >
            Total Time:
            {{
              totaltimeteller(
                store.totaltime[0],
                store.totaltime[1],
                store.totaltime[2]
              )
            }}</q-chip
          >
          <q-chip
            icon="question_answer"
            outline
            size="20px"
            color="primary"
            text-color="primary"
          >
            Total Questions: {{ store.totalquestion }}
          </q-chip>
          <q-chip
            icon="segment"
            outline
            size="20px"
            color="primary"
            text-color="primary"
          >
            Active Section: {{ store.question.section }}
          </q-chip>
          <q-chip
            icon="scoreboard"
            outline
            size="20px"
            color="primary"
            text-color="primary"
          >
            Active Question's Points: {{ store.question.marks }}
          </q-chip>
        </div>
      </q-scroll-area>
    </q-toolbar>
    <q-linear-progress indeterminate stripe v-if="store.busy" />
  </q-header>

  <q-card style="overflow: auto" class="my-card">
    <video
      style="display: block; margin-left: auto; margin-right: auto"
      width="225"
      height="250"
      :srcObject="store.videostream"
      autoplay
    ></video>
    <p style="font-size: 40px; text-align: center">
      <q-icon name="timer" />
      {{ store.timeremaining[0] }} : {{ store.timeremaining[1] }} :
      {{ store.timeremaining[2] }}
    </p>
    <br />
  </q-card>
</template>

<script lang="ts">
import { OPE } from 'src/stores/ope';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoComponent',
  setup() {
    return {
      store: OPE(),
      horizontalthumbStyle: {
        borderRadius: '100px',
        backgroundColor: '#00b4ff',
        width: '5px',
      },

      barStyle: {
        borderRadius: '100px',
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      },
    };
  },

  methods: {
    totaltimeteller(hrs: number, mins: number, secs: number) {
      let str = '';
      if (hrs > 0) {
        str += hrs.toString();
        str += hrs > 1 ? ' hrs ' : ' hr';
      }
      if (mins > 0) {
        str += mins.toString();
        str += mins > 1 ? ' mins ' : ' min';
      }
      if (secs > 0) {
        str += secs.toString();
        str += secs > 1 ? ' secs ' : ' sec';
      }
      return str;
    },
  },
});
</script>
