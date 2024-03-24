import { Account } from './account.type';

export interface SignUpPayload {
  username: string;
  password: string;
}

export class AuthApi {
  hostApiUrl: string;
  constructor(private host: string) {
    this.hostApiUrlApiUrl = host + '/api';
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }

  getHost() {
    return this.hostApiUrl;
  }

  signin(username: string, password: string): Promise<Account | null> {
    // Call signin API to get token
    return fetch(`http://${this.hostApiUrl}/signin`, {
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
          return this.getAccount();
        } else {
          return null;
        }
      });
  }

  getAccount(): Promise<Account | null> {
    // Get access_token from local storage
    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
      console.log('no token');
      return Promise.resolve(null);
    }

    return fetch(`http://${this.hostApiUrl}/account`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return {
          uid: res.uid,
          username: res.username,
          profile: res.profile,
        };
      });
  }

  signup(data: SignUpPayload): Promise<Account | null> {
    return fetch(`http://${this.hostApiUrl}/signup`, {
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
          return this.getAccount();
        } else {
          return null;
        }
      });
  }

  signout(): Promise<void> {
    // Clear access_token from local storage
    localStorage.removeItem('access_token');

    return Promise.resolve();
  }

  getAvatars(): Promise<string[]> {
    return fetch(this.hostApiUrl + '/avatars')
      .then((res) => res.json() as Promise<string[]>)
      .then((avatars) => avatars.map((a) => this.host + a))
      .catch((err) => {
        console.error(err);
        return [];
      });
  }
}
