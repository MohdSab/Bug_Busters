import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from '@bb/auth-hook-lib';
import { Navbar } from '../components/Navbar';

export default function SignUp() {
  const { loading, account, signup } = useAccount();
  const [values, setValues] = React.useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onSubmit = () => {
    signup(values).then(console.log);
  };

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
      <h2>Sign up</h2>

      <div>
        <input
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />

        <button onClick={onSubmit}>Sign up</button>
      </div>
    </div>
  );
}
