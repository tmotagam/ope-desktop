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
interface IPCService {
  request: (method: string, data?: string | undefined) => Promise<string>;
}

const account_nameApi = async (Service: IPCService, name: string) => {
  try {
    const result = await Service.request(
      'ope_method_accountNameAPI',
      JSON.stringify({ name: name })
    );
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      message: JSON.parse(response.data).message,
      name: JSON.parse(response.data).name,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_getcommApi = async (Service: IPCService) => {
  try {
    const result = await Service.request('ope_method_account_getcommAPI');
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      commid: JSON.parse(response.data).commid,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_commidApi = async (Service: IPCService, commid: string) => {
  try {
    const result = await Service.request(
      'ope_method_account_commidAPI',
      JSON.stringify({ commid: commid, commtype: 'EMAIL' })
    );
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      message: JSON.parse(response.data).message,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const account_passwordApi = async (
  Service: IPCService,
  opass: string,
  npass: string,
  cnpass: string
) => {
  try {
    const result = await Service.request(
      'ope_method_accountpasswordAPI',
      JSON.stringify({
        currentpassword: opass,
        newpassword: npass,
        confirmpassword: cnpass,
      })
    );
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      message: JSON.parse(response.data).message,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const refreshtokenApi = async (Service: IPCService) => {
  try {
    const result = await Service.request('ope_method_refreshtoken');
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const logoutApi = async (Service: IPCService) => {
  try {
    const result = await Service.request('ope_method_logout');
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      message: JSON.parse(response.data).msg,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

export {
  account_nameApi,
  account_getcommApi,
  account_commidApi,
  account_passwordApi,
  refreshtokenApi,
  logoutApi,
};
