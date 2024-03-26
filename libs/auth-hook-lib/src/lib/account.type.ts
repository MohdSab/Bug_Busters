export type Profile = {
  avatarUrl: string;
};

export type Account = {
  uid: number;
  username: string;
  profile: Profile;
};
