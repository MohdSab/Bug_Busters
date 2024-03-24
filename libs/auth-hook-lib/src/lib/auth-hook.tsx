import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Account } from './account.type';
import { AuthApi, SignUpPayload } from './auth.api';

interface AccountContextPaylaod {
  loading: boolean;
  account: Account | null;
  setLoading: (loading: boolean) => void;
  signin: (username: string, password: string) => Promise<Account | null>;
  signup: (data: SignUpPayload) => Promise<Account | null>;
  signout: () => Promise<void>;
  useAccessToken: (token: string) => Promise<Account | null>;
}

export const AccountContext = createContext<AccountContextPaylaod>({
  loading: true,
  account: null,
  setLoading: (loading: boolean) => {},
  signin: (_, __) => Promise.resolve(null),
  signup: (_) => Promise.resolve(null),
  signout: () => Promise.resolve(),
  useAccessToken: (_) => Promise.resolve(null),
});

export function useAccount() {
  return useContext(AccountContext);
}

interface Props extends PropsWithChildren<object> {
  host: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function AccountProvider({ host, children }: Props) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const authApi = useMemo(() => new AuthApi(host), [host]);

  const signinn = (username: string, password: string) => {
    if (loading) {
      console.log('Some account action is in progress, cannot perform signin');
    }
    setLoading(true);
    return authApi.signin(username, password).then((account) => {
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
    return authApi.signout().then(() => {
      setLoading(false);
      setAccount(null);
    });
  };

  const signupp = (data: SignUpPayload) => {
    if (loading) {
      console.log('Some account action is in progress, cannot perform signup');
    }

    setLoading(true);
    return authApi.signup(data).then((data) => {
      setLoading(false);
      setAccount(data);
      return data;
    });
  };

  const useAccessToken = (accessToken: string) => {
    authApi.setAccessToken(accessToken);
    setLoading(true);
    setAccount(null);
    return authApi.getAccount().then((acc) => {
      setLoading(false);
      setAccount(acc);
      return acc;
    });
  };

  useEffect(() => {
    authApi.getAccount().then((account) => {
      setAccount(account);
      setLoading(false);
    });
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        loading,
        setLoading,
        signin: signinn,
        signout: signoutt,
        signup: signupp,
        useAccessToken,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
