// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

// import NxWelcome from './nx-welcome';
import SignIn from './pages/SignIn';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './pages/SignUp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home page</div>,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

export function App() {
  return (
    <div>
      {/* <NxWelcome title="bug-buster" /> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
