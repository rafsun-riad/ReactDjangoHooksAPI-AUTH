"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { create } from "zustand";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL + "/api";

interface AuthState {
  user: any;
  setUser: (user: any) => void;
  notifs: any[];
  setNotifs: (notifs: any[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  notifs: [],
  setNotifs: (notifs) => set({ notifs }),
}));

export function useAuth() {
  const router = useRouter();
  const { user, setUser, notifs, setNotifs } = useAuthStore();

  const isAuthenticated = !!user;

  const jwtLogin = async () => {
    const token = Cookies.get("jwt-token");
    if (!token) {
      setUser(null);
      return false;
    }

    try {
      const res = await axios.get(`${baseURL}/auth/validate-token/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data) {
        setUser(res.data);
        Cookies.set("jwt-token", res.data.access);
        if (res.data.face) {
          Cookies.set("username", res.data.user.username);
        }
        return true;
      }
    } catch (err: any) {
      console.error("JWT validation error:", err);
      Cookies.remove("jwt-token");
      setUser(null);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${baseURL}/auth/login/`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data) {
        setUser(res.data);
        Cookies.set("jwt-token", res.data.access);
        if (res.data.face) {
          Cookies.set("username", res.data.user.username);
        }

        return {
          loggedIn: true,
          user_type: res.data.user.user_type,
          is_superuser: res.data.user.is_superuser,
        };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { loggedIn: false, error: err };
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("jwt-token");
    Cookies.remove("username");
    router.push("/");
  };

  return {
    user,
    isAuthenticated,
    jwtLogin,
    login,
    logout,
    notifs,
    setNotifs,
  };
}
