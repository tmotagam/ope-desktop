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
      </q-toolbar>
      <q-linear-progress
        indeterminate
        stripe
        v-if="store.busy && $route.path !== '/test/testboard'"
      />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { OPE } from 'src/stores/ope';

export default defineComponent({
  name: 'TestLayout',
  setup() {
    const store = OPE();
    return {
      store,
    };
  },
});
</script>
