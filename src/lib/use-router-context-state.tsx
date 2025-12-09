import { useEffect, useState } from "react";
import { type UserToken, type RouterContext } from "../routes/__root";
import { QueryClient } from "@tanstack/react-query";

export function useRouterContextState(): RouterContext {
    const [userToken, setUserToken] = useState<UserToken>(() => {
        const savedToken = localStorage.getItem("userToken") as UserToken;
        return savedToken || null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!userToken);

    useEffect(() => {
        if (userToken) {
            localStorage.setItem("userToken", userToken);
        } else {
            localStorage.removeItem("userToken")
        }
    }, [userToken]);

    const login = (newUserToken: string) => {
        setIsAuthenticated(true);
        setUserToken(newUserToken);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserToken(null);
    };

    return {
        isAuthenticated,
        login,
        logout,
        queryClient: new QueryClient(),
        userToken: userToken
    }
}