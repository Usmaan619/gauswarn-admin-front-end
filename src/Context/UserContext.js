import { createContext, useState, useEffect, useCallback } from "react";
import {
  getItem,
  setItem,
  removeItem,
  clearSession,
  isSessionValid,
  initSession,
} from "../Services/storage.service";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [UserLogin, setUserLogin] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Full logout — clears session and resets state
  const logout = useCallback(() => {
    clearSession();
    setUserLogin(null);
    setUserPermissions([]);
  }, []);

  //  Initialize from sessionStorage on app load (with validation)
  useEffect(() => {
    if (isSessionValid()) {
      const token = getItem("token");
      const permissions = sessionStorage.getItem("permissions");

      if (token) {
        setUserLogin(token);
      }

      if (permissions) {
        try {
          setUserPermissions(JSON.parse(permissions));
        } catch (error) {
          setUserPermissions([]);
        }
      }
    } else {
      // Invalid or expired session — force logout
      logout();
    }

    setIsLoading(false);
  }, [logout]);

  // Periodic session health check (every 60 seconds)
  useEffect(() => {
    if (!UserLogin) return;

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        logout();
      }
    }, 60 * 1000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [UserLogin, logout]);

  //  Save permissions to sessionStorage whenever they change
  const setUserPermissionsWrapper = (permissions) => {
    setUserPermissions(permissions);
    sessionStorage.setItem("permissions", JSON.stringify(permissions));
  };

  //  Save login to sessionStorage whenever it changes
  const setUserLoginWrapper = (token) => {
    setUserLogin(token);
    if (token) {
      setItem("token", token);
    } else {
      removeItem("token");
    }
  };

  return (
    <UserContext.Provider
      value={{
        UserLogin,
        setUserLogin: setUserLoginWrapper,
        userPermissions,
        setUserPermissions: setUserPermissionsWrapper,
        isLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
