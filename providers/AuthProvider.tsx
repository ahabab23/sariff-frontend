"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  login as apiLogin,
  verifyOtp as apiVerifyOtp,
  logout as apiLogout,
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  UnifiedLoginDto,
  OtpVerifyDto,
  TokenResponseDto,
  UserRole,
} from "@/lib/api";

// ==============================================
// Types
// ==============================================

export type UserRoleType = "super-admin" | "office-user" | "client" | null;

export interface AuthUser {
  id: string;
  name: string;
  role: UserRoleType;
  roleNum: number;
  phone: string;
  email?: string;
  companyId?: string;
  companyName?: string;
  ownerName?: string;
  userCode?: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  requiresOtp?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    code: string,
    phoneNumber: string,
    password: string
  ) => Promise<LoginResult>;
  verifyOtp: (
    code: string,
    phoneNumber: string,
    otpCode: string
  ) => Promise<LoginResult>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

// ==============================================
// Context
// ==============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==============================================
// Helper Functions
// ==============================================

function roleNumToString(roleNum: number): UserRoleType {
  switch (roleNum) {
    case UserRole.SuperAdmin:
      return "super-admin";
    case UserRole.OfficeUser:
      return "office-user";
    case UserRole.Client:
      return "client";
    default:
      return null;
  }
}

function getDashboardPath(role: UserRoleType): string {
  switch (role) {
    case "super-admin":
      return "/admin/dashboard";
    case "office-user":
      return "/office/dashboard";
    case "client":
      return "/client/dashboard";
    default:
      return "/login";
  }
}

// Public routes that don't require authentication
const publicRoutes = ["/", "/login"];

// ==============================================
// Provider Component
// ==============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const stored = getStoredAuth();
      if (stored && stored.token && stored.user) {
        const roleType = roleNumToString(stored.user.role);
        setUser({
          id: stored.user.id,
          name: stored.user.fullName,
          role: roleType,
          roleNum: stored.user.role,
          phone: stored.user.whatsAppNumber,
          email: stored.user.email,
          companyId: stored.user.companyId,
          companyName: stored.user.companyName,
          ownerName: stored.user.ownerName,
          userCode: stored.user.userCode,
        });
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push("/login");
    } else if (user && pathname === "/login") {
      router.push(getDashboardPath(user.role));
    } else if (user && pathname === "/dashboard") {
      router.push("/office/dashboard");
    } else if (user && pathname === "/client-portal") {
      router.push("/client/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  // Helper to set auth from token response
  const setAuthFromTokens = useCallback(
    (tokens: TokenResponseDto, phoneNumber: string, userCode: string) => {
      if (tokens.accessToken) {
        const roleType = roleNumToString(tokens.role);

        const userInfo = {
          id: tokens.userId || "",
          fullName: tokens.name,
          whatsAppNumber: tokens.whatsAppNumber || phoneNumber,
          email: tokens.email,
          role: tokens.role,
          companyId: tokens.companyId,
          companyName: tokens.name,
          ownerName: tokens.ownerName,
          userCode: tokens.code || userCode,
          mustChangePassword: false,
        };

        setStoredAuth({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken || "",
          user: userInfo,
          expiresAt: tokens.expiresAt || "",
        });

        const authUser: AuthUser = {
          id: userInfo.id,
          name: userInfo.fullName,
          role: roleType,
          roleNum: userInfo.role,
          phone: userInfo.whatsAppNumber,
          email: userInfo.email,
          companyId: userInfo.companyId,
          companyName: userInfo.companyName,
          ownerName: userInfo.ownerName,
          userCode: userInfo.userCode,
        };

        setUser(authUser);

        // Redirect to appropriate dashboard
        router.push(getDashboardPath(roleType));
      }
    },
    [router]
  );

  // Unified login function
  const login = useCallback(
    async (
      code: string,
      phoneNumber: string,
      password: string
    ): Promise<LoginResult> => {
      try {
        const dto: UnifiedLoginDto = { code, phoneNumber, password };
        const response = await apiLogin(dto);

        if (response.success && response.data) {
          // 1) OTP flow (Super Admin / Office User)
          if ((response.data as any).requiresOtp) {
            return {
              success: true,
              message:
                (response.data as any).message || "OTP sent to your WhatsApp",
              requiresOtp: true,
            };
          }

          // 2) Non-OTP flow (Client) - tokens might be nested OR returned directly
          const possibleTokens = (response.data as any).tokens ?? response.data;

          if (possibleTokens?.accessToken) {
            setAuthFromTokens(
              possibleTokens as TokenResponseDto,
              phoneNumber,
              code
            );
            return { success: true, message: "Login successful" };
          }

          return {
            success: false,
            message:
              (response.data as any).message ||
              response.message ||
              "Login failed",
          };
        }

        return { success: false, message: response.message || "Login failed" };
      } catch (error: any) {
        console.error("Login error:", error);
        return { success: false, message: error.message || "Login failed" };
      }
    },
    [setAuthFromTokens]
  );

  // Verify OTP function
  const verifyOtp = useCallback(
    async (
      code: string,
      phoneNumber: string,
      otpCode: string
    ): Promise<LoginResult> => {
      try {
        const dto: OtpVerifyDto = { code, phoneNumber, otp: otpCode };
        const response = await apiVerifyOtp(dto);

        if (response.success && response.data) {
          setAuthFromTokens(response.data, phoneNumber, code);
          return { success: true, message: "Login successful" };
        } else {
          return {
            success: false,
            message: response.message || "OTP verification failed",
          };
        }
      } catch (error: any) {
        console.error("OTP verify error:", error);
        return {
          success: false,
          message: error.message || "OTP verification failed",
        };
      }
    },
    [setAuthFromTokens]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredAuth();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // Get current token
  const getToken = useCallback((): string | null => {
    const stored = getStoredAuth();
    return stored?.token || null;
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verifyOtp,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==============================================
// Hook
// ==============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { UserRole };
