import React from 'react';
import { signup } from './auth';

type Props = {};

export default function SignUp({}: Props) {
  const [values, setValues] = React.useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onSubmit = () => {
    signup(values).then(console.log);
  };

  return (
    <div>
      <h1>BugBuster</h1>

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
