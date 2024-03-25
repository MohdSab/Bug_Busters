import React, { useMemo } from 'react';
import styles from './landing.module.css';
import { useAccount } from '@bb/auth-hook-lib';
import backdropImg from '../../backdrop.jpg';

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
        <button>Sign in</button>
      </div>
      <div>
        <button>Sign up</button>
      </div>
    </>
  );
}

export default function LandingPage({}: Props) {
  const { loading, account } = useAccount();

  const signedIn = useMemo(() => !loading && account !== null, [account]);

  return (
    <div className={styles['page-container']}>
      <h1 className={styles.title}>Connect 4</h1>

      <div
        className={styles.backdrop}
        style={{
          backgroundImage: `url(${backdropImg})`,
        }}
      >
        {loading ? <Loading /> : signedIn ? <SignedIn /> : <NotSignedIn />}
      </div>
    </div>
  );
}
