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

export function App() {
  return (
    <AccountProvider host={'localhost:3000/api/service/auth'}>
      <RouterProvider router={router} />
    </AccountProvider>
  );
}

export default App;
