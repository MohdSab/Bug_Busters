import React, { useEffect } from 'react';
import styles from './landing-page.module.css';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkIfExists } from '../api/join-room';
import { WebsocketContext } from '../contexts/websocket-context';

export function TttLandingPage() {
  const { socket } = useContext(WebsocketContext);
  const [join, setJoin] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on('roomCreated', (room: string) => {
      console.log('Room created!');
      navigate('/game/' + room);
    });

    socket.on('onMessage', (data: any) => {
      console.log('onMessage received!');
      console.log(data);
    });

    return () => {
      console.log('Unregistering events...');
      socket.off('roomCreated');
      socket.off('onMessage');
    };
  }, [socket]);

  const CreateRoom = () => {
    // socket
  };

  const modal = (
    <div>
      <input type="number" onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => socket.emit('create-room')}>Submit</button>
    </div>
  );

  return (
    <div>
      <div className={styles.center}>
        <button className={styles.button}>Create Room</button>
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
