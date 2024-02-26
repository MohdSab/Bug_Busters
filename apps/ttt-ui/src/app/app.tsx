// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TicTacToe from './components/game';
import { TttLandingPage } from './pages/ttt-landing-page';
import { ErrorPage } from './pages/error-page';
import { AccountProvider } from '@bb/auth-hook-lib';
import { WebsocketProvider } from './contexts/websocket-context';

const router = createBrowserRouter([
  { path: '/', Component: TttLandingPage  },
  { path: '/game/:id', element: <TicTacToe /> },
  { path: '/error', element: <ErrorPage /> },
]);

export function App() {
  return (
    <AccountProvider>
      <WebsocketProvider>
        <RouterProvider router={router} />
      </WebsocketProvider>
    </AccountProvider>
  );
}

export default App;
