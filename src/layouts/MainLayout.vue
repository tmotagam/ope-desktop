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
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-white text-black"
      style="-webkit-app-region: drag"
      elevated
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            class="on-right on-left"
            src="icons/favicon-128x128.png"
            style="height: 30px; width: 50px"
          />
        </q-toolbar-title>
        <q-btn
          v-if="store.route === '/mainpage' && store.devicedetection === false"
          rounded
          style="-webkit-app-region: no-drag"
          class="q-mr-md"
          push
          @click.stop="account()"
          textColor="primary"
          :label="'Hi ' + store.name"
          icon="o_manage_accounts"
        />
        <q-btn
          v-if="store.route === '/mainpage' && store.devicedetection === false"
          rounded
          style="-webkit-app-region: no-drag"
          class="q-mr-md"
          push
          @click.stop="result()"
          textColor="primary"
          label="Result Page"
          icon="o_grading"
        />
        <q-btn
          v-if="store.route === '/account' && store.devicedetection === false"
          rounded
          style="-webkit-app-region: no-drag"
          class="q-mr-md"
          push
          @click.stop="back()"
          textColor="primary"
          label="Back"
          icon="o_arrow_back_ios_new"
        />
        <q-btn
          v-if="store.route === '/result' && store.devicedetection === false"
          rounded
          style="-webkit-app-region: no-drag"
          class="q-mr-md"
          push
          @click.stop="reback()"
          textColor="primary"
          label="Back"
          icon="o_arrow_back_ios_new"
        />
        <q-btn
          round
          @click.stop="minimize()"
          style="-webkit-app-region: no-drag"
          class="q-mr-md"
          flat
          color="primary"
          icon="remove"
        />
        <q-btn
          round
          @click.stop="quit()"
          style="-webkit-app-region: no-drag"
          class="q-mr-md"
          flat
          color="negative"
          icon="close"
        />
      </q-toolbar>
      <q-linear-progress indeterminate stripe v-if="store.busy" />
    </q-header>

    <q-page-container>
      <Suspense>
        <router-view />
      </Suspense>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { OPE } from 'src/stores/ope';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const store = OPE();
    const quit = async () => await store.Service.request('ope_method_quit');
    const minimize = async () =>
      await store.Service.request('ope_method_minimize');
    const account = async () => store.setRoute('/account');
    const result = async () => store.setRoute('/result');
    const back = async () => store.setRoute('/mainpage');
    const reback = async () => {
      store.show = false;
      store.setRoute('/mainpage');
    };
    return {
      quit,
      store,
      result,
      reback,
      account,
      back,
      minimize,
    };
  },
});
</script>
