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
    <div v-if="!store.show" class="q-gutter-md" style="width: 60%">
      <q-input
        color="primary"
        autocomplete="on"
        rounded
        v-model="evalid"
        outlined
        placeholder="Enter your evaluation id"
        :rules="[(val) => !!val || 'Field is required']"
      />
      <div class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          @click.stop="change()"
          color="white"
          text-color="positive"
          label="Show evaluation"
        />
      </div>
    </div>
    <div v-if="store.show" class="q-gutter-md" style="width: 100%">
      <q-card flat class="text-black">
        <q-card-section>
          <div style="font-size: 20px">Evaluation Id: {{ evalid }}</div>
        </q-card-section>
        <q-card-section>
          <div style="font-size: 18px">
            Marks Obtained: {{ store.eval.marksobtained }} /
            {{ store.eval.totalmarks }}
          </div>
        </q-card-section>
        <q-card
          v-if="store.eval.ischeated.length !== 0"
          class="my-card"
          style="width: 100%"
        >
          <q-card-actions>
            <div class="q-ml-md" style="font-size: 18px">Cheating Summary</div>
            <q-space />
            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="visible ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="visible = !visible"
            />
          </q-card-actions>
          <div v-if="visible">
            <q-card-section
              v-for="cheat in store.eval.ischeated"
              v-bind:key="cheat.userid"
            >
              <q-card class="my-card">
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size: 20px"
                      >By: {{ cheat.userid }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size: 20px"
                      >Cheated:
                      {{ cheat.is === true ? 'YES' : 'NO' }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size: 20px"
                      >Date & Time:
                      {{ new Date(Number(cheat.timestamp)) }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size: 20px"
                      >Reason: {{ cheat.reason }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-card>
              <br />
            </q-card-section>
          </div>
        </q-card>
        <q-card-section
          v-for="question in store.eval.answers"
          v-bind:key="question.index"
        >
          <q-card class="my-card">
            <q-scroll-area
              :bar-style="barStyle"
              :vertical-thumb-style="verticalthumbStyle"
              visible
              style="height: 55vh; width: 100%"
            >
              <q-item>
                <q-item-section side>
                  <q-item-label style="font-size: 20px"
                    >Q{{ question.questionnumber }}.</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label style="font-size: 20px">{{
                    question.question
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <br />
              <div v-if="question.type === 'multiple'">
                <div v-for="option in question.option" v-bind:key="option">
                  <q-item tag="label" v-ripple>
                    <q-item-section side>
                      <q-checkbox
                        disable
                        :val="option"
                        :color="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          )
                        "
                        :model-value="question.markedoption"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        v-if="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          ) === undefined
                        "
                        style="font-size: 20px"
                        >{{ option }}</q-item-label
                      >
                      <q-item-label
                        v-if="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          ) === 'positive'
                        "
                        style="font-size: 20px; color: #3de09c"
                        >{{ option }}</q-item-label
                      >
                      <q-item-label
                        v-if="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          ) === 'negative'
                        "
                        style="font-size: 20px; color: #db162f"
                        >{{ option }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <br />
                </div>
              </div>
              <div v-if="question.type === 'single'">
                <div v-for="option in question.option" v-bind:key="option">
                  <q-item tag="label" v-ripple>
                    <q-item-section side>
                      <q-radio
                        disable
                        :model-value="question.markedoption"
                        :color="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          )
                        "
                        :val="option"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        v-if="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          ) === undefined
                        "
                        style="font-size: 20px"
                        >{{ option }}</q-item-label
                      >
                      <q-item-label
                        v-if="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          ) === 'positive'
                        "
                        style="font-size: 20px; color: #3de09c"
                        >{{ option }}</q-item-label
                      >
                      <q-item-label
                        v-if="
                          getcolor(
                            question.markedoption,
                            question.obtainmarks === null
                              ? 0
                              : question.obtainmarks,
                            option
                          ) === 'negative'
                        "
                        style="font-size: 20px; color: #db162f"
                        >{{ option }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <br />
                </div>
              </div>
            </q-scroll-area>
            <div class="row justify-center">
              <div style="font-size: 20px" class="q-ma-lg">
                Marks Obtained:
                {{ question.obtainmarks === null ? 0 : question.obtainmarks }} /
                {{ question.marks }}
              </div>
              <div style="font-size: 20px" class="q-ma-lg">
                {{
                  question.skipped === true
                    ? 'Skipped'
                    : question.answered === true
                    ? 'Answered'
                    : 'Not Answered'
                }}
              </div>
            </div>
            <br />
          </q-card>
          <br />
        </q-card-section>
      </q-card>
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
      verticalthumbStyle: {
        borderRadius: '100px',
        backgroundColor: '#00b4ff',
        width: '8px',
      },

      barStyle: {
        borderRadius: '100px',
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      },
    };
  },

  data() {
    return {
      evalid: <string | null>null,
      visible: false,
    };
  },

  methods: {
    change() {
      if (this.evalid === null) {
        Notify.create({
          message: 'Enter proper evaluation id',
          position: 'top',
          type: 'negative',
        });
        return;
      }
      this.store.geteval(this.evalid);
    },
    getcolor(
      markedoption: string | string[],
      obtainmarks: number,
      option: string
    ) {
      if (typeof markedoption === 'string') {
        if (markedoption === option) {
          if (obtainmarks > 0) {
            return 'positive';
          } else {
            return 'negative';
          }
        } else {
          return undefined;
        }
      } else if (Array.isArray(markedoption)) {
        if (markedoption.find((v) => v === option) === option) {
          if (obtainmarks > 0) {
            return 'positive';
          } else {
            return 'negative';
          }
        } else {
          return undefined;
        }
      } else {
        undefined;
      }
    },
  },
});
</script>
