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

function EmptyCell() {
  return <div className={styles.emptyCell} />;
}

function P1Cell() {
  return <div className={styles.p1Cell} />;
}

function P2Cell() {
  return <div className={styles.p2Cell} />;
}

function Butt({ onClick }: { onClick: () => void }) {
  return <div onClick={onClick}>Butt</div>;
}

const initalState: number[][] = Array(6).fill(Array(7).fill(0));

function C4() {
  const [board, setBoard] = useState(initalState);
  const [isP1, setIsP1] = useState(true);

  // Read about useEffect

  // Read c4 for how to use Auth service and websocket context

  // Design the action flow

  // console.log

  const handleClick = (col: number) => {
    if (isP1) {
      setIsP1(false);

      setIsP1((old) => !old);

      setBoard((old) => {
        const newBoard = [...old];
        newBoard[3][col] = isP1 ? 1 : 2;
        return newBoard;
      });
    }

    console.log('P' + isP1 + ' Clicked on row ' + col);
    setIsP1((old) => !old);

    // Animations and stuff
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Connect 5</h1>

      <div id={styles.board}>
        <div id={styles.buttons}>
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Butt key={`button-${i}`} onClick={() => handleClick(i)} />
            ))}
        </div>
        {board.map((row, i) => (
          <div className={styles.row} key={`row-${i}`}>
            {row.map((cell, j) => (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {cell === 0 ? (
                  <EmptyCell key={`cell-${i + j}`} />
                ) : cell === 1 ? (
                  <P1Cell key={`cell-${i + j}`} />
                ) : (
                  <P2Cell key={`cell-${i + j}`} />
                )}
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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
        console.log(routeWs);
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
              <Route path="room/:id" Component={Room} />
              <Route path="*" Component={ErrorPage} />
            </Route>
          </Routes>
        </GetHostForProviders>
      </GatewayProvider>
    </BrowserRouter>
  );
}

export default App;
