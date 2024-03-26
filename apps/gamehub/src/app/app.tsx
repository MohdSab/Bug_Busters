// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NxWelcome from './nx-welcome';
import { AccountProvider } from '@bb/auth-hook-lib';
import GameHubPage from './pages/GameListPage';
import TicTacToeArrival from './pages/temptttpage';
import { GatewayProvider, useGateway } from '@bb/gateway-hook-lib';
import { useEffect, useState } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/nx',
    element: <NxWelcome title="bug-buster" />,
  },
  {
    path: '/gamehub',
    element: <GameHubPage />,
  },
  {
    path: '/tictactoe',
    element: <TicTacToeArrival />,
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
      host={process.env.NX_GATEWAY_HOST + ':' + process.env.NX_GATEWAY_PORT}
    >
      <Wrapper />
    </GatewayProvider>
  );
}

export default App;
