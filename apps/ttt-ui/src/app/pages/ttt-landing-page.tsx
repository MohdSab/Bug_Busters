import React, { useEffect } from 'react';
import styles from './landing-page.module.css'
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkIfExists } from '../api/join-room';
import { WebsocketContext } from '../contexts/websocket-context';

export function TttLandingPage() {
    const socket = useContext(WebsocketContext);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('roomCreated', (room: string) => {
            console.log("Room created!");
            navigate('/game/' + room);
        });

        socket.on('onMessage', (data: any) => {
            console.log("onMessage received!");
            console.log(data);
        })

        return () => {
            console.log("Unregistering events...")
            socket.off('roomCreated');
        }
    }, []);

    let [join, setJoin] = useState(false);

    let [message, setMessage] = useState('');


    let modal = join ? (
        <div>
            <input type="number" onChange={(e) => setMessage(e.target.value)}/>
            <button onClick={() => socket.emit('create-room')}>Submit</button>
        </div>
    ) : null;

    return (
        <div>
            <div className={styles.center}>
                <button className={styles.button}>Create Room</button>
                <button className={styles.button} onClick={() => {setJoin(!join); console.log(modal)}}>Join Room</button>
                {modal}
            </div>
        </div>
    )
}