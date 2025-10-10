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

export type CategoryListResponse = {
  message: string;
  data: Category[];
  
}

export type Category = {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  Incomings: Incoming[];
  Expense: Expense[];
};

export type Incoming = {
  id: string;
  amount: number;
  userId: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: string;
  amount: number;
  userId: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};
