// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  // createBrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import styles from './app.module.css';

import { WebsocketProvider } from '@bb/socket-hook-lib';
import { GatewayProvider, useGateway } from '@bb/gateway-hook-lib';
import { AccountProvider, SignIn, SignUp } from '@bb/auth-hook-lib';

import LandingPage from './pages/LandingPage';
import Room from './pages/Room';
import ErrorPage from './pages/ErrorPage';
import Layout from './components/Layout';

function C4() {}

// const router = createBrowserRouter([
//   { path: '/', element: <LandingPage /> },
//   { path: '/game/:id', element: <Room /> },
//   { path: '/error', element: <ErrorPage /> },
//   { path: '/signin', element: <SignIn /> },
//   { path: '/signup', element: <SignUp /> },
// ]);

function GetHostForProviders({ children }: React.PropsWithChildren<object>) {
  const { getService, getHost, loading: gatewayLoading } = useGateway();
  const [authHost, setAuthHost] = useState('localhost:3000');
  const [hostWs, setHostWs] = useState('localhost:3000');
  const [loading, setLoading] = useState(true);

  const serviceKey = useMemo(
    () => process.env.NX_C4_WS_SERVICE || 'c4-ws-service',
    []
  );

  useEffect(() => {
    console.log(gatewayLoading);
    if (gatewayLoading) return;

    setLoading(true);
    const ps = [
      getService(process.env.NX_AUTH_SERVICE || 'auth'),
      getService(process.env.NX_C4_WS || 'c4-ws-service'),
    ];

    Promise.all(ps)
      .then(([route, routeWs]) => {
        setAuthHost(`${getHost()}${route.endpoint || ''}`);
        setHostWs(`${getHost()}${routeWs.endpoint}`);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [getService, getHost, gatewayLoading]);

  if (loading) {
    return <div>Loading....</div>;
  }
  console.log('Wshost: ', hostWs);

  return (
    <AccountProvider host={authHost}>
      <WebsocketProvider host={hostWs} serviceKey={serviceKey}>
        {children}
      </WebsocketProvider>
    </AccountProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GatewayProvider
        host={`${process.env.NX_GATEWAY_HOST || 'localhost'}:${
          process.env.NX_GATEWAY_PORT || 3000
        }`}
      >
        <GetHostForProviders>
          <Routes>
            <Route path="/" Component={Layout}>
              <Route index Component={LandingPage} />
              <Route path="signin" Component={SignIn} />
              <Route path="signup" Component={SignUp} />
              <Route path="game/:id" Component={Room} />
              <Route path="error" Component={ErrorPage} />
            </Route>
          </Routes>
        </GetHostForProviders>
      </GatewayProvider>
    </BrowserRouter>
  );
}

export default App;
