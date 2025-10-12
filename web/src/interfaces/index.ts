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
};

export type CreateCategoryResponse = {
  message: string;
  data: {
    name: string;
    id: string;
  } | null;
};

export type ListMonthlyTransactionsResponse = {
  message: string;
  data: {
    userId: string;
    period: {
      month: number;
      year: number;
    };
    transactions: {
      expenses: Expense[];
      incomings: Incoming[];
    };
  };
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  name: string;
};

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

export type Transactions = {
  expenses: Expense[];
  incomings: Incoming[];
  period: {
    month: number;
    year: number;
  };
};
