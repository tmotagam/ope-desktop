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

const startexamApi = async (
  Service: IPCService,
  examid: string,
  code: string
) => {
  try {
    const result = await Service.request(
      'ope_method_startexamAPI',
      JSON.stringify({ examid: examid, code: code })
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
      instructions: JSON.parse(response.data).instructions,
      datastatus: JSON.parse(response.data).status,
      time: JSON.parse(response.data).timeremain,
      totalmarks: JSON.parse(response.data).marks,
      testname: JSON.parse(response.data).testname,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const sendimagesApi = async (
  Service: IPCService,
  images: Array<string>,
  examid: string
) => {
  try {
    const result = await Service.request(
      'ope_method_sendimagesAPI',
      JSON.stringify({ images: images, examid: examid })
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
      time: JSON.parse(response.data).timeremain,
      totalmarks: JSON.parse(response.data).marks,
      testname: JSON.parse(response.data).testname,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getfirstquestionApi = async (Service: IPCService) => {
  try {
    const result = await Service.request('ope_method_getfirstquestionAPI');
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      totalquestions: JSON.parse(response.data).totalquestions,
      question: JSON.parse(response.data).question,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getpreviousquestionApi = async (Service: IPCService, index: number) => {
  try {
    const result = await Service.request(
      'ope_method_getpreviousquestionAPI',
      JSON.stringify({ index: index })
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
      question: JSON.parse(response.data).question,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getnextquestionApi = async (Service: IPCService, index: number) => {
  try {
    const result = await Service.request(
      'ope_method_getnextquestionAPI',
      JSON.stringify({ index: index })
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
      question: JSON.parse(response.data).question,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getquestionslistApi = async (
  Service: IPCService
): Promise<{
  error?: string;
  status: number;
  list?: { section: string; questions: string[] }[];
}> => {
  try {
    const result = await Service.request('ope_method_getquestionslistAPI');
    const response = JSON.parse(result);
    if (response.status !== 200) {
      return {
        error: JSON.parse(response.data).error,
        status: response.status,
      };
    }
    return {
      status: response.status,
      list: JSON.parse(response.data).questionslist,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const submitanswerApi = async (
  Service: IPCService,
  index: number,
  answer: string | string[],
  examid: string
) => {
  try {
    const result = await Service.request(
      'ope_method_submitanswerAPI',
      JSON.stringify({ index: index, answer: answer, examid: examid })
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
      question: JSON.parse(response.data).question,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const skipanswerApi = async (
  Service: IPCService,
  index: number,
  examid: string
) => {
  try {
    const result = await Service.request(
      'ope_method_skipanswerAPI',
      JSON.stringify({ index: index, examid: examid })
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
      question: JSON.parse(response.data).question,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const endexamApi = async (Service: IPCService, id: string) => {
  try {
    const result = await Service.request(
      'ope_method_endexamAPI',
      JSON.stringify({ examid: id })
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
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

const getevalApi = async (Service: IPCService, id: string) => {
  try {
    const result = await Service.request(
      'ope_method_getevalAPI',
      JSON.stringify({ evalid: id })
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
      eval: JSON.parse(response.data).questions,
      cheated: JSON.parse(response.data).ischeated,
    };
  } catch (error) {
    return {
      error: 'Network Error',
      status: 11596,
    };
  }
};

export {
  startexamApi,
  sendimagesApi,
  getfirstquestionApi,
  getpreviousquestionApi,
  getnextquestionApi,
  getquestionslistApi,
  submitanswerApi,
  skipanswerApi,
  endexamApi,
  getevalApi,
};
