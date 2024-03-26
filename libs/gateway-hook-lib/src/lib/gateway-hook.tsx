import { Gateway, RouteResp } from '@bb/gateway-lib';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

interface GatewayContextPaylaod {
  loading: boolean;
  getHost: () => string;
  getAllServices: () => Promise<RouteResp[]>;
  getService: (key: string) => Promise<RouteResp>;
  sendRequest: (
    key: string,
    endpoint: string,
    reqData: RequestInit
  ) => Promise<Response>;
}

export const GatewayContext = createContext<GatewayContextPaylaod>({
  loading: true,
  getHost: () => '',
  getAllServices: () => Promise.resolve([]),
  getService: (key: string) => Promise.resolve(null as unknown as RouteResp),
  sendRequest: (key: string, endpoint: string, reqData: RequestInit) =>
    Promise.resolve(null as unknown as Response),
});

export function useGateway() {
  return useContext(GatewayContext);
}

interface Props extends PropsWithChildren<object> {
  host: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function GatewayProvider({ host, children }: Props) {
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState(new Gateway(host));

  useEffect(() => {
    setGateway(new Gateway(host));
    setLoading(false);
  }, [host]);

  return (
    <GatewayContext.Provider
      value={{
        loading,
        getHost: () => gateway.GetHost(),
        getAllServices: () => gateway.GetAllServices(),
        getService: (key) => gateway.GetService(key),
        sendRequest: (a, b, c) => gateway.SendRequest(a, b, c),
      }}
    >
      {children}
    </GatewayContext.Provider>
  );
}
