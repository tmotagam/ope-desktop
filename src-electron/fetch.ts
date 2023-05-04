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
import axios from 'axios';
import { FormData } from 'formdata-node/@type/FormData';

const sendRequest = async (
  url: string,
  method: string,
  payload?: string | FormData,
  authHeader?: string
) => {
  if (method === 'GET') {
    try {
      const res = await axios.get(url, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${authHeader}` },
      });
      return JSON.stringify({
        status: res.status,
        data: JSON.stringify(res.data),
      });
    } catch (error) {
      return JSON.stringify({
        status: 11596,
        data: 'Error',
      });
    }
  } else if (method === 'POST') {
    if (typeof payload === 'string') {
      const res = await axios.post(url, JSON.parse(payload), {
        validateStatus: () => true,
        headers: {
          Authorization: `Bearer ${authHeader}`,
        },
      });
      return JSON.stringify({
        status: res.status,
        data: JSON.stringify(res.data),
      });
    } else if (payload !== undefined) {
      const res = await axios.post(url, payload, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${authHeader}` },
      });
      return JSON.stringify({
        status: res.status,
        data: JSON.stringify(res.data),
      });
    } else {
      throw new Error('Payload not correct');
    }
  } else {
    throw new Error('Method not correct');
  }
};

export { sendRequest };
