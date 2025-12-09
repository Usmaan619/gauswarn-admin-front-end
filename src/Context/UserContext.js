import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [UserLogin, setUserLogin] = useState(null);

  const [userPermissions, setUserPermissions] = useState([]);

  return (
    <UserContext.Provider
      value={{
        UserLogin,
        setUserLogin,
        userPermissions,
        setUserPermissions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
