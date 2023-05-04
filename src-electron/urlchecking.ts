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
const split = (uri: string) => {
  return uri.match(
    /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  );
};

const urlcheck = (value: string) => {
  if (!value) {
    return;
  }

  if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value))
    return;

  if (/%[^0-9a-f]/i.test(value)) return;
  if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;

  let splitted: RegExpMatchArray | null = [''];
  let scheme = '';
  let authority = '';
  let path = '';
  let query = '';
  let fragment = '';
  let out = '';

  splitted = split(value);
  if (splitted === null) return;
  scheme = splitted[1];
  authority = splitted[2];
  path = splitted[3];
  query = splitted[4];
  fragment = splitted[5];

  if (!(scheme && scheme.length && path.length >= 0)) return;

  if (authority && authority.length) {
    if (!(path.length === 0 || /^\//.test(path))) return;
  } else {
    if (/^\/\//.test(path)) return;
  }

  if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) return;

  out += scheme + ':';
  if (authority && authority.length) {
    out += '//' + authority;
  }

  out += path;

  if (query && query.length) {
    out += '?' + query;
  }

  if (fragment && fragment.length) {
    out += '#' + fragment;
  }

  return out;
};

export { split, urlcheck };
