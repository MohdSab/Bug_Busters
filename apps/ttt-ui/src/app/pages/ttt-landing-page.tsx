import React, { useEffect } from 'react';
import styles from './landing-page.module.css';
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { checkIfExists } from '../api/join-room';
import { WebsocketContext } from '../contexts/websocket-context';
import { useAccount } from '@bb/auth-hook-lib';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function TttLandingPage() {
  const { useAccessToken: abcAccessToken } = useAccount();
  const query = useQuery();
  const { socket, loading } = useContext(WebsocketContext);
  const [join, setJoin] = useState(false);
  // const navigate = useNavigate();
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
    socket?.emit('create-room', (res: { id: number, p1?: number, p2?: number, game: any }) => {
      console.log('create-room res: ', res);
    });
  };

  const modal = (
    <div>
      <input type="number" onChange={(e) => setMessage(e.target.value)} />
      <button>Submit</button>
    </div>
  );

  return (
    <div>
      <div className={styles.center}>
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
