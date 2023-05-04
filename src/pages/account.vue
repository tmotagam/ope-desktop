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
  <q-page class="flex flex-center row justify-center items-center">
    <q-card style="width: 50%" class="my-card" flat bordered>
      <br />
      <q-card class="my-card">
        <q-card-section horizontal>
          <q-item>
            <q-item-section horizontal>
              <q-item-label>Communication</q-item-label>
              <q-item-label caption
                >Change your email address here</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-space />
          <q-card-actions vertical class="q-mr-sm justify-around">
            <q-btn
              style="font-size: 100%"
              @click.stop="comm"
              label="Edit"
              text-color="info"
              push
              icon="o_edit"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      <br />
      <q-separator />
      <br />
      <q-card class="my-card">
        <q-card-section horizontal>
          <q-item>
            <q-item-section horizontal>
              <q-item-label>Password</q-item-label>
              <q-item-label caption>Change your password here</q-item-label>
            </q-item-section>
          </q-item>
          <q-space />
          <q-card-actions vertical class="q-mr-sm justify-around">
            <q-btn
              style="font-size: 100%"
              @click.stop="passworddialog = true"
              label="Edit"
              text-color="info"
              push
              icon="o_edit"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      <br />
      <q-separator />
      <br />
      <q-card class="my-card">
        <q-card-section horizontal>
          <q-item>
            <q-item-section horizontal>
              <q-item-label>Name</q-item-label>
              <q-item-label caption>Change your name here</q-item-label>
            </q-item-section>
          </q-item>
          <q-space />
          <q-card-actions vertical class="q-mr-sm justify-around">
            <q-btn
              style="font-size: 100%"
              @click.stop="namedialog = true"
              label="Edit"
              text-color="info"
              push
              icon="o_edit"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      <br />
      <q-separator />
      <br />
      <q-card class="my-card">
        <q-card-section horizontal>
          <q-item>
            <q-item-section horizontal>
              <q-item-label>Logout</q-item-label>
              <q-item-label caption>Logout from OPE</q-item-label>
            </q-item-section>
          </q-item>
          <q-space />
          <q-card-actions vertical class="q-mr-sm justify-around">
            <q-btn
              style="font-size: 100%"
              @click.stop="logout()"
              label="Logout"
              text-color="negative"
              push
              icon="o_logout"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      <br />
    </q-card>
  </q-page>

  <q-dialog
    v-model="communicationdialog"
    :maximized="true"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-black">
      <q-page class="flex flex-center row justify-center items-center">
        <q-card flat style="width: 40%">
          <q-card-section>
            <p style="font-size: 20px">Current Email</p>
            <q-input
              :model-value="store.commid"
              rounded
              color="primary"
              outlined
              readonly
            />
            <p class="q-pt-xl" style="font-size: 20px">New Email</p>
            <q-input
              v-model="commid"
              rounded
              color="primary"
              autocomplete="on"
              hint="Enter your new email here"
              outlined
              :rules="[(val) => !!val || 'Field is required']"
            />
            <div class="row justify-center">
              <q-btn
                class="q-mt-xl col-4 on-left"
                @click.stop="sendcomm"
                style="font-size: 120%; width: 45%"
                size="20px"
                color="white"
                text-color="positive"
                label="Change Email"
              />
              <q-btn
                class="q-mt-xl col-1 on-right"
                style="font-size: 120%; width: 45%"
                size="20px"
                color="white"
                text-color="negative"
                label="Close"
                @click.stop="close()"
                v-close-popup
              />
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="passworddialog"
    :maximized="true"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-black">
      <q-page class="flex flex-center row justify-center items-center">
        <q-card flat style="width: 40%">
          <q-card-section>
            <form>
              <p style="font-size: 20px">Current Password</p>
              <q-input
                v-model="opass"
                rounded
                type="password"
                color="info"
                autocomplete="on"
                hint="Enter your current password here"
                outlined
                :rules="[(val) => !!val || 'Field is required']"
              />
              <p class="q-pt-xl" style="font-size: 20px">New Password</p>
              <q-input
                v-model="npass"
                rounded
                type="password"
                color="info"
                autocomplete="on"
                hint="Enter your new password here"
                outlined
                :rules="[(val) => !!val || 'Field is required']"
              />
              <p class="q-pt-xl" style="font-size: 20px">
                Confirm New Password
              </p>
              <q-input
                v-model="cnpass"
                rounded
                type="password"
                color="info"
                autocomplete="on"
                hint="Enter your new password here again"
                outlined
                :rules="[(val) => val === npass || 'Password is not matching']"
              />
            </form>
            <div class="row justify-center">
              <q-btn
                class="q-mt-xl col-4 on-left"
                @click.stop="sendpassword"
                style="font-size: 105%; width: 45%"
                size="20px"
                color="white"
                text-color="positive"
                label="Change Password"
              />
              <q-btn
                class="q-mt-xl col-1 on-right"
                style="font-size: 105%; width: 45%"
                size="20px"
                color="white"
                text-color="negative"
                label="Close"
                @click.stop="close()"
                v-close-popup
              />
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="namedialog"
    :maximized="true"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-black">
      <q-page class="flex flex-center row justify-center items-center">
        <q-card flat style="width: 40%">
          <q-card-section>
            <p style="font-size: 20px">Name</p>
            <q-input
              v-model="name"
              rounded
              color="info"
              autocomplete="on"
              hint="Enter your new name"
              outlined
              :rules="[(val) => !!val || 'Field is required']"
            />
            <div class="row justify-center">
              <q-btn
                @click.stop="sendname"
                class="q-mt-xl col-4 on-left"
                style="font-size: 120%; width: 45%"
                size="20px"
                color="white"
                text-color="positive"
                label="Edit name"
              />
              <q-btn
                class="q-mt-xl col-1 on-right"
                style="font-size: 120%; width: 45%"
                size="20px"
                color="white"
                text-color="negative"
                label="Close"
                @click.stop="close()"
                v-close-popup
              />
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Notify } from 'quasar';
import { OPE } from 'src/stores/ope';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AccountPage',

  setup() {
    const store = OPE();
    return {
      store,
    };
  },

  data() {
    return {
      communicationdialog: false,
      passworddialog: false,
      namedialog: false,
      name: <string | null>null,
      npass: <string | null>null,
      cnpass: <string | null>null,
      opass: <string | null>null,
      commid: <string | null>null,
    };
  },

  methods: {
    sendname() {
      if (this.name === null || this.name.trim().length === 0) {
        return Notify.create({
          message: 'Please enter your new name correctly',
          position: 'top',
          type: 'negative',
        });
      }
      this.namedialog = false;
      this.store.editname(this.name);
    },
    sendcomm() {
      if (this.commid === null || this.commid.trim().length === 0) {
        return Notify.create({
          message: 'Please enter your new communication Id correctly',
          position: 'top',
          type: 'negative',
        });
      }
      this.communicationdialog = false;
      this.store.editcommid(this.commid);
    },
    sendpassword() {
      if (this.opass === null || this.opass.trim().length === 0) {
        return Notify.create({
          message: 'Please enter your current password correctly',
          position: 'top',
          type: 'negative',
        });
      }
      if (this.npass === null || this.npass.trim().length === 0) {
        return Notify.create({
          message: 'Please enter your new password correctly',
          position: 'top',
          type: 'negative',
        });
      }
      if (this.cnpass !== this.npass) {
        return Notify.create({
          message: 'Please confirm your new password',
          position: 'top',
          type: 'negative',
        });
      }
      this.passworddialog = false;
      this.store.editpassword(this.opass, this.npass, this.cnpass);
    },
    comm() {
      this.store.getcommid();
      this.communicationdialog = true;
    },
    close() {
      this.name = null;
      this.npass = null;
      this.cnpass = null;
      this.opass = null;
      this.commid = null;
    },
    logout() {
      this.store.logout();
    },
  },
});
</script>
