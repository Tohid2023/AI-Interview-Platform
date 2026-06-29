import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login({ email, password });
      if (data && data.user) {
        setUser(data.user);
        return { success: true };
      }
      setUser(null);
      return { success: false, message: "Invalid email or password" };
    } catch (err) {
      console.error(err);
      setUser(null);
      const message = err.response?.data?.message || "Invalid email or password";
      return { success: false, message };
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      const data = await register({ username, email, password });
      if (data && data.user) {
        setUser(data.user);
        return { success: true };
      }
      setUser(null);
      return { success: false, message: "Registration failed" };
    } catch (err) {
      console.error(err);
      setUser(null);
      const message = err.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, [setUser, setLoading]);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
