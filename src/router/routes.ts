// OPE Desktop Application
// Copyright (C) 2020-2023  Motagamwala Taha Arif Ali

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/login.vue') },
      { path: 'mainpage', component: () => import('src/pages/mainpage.vue') },
      { path: 'account', component: () => import('src/pages/account.vue') },
      { path: 'result', component: () => import('src/pages/result.vue') },
    ],
  },

  {
    path: '/test',
    component: () => import('layouts/TestLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/test/instructions.vue') },
      {
        path: 'verification',
        component: () => import('src/pages/test/verification.vue'),
      },
      {
        path: 'testboard',
        component: () => import('src/pages/test/testboard.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
