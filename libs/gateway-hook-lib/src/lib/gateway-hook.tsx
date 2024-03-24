import { Gateway, RouteResp } from '@bb/gateway-lib';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface GatewayContextPaylaod {
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
  const gateway = useMemo(() => new Gateway(host), [host]);

  return (
    <GatewayContext.Provider
      value={{
        getHost: gateway.GetHost,
        getAllServices: gateway.GetAllServices,
        getService: gateway.GetService,
        sendRequest: gateway.SendRequest,
      }}
    >
      {children}
    </GatewayContext.Provider>
  );
}
