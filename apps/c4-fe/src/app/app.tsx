// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './app.module.css';

import { WebsocketProvider } from '@bb/socket-hook-lib';
import { GatewayProvider, useGateway } from '@bb/gateway-hook-lib';
import { AccountProvider } from '@bb/auth-hook-lib';

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

const c4Host = 'localhost:4032';
const c4WsPath = '/c4';

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

function GetHostForProviders() {
  const { getService, getHost, loading: gatewayLoading } = useGateway();
  const [host, setHost] = useState('localhost:3000');
  const [hostWs, setHostWs] = useState('localhost:3000');
  const [wsPath, setWsPath] = useState('/c4');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(gatewayLoading);
    if (gatewayLoading) return;

    setLoading(true);
    const ps = [
      getService(process.env.NX_C4_SERVICE_KEY || 'c4-service'),
      getService(process.env.NX_C4_WS_KEY || 'c4-ws-service'),
    ];

    Promise.all(ps)
      .then(([route, routeWs]) => {
        setHost(`${getHost()}${route.endpoint || ''}`);
        setHostWs(`${getHost()}${routeWs.endpoint}`);
        setWsPath(routeWs.endpoint);
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

  console.log('host', getHost());
  return (
    <AccountProvider host={host}>
      <WebsocketProvider host={hostWs} path={wsPath}>
        {/* <RouterProvider router={router} /> */}
        <C4 />
      </WebsocketProvider>
    </AccountProvider>
  );
}

function App() {
  return (
    <GatewayProvider
      host={`${process.env.NX_GATEWAY_HOST || 'localhost'}:${
        process.env.NX_GATEWAY_PORT || 3000
      }`}
    >
      <GetHostForProviders />
    </GatewayProvider>
  );
}

export default App;
