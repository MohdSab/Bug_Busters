import { Link } from 'react-router-dom';
import styles from './navbar.module.css';
import { useAccount } from '../hooks/account';

export function Navbar() {
  const { loading, account, signout } = useAccount();

  return (
    <nav
      style={{
        position: 'sticky',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'pink',
        color: 'black',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div>
          <h1>Bug Buster</h1>
        </div>

        {loading ? (
          <span>Loading...</span>
        ) : account ? (
          <div>
            <button onClick={signout}>Signout</button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <div className={styles['nav-link']}>
              <Link to="/signin">Sign in</Link>
            </div>
            <div className={styles['nav-link']}>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
