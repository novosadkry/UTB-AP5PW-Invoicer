import React, { createContext, useState, useContext, useEffect } from 'react';
import type { AxiosResponse } from "axios";

type AuthContextType = {
  accessToken: string | null,
  setAccessToken: (token: string | null) => void,
  user: LoginResponse['data']['user'] | null,
  setUser: (user: LoginResponse['data']['user'] | null) => void,
};

type LoginResponse = AxiosResponse<{
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}>;

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken");
  });
  const [user, setUser] = useState<AuthContextType['user']>(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [accessToken, user]);

  const value: AuthContextType = {
    accessToken,
    setAccessToken,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
