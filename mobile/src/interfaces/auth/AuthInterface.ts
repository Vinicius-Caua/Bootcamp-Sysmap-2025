export interface AuthTypeState {
  token: string;
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  refreshToken: (token: string) => void;
  isLoading: boolean;
  user: any;

  register: (
    name: string,
    email: string,
    cpf: string,
    password: string,
  ) => void;
}
