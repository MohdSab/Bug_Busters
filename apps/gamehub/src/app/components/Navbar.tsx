import { Link } from 'react-router-dom';
import styles from './navbar.module.css';
import { useAccount } from '../hooks/account';
import { Account } from '../types/account';

function Badge({ account }: { account: Account }) {
  return (
    <div className={styles.badge}>
      <div style={{ width: '48px' }}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url(${account.profile?.avatarUrl || ''})`,
          }}
        />
      </div>

      <div className={styles.tag}>
        <h4>{account.username}</h4>
        <p>#{account.uid}</p>
      </div>
    </div>
  );
}

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
          padding: '0 40px',
        }}
      >
        <div>
          <h1>Bug Buster</h1>
        </div>

        {loading ? (
          <span>Loading...</span>
        ) : account ? (
          <div
            style={{
              display: 'flex',
              padding: '16px',
              alignItems: 'center',
              gap: '32px',
              justifyContent: 'flex-end',
              width: '30%',
            }}
          >
            <Badge account={account} />
            <button className={styles.butt} onClick={signout}>
              Signout
            </button>
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
