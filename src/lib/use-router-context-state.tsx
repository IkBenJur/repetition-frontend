import { useEffect, useState } from "react";
import { type UserToken } from "../routes/__root";

export function useRouterContextState() {
  const [userToken, setUserToken] = useState<UserToken>(() => {
    const savedToken = localStorage.getItem("userToken") as UserToken;
    return savedToken || null;
  });

  const isAuthenticated = !!userToken;

  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [userToken]);

  const login = (newUserToken: string) => {
    setUserToken(newUserToken);
  };

  const logout = () => {
    setUserToken(null);
  };

  return {
    isAuthenticated,
    login,
    logout,
    userToken: userToken,
  };
}
