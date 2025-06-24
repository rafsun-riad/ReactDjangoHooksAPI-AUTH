export type Category = {
  id?: number;
  name: string;
};

export type Blog = {
  id?: number;
  title: string;
  content: string;
  category: string;
  category_details?: Category;
  auhtor?: string;
  author_details?: User;
  created_at?: string;
};

export type BlogFormState = {
  title: string;
  content: string;
  category: string;
};

export type RegisterFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormState = {
  email: string;
  password: string;
};

export type RegsiterUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  name?: string; // Optional for user details, required for registration
  email: string;
  password?: string; // Optional for user details, required for registration
};
