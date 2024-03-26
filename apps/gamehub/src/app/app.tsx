// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AccountProvider, SignIn, SignUp } from '@bb/auth-hook-lib';
import { GatewayProvider, useGateway } from '@bb/gateway-hook-lib';
import Homepage from './pages/Homepage';
import NxWelcome from './nx-welcome';
import GameHubPage from './pages/GameListPage';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'nx',
        element: <NxWelcome title="bug-buster" />,
      },
      {
        path: 'gamehub',
        element: <GameHubPage />,
      },
    ],
  },
]);

function Wrapper() {
  const { getService, getHost } = useGateway();
  const [loading, setLoading] = useState(true);
  const [authHost, setAuthHost] = useState('');

  useEffect(() => {
    getService(process.env.NX_AUTH_SERVICE_KEY || 'auth').then((route) => {
      if (route) {
        setAuthHost(getHost() + route.endpoint);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AccountProvider host={authHost}>
      <RouterProvider router={router} />
    </AccountProvider>
  );
}

export function App() {
  return (
    <GatewayProvider
      host={
        (process.env.NX_GATEWAY_HOST || 'localhost') +
        ':' +
        (process.env.NX_GATEWAY_PORT || '3000')
      }
    >
      <Wrapper />
    </GatewayProvider>
  );
}

export default App;
