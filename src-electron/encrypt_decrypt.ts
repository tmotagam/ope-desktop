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
import {
  randomBytes,
  createSecretKey,
  createCipheriv,
  createDecipheriv,
} from 'crypto';

const Encrypt = (data: string, key: string): Buffer[] => {
  const iv = randomBytes(600);
  const cipher = createCipheriv(
    'aes-256-gcm',
    createSecretKey(Buffer.from(JSON.parse(key).k, 'base64')).export(),
    iv
  );
  return [
    Buffer.concat([
      cipher.update(typeof data === 'string' ? Buffer.from(data) : data),
      cipher.final(),
    ]),
    cipher.getAuthTag(),
    iv,
  ];
};

const Decrypt = (
  iv: Buffer,
  authTag: Buffer,
  data: Buffer,
  key: string
): Buffer => {
  const decipher = createDecipheriv(
    'aes-256-gcm',
    createSecretKey(Buffer.from(JSON.parse(key).k, 'base64')).export(),
    iv
  ).setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
};

export { Encrypt, Decrypt };
