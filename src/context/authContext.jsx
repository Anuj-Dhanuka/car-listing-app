import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const storeUserIdAndTokenInContext = (userId, token) => {
    setUser({ userId, token });
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
  };

  const removeUserIdAndTokenFromContext = () => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  const getUserIdFromStorage = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      setUser({ userId, token });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    getUserIdFromStorage();
  }, []);

  const value = {
    user,
    storeUserIdAndTokenInContext,
    removeUserIdAndTokenFromContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
