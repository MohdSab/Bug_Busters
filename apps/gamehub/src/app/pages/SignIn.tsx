import axios from 'axios';
import React from 'react';
import { signin } from './auth';

type Props = {};

export default function SignIn({}: Props) {
  const [values, setValues] = React.useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onSubmit = () => {
    signin(values).then(console.log);
  };

  return (
    <div>
      <h1>BugBuster</h1>

      <h2>Sign in</h2>

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

        <button onClick={onSubmit}>Sign in</button>
      </div>
    </div>
  );
}
