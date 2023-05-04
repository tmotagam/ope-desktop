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
  <q-card
    class="my-card"
    v-if="
      store.instructions.can_skip === true && store.question.skipped === true
    "
  >
    <q-scroll-area
      :bar-style="barStyle"
      :vertical-thumb-style="verticalthumbStyle"
      visible
      style="height: 38vh; width: 100%"
    >
      <q-item>
        <q-item-section side>
          <q-item-label style="font-size: 25px"
            >Q{{ store.question.questionnumber }}.</q-item-label
          >
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 25px">{{
            store.question.question
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <br />
      <div v-if="store.question.type === 'multiple'">
        <div v-for="option in store.question.option" v-bind:key="option">
          <q-item tag="label" v-ripple>
            <q-item-section side>
              <q-checkbox disable :val="option" v-model="msq" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-size: 25px">{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
          <br />
        </div>
      </div>
      <div v-if="store.question.type === 'single'">
        <div v-for="option in store.question.option" v-bind:key="option">
          <q-item tag="label" v-ripple>
            <q-item-section side>
              <q-radio disable v-model="mcq" :val="option" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-size: 25px">{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
          <br />
        </div>
      </div>
    </q-scroll-area>
    <br />
    <br />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.see_question_list"
      label="Questions' List"
      :disable="store.busy"
      text-color="info"
      @click.stop="seequestions()"
      push
      icon="o_receipt_long"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_end_test"
      label="End Test"
      @click.stop="store.endexam()"
      :disable="store.busy"
      text-color="negative"
      push
      icon="o_edit_off"
    />
    <br />
  </q-card>
  <q-card
    class="my-card"
    v-else-if="
      store.instructions.submit_means_final === true &&
      store.question.answered === true
    "
  >
    <q-scroll-area
      :bar-style="barStyle"
      :vertical-thumb-style="verticalthumbStyle"
      visible
      style="height: 38vh; width: 100%"
    >
      <q-item>
        <q-item-section side>
          <q-item-label style="font-size: 25px"
            >Q{{ store.question.questionnumber }}.</q-item-label
          >
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 25px">{{
            store.question.question
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <br />
      <div v-if="store.question.type === 'multiple'">
        <div v-for="option in store.question.option" v-bind:key="option">
          <q-item tag="label" v-ripple>
            <q-item-section side>
              <q-checkbox disable :val="option" v-model="msq" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-size: 25px">{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
          <br />
        </div>
      </div>
      <div v-if="store.question.type === 'single'">
        <div v-for="option in store.question.option" v-bind:key="option">
          <q-item tag="label" v-ripple>
            <q-item-section side>
              <q-radio disable v-model="mcq" :val="option" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-size: 25px">{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
          <br />
        </div>
      </div>
    </q-scroll-area>
    <br />
    <br />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_navigate"
      label="Back"
      :disable="store.busy"
      @click.stop="store.getpreviousquestion()"
      text-color="info"
      push
      icon="o_arrow_back_ios_new"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_navigate"
      label="Next"
      :disable="store.busy"
      text-color="info"
      @click.stop="store.getnextquestion()"
      push
      icon-right="o_arrow_forward_ios"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.see_question_list"
      label="Questions' List"
      :disable="store.busy"
      text-color="info"
      @click.stop="seequestions()"
      push
      icon="o_receipt_long"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_end_test"
      label="End Test"
      @click.stop="store.endexam()"
      :disable="store.busy"
      text-color="negative"
      push
      icon="o_edit_off"
    />
    <br />
  </q-card>
  <q-card class="my-card" v-else>
    <q-scroll-area
      :bar-style="barStyle"
      :vertical-thumb-style="verticalthumbStyle"
      visible
      style="height: 38vh; width: 100%"
    >
      <q-item>
        <q-item-section side>
          <q-item-label style="font-size: 25px"
            >Q{{ store.question.questionnumber }}.</q-item-label
          >
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-size: 25px">{{
            store.question.question
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <br />
      <div v-if="store.question.type === 'multiple'">
        <div v-for="option in store.question.option" v-bind:key="option">
          <q-item tag="label" v-ripple>
            <q-item-section side>
              <q-checkbox :disable="store.busy" :val="option" v-model="msq" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-size: 25px">{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
          <br />
        </div>
      </div>
      <div v-if="store.question.type === 'single'">
        <div v-for="option in store.question.option" v-bind:key="option">
          <q-item tag="label" v-ripple>
            <q-item-section side>
              <q-radio :disable="store.busy" v-model="mcq" :val="option" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-size: 25px">{{ option }}</q-item-label>
            </q-item-section>
          </q-item>
          <br />
        </div>
      </div>
    </q-scroll-area>
    <br />
    <br />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_navigate"
      label="Back"
      :disable="store.busy"
      @click.stop="store.getpreviousquestion()"
      text-color="info"
      push
      icon="o_arrow_back_ios_new"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      label="Submit"
      :disable="store.busy"
      text-color="positive"
      @click.stop="submit()"
      push
      icon="o_task_alt"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_navigate"
      label="Next"
      :disable="store.busy"
      text-color="info"
      @click.stop="store.getnextquestion()"
      push
      icon-right="o_arrow_forward_ios"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_skip && !store.question.answered"
      label="Skip"
      :disable="store.busy"
      @click.stop="store.skipanswer()"
      text-color="info"
      push
      icon-right="o_skip_next"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.see_question_list"
      label="Questions' List"
      :disable="store.busy"
      text-color="info"
      @click.stop="seequestions()"
      push
      icon="o_receipt_long"
    />
    <q-btn
      style="font-size: 100%; width: 15%"
      class="q-ma-lg"
      v-if="store.instructions.can_end_test"
      label="End Test"
      @click.stop="store.endexam()"
      :disable="store.busy"
      text-color="negative"
      push
      icon="o_edit_off"
    />
    <br />
  </q-card>
  <q-dialog
    v-model="activatelist"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-toolbar>
        <q-avatar>
          <q-icon size="25px" name="o_receipt_long" />
        </q-avatar>

        <q-toolbar-title style="font-size: 25px"
          >Questions' List</q-toolbar-title
        >
      </q-toolbar>

      <q-card-section class="q-pt-none">
        <br />
        <div v-for="(q, j) in qlist" v-bind:key="q.section">
          <q-card class="my-card">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="text-h5 text-weight-medium">
                  Section: {{ q.section }}
                </div>
                <q-space />
                <q-btn
                  round
                  class="text-h5 text-weight-medium"
                  :icon="
                    expanded[j] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                  @click="expanded[j] = !expanded[j]"
                />
              </div>
            </q-card-section>

            <q-separator />

            <div v-show="expanded[j]">
              <br />
              <q-card-section v-for="(qu, i) in q.questions" v-bind:key="qu">
                <p style="font-size: 25px">Q{{ i + 1 }}. {{ qu }}</p>
                <br />
              </q-card-section>
            </div>
          </q-card>
          <br />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" size="20px" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, watch, ref } from 'vue';
