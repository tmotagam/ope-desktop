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
  <q-page>
    <br />
    <q-card class="my-card" flat bordered>
      <br v-if="instructions.can_skip" />
      <q-splitter
        v-if="instructions.can_skip"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>Skip Questions</q-item-label>
                <q-item-label caption
                  >This button is used for skipping any question in the test
                  paper.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 80%"
              class="q-ml-lg"
              label="Skip"
              text-color="info"
              push
              icon="o_skip_next"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="instructions.can_skip" />
      <br v-if="instructions.can_navigate" />
      <q-splitter
        v-if="instructions.can_navigate"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>Back Button</q-item-label>
                <q-item-label caption
                  >This button is used for going back to previous question that
                  you were attempting before the current question.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 50%"
              class="q-ml-lg"
              label="Back"
              text-color="info"
              push
              icon="o_arrow_back_ios_new"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="instructions.can_navigate" />
      <br v-if="instructions.can_navigate" />
      <q-splitter
        v-if="instructions.can_navigate"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>Next Button</q-item-label>
                <q-item-label caption
                  >This button is used for going forward to the next question in
                  the question paper.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 50%"
              class="q-ml-lg"
              label="Next"
              text-color="info"
              push
              icon-right="o_arrow_forward_ios"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="instructions.can_navigate" />
      <br v-if="instructions.submit_means_final" />
      <q-splitter
        v-if="instructions.submit_means_final"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>Submit Button</q-item-label>
                <q-item-label caption
                  >This button is used for submitting the question`s answer once
                  submitted the answer cannot be changed.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 60%"
              class="q-ml-lg"
              label="Submit"
              text-color="positive"
              push
              icon="o_task_alt"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="instructions.submit_means_final" />
      <br v-if="!instructions.submit_means_final" />
      <q-splitter
        v-if="!instructions.submit_means_final"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>Submit Button</q-item-label>
                <q-item-label caption
                  >This button is used for submitting the question`s answer you
                  can change the answer even after the submission as
                  well.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 60%"
              class="q-ml-lg"
              label="Submit"
              text-color="positive"
              push
              icon="o_done"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="!instructions.submit_means_final" />
      <br v-if="instructions.can_end_test" />
      <q-splitter
        v-if="instructions.can_end_test"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>End Test Button</q-item-label>
                <q-item-label caption
                  >This button is used for ending the examination and submitting
                  the paper for the evaluation.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 60%"
              class="q-ml-lg"
              label="End Test"
              text-color="negative"
              push
              icon="o_edit_off"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="instructions.can_end_test" />
      <br v-if="instructions.see_question_list" />
      <q-splitter
        v-if="instructions.see_question_list"
        v-model="split"
        :separator-style="{ backgroundColor: 'white' }"
        disable
      >
        <template v-slot:before>
          <q-card-section class="q-ml-lg" horizontal>
            <q-item>
              <q-item-section horizontal>
                <q-item-label>Question`s List Button</q-item-label>
                <q-item-label caption
                  >This button is used for seeing the test paper and its
                  sections.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-card-section>
        </template>
        <template v-slot:after>
          <q-card-actions vertical class="q-ml-lg">
            <q-btn
              style="font-size: 100%; width: 80%"
              class="q-ml-lg"
              label="Question`s List"
              text-color="info"
              push
              icon="o_receipt_long"
            />
          </q-card-actions>
        </template>
      </q-splitter>
      <br v-if="instructions.see_question_list" />
    </q-card>
    <br />
    <div class="row justify-center items-center">
      <q-btn
        style="font-size: 100%"
        label="Start Test"
        @click="verification"
        text-color="positive"
        push
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { OPE } from 'src/stores/ope';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'InstructionsPage',
  setup() {
    const store = OPE();
    const instructions = store.instructions;
    const verification = () => store.setRoute('/test/verification');
    return {
      instructions,
      split: 75,
      verification,
    };
  },
});
</script>
