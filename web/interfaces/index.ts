export type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type LoginResponse = {
  token: string;
  data: User | undefined;
  message: string;
};

export type VerifyResponse = {
  valid: boolean;
  token: string;
  user: User | undefined;
  message: string;
};
