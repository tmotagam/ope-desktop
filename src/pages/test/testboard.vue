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
  <br /><br /><br /><br />
  <div class="fit row inline justify-between">
    <div class="q-mr-lg q-ml-lg col-9">
      <QaComponent />
    </div>
    <div class="q-mr-lg col-2">
      <InfoComponent />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InfoComponent from 'components/infoComponent.vue';
import QaComponent from 'components/QaComponent.vue';

export default defineComponent({
  name: 'testBoard',

  components: {
    InfoComponent,
    QaComponent,
  },
});
</script>
