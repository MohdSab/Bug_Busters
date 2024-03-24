import styles from './SignUp.module.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from '../hooks/account';
import { Navbar } from '../components/Navbar';

export default function SignUp() {
  const { loading, account, signup, getAvatars } = useAccount();
  const [values, setValues] = React.useState({ username: '', password: '' });
  const [avatars, setAvatars] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onSubmit = () => {
    signup({ ...values, avatar: avatars[selected] }).then(console.log);
  };

  useEffect(() => {
    getAvatars().then(setAvatars);
  }, []);

  useEffect(() => {
    if (!loading && account) {
      // Fancy animation lol
      setTimeout(() => {
        navigate('/');
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, account]);

  if (loading) return <h1>Loading...</h1>;
  if (account) return <h1>Redirecting...</h1>;

  return (
    <div>
      <Navbar />

      <div className={styles.everything}>
        <h2>Sign up</h2>
        <div className={styles.formText}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
          />
        </div>

        <h3>Choose your avatar</h3>
        <div className={styles.avatarList}>
          {avatars.map((url, i) => (
            <div
              onClick={() => setSelected(i)}
              className={`${styles.avatar} ${
                selected === i && styles.selectedAvatar
              }`}
              key={url}
              style={{
                backgroundImage: `url(${url})`,
              }}
            />
          ))}
        </div>

        <div className={styles.terms}>
          <input type="checkbox" />
          <span>I agree with the Terms & Services of Bug Buster</span>
        </div>

        <div>
          <button className={styles.butt} onClick={onSubmit}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
