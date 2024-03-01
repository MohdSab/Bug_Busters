import { Account } from '../types/account';

export interface SignUpPayload {
  username: string;
  password: string;
}

// TODO will have to use the API Gateway, for now, directly call
// the auth-service
const hostUrl = 'http://localhost:3000';
const hostAPIUrl = `${hostUrl}/api`;

export function getImageUrl(uri: string): string {
  return `${hostUrl}${uri}`;
}

export function getAccount(): Promise<Account | null> {
  // Get access_token from local storage
  const access_token = localStorage.getItem('access_token');

  if (!access_token) {
    console.log('no token');
    return Promise.resolve(null);
  }

  return fetch(`${hostAPIUrl}/account`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return {
        uid: res.uid,
        username: res.username,
        profile: res.profile,
      };
    });
}

export function signin(
  username: string,
  password: string
): Promise<Account | null> {
  // Call signin API to get token
  return fetch(`${hostAPIUrl}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.access_token) {
        // Save token to localstorage
        localStorage.setItem('access_token', res.access_token);

        // Use getAccount with the token to get account data
        return getAccount();
      } else {
        return null;
      }
    });
}

export function signinGuest(): Promise<Account | null>{
  return fetch(`${hostAPIUrl}/signinGuest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((res) => res.json())
  .then((res) => {
    if (res.access_token) {
      // Save token to localstorage
      localStorage.setItem('access_token', res.access_token);

      // Use getAccount with the token to get account data
      return getAccount();
    } else {
      return null;
    }
  })
  
}

export function signup(data: SignUpPayload): Promise<Account | null> {
  return fetch(`${hostAPIUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.access_token) {
        // Save token to localstorage
        localStorage.setItem('access_token', res.access_token);

        // Use getAccount with the token to get account data
        return getAccount();
      } else {
        return null;
      }
    });
}

export function signout(): Promise<void> {
  // Clear access_token from local storage
  localStorage.removeItem('access_token');

  return Promise.resolve();
}
