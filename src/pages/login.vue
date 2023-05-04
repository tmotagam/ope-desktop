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
    <div v-if="detail === true" class="q-gutter-md">
      <div class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          color="white"
          text-color="positive"
          @click.stop="login"
          label="Login into ope"
        />
      </div>
    </div>
    <div v-if="detail === false" style="width: 50%" class="q-gutter-md">
      <q-input
        color="primary"
        autocomplete="on"
        rounded
        v-model="url"
        outlined
        placeholder="Enter URL"
        :rules="[(val) => !!val || 'Field is required']"
      />
      <div class="row justify-center">
        <q-btn
          style="font-size: 120%"
          push
          color="white"
          @click.stop="enterurl(url)"
          text-color="positive"
          label="Submit"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Notify } from 'quasar';
import { OPE } from 'src/stores/ope';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LoginPage',

  setup() {
    let detail = ref<boolean | null>(null);
    const store = OPE();
    store.Service.request('ope_method_init')
      .then((data) => {
        if (data === 'true') detail.value = true;
      })
      .catch((err) => {
        if (err === 'false') {
          detail.value = false;
        }
      });
    const enterurl = async (url: string | null) => {
      if (url === null || url.trim().length === 0) {
        Notify.create({
          message: 'Please enter the url correctly',
          position: 'top',
          type: 'negative',
        });
        return;
      }
      try {
        const data = await store.Service.request('ope_method_saveurl', url);
        Notify.create({
          message: data,
          position: 'top',
          type: 'positive',
        });
        detail.value = true;
        return;
      } catch (error) {
        Notify.create({
          message: 'URL is not correct',
          position: 'top',
          type: 'negative',
        });
        return;
      }
    };
    return {
      store,
      detail,
      enterurl,
    };
  },

  methods: {
    async login() {
      this.store.Service.request('ope_method_login');
    },
  },

  data() {
    return {
      url: <string | null>null,
    };
  },
});
</script>
