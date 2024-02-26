import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Account } from './account.type';
import { SignUpPayload, getAccount, setAccessToken, signin, signout, signup } from './auth.api';

interface AccountContextPaylaod {
  loading: boolean;
  account: Account | null;
  signin: (username: string, password: string) => Promise<Account | null>;
  signup: (data: SignUpPayload) => Promise<Account | null>;
  signout: () => Promise<void>;
  useAccessToken: (token: string) => Promise<Account | null>;
}

export const AccountContext = createContext<AccountContextPaylaod>({
  loading: true,
  account: null,
  signin: (_, __) => Promise.resolve(null),
  signup: (_) => Promise.resolve(null),
  signout: () => Promise.resolve(),
  useAccessToken: (_) => Promise.resolve(null)
});

export function useAccount() {
  return useContext(AccountContext);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function AccountProvider({ children }: PropsWithChildren<{}>) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const signinn = (username: string, password: string) => {
    if (loading) {
      console.log('Some account action is in progress, cannot perform signin');
    }
    setLoading(true);
    return signin(username, password).then((account) => {
      setLoading(false);
      setAccount(account);
      return account;
    });
  };

  const signoutt = () => {
    if (loading) {
      console.log('Some account action is in progress, cannot perform signout');
    }
    setLoading(true);
    return signout().then(() => {
      setLoading(false);
      setAccount(null);
    });
  };

  const signupp = (data: SignUpPayload) => {
    if (loading) {
      console.log('Some account action is in progress, cannot perform signup');
    }

    setLoading(true);
    return signup(data).then((data) => {
      setLoading(false);
      setAccount(data);
      return data;
    });
  };

  const useAccessToken = (accessToken: string) => {
    setAccessToken(accessToken);
    setLoading(true);
    setAccount(null);
    return getAccount().then(acc => {
      setLoading(false);
      setAccount(acc);
      return acc;
    });
  }

  useEffect(() => {
    getAccount().then((account) => {
      setAccount(account);
      setLoading(false);
    });
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        loading,
        signin: signinn,
        signout: signoutt,
        signup: signupp,
        useAccessToken
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
