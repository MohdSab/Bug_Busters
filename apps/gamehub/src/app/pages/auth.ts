export const signin = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  console.log('Username: ', username);
  console.log('Password: ', password);

  return Promise.resolve({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  });
};

export const signup = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  console.log('Username: ', username);
  console.log('Password: ', password);

  return Promise.resolve({
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  });
};