import { OPE } from 'src/stores/ope';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'QaComponent',

  setup() {
    const store = OPE();
    const mcq = ref('');
    const msq = ref([]);
    watch(
      () => store.question.index,
      () => {
        if (store.question.answered === true) {
          if (store.question.type === 'single') {
            mcq.value = store.question.markedoption;
          } else if (store.question.type === 'multiple') {
            msq.value = [...store.question.markedoption];
          }
        } else {
          mcq.value = '';
          msq.value.length = 0;
        }
      }
    );
    return {
      mcq,
      msq,
      store,
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

  async beforeMount() {
    await this.store.getfirstquestion();
  },

  data() {
    return {
      expanded: [],
      qlist: [],
      activatelist: false,
    };
  },

  methods: {
    submit() {
      if (this.store.question.type === 'single' && this.mcq !== '') {
        this.store.submitanswer(this.mcq);
      } else if (
        this.store.question.type === 'multiple' &&
        this.msq.length !== 0
      ) {
        this.store.submitanswer([...this.msq]);
      } else {
        Notify.create({
          message: 'Mark your answer first',
          position: 'top',
          type: 'negative',
        });
      }
    },
    async seequestions() {
      this.qlist = await this.store.getquestionslist();
      this.expanded.length = this.qlist.length;
      this.expanded.fill(true);
      this.activatelist = true;
    },
  },
});
</script>
