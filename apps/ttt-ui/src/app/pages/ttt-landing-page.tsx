import React, { useEffect, useMemo } from 'react';
import styles from './landing-page.module.css';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkIfExists } from '../api/join-room';
import { useSocket, WebsocketContext } from '@bb/socket-hook-lib';
import { Navbar, useAccount } from '@bb/auth-hook-lib';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function TttLandingPage() {
  const { useAccessToken: abcAccessToken, loading: accLoading } = useAccount();
  const query = useQuery();
  const { socket, loading } = useSocket();
  const [join, setJoin] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const at = query.get('access_token');
    if (at !== null) {
      abcAccessToken(at);
    }

    // console.log(accLoading);
    if (socket && !loading) {
      socket.connect();
    }
  }, [loading, accLoading]);

  // useEffect(() => {
  //   if (!socket) return;

  //   // socket.on('roomCreated', (room: string) => {
  //   //   console.log('Room created!');
  //   //   navigate('/game/' + room);
  //   // });

  //   // socket.on('onMessage', (data: any) => {
  //   //   console.log('onMessage received!');
  //   //   console.log(data);
  //   // });

  //   return () => {
  //     // console.log('Unregistering events...');
  //     // socket.off('roomCreated');
  //     // socket.off('onMessage');
  //   };
  // }, [socket]);

  const CreateRoom = useMemo(
    () => () => {
      // socket
      socket?.emit('create-room', (res: { data: any; error: any }) => {
        console.log(res);
        if (res.error) {
          console.error(res.error);
          return;
        }
        if (res != null) {
          navigate('/game/' + res.data.id.toString());
          console.log('create-room res: ', res);
        } else {
          navigate('/error');
        }
      });
    },
    [socket]
  );

  const CreateRoomAI = useMemo(
    () => () => {
      // socket
      socket?.emit('create-single', (res: { data: any; error: any }) => {
        console.log(res);
        if (res.error) {
          console.error(res.error);
          return;
        }
        if (res != null) {
          navigate('/game/' + res.data.id.toString());
        } else {
          navigate('/error');
        }
      });
    },
    [socket]
  );

  if (loading) return <h1>Loading...</h1>;

  const modal = (
    <div>
      <input type="number" onChange={(e) => setMessage(e.target.value)} />
      <button
        onClick={() =>
          socket?.emit('join-room', parseInt(message), (res: { data: any }) => {
            if (res.data !== null) {
              navigate('/game/' + res.data.id.toString());
            } else {
              navigate('/error');
            }
          })
        }
      >
        Submit
      </button>
    </div>
  );

  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>Tic tac toe</h1>
      <div className={styles.center}>
        <div>
          <button onClick={CreateRoom} className={styles.button}>
            Create Room
          </button>

          {/*<button className={styles.button} onClick={() => {}}>
            Play against AI
          </button>*/}
          <button className={styles.button} onClick={CreateRoomAI}>
            Play against AI
          </button>
        </div>
        <div>
          <button
            className={styles.button}
            onClick={() => {
              setJoin(!join);
              // console.log(modal);
            }}
          >
            Join Room
          </button>
          {join && modal}
        </div>
      </div>
    </div>
  );
}
