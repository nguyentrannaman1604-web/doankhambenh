import { createContext, useContext, useState, type ReactNode } from "react";

import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;

  isAuthenticated: boolean;

  login: (user: User, accessToken: string, refreshToken: string) => void;

  logout: () => void;

  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });

  /*
   * ĐĂNG NHẬP
   */
  const login = (userData: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("refreshToken", refreshToken);

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  /*
   * CẬP NHẬT USER TRONG FRONTEND
   *
   * Dùng sau khi bệnh nhân
   * sửa hồ sơ thành công.
   *
   * Ví dụ:
   * updateUser({
   *   name: "Nguyễn Văn An"
   * });
   */
  const updateUser = (userData: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const updatedUser: User = {
        ...currentUser,
        ...userData,
      };

      /*
       * Cập nhật localStorage
       * để reload trang vẫn giữ
       * thông tin mới.
       */
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  /*
   * ĐĂNG XUẤT
   */
  const logout = () => {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    localStorage.removeItem("user");

    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }

  return context;
}
