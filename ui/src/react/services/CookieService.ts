/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const TOKEN_KEY = 'token';
const tokenDuration = 1000 * 60 * 60 * 24 * 2;

const CookieService = {
  setToken: (token: string): void => {
    const expiresDate = new Date(Date.now() + tokenDuration);
    const expires = expiresDate.toUTCString();
    document.cookie = `${TOKEN_KEY}=${token};expires=${expires};path=/`;
  },

  getToken: (): string => {
    let token = null;
    const cookie = document.cookie;
    const keyIndex = cookie.indexOf(`${TOKEN_KEY}=`);
    if (keyIndex >= 0) {
      const cookieMinusKey = cookie.substr(keyIndex + TOKEN_KEY.length + 1);
      token = cookieMinusKey.split(';')[0];
    }
    return token;
  },

  clearToken: (): void => {
    document.cookie = `${TOKEN_KEY}=;expires=-99999999;path=/`;
  },
};

export default CookieService;