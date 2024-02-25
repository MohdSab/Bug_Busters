// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import TicTacToe from './components/game';
import { TttLandingPage } from './pages/ttt-landing-page';
import { ErrorPage } from './pages/error-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AccountProvider } from '../../../gamehub/src/app/hooks/account';

const router = createBrowserRouter([
  { path: '/', element: <TttLandingPage /> },
  { path: '/game/:id', element: <TicTacToe /> },
  { path: '/error', element: <ErrorPage /> }
]);

export function App() {
  return (
    <div>
      <AccountProvider>
        <RouterProvider router={router} />
      </AccountProvider>
    </div>
  );
}

export default App;
