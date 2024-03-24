import { Account } from './account.type';

export interface SignUpPayload {
  username: string;
  password: string;
}

export class AuthApi {
  constructor(private host: string) {}

  setAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }

  getHost() {
    return this.host;
  }

  signin(username: string, password: string): Promise<Account | null> {
    // Call signin API to get token
    return fetch(`http://${this.host}/signin`, {
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

    return fetch(`http://${this.host}/account`, {
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
    return fetch(`http://${this.host}/signup`, {
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
}
