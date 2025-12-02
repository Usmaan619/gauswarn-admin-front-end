import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [UserLogin, setUserLogin] = useState(null);

  return (
    <UserContext.Provider value={{ UserLogin, setUserLogin }}>
      {children}
    </UserContext.Provider>
  );
};
