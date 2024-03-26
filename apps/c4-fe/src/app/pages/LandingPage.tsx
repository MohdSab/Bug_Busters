import React, { useEffect, useMemo, useState } from 'react';
import styles from './landing.module.css';
import { useAccount } from '@bb/auth-hook-lib';
import backdropImg from '../../backdrop.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '@bb/socket-hook-lib';

type Props = {};

function Loading() {
  return <div>Loading.................</div>;
}

function SignedIn() {
  return (
    <>
      <div>
        <button
          className={styles['nice-butt']}
          style={{
            backgroundColor: 'green',
          }}
        >
          Create new room
        </button>
      </div>
      <div>
        <button
          className={styles['nice-butt']}
          style={{
            backgroundColor: 'yellow',
          }}
        >
          Join a room
        </button>
      </div>
      <div>
        <button
          className={styles['nice-butt']}
          style={{
            backgroundColor: 'teal',
          }}
        >
          Play alone :(
        </button>
      </div>
    </>
  );
}

function NotSignedIn() {
  return (
    <>
      <div>
        <button className={styles['nice-butt']}>Sign in</button>
      </div>
      <div>
        <button className={styles['nice-butt']}>Sign up</button>
      </div>
    </>
  );
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function LandingPage() {
  const { loading, account } = useAccount();
  const { useAccessToken: abcAccessToken, loading: accLoading } = useAccount();
  const { socket, loading: socketLoading } = useSocket();
  const query = useQuery();
  const navigate = useNavigate();
  const [join, setJoin] = useState(false);
  const [message, setMessage] = useState('');

  const signedIn = useMemo(() => !loading && account !== null, [account]);

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
    <div className={styles['page-container']}>
      <h1 className={styles.title}>Connect 4</h1>

      <div
        className={styles.backdrop}
        style={{
          backgroundImage: `url(${backdropImg})`,
        }}
      >
        {loading ? <Loading /> : signedIn ? <SignedIn /> : <NotSignedIn />};
        <button onClick={CreateRoom} className={styles.button}>
          Create Room
        </button>
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
  );
}
