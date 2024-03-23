// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TicTacToe from './components/game';
import { TttLandingPage } from './pages/ttt-landing-page';
import { ErrorPage } from './pages/error-page';
// import SignIn from '../../../gamehub/src/app/pages/SignIn';
// import SignUp from '../../../gamehub/src/app/pages/SignUp';
import { AccountProvider } from '@bb/auth-hook-lib';
import { WebsocketProvider } from './contexts/websocket-context';

function SignUp() {
  return <div>Sign up</div>;
}

function SignIn() {
  return <div>Sign in</div>;
}

const router = createBrowserRouter([
  { path: '/', Component: TttLandingPage },
  { path: '/game/:id', element: <TicTacToe /> },
  { path: '/error', element: <ErrorPage /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
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
