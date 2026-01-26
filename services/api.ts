// services/api.ts

const API_BASE_URL = "http://localhost:8080";

export interface UnifiedLoginDto {
  Code: string;
  PhoneNumber: string;
  Password: string;
}

export interface OtpVerifyWithCodeDto {
  Code: string;
  PhoneNumber: string;
  Otp: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  role: string;
  name: string;
  code: string;
  companyId: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Role enum to match backend
export enum UserRole {
  SUPER_ADMIN = "SuperAdmin",
  OFFICE_USER = "OfficeUser",
  CLIENT = "Client",
}

// Helper to map backend role to frontend role
export const mapBackendRoleToFrontend = (
  backendRole: string
): "super-admin" | "office-user" | "client" | null => {
  switch (backendRole) {
    case "SuperAdmin":
      return "super-admin";
    case "OfficeUser":
      return "office-user";
    case "Client":
      return "client";
    default:
      return null;
  }
};

export const authApi = {
  async login(
    loginData: UnifiedLoginDto
  ): Promise<
    ApiResponse<
      | TokenResponseDto
      | {
          requiresOtp: boolean;
          role: string;
          code: string;
          phoneNumber: string;
        }
    >
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  async verifyOtp(
    otpData: OtpVerifyWithCodeDto
  ): Promise<ApiResponse<TokenResponseDto>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      return await response.json();
    } catch (error) {
      console.error("OTP verification API error:", error);
      throw error;
    }
  },

  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<TokenResponseDto>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Token refresh failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Refresh token API error:", error);
      throw error;
    }
  },

  async logout(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Logout API error:", error);
      throw error;
    }
  },
};

// Token storage helper
export const tokenStorage = {
  setTokens(tokenData: TokenResponseDto) {
    localStorage.setItem("accessToken", tokenData.accessToken);
    localStorage.setItem("refreshToken", tokenData.refreshToken);
    localStorage.setItem("expiresAt", tokenData.expiresAt);
    localStorage.setItem("userRole", tokenData.role);
    localStorage.setItem("userName", tokenData.name);
    localStorage.setItem("userCode", tokenData.code);
    if (tokenData.companyId) {
      localStorage.setItem("companyId", tokenData.companyId);
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  getUserData() {
    return {
      role: localStorage.getItem("userRole"),
      name: localStorage.getItem("userName"),
      code: localStorage.getItem("userCode"),
      companyId: localStorage.getItem("companyId"),
    };
  },

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userCode");
    localStorage.removeItem("companyId");
  },

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem("expiresAt");
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
  },
};

// Interceptor for adding auth headers to requests
export const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const token = tokenStorage.getAccessToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401 && tokenStorage.getRefreshToken()) {
      try {
        const refreshResponse = await authApi.refreshToken(
          tokenStorage.getRefreshToken()!
        );
        if (refreshResponse.success) {
          tokenStorage.setTokens(refreshResponse.data);
          // Retry the original request with new token
          headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
          });
        }
      } catch (error) {
        tokenStorage.clearTokens();
        window.location.href = "/login";
      }
    }

    return response;
  },
};
