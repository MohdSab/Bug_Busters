import React, { useEffect } from 'react';
import styles from './landing-page.module.css';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkIfExists } from '../api/join-room';
import { WebsocketContext } from '@bb/socket-hook-lib';
import { useAccount } from '@bb/auth-hook-lib';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function TttLandingPage() {
  const {
    useAccessToken: abcAccessToken,
    account: acc,
    signout: sout,
  } = useAccount();
  const query = useQuery();
  const { socket, loading } = useContext(WebsocketContext);
  const [join, setJoin] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const at = query.get('access_token');
    if (at !== null) {
      abcAccessToken(at).then(console.log);
    }
  }, []);

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

  if (loading) return <h1>Loading...</h1>;

  const CreateRoom = () => {
    // socket
    socket?.emit(
      'create-room',
      (res: { id: number; p1?: number; p2?: number; game: any }) => {
        if (res != null) {
          navigate('/game/' + res.id.toString());
          console.log('create-room res: ', res);
        } else {
          navigate('/error');
        }
      }
    );
  };

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
      {acc ? (
        <div>
          <p>Signed in as {acc.username}</p>
          <button onClick={sout}>Signout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate('/signin')}>Sign in</button>
          <button onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      )}
      <div className={styles.center}>
        <h1>Tic tac toe</h1>
        <button onClick={CreateRoom} className={styles.button}>
          Create Room
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setJoin(!join);
            console.log(modal);
          }}
        >
          Join Room
        </button>
        {join && modal}
      </div>
    </div>
  );
}
