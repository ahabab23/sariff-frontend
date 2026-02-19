// // ==============================================
// // SARIFF API Client - .NET Backend Integration
// // API_BASE_URL configured via NEXT_PUBLIC_API_URL environment variable
// // ==============================================

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// // ==============================================
// // Type Definitions
// // ==============================================

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T | null;
// }

// export interface PagedResult<T> {
//   items: T[];
//   totalCount: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }

// // ==============================================
// // Enums (matching backend) with Type Exports
// // ==============================================

// export const UserRole = {
//   SuperAdmin: 0,
//   OfficeUser: 1,
//   Client: 2,
// } as const;
// export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// export const ClientType = {
//   Permanent: 0,
//   Temporary: 1,
// } as const;
// export type ClientType = (typeof ClientType)[keyof typeof ClientType];

// export const Currency = {
//   KES: 0,
//   USD: 1,
// } as const;
// export type Currency = (typeof Currency)[keyof typeof Currency];

// export const TransactionType = {
//   Debit: 0, // Money IN (increases asset accounts)
//   Credit: 1, // Money OUT (decreases asset accounts)
// } as const;
// export type TransactionType =
//   (typeof TransactionType)[keyof typeof TransactionType];

// export const AccountType = {
//   Cash: 0,
//   Bank: 1,
//   Mpesa: 2,
//   Client: 3,
// } as const;
// export type AccountType = (typeof AccountType)[keyof typeof AccountType];

// export const ReconciliationStatus = {
//   Pending: 0,
//   Matched: 1,
//   Unmatched: 2,
// } as const;
// export type ReconciliationStatus =
//   (typeof ReconciliationStatus)[keyof typeof ReconciliationStatus];

// export const PaymentMethod = {
//   Cash: 0,
//   Bank: 1,
//   Mpesa: 2,
//   AccountTransfer: 3,
// } as const;
// export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// // ==============================================
// // Auth Types - Unified Login
// // ==============================================

// export interface UnifiedLoginDto {
//   code: string;
//   phoneNumber: string;
//   password: string;
// }

// export interface OtpVerifyDto {
//   code: string;
//   phoneNumber: string;
//   otp: string;
// }

// export interface LoginResponseDto {
//   requiresOtp: boolean;
//   tokens: TokenResponseDto | null;
//   message: string;
// }

// // export interface TokenResponseDto {
// //   accessToken: string;
// //   refreshToken: string;
// //   expiresAt: string;
// //   role: number;
// //   name: string;
// //   userId?: string;
// //   companyId?: string;
// //   companyName?: string;
// //   ownerName?: string;
// //   email?: string;
// //   whatsAppNumber?: string;
// //   userCode?: string;
// // }
// // =====================================================
// // api.ts - FIXED TokenResponseDto
// // =====================================================
// // Update your TokenResponseDto to match ACTUAL API response

// export interface TokenResponseDto {
//   accessToken: string;
//   refreshToken: string;
//   expiresAt: string;
//   role: number;
//   name: string; // Company name (for OfficeUser) or User name
//   code: string; // FIXED: API returns "code" not "userCode"
//   companyId?: string;
//   ownerName?: string; // Owner name for greeting
//   // These are optional - API may not return them
//   userId?: string;
//   email?: string;
//   whatsAppNumber?: string;
// }

// // NOTE: Removed these fields that don't match API:
// // - userCode (API returns "code")
// // - companyName (API returns "name" which IS the company name)
// export interface AuthResponseDto {
//   accessToken: string;
//   refreshToken?: string;
//   expiresAt?: string;
//   user: UserInfoDto;
// }

// export interface UserInfoDto {
//   id: string;
//   fullName: string;
//   whatsAppNumber: string;
//   email?: string;
//   role: number;
//   companyId?: string;
//   companyName?: string;
//   ownerName?: string;
//   userCode?: string;
//   mustChangePassword: boolean;
// }

// // ==============================================
// // Client Types
// // ==============================================

// export interface ClientDto {
//   id: string;
//   code: string;
//   fullName: string;
//   whatsAppNumber: string;
//   email?: string;
//   idPassport?: string;
//   clientType: ClientType;
//   balanceKES: number;
//   balanceUSD: number;
//   openingBalanceKES: number;
//   openingBalanceUSD: number;
//   netMovementUSD: number;
//   totalCreditUSD: number;
//   totalDebitUSD: number;
//   netMovementKES: number;
//   totalCreditKES: number;
//   totalDebitKES: number;
//   isActive: boolean;
//   expiresAt?: string;
//   lastActivityAt?: string;
//   createdAt: string;
// }

// export interface CreateClientDto {
//   fullName: string;
//   whatsAppNumber: string;
//   email?: string;
//   idPassport?: string;
//   clientType: ClientType;
//   openingBalanceKES?: number;
//   openingBalanceUSD?: number;
//   password?: string;
//   expiryDays?: number;
// }

// export interface UpdateClientDto {
//   fullName?: string;
//   whatsAppNumber?: string;
//   email?: string;
//   idPassport?: string;
//   isActive?: boolean;
// }

// // ==============================================
// // Transaction Types - MATCHING BACKEND EXACTLY
// // ==============================================

// export interface TransactionDto {
//   id: string;
//   code: string;
//   reference: string;
//   transactionDate: string;
//   transactionType: TransactionType;
//   amount: number;
//   currency: Currency;
//   description: string;
//   notes?: string;
//   exchangeRate?: number;
//   sourceAccountType: AccountType;
//   sourceAccountId: string;
//   sourceAccountName: string;
//   sourceBalanceBefore: number;
//   sourceBalanceAfter: number;
//   destAccountType: AccountType;
//   destAccountId: string;
//   destAccountName: string;
//   destBalanceBefore: number;
//   destBalanceAfter: number;
//   reconciliationStatus: ReconciliationStatus;
//   createdAt: string;
//   createdByName?: string;
// }

// // CreateTransactionDto - MATCHES BACKEND CreateTransactionDto EXACTLY
// // =====================================================
// // Add these to your api.ts file - UPDATED FOR FOREX
// // =====================================================

// // Update CreateTransactionDto interface
// export interface CreateTransactionDto {
//   transactionType: TransactionType;
//   sourceAccountType: AccountType;
//   sourceAccountId: string;
//   destAccountType: AccountType;
//   destAccountId: string;

//   // Primary account amount (converted for forex)
//   amount: number;
//   currency: Currency;

//   // Counter account amount (original for forex)
//   // If undefined, same as amount (no forex)
//   counterAmount?: number;
//   counterCurrency?: Currency;

//   description: string;
//   notes?: string;
//   exchangeRate?: number;
//   paymentMethod: PaymentMethod;
// }

// // Update TransactionResponseDto if needed
// export interface TransactionResponseDto {
//   id: string;
//   code: string;
//   reference: string;
//   transactionDate: string;
//   transactionType: TransactionType;
//   amount: number;
//   currency: Currency;
//   description: string;
//   notes?: string;
//   exchangeRate?: number;
//   sourceAccountType: AccountType;
//   sourceAccountId: string;
//   sourceAccountName: string;
//   sourceBalanceBefore: number;
//   sourceBalanceAfter: number;
//   destAccountType: AccountType;
//   destAccountId: string;
//   destAccountName: string;
//   destBalanceBefore: number;
//   destBalanceAfter: number;
//   // NEW: Counter amount for forex
//   counterAmount?: number;
//   counterCurrency?: Currency;
//   reconciliationStatus: ReconciliationStatus;
//   createdAt: string;
// }

// // ==============================================
// // Bank Account Types
// // ==============================================

// export interface BankAccountDto {
//   id: string;
//   code: string;
//   bankName: string;
//   accountNumber: string;
//   accountName: string;
//   branchCode?: string;
//   currency: Currency;
//   balance: number;
//   openingBalance: number;
//   isActive: boolean;
//   createdAt: string;
// }

// export interface CreateBankAccountDto {
//   bankName: string;
//   accountNumber: string;
//   accountName: string;
//   branchCode?: string;
//   currency: Currency;
//   openingBalance?: number;
// }

// // ==============================================
// // M-Pesa Agent Types
// // ==============================================

// export interface MpesaAgentDto {
//   id: string;
//   code: string;
//   agentName: string;
//   agentNumber: string;
//   phoneNumber: string;
//   tillNumber?: string;
//   paybillNumber?: string;
//   balance: number;
//   openingBalance: number;
//   isActive: boolean;
//   createdAt: string;
// }

// export interface CreateMpesaAgentDto {
//   agentName: string;
//   agentNumber: string;
//   phoneNumber: string;
//   tillNumber?: string;
//   paybillNumber?: string;
//   openingBalance?: number;
// }

// // ==============================================
// // Cash Account Types
// // ==============================================

// export interface CashAccountDto {
//   id: string;
//   name: string;
//   currency: Currency;
//   balance: number;
//   openingBalance: number;
//   isActive: boolean;
// }

// // ==============================================
// // Exchange Rate Types
// // ==============================================

// export interface ExchangeRateDto {
//   id: string;
//   buyRate: number;
//   sellRate: number;
//   effectiveFrom: string;
//   effectiveTo?: string;
//   isActive: boolean;
//   createdAt: string;
//   createdByName?: string;
// }

// export interface SetExchangeRateDto {
//   buyRate: number;
//   sellRate: number;
// }

// // ==============================================
// // Expense Types
// // ==============================================

// export interface ExpenseCategoryDto {
//   id: string;
//   name: string;
//   description?: string;
//   isActive: boolean;
// }

// export interface ExpenseDto {
//   id: string;
//   code: string;
//   categoryId: string;
//   categoryName?: string;
//   description: string;
//   vendorPayee?: string;
//   amount: number;
//   currency: Currency;
//   expenseDate: string;
//   paymentMethod: PaymentMethod;
//   reference?: string;
//   notes?: string;
//   createdAt: string;
//   createdByName?: string;
// }

// export interface CreateExpenseDto {
//   categoryId: string;
//   description: string;
//   vendorPayee?: string;
//   amount: number;
//   currency: Currency;
//   expenseDate: string;
//   paymentMethod: PaymentMethod;
//   reference?: string;
//   notes?: string;
// }

// // ==============================================
// // Dashboard Types
// // ==============================================

// export interface DashboardStatsDto {
//   cash: { kes: number; usd: number };
//   banks: { kes: number; usd: number };
//   mpesa: { total: number };
//   exchange: { kes: number; usd: number };
//   clients: { kes: number; usd: number };
//   walkin: { kes: number; usd: number };
//   daily: {
//     credits: number;
//     debits: number;
//     net: number;
//     byCurrency: {
//       kes: { credits: number; debits: number; net: number };
//       usd: { credits: number; debits: number; net: number };
//     };
//   };
//   totalAccounts: number;
//   totalTransactions: number;
//   todayTransactions: number;
// }

// // ==============================================
// // Invoice Types
// // ==============================================

// export interface InvoiceDto {
//   id: string;
//   invoiceNumber: string;
//   clientId: string;
//   clientName: string;
//   amount: number;
//   currency: Currency;
//   status: number;
//   dueDate: string;
//   createdAt: string;
// }

// // ==============================================
// // Reconciliation Types
// // ==============================================

// export interface ReconciliationDto {
//   id: string;
//   accountType: AccountType;
//   accountId: string;
//   accountName: string;
//   systemBalance: number;
//   actualBalance: number;
//   variance: number;
//   status: ReconciliationStatus;
//   reconciledAt?: string;
//   reconciledByName?: string;
//   notes?: string;
// }

// // ==============================================
// // Company Types (for Super Admin)
// // ==============================================

// export interface CompanyDto {
//   id: string;
//   code: string;
//   name: string;
//   whatsAppNumber: string;
//   email?: string;
//   address?: string;
//   isActive: boolean;
//   createdAt: string;
// }

// export interface CompanySummaryDto {
//   company: CompanyDto;
//   totalClients: number;
//   totalTransactions: number;
//   cashBalanceKES: number;
//   cashBalanceUSD: number;
//   bankBalanceKES: number;
//   bankBalanceUSD: number;
//   mpesaBalance: number;
// }

// // ==============================================
// // Audit Log Types
// // ==============================================

// export interface AuditLogDto {
//   id: string;
//   timestamp: string;
//   userId: string;
//   userName: string;
//   userRole: string;
//   companyId?: string;
//   companyName?: string;
//   action: string;
//   details: string;
//   entityType: string;
//   entityId?: string;
//   ipAddress: string;
// }

// export interface LoginHistoryDto {
//   id: string;
//   userId: string;
//   userName: string;
//   userRole: string;
//   companyId?: string;
//   companyName?: string;
//   loginTime: string;
//   logoutTime?: string;
//   ipAddress: string;
//   userAgent?: string;
//   isSuccess: boolean;
//   failureReason?: string;
// }

// // ==============================================
// // Auth Token Management
// // ==============================================

// export interface StoredAuth {
//   token: string;
//   refreshToken: string;
//   user: UserInfoDto;
//   expiresAt: string;
// }

// export function getStoredAuth(): StoredAuth | null {
//   if (typeof window === "undefined") return null;

//   const authStr = localStorage.getItem("sariff_auth");
//   if (!authStr) return null;

//   try {
//     return JSON.parse(authStr);
//   } catch {
//     return null;
//   }
// }

// export function setStoredAuth(auth: StoredAuth): void {
//   if (typeof window === "undefined") return;
//   localStorage.setItem("sariff_auth", JSON.stringify(auth));

//   const expiryDate = auth.expiresAt
//     ? new Date(auth.expiresAt)
//     : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const expires = expiryDate.toUTCString();

//   document.cookie = `auth_token=${auth.token}; path=/; expires=${expires}; SameSite=Lax`;

//   const roleMap: Record<number, string> = {
//     0: "super-admin",
//     1: "office-user",
//     2: "client",
//   };
//   const roleName = roleMap[auth.user.role] || "client";
//   document.cookie = `user_role=${roleName}; path=/; expires=${expires}; SameSite=Lax`;
// }

// export function clearStoredAuth(): void {
//   if (typeof window === "undefined") return;
//   localStorage.removeItem("sariff_auth");

//   document.cookie =
//     "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//   document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
// }

// export function getCompanyId(): string | undefined {
//   const auth = getStoredAuth();
//   return auth?.user?.companyId;
// }

// // ==============================================
// // API Request Helper
// // ==============================================

// export async function apiRequest<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<ApiResponse<T>> {
//   const auth = getStoredAuth();

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...((options.headers as Record<string, string>) || {}),
//   };

//   if (auth?.token) {
//     headers["Authorization"] = `Bearer ${auth.token}`;
//   }

//   if (auth?.user?.companyId) {
//     headers["X-Company-Id"] = auth.user.companyId;
//   }

//   if (auth?.user?.id) {
//     headers["X-User-Id"] = auth.user.id;
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (response.status === 401 && auth?.refreshToken) {
//       const refreshed = await refreshToken(auth.refreshToken);
//       if (refreshed) {
//         headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
//         const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
//           ...options,
//           headers,
//         });
//         return await retryResponse.json();
//       } else {
//         clearStoredAuth();
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return { success: false, message: "Session expired", data: null };
//       }
//     }

//     const data = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("API Request Error:", error);
//     return {
//       success: false,
//       message: error.message || "Network error occurred",
//       data: null,
//     };
//   }
// }

// async function refreshToken(
//   refreshTokenValue: string
// ): Promise<AuthResponseDto | null> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refreshToken: refreshTokenValue }),
//     });

//     if (!response.ok) return null;

//     const result: ApiResponse<AuthResponseDto> = await response.json();
//     if (result.success && result.data?.accessToken && result.data?.user) {
//       setStoredAuth({
//         token: result.data.accessToken,
//         refreshToken: result.data.refreshToken || refreshTokenValue,
//         user: result.data.user,
//         expiresAt: result.data.expiresAt || "",
//       });
//       return result.data;
//     }
//     return null;
//   } catch {
//     return null;
//   }
// }

// // ==============================================
// // Auth API Functions
// // ==============================================

// export async function login(
//   dto: UnifiedLoginDto
// ): Promise<ApiResponse<LoginResponseDto>> {
//   const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(dto),
//   });
//   return response.json();
// }

// export async function verifyOtp(
//   dto: OtpVerifyDto
// ): Promise<ApiResponse<TokenResponseDto>> {
//   const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(dto),
//   });
//   return response.json();
// }

// export async function logout(): Promise<void> {
//   try {
//     await apiRequest("/api/auth/logout", { method: "POST" });
//   } finally {
//     clearStoredAuth();
//   }
// }

// // ==============================================
// // Dashboard API Functions
// // ==============================================

// export async function getDashboardStats(): Promise<
//   ApiResponse<DashboardStatsDto>
// > {
//   const cashResult = await apiRequest<CashAccountDto[]>("/api/cash");
//   const bankResult = await apiRequest<BankAccountDto[]>("/api/bank");
//   const mpesaResult = await apiRequest<MpesaAgentDto[]>("/api/mpesa");
//   const clientResult = await apiRequest<PagedResult<ClientDto>>(
//     "/api/client?page=1&pageSize=1000"
//   );
//   const transactionResult = await apiRequest<PagedResult<TransactionDto>>(
//     "/api/transaction/today"
//   );

//   let cashKes = 0,
//     cashUsd = 0;
//   if (cashResult.success && cashResult.data) {
//     cashResult.data.forEach((c) => {
//       if (c.currency === Currency.KES) cashKes = c.balance;
//       else cashUsd = c.balance;
//     });
//   }

//   let bankKes = 0,
//     bankUsd = 0;
//   if (bankResult.success && bankResult.data) {
//     bankResult.data.forEach((b) => {
//       if (b.currency === Currency.KES) bankKes += b.balance;
//       else bankUsd += b.balance;
//     });
//   }

//   let mpesaTotal = 0;
//   if (mpesaResult.success && mpesaResult.data) {
//     mpesaResult.data.forEach((m) => (mpesaTotal += m.balance));
//   }

//   let clientKes = 0,
//     clientUsd = 0,
//     totalClients = 0;
//   if (clientResult.success && clientResult.data) {
//     totalClients = clientResult.data.totalCount;
//     clientResult.data.items.forEach((c) => {
//       clientKes += c.balanceKES;
//       clientUsd += c.balanceUSD;
//     });
//   }

//   const stats: DashboardStatsDto = {
//     cash: { kes: cashKes, usd: cashUsd },
//     banks: { kes: bankKes, usd: bankUsd },
//     mpesa: { total: mpesaTotal },
//     exchange: { kes: 0, usd: 0 },
//     clients: { kes: clientKes, usd: clientUsd },
//     walkin: { kes: 0, usd: 0 },
//     daily: {
//       credits: 0,
//       debits: 0,
//       net: 0,
//       byCurrency: {
//         kes: {
//           credits: transactionResult.data?.totalCreditKES,
//           debits: transactionResult.data?.totalDebitKES,
//           net: transactionResult.data?.netFlowKES,
//         },
//         usd: {
//           credits: transactionResult.data?.totalCreditUSD,
//           debits: transactionResult.data?.totalDebitUSD,
//           net: transactionResult.data?.netFlowUSD,
//         },
//       },
//     },
//     totalAccounts: totalClients,
//     totalTransactions: 0,
//     todayTransactions: transactionResult.data?.totalCount || 0,
//   };

//   return { success: true, message: "Dashboard stats loaded", data: stats };
// }

// export async function getRecentTransactions(
//   count: number = 10
// ): Promise<ApiResponse<TransactionDto[]>> {
//   return apiRequest(`/api/transaction/recent?count=${count}`);
// }

// // ==============================================
// // Client API Functions
// // ==============================================

// export async function getClients(
//   page: number = 1,
//   pageSize: number = 10,
//   search?: string,
//   filter?: string
// ): Promise<ApiResponse<PagedResult<ClientDto>>> {
//   let url = `/api/client?page=${page}&pageSize=${pageSize}`;
//   if (search) url += `&search=${encodeURIComponent(search)}`;
//   if (filter) url += `&filter=${filter}`;
//   return apiRequest(url);
// }

// export async function getClientById(
//   id: string
// ): Promise<ApiResponse<ClientDto>> {
//   return apiRequest(`/api/client/${id}`);
// }

// export async function createClient(
//   dto: CreateClientDto
// ): Promise<ApiResponse<ClientDto>> {
//   return apiRequest("/api/client", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function updateClient(
//   id: string,
//   dto: UpdateClientDto
// ): Promise<ApiResponse<ClientDto>> {
//   return apiRequest(`/api/client/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(dto),
//   });
// }

// export async function deleteClient(id: string): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/client/${id}`, { method: "DELETE" });
// }

// export async function getClientStatement(
//   id: string,
//   startDate?: string,
//   endDate?: string
// ): Promise<ApiResponse<any>> {
//   let url = `/api/client/${id}/statement`;
//   const params = new URLSearchParams();
//   if (startDate) params.append("startDate", startDate);
//   if (endDate) params.append("endDate", endDate);
//   if (params.toString()) url += `?${params.toString()}`;
//   return apiRequest(url);
// }

// export async function getClientStats(): Promise<ApiResponse<any>> {
//   return apiRequest("/api/client/stats");
// }

// // ==============================================
// // Transaction API Functions
// // ==============================================

// export async function getTransactions(
//   page: number = 1,
//   pageSize: number = 10,
//   filters?: {
//     startDate?: string;
//     endDate?: string;
//     type?: number;
//     currency?: number;
//   }
// ): Promise<ApiResponse<PagedResult<TransactionDto>>> {
//   let url = `/api/transaction?page=${page}&pageSize=${pageSize}`;
//   if (filters) {
//     if (filters.startDate) url += `&startDate=${filters.startDate}`;
//     if (filters.endDate) url += `&endDate=${filters.endDate}`;
//     if (filters.type !== undefined) url += `&type=${filters.type}`;
//     if (filters.currency !== undefined) url += `&currency=${filters.currency}`;
//   }
//   return apiRequest(url);
// }

// export async function createTransaction(
//   dto: CreateTransactionDto
// ): Promise<ApiResponse<TransactionDto>> {
//   return apiRequest("/api/transaction", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function getTransactionById(
//   id: string
// ): Promise<ApiResponse<TransactionDto>> {
//   return apiRequest(`/api/transaction/${id}`);
// }

// export async function deleteTransaction(
//   id: string,
//   reason: string
// ): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/transaction/${id}`, {
//     method: "DELETE",
//     body: JSON.stringify({ reason }),
//   });
// }

// export async function getTodayTransactionsSummary(): Promise<ApiResponse<any>> {
//   return apiRequest("/api/transaction/today");
// }

// // ==============================================
// // Bank Account API Functions
// // ==============================================

// export async function getBankAccounts(): Promise<
//   ApiResponse<BankAccountDto[]>
// > {
//   return apiRequest("/api/bank");
// }

// export async function getBankAccountById(
//   id: string
// ): Promise<ApiResponse<BankAccountDto>> {
//   return apiRequest(`/api/bank/${id}`);
// }

// export async function createBankAccount(
//   dto: CreateBankAccountDto
// ): Promise<ApiResponse<BankAccountDto>> {
//   return apiRequest("/api/bank", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function updateBankAccount(
//   id: string,
//   dto: Partial<BankAccountDto>
// ): Promise<ApiResponse<BankAccountDto>> {
//   return apiRequest(`/api/bank/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(dto),
//   });
// }

// export async function deleteBankAccount(
//   id: string
// ): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/bank/${id}`, { method: "DELETE" });
// }

// export async function getBankAccountStatement(
//   id: string,
//   startDate?: string,
//   endDate?: string
// ): Promise<ApiResponse<any>> {
//   let url = `/api/bank/${id}/statement`;
//   const params = new URLSearchParams();
//   if (startDate) params.append("startDate", startDate);
//   if (endDate) params.append("endDate", endDate);
//   if (params.toString()) url += `?${params.toString()}`;
//   return apiRequest(url);
// }

// export async function getBankStats(): Promise<ApiResponse<any>> {
//   return apiRequest("/api/bank/stats");
// }

// // ==============================================
// // M-Pesa Agent API Functions
// // ==============================================

// export async function getMpesaAgents(): Promise<ApiResponse<MpesaAgentDto[]>> {
//   return apiRequest("/api/mpesa");
// }

// export async function getMpesaAgentById(
//   id: string
// ): Promise<ApiResponse<MpesaAgentDto>> {
//   return apiRequest(`/api/mpesa/${id}`);
// }

// export async function createMpesaAgent(
//   dto: CreateMpesaAgentDto
// ): Promise<ApiResponse<MpesaAgentDto>> {
//   return apiRequest("/api/mpesa", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function updateMpesaAgent(
//   id: string,
//   dto: Partial<MpesaAgentDto>
// ): Promise<ApiResponse<MpesaAgentDto>> {
//   return apiRequest(`/api/mpesa/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(dto),
//   });
// }

// export async function deleteMpesaAgent(
//   id: string
// ): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/mpesa/${id}`, { method: "DELETE" });
// }

// export async function getMpesaAgentStatement(
//   id: string,
//   startDate?: string,
//   endDate?: string
// ): Promise<ApiResponse<any>> {
//   let url = `/api/mpesa/${id}/statement`;
//   const params = new URLSearchParams();
//   if (startDate) params.append("startDate", startDate);
//   if (endDate) params.append("endDate", endDate);
//   if (params.toString()) url += `?${params.toString()}`;
//   return apiRequest(url);
// }

// export async function getMpesaStats(): Promise<ApiResponse<any>> {
//   return apiRequest("/api/mpesa/stats");
// }

// // ==============================================
// // Cash Account API Functions
// // ==============================================

// export async function getCashAccounts(): Promise<
//   ApiResponse<CashAccountDto[]>
// > {
//   return apiRequest("/api/cash");
// }

// export async function getCashAccountStatement(
//   currency: number,
//   startDate?: string,
//   endDate?: string
// ): Promise<ApiResponse<any>> {
//   let url = `/api/cash/statement/${currency}`;
//   const params = new URLSearchParams();
//   if (startDate) params.append("startDate", startDate);
//   if (endDate) params.append("endDate", endDate);
//   if (params.toString()) url += `?${params.toString()}`;
//   return apiRequest(url);
// }

// export async function getCashStats(): Promise<ApiResponse<any>> {
//   return apiRequest("/api/cash/stats");
// }

// // ==============================================
// // Exchange Rate API Functions
// // ==============================================

// export async function getCurrentExchangeRate(): Promise<
//   ApiResponse<ExchangeRateDto>
// > {
//   return apiRequest("/api/exchange/current");
// }

// export async function setExchangeRate(
//   dto: SetExchangeRateDto
// ): Promise<ApiResponse<ExchangeRateDto>> {
//   return apiRequest("/api/exchange", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function getExchangeRateHistory(): Promise<
//   ApiResponse<ExchangeRateDto[]>
// > {
//   return apiRequest("/api/exchange/history");
// }

// export async function convertCurrency(
//   fromCurrency: Currency,
//   toCurrency: Currency,
//   amount: number
// ): Promise<ApiResponse<any>> {
//   return apiRequest("/api/exchange/convert", {
//     method: "POST",
//     body: JSON.stringify({ fromCurrency, toCurrency, amount }),
//   });
// }

// export async function createExchangeTransaction(
//   dto: any
// ): Promise<ApiResponse<any>> {
//   return apiRequest("/api/exchange/transaction", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// // ==============================================
// // Expense API Functions
// // ==============================================

// export async function getExpenseCategories(): Promise<
//   ApiResponse<ExpenseCategoryDto[]>
// > {
//   return apiRequest("/api/expense/category");
// }

// export async function createExpenseCategory(dto: {
//   name: string;
//   description?: string;
// }): Promise<ApiResponse<ExpenseCategoryDto>> {
//   return apiRequest("/api/expense/category", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function updateExpenseCategory(
//   id: string,
//   dto: { name: string; description?: string }
// ): Promise<ApiResponse<ExpenseCategoryDto>> {
//   return apiRequest(`/api/expense/category/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(dto),
//   });
// }

// export async function deleteExpenseCategory(
//   id: string
// ): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/expense/category/${id}`, {
//     method: "DELETE",
//   });
// }

// export async function getExpenses(
//   page: number = 1,
//   pageSize: number = 10,
//   filters?: {
//     startDate?: string;
//     endDate?: string;
//     currency?: number;
//   }
// ): Promise<ApiResponse<PagedResult<ExpenseDto>>> {
//   let url = `/api/expense?page=${page}&pageSize=${pageSize}`;
//   if (filters) {
//     if (filters.startDate) url += `&startDate=${filters.startDate}`;
//     if (filters.endDate) url += `&endDate=${filters.endDate}`;
//     if (filters.currency !== undefined) url += `&currency=${filters.currency}`;
//   }
//   return apiRequest(url);
// }

// export async function createExpense(
//   dto: CreateExpenseDto
// ): Promise<ApiResponse<ExpenseDto>> {
//   return apiRequest("/api/expense", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function getExpenseStats(): Promise<ApiResponse<any>> {
//   return apiRequest("/api/expense/stats");
// }

// // ==============================================
// // Invoice API Functions
// // ==============================================

// export async function getInvoices(
//   page: number = 1,
//   pageSize: number = 10
// ): Promise<ApiResponse<PagedResult<InvoiceDto>>> {
//   return apiRequest(`/api/invoice?page=${page}&pageSize=${pageSize}`);
// }

// export async function createInvoice(
//   dto: any
// ): Promise<ApiResponse<InvoiceDto>> {
//   return apiRequest("/api/invoice", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function getInvoiceById(
//   id: string
// ): Promise<ApiResponse<InvoiceDto>> {
//   return apiRequest(`/api/invoice/${id}`);
// }

// export async function updateInvoiceStatus(
//   id: string,
//   status: number
// ): Promise<ApiResponse<InvoiceDto>> {
//   return apiRequest(`/api/invoice/${id}/status`, {
//     method: "PUT",
//     body: JSON.stringify({ status }),
//   });
// }

// // ==============================================
// // Reconciliation API Functions
// // ==============================================

// export async function getReconciliations(
//   page: number = 1,
//   pageSize: number = 10
// ): Promise<ApiResponse<PagedResult<ReconciliationDto>>> {
//   return apiRequest(`/api/reconciliation?page=${page}&pageSize=${pageSize}`);
// }

// export async function createReconciliation(
//   dto: any
// ): Promise<ApiResponse<ReconciliationDto>> {
//   return apiRequest("/api/reconciliation", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// // ==============================================
// // Report API Functions
// // ==============================================

// export async function getDailyReport(date: string): Promise<ApiResponse<any>> {
//   return apiRequest(`/api/report/daily?date=${date}`);
// }

// export async function getMonthlyReport(
//   year: number,
//   month: number
// ): Promise<ApiResponse<any>> {
//   return apiRequest(`/api/report/monthly?year=${year}&month=${month}`);
// }

// export async function getClientStatementReport(
//   clientId: string,
//   startDate: string,
//   endDate: string
// ): Promise<ApiResponse<any>> {
//   return apiRequest(
//     `/api/report/client-statement?clientId=${clientId}&startDate=${startDate}&endDate=${endDate}`
//   );
// }

// // ==============================================
// // Company API Functions (Super Admin)
// // ==============================================

// export async function getCompanies(
//   page: number = 1,
//   pageSize: number = 10,
//   search?: string
// ): Promise<ApiResponse<PagedResult<CompanyDto>>> {
//   let url = `/api/company?page=${page}&pageSize=${pageSize}`;
//   if (search) url += `&search=${encodeURIComponent(search)}`;
//   return apiRequest(url);
// }

// export async function getCompanyById(
//   id: string
// ): Promise<ApiResponse<CompanyDto>> {
//   return apiRequest(`/api/company/${id}`);
// }

// export async function createCompany(
//   dto: any
// ): Promise<ApiResponse<CompanyDto>> {
//   return apiRequest("/api/company", {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function updateCompany(
//   id: string,
//   dto: any
// ): Promise<ApiResponse<CompanyDto>> {
//   return apiRequest(`/api/company/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(dto),
//   });
// }

// export async function activateCompany(
//   id: string
// ): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/company/${id}/activate`, { method: "POST" });
// }

// export async function deactivateCompany(
//   id: string
// ): Promise<ApiResponse<boolean>> {
//   return apiRequest(`/api/company/${id}/deactivate`, { method: "POST" });
// }

// export async function getCompanySummary(
//   id: string
// ): Promise<ApiResponse<CompanySummaryDto>> {
//   return apiRequest(`/api/company/${id}/summary`);
// }

// export async function getAllCompanySummaries(): Promise<
//   ApiResponse<CompanySummaryDto[]>
// > {
//   return apiRequest("/api/company/summaries");
// }

// // ==============================================
// // Audit Log API Functions (Super Admin)
// // ==============================================

// export async function getAuditLogs(
//   page: number = 1,
//   pageSize: number = 50,
//   companyId?: string
// ): Promise<ApiResponse<PagedResult<AuditLogDto>>> {
//   let url = `/api/audit?page=${page}&pageSize=${pageSize}`;
//   if (companyId) url += `&companyId=${companyId}`;
//   return apiRequest(url);
// }

// export async function getLoginHistory(
//   page: number = 1,
//   pageSize: number = 50,
//   companyId?: string,
//   userId?: string
// ): Promise<ApiResponse<PagedResult<LoginHistoryDto>>> {
//   let url = `/api/audit/login-history?page=${page}&pageSize=${pageSize}`;
//   if (companyId) url += `&companyId=${companyId}`;
//   if (userId) url += `&userId=${userId}`;
//   return apiRequest(url);
// }

// // ==============================================
// // Helper Functions
// // ==============================================

// export function formatCurrency(
//   amount: number,
//   currency: Currency | string
// ): string {
//   const currencyCode =
//     typeof currency === "number"
//       ? currency === Currency.KES
//         ? "KES"
//         : "USD"
//       : currency;

//   return new Intl.NumberFormat("en-KE", {
//     style: "currency",
//     currency: currencyCode,
//     minimumFractionDigits: 2,
//   }).format(amount);
// }

// export function formatNumber(num: number): string {
//   return new Intl.NumberFormat("en-KE").format(num);
// }

// export function getCurrencyLabel(currency: Currency): string {
//   return currency === Currency.KES ? "KES" : "USD";
// }

// export function getTransactionTypeLabel(type: TransactionType): string {
//   return type === TransactionType.Debit
//     ? "Debit (Money Out)"
//     : "Credit (Money In)";
// }

// export function getAccountTypeLabel(type: AccountType): string {
//   const labels: Record<AccountType, string> = {
//     [AccountType.Cash]: "Cash",
//     [AccountType.Bank]: "Bank",
//     [AccountType.Mpesa]: "M-Pesa",
//     [AccountType.Client]: "Client",
//   };
//   return labels[type] || "Unknown";
// }

// export function getPaymentMethodLabel(method: PaymentMethod): string {
//   const labels: Record<PaymentMethod, string> = {
//     [PaymentMethod.Cash]: "Cash",
//     [PaymentMethod.Bank]: "Bank Transfer",
//     [PaymentMethod.Mpesa]: "M-Pesa",
//     [PaymentMethod.AccountTransfer]: "Account Transfer",
//   };
//   return labels[method] || "Unknown";
// }

// export function getRoleLabel(role: UserRole): string {
//   const labels: Record<UserRole, string> = {
//     [UserRole.SuperAdmin]: "Super Admin",
//     [UserRole.OfficeUser]: "Office User",
//     [UserRole.Client]: "Client",
//   };
//   return labels[role] || "Unknown";
// }

// export function getClientTypeLabel(type: ClientType): string {
//   return type === ClientType.Permanent ? "Permanent" : "Temporary";
// }

// export function getReconciliationStatusLabel(
//   status: ReconciliationStatus
// ): string {
//   const labels: Record<ReconciliationStatus, string> = {
//     [ReconciliationStatus.Pending]: "Pending",
//     [ReconciliationStatus.Matched]: "Matched",
//     [ReconciliationStatus.Unmatched]: "Unmatched",
//   };
//   return labels[status] || "Unknown";
// }
// ==============================================
// SARIFF API Client - .NET Backend Integration
// API_BASE_URL configured via NEXT_PUBLIC_API_URL environment variable
// ==============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ==============================================
// Type Definitions
// ==============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==============================================
// Enums (matching backend) with Type Exports
// ==============================================

export const UserRole = {
  SuperAdmin: 0,
  OfficeUser: 1,
  Client: 2,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ClientType = {
  Permanent: 0,
  Temporary: 1,
} as const;
export type ClientType = (typeof ClientType)[keyof typeof ClientType];

export const Currency = {
  KES: 0,
  USD: 1,
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export const TransactionType = {
  Debit: 0, // Money IN (increases asset accounts)
  Credit: 1, // Money OUT (decreases asset accounts)
} as const;
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const AccountType = {
  Cash: 0,
  Bank: 1,
  Mpesa: 2,
  Client: 3,
} as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const ReconciliationStatus = {
  Pending: 0,
  Matched: 1,
  Unmatched: 2,
} as const;
export type ReconciliationStatus =
  (typeof ReconciliationStatus)[keyof typeof ReconciliationStatus];

export const PaymentMethod = {
  Cash: 0,
  Bank: 1,
  Mpesa: 2,
  AccountTransfer: 3,
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// ==============================================
// Auth Types - Unified Login
// ==============================================

export interface UnifiedLoginDto {
  code: string;
  phoneNumber: string;
  password: string;
}

export interface OtpVerifyDto {
  code: string;
  phoneNumber: string;
  otp: string;
}

export interface LoginResponseDto {
  requiresOtp: boolean;
  tokens: TokenResponseDto | null;
  message: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  role: number;
  name: string;
  code: string;
  companyId?: string;
  ownerName?: string;
  userId?: string;
  email?: string;
  whatsAppNumber?: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: UserInfoDto;
}

export interface UserInfoDto {
  id: string;
  fullName: string;
  whatsAppNumber: string;
  email?: string;
  role: number;
  companyId?: string;
  companyName?: string;
  ownerName?: string;
  userCode?: string;
  mustChangePassword: boolean;
}

// ==============================================
// Client Types
// ==============================================

export interface ClientDto {
  id: string;
  code: string;
  fullName: string;
  whatsAppNumber: string;
  email?: string;
  idPassport?: string;
  clientType: ClientType;
  balanceKES: number;
  balanceUSD: number;
  openingBalanceKES: number;
  openingBalanceUSD: number;
  netMovementUSD: number;
  totalCreditUSD: number;
  totalDebitUSD: number;
  netMovementKES: number;
  totalCreditKES: number;
  totalDebitKES: number;
  isActive: boolean;
  expiresAt?: string;
  lastActivityAt?: string;
  createdAt: string;
}

export interface CreateClientDto {
  fullName: string;
  whatsAppNumber: string;
  email?: string;
  idPassport?: string;
  clientType: ClientType;
  openingBalanceKES?: number;
  openingBalanceUSD?: number;
  password?: string;
  expiryDays?: number;
}

export interface UpdateClientDto {
  fullName?: string;
  whatsAppNumber?: string;
  email?: string;
  idPassport?: string;
  isActive?: boolean;
}

// ==============================================
// Transaction Types
// ==============================================

export interface TransactionDto {
  id: string;
  code: string;
  reference: string;
  transactionDate: string;
  transactionType: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  notes?: string;
  exchangeRate?: number;
  sourceAccountType: AccountType;
  sourceAccountId: string;
  sourceAccountName: string;
  sourceBalanceBefore: number;
  sourceBalanceAfter: number;
  destAccountType: AccountType;
  destAccountId: string;
  destAccountName: string;
  destBalanceBefore: number;
  destBalanceAfter: number;
  reconciliationStatus: ReconciliationStatus;
  createdAt: string;
  createdByName?: string;
}

export interface CreateTransactionDto {
  transactionType: TransactionType;
  sourceAccountType: AccountType;
  sourceAccountId: string;
  destAccountType: AccountType;
  destAccountId: string;
  amount: number;
  currency: Currency;
  counterAmount?: number;
  counterCurrency?: Currency;
  description: string;
  notes?: string;
  exchangeRate?: number;
  paymentMethod: PaymentMethod;
}

export interface TransactionResponseDto {
  id: string;
  code: string;
  reference: string;
  transactionDate: string;
  transactionType: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  notes?: string;
  exchangeRate?: number;
  sourceAccountType: AccountType;
  sourceAccountId: string;
  sourceAccountName: string;
  sourceBalanceBefore: number;
  sourceBalanceAfter: number;
  destAccountType: AccountType;
  destAccountId: string;
  destAccountName: string;
  destBalanceBefore: number;
  destBalanceAfter: number;
  counterAmount?: number;
  counterCurrency?: Currency;
  reconciliationStatus: ReconciliationStatus;
  createdAt: string;
}

// ==============================================
// Bank Account Types
// ==============================================

export interface BankAccountDto {
  id: string;
  code: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  currency: Currency;
  balance: number;
  openingBalance: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBankAccountDto {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  currency: Currency;
  openingBalance?: number;
}

// ==============================================
// M-Pesa Agent Types
// ==============================================

export interface MpesaAgentDto {
  id: string;
  code: string;
  agentName: string;
  agentNumber: string;
  phoneNumber: string;
  tillNumber?: string;
  paybillNumber?: string;
  balance: number;
  openingBalance: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateMpesaAgentDto {
  agentName: string;
  agentNumber: string;
  phoneNumber: string;
  tillNumber?: string;
  paybillNumber?: string;
  openingBalance?: number;
}

// ==============================================
// Cash Account Types
// ==============================================

export interface CashAccountDto {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
  openingBalance: number;
  isActive: boolean;
}

// ==============================================
// Exchange Rate Types
// ==============================================

export interface ExchangeRateDto {
  id: string;
  buyRate: number;
  sellRate: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdAt: string;
  createdByName?: string;
}

export interface SetExchangeRateDto {
  buyRate: number;
  sellRate: number;
}

// ==============================================
// Expense Types
// ==============================================

export interface ExpenseCategoryDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ExpenseDto {
  id: string;
  code: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  vendorPayee?: string;
  amount: number;
  currency: Currency;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  createdAt: string;
  createdByName?: string;
}

export interface CreateExpenseDto {
  categoryId: string;
  description: string;
  vendorPayee?: string;
  amount: number;
  currency: Currency;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
}

// ==============================================
// Dashboard Types
// ==============================================

export interface DashboardStatsDto {
  cash: { kes: number; usd: number };
  banks: { kes: number; usd: number };
  mpesa: { total: number };
  exchange: { kes: number; usd: number };
  clients: { kes: number; usd: number };
  walkin: { kes: number; usd: number };
  daily: {
    credits: number;
    debits: number;
    net: number;
    byCurrency: {
      kes: { credits: number; debits: number; net: number };
      usd: { credits: number; debits: number; net: number };
    };
  };
  totalAccounts: number;
  totalTransactions: number;
  todayTransactions: number;
}

// ==============================================
// Invoice Types
// ==============================================

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: Currency;
  status: number;
  dueDate: string;
  createdAt: string;
}

// ==============================================
// Reconciliation Types - ALIGNED WITH BACKEND DTOs
// ==============================================

// Matches AccountReconciliationSummaryDto from backend
export interface AccountReconciliationSummaryDto {
  id: string;
  code: string;
  name: string;
  accountType: AccountType;
  currency: Currency;
  balance: number;
  pendingCount: number;
  matchedCount: number;
  unmatchedCount: number;
}

// Matches TransactionReconciliationDto from backend
export interface TransactionReconciliationDto {
  id: string;
  code: string;
  reference: string;
  transactionDate: string;
  transactionType: TransactionType;
  amount: number;
  actualAmount: number | null;
  variance: number | null;
  currency: Currency;
  description: string;
  reconciliationStatus: ReconciliationStatus;
  reconciledAt: string | null;
  reconciledByName: string | null;
  reconciliationNotes: string | null;
}

// Matches AccountReconciliationBalanceDto from backend
export interface AccountReconciliationBalanceDto {
  expectedBalance: number;
  actualBalance: number;
  variance: number;
  pendingCount: number;
  matchedCount: number;
  unmatchedCount: number;
  pendingAmount: number;
  matchedAmount: number;
  unmatchedAmount: number;
}

// Matches ReconcileTransactionDto for PUT request
export interface ReconcileTransactionDto {
  actualAmount: number;
  status: ReconciliationStatus;
  notes?: string;
}

// Matches BulkReconcileDto for PUT request
export interface BulkReconcileDto {
  transactionIds: string[];
  status: ReconciliationStatus;
  notes?: string;
}

// Matches CreateReconciliationDto for POST request
export interface CreateReconciliationDto {
  accountType: AccountType;
  accountId: string;
  actualBalance: number;
  notes?: string;
}

// Matches ReconciliationResponseDto from backend
export interface ReconciliationResponseDto {
  id: string;
  accountType: AccountType;
  accountId: string;
  accountName: string;
  currency: Currency;
  expectedBalance: number;
  actualBalance: number;
  variance: number;
  status: ReconciliationStatus;
  notes: string | null;
  reconciledAt: string | null;
  createdAt: string;
}

// Reconciliation filter DTO
export interface ReconciliationFilterDto {
  status?: ReconciliationStatus;
  startDate?: string;
  endDate?: string;
}

// Legacy ReconciliationDto
export interface ReconciliationDto {
  id: string;
  accountType: AccountType;
  accountId: string;
  accountName: string;
  systemBalance: number;
  actualBalance: number;
  variance: number;
  status: ReconciliationStatus;
  reconciledAt?: string;
  reconciledByName?: string;
  notes?: string;
}

// ==============================================
// Company Types (for Super Admin)
// ==============================================

export interface CompanyDto {
  id: string;
  code: string;
  name: string;
  whatsAppNumber: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CompanySummaryDto {
  company: CompanyDto;
  totalClients: number;
  totalTransactions: number;
  cashBalanceKES: number;
  cashBalanceUSD: number;
  bankBalanceKES: number;
  bankBalanceUSD: number;
  mpesaBalance: number;
}

// ==============================================
// Audit Log Types
// ==============================================

export interface AuditLogDto {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  companyId?: string;
  companyName?: string;
  action: string;
  details: string;
  entityType: string;
  entityId?: string;
  ipAddress: string;
}

export interface LoginHistoryDto {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  companyId?: string;
  companyName?: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent?: string;
  isSuccess: boolean;
  failureReason?: string;
}
// ============ CLIENT PORTAL DTOs ============

export interface ClientDashboardDto {
  profile: ClientProfileDto;
  recentTransactions: ClientTransactionDto[];
  recentAlerts: ClientAlertDto[];
  quickStats: QuickStatsDto;
}

export interface QuickStatsDto {
  thisMonthInKES: number;
  thisMonthOutKES: number;
  thisMonthInUSD: number;
  thisMonthOutUSD: number;
  transactionCount: number;
  unreadAlerts: number;
}

export interface ClientProfileDto {
  id: string;
  code: string;
  fullName: string;
  email: string | null;
  whatsAppNumber: string;
  idPassport: string | null;
  clientType: ClientType;
  balanceKES: number;
  balanceUSD: number;
  openingBalanceKES: number;
  openingBalanceUSD: number;
  totalInKES: number;
  totalOutKES: number;
  totalInUSD: number;
  totalOutUSD: number;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UpdateClientProfileDto {
  email?: string;
  whatsAppNumber?: string;
}

export interface ClientTransactionDto {
  id: string;
  code: string;
  date: string;
  time: string;
  type: string; // "Credit" or "Debit" from client's perspective
  transactionType: TransactionType;
  description: string;
  amount: number;
  currency: Currency;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  notes: string | null;
  status: ReconciliationStatus;
  createdAt: string;
  counterAccountName: string | null;
  counterAccountType: AccountType | null;
  exchangeRate: number | null;
  counterAmount: number | null;
  counterCurrency: Currency | null;
}

export interface ClientStatementDto {
  accountName: string;
  accountCode: string;
  currency: Currency;
  periodStart: string;
  periodEnd: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  netMovement: number;
  transactions: ClientTransactionDto[];
}

export interface ClientAlertDto {
  id: string;
  type: string; // "success" | "info" | "warning" | "error"
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedTransactionId: string | null;
}

export interface ClientAnalyticsDto {
  monthlyData: MonthlyDataDto[];
  categoryBreakdown: CategoryBreakdownDto[];
  weeklyActivity: WeeklyActivityDto[];
  totals: AnalyticsTotalsDto;
}

export interface MonthlyDataDto {
  month: string;
  incomeKES: number;
  expensesKES: number;
  incomeUSD: number;
  expensesUSD: number;
  balanceKES: number;
  balanceUSD: number;
}

export interface CategoryBreakdownDto {
  category: string;
  count: number;
  totalKES: number;
  totalUSD: number;
  percentage: number;
}

export interface WeeklyActivityDto {
  day: string;
  transactions: number;
}

export interface AnalyticsTotalsDto {
  totalTransactions: number;
  avgTransactionKES: number;
  avgTransactionUSD: number;
  netIncomeKES: number;
  netIncomeUSD: number;
  growthPercentage: number;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PortalTransactionFilters {
  startDate?: string;
  endDate?: string;
  currency?: Currency;
  type?: TransactionType;
  search?: string;
}

// ==============================================
// Auth Token Management
// ==============================================

export interface StoredAuth {
  token: string;
  refreshToken: string;
  user: UserInfoDto;
  expiresAt: string;
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;

  const authStr = localStorage.getItem("sariff_auth");
  if (!authStr) return null;

  try {
    return JSON.parse(authStr);
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sariff_auth", JSON.stringify(auth));

  const expiryDate = auth.expiresAt
    ? new Date(auth.expiresAt)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const expires = expiryDate.toUTCString();

  document.cookie = `auth_token=${auth.token}; path=/; expires=${expires}; SameSite=Lax`;

  const roleMap: Record<number, string> = {
    0: "super-admin",
    1: "office-user",
    2: "client",
  };
  const roleName = roleMap[auth.user.role] || "client";
  document.cookie = `user_role=${roleName}; path=/; expires=${expires}; SameSite=Lax`;
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sariff_auth");

  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function getCompanyId(): string | undefined {
  const auth = getStoredAuth();
  return auth?.user?.companyId;
}

// ==============================================
// API Request Helper
// ==============================================

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const auth = getStoredAuth();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (auth?.token) {
    headers["Authorization"] = `Bearer ${auth.token}`;
  }

  if (auth?.user?.companyId) {
    headers["X-Company-Id"] = auth.user.companyId;
  }

  if (auth?.user?.id) {
    headers["X-User-Id"] = auth.user.id;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && auth?.refreshToken) {
      const refreshed = await refreshToken(auth.refreshToken);
      if (refreshed) {
        headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
        return await retryResponse.json();
      } else {
        clearStoredAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return { success: false, message: "Session expired", data: null };
      }
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    return {
      success: false,
      message: error.message || "Network error occurred",
      data: null,
    };
  }
}

async function refreshToken(
  refreshTokenValue: string
): Promise<AuthResponseDto | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!response.ok) return null;

    const result: ApiResponse<AuthResponseDto> = await response.json();
    if (result.success && result.data?.accessToken && result.data?.user) {
      setStoredAuth({
        token: result.data.accessToken,
        refreshToken: result.data.refreshToken || refreshTokenValue,
        user: result.data.user,
        expiresAt: result.data.expiresAt || "",
      });
      return result.data;
    }
    return null;
  } catch {
    return null;
  }
}

// ==============================================
// Auth API Functions
// ==============================================

export async function login(
  dto: UnifiedLoginDto
): Promise<ApiResponse<LoginResponseDto>> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return response.json();
}

export async function verifyOtp(
  dto: OtpVerifyDto
): Promise<ApiResponse<TokenResponseDto>> {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return response.json();
}

export async function logout(): Promise<void> {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } finally {
    clearStoredAuth();
  }
}

// ==============================================
// Dashboard API Functions
// ==============================================

export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStatsDto>
> {
  const cashResult = await apiRequest<CashAccountDto[]>("/api/cash");
  const bankResult = await apiRequest<BankAccountDto[]>("/api/bank");
  const mpesaResult = await apiRequest<MpesaAgentDto[]>("/api/mpesa");
  const clientResult = await apiRequest<PagedResult<ClientDto>>(
    "/api/client?page=1&pageSize=1000"
  );
  const transactionResult = await apiRequest<PagedResult<TransactionDto>>(
    "/api/transaction/today"
  );

  let cashKes = 0,
    cashUsd = 0;
  if (cashResult.success && cashResult.data) {
    cashResult.data.forEach((c) => {
      if (c.currency === Currency.KES) cashKes = c.balance;
      else cashUsd = c.balance;
    });
  }

  let bankKes = 0,
    bankUsd = 0;
  if (bankResult.success && bankResult.data) {
    bankResult.data.forEach((b) => {
      if (b.currency === Currency.KES) bankKes += b.balance;
      else bankUsd += b.balance;
    });
  }

  let mpesaTotal = 0;
  if (mpesaResult.success && mpesaResult.data) {
    mpesaResult.data.forEach((m) => (mpesaTotal += m.balance));
  }

  let clientKes = 0,
    clientUsd = 0,
    totalClients = 0;
  if (clientResult.success && clientResult.data) {
    totalClients = clientResult.data.totalCount;
    clientResult.data.items.forEach((c) => {
      clientKes += c.balanceKES;
      clientUsd += c.balanceUSD;
    });
  }

  const stats: DashboardStatsDto = {
    cash: { kes: cashKes, usd: cashUsd },
    banks: { kes: bankKes, usd: bankUsd },
    mpesa: { total: mpesaTotal },
    exchange: { kes: 0, usd: 0 },
    clients: { kes: clientKes, usd: clientUsd },
    walkin: { kes: 0, usd: 0 },
    daily: {
      credits: 0,
      debits: 0,
      net: 0,
      byCurrency: {
        kes: {
          credits: (transactionResult.data as any)?.totalCreditKES,
          debits: (transactionResult.data as any)?.totalDebitKES,
          net: (transactionResult.data as any)?.netFlowKES,
        },
        usd: {
          credits: (transactionResult.data as any)?.totalCreditUSD,
          debits: (transactionResult.data as any)?.totalDebitUSD,
          net: (transactionResult.data as any)?.netFlowUSD,
        },
      },
    },
    totalAccounts: totalClients,
    totalTransactions: 0,
    todayTransactions: transactionResult.data?.totalCount || 0,
  };

  return { success: true, message: "Dashboard stats loaded", data: stats };
}

export async function getRecentTransactions(
  count: number = 10
): Promise<ApiResponse<TransactionDto[]>> {
  return apiRequest(`/api/transaction/recent?count=${count}`);
}

// ==============================================
// Client API Functions
// ==============================================

export async function getClients(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  filter?: string
): Promise<ApiResponse<PagedResult<ClientDto>>> {
  let url = `/api/client?page=${page}&pageSize=${pageSize}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (filter) url += `&filter=${filter}`;
  return apiRequest(url);
}

export async function getClientById(
  id: string
): Promise<ApiResponse<ClientDto>> {
  return apiRequest(`/api/client/${id}`);
}

export async function createClient(
  dto: CreateClientDto
): Promise<ApiResponse<ClientDto>> {
  return apiRequest("/api/client", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateClient(
  id: string,
  dto: UpdateClientDto
): Promise<ApiResponse<ClientDto>> {
  return apiRequest(`/api/client/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteClient(id: string): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/client/${id}`, { method: "DELETE" });
}

export async function getClientStatement(
  id: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> {
  let url = `/api/client/${id}/statement`;
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return apiRequest(url);
}

export async function getClientStats(): Promise<ApiResponse<any>> {
  return apiRequest("/api/client/stats");
}

// ==============================================
// Transaction API Functions
// ==============================================

export async function getTransactions(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    startDate?: string;
    endDate?: string;
    type?: number;
    currency?: number;
  }
): Promise<ApiResponse<PagedResult<TransactionDto>>> {
  let url = `/api/transaction?page=${page}&pageSize=${pageSize}`;
  if (filters) {
    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    if (filters.type !== undefined) url += `&type=${filters.type}`;
    if (filters.currency !== undefined) url += `&currency=${filters.currency}`;
  }
  return apiRequest(url);
}

export async function createTransaction(
  dto: CreateTransactionDto
): Promise<ApiResponse<TransactionDto>> {
  return apiRequest("/api/transaction", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getTransactionById(
  id: string
): Promise<ApiResponse<TransactionDto>> {
  return apiRequest(`/api/transaction/${id}`);
}

export async function deleteTransaction(
  id: string,
  reason: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/transaction/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ reason }),
  });
}

export async function getTodayTransactionsSummary(): Promise<ApiResponse<any>> {
  return apiRequest("/api/transaction/today");
}

// ==============================================
// Bank Account API Functions
// ==============================================

export async function getBankAccounts(): Promise<
  ApiResponse<BankAccountDto[]>
> {
  return apiRequest("/api/bank");
}

export async function getBankAccountById(
  id: string
): Promise<ApiResponse<BankAccountDto>> {
  return apiRequest(`/api/bank/${id}`);
}

export async function createBankAccount(
  dto: CreateBankAccountDto
): Promise<ApiResponse<BankAccountDto>> {
  return apiRequest("/api/bank", { method: "POST", body: JSON.stringify(dto) });
}

export async function updateBankAccount(
  id: string,
  dto: Partial<BankAccountDto>
): Promise<ApiResponse<BankAccountDto>> {
  return apiRequest(`/api/bank/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteBankAccount(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/bank/${id}`, { method: "DELETE" });
}

export async function getBankAccountStatement(
  id: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> {
  let url = `/api/bank/${id}/statement`;
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return apiRequest(url);
}

export async function getBankStats(): Promise<ApiResponse<any>> {
  return apiRequest("/api/bank/stats");
}

// ==============================================
// M-Pesa Agent API Functions
// ==============================================

export async function getMpesaAgents(): Promise<ApiResponse<MpesaAgentDto[]>> {
  return apiRequest("/api/mpesa");
}

export async function getMpesaAgentById(
  id: string
): Promise<ApiResponse<MpesaAgentDto>> {
  return apiRequest(`/api/mpesa/${id}`);
}

export async function createMpesaAgent(
  dto: CreateMpesaAgentDto
): Promise<ApiResponse<MpesaAgentDto>> {
  return apiRequest("/api/mpesa", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateMpesaAgent(
  id: string,
  dto: Partial<MpesaAgentDto>
): Promise<ApiResponse<MpesaAgentDto>> {
  return apiRequest(`/api/mpesa/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteMpesaAgent(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/mpesa/${id}`, { method: "DELETE" });
}

export async function getMpesaAgentStatement(
  id: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> {
  let url = `/api/mpesa/${id}/statement`;
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return apiRequest(url);
}

export async function getMpesaStats(): Promise<ApiResponse<any>> {
  return apiRequest("/api/mpesa/stats");
}

// ==============================================
// Cash Account API Functions
// ==============================================

export async function getCashAccounts(): Promise<
  ApiResponse<CashAccountDto[]>
> {
  return apiRequest("/api/cash");
}

export async function getCashAccountStatement(
  currency: number,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> {
  let url = `/api/cash/statement/${currency}`;
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return apiRequest(url);
}

export async function getCashStats(): Promise<ApiResponse<any>> {
  return apiRequest("/api/cash/stats");
}

// ==============================================
// Exchange Rate API Functions
// ==============================================

export async function getCurrentExchangeRate(): Promise<
  ApiResponse<ExchangeRateDto>
> {
  return apiRequest("/api/exchange/current");
}

export async function setExchangeRate(
  dto: SetExchangeRateDto
): Promise<ApiResponse<ExchangeRateDto>> {
  return apiRequest("/api/exchange", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getExchangeRateHistory(): Promise<
  ApiResponse<ExchangeRateDto[]>
> {
  return apiRequest("/api/exchange/history");
}

export async function convertCurrency(
  fromCurrency: Currency,
  toCurrency: Currency,
  amount: number
): Promise<ApiResponse<any>> {
  return apiRequest("/api/exchange/convert", {
    method: "POST",
    body: JSON.stringify({ fromCurrency, toCurrency, amount }),
  });
}

export async function createExchangeTransaction(
  dto: any
): Promise<ApiResponse<any>> {
  return apiRequest("/api/exchange/transaction", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// ==============================================
// Expense API Functions
// ==============================================

export async function getExpenseCategories(): Promise<
  ApiResponse<ExpenseCategoryDto[]>
> {
  return apiRequest("/api/expense/category");
}

export async function createExpenseCategory(dto: {
  name: string;
  description?: string;
}): Promise<ApiResponse<ExpenseCategoryDto>> {
  return apiRequest("/api/expense/category", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateExpenseCategory(
  id: string,
  dto: { name: string; description?: string }
): Promise<ApiResponse<ExpenseCategoryDto>> {
  return apiRequest(`/api/expense/category/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteExpenseCategory(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/expense/category/${id}`, { method: "DELETE" });
}

export async function getExpenses(
  page: number = 1,
  pageSize: number = 10,
  filters?: { startDate?: string; endDate?: string; currency?: number }
): Promise<ApiResponse<PagedResult<ExpenseDto>>> {
  let url = `/api/expense?page=${page}&pageSize=${pageSize}`;
  if (filters) {
    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    if (filters.currency !== undefined) url += `&currency=${filters.currency}`;
  }
  return apiRequest(url);
}

export async function createExpense(
  dto: CreateExpenseDto
): Promise<ApiResponse<ExpenseDto>> {
  return apiRequest("/api/expense", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getExpenseStats(): Promise<ApiResponse<any>> {
  return apiRequest("/api/expense/stats");
}

// ==============================================
// Invoice API Functions
// ==============================================

export async function getInvoices(
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PagedResult<InvoiceDto>>> {
  return apiRequest(`/api/invoice?page=${page}&pageSize=${pageSize}`);
}

export async function createInvoice(
  dto: any
): Promise<ApiResponse<InvoiceDto>> {
  return apiRequest("/api/invoice", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getInvoiceById(
  id: string
): Promise<ApiResponse<InvoiceDto>> {
  return apiRequest(`/api/invoice/${id}`);
}

export async function updateInvoiceStatus(
  id: string,
  status: number
): Promise<ApiResponse<InvoiceDto>> {
  return apiRequest(`/api/invoice/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ==============================================
// Reconciliation API Functions - FULL IMPLEMENTATION
// ==============================================

// Get all accounts with reconciliation stats
export async function getReconciliationAccounts(): Promise<
  ApiResponse<AccountReconciliationSummaryDto[]>
> {
  return apiRequest("/api/reconciliation/accounts");
}

// Get transactions for a specific account
export async function getAccountTransactionsForReconciliation(
  accountType: AccountType,
  accountId: string,
  filter?: ReconciliationFilterDto,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<PagedResult<TransactionReconciliationDto>>> {
  const params = new URLSearchParams();
  if (filter?.status !== undefined)
    params.append("status", filter.status.toString());
  if (filter?.startDate) params.append("startDate", filter.startDate);
  if (filter?.endDate) params.append("endDate", filter.endDate);
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  return apiRequest(
    `/api/reconciliation/account/${accountType}/${accountId}/transactions?${params.toString()}`
  );
}

// Get account balance summary for reconciliation
export async function getAccountReconciliationSummary(
  accountType: AccountType,
  accountId: string
): Promise<ApiResponse<AccountReconciliationBalanceDto>> {
  return apiRequest(
    `/api/reconciliation/account/${accountType}/${accountId}/summary`
  );
}

// Reconcile a single transaction
export async function reconcileTransaction(
  transactionId: string,
  dto: ReconcileTransactionDto
): Promise<ApiResponse<TransactionReconciliationDto>> {
  return apiRequest(`/api/reconciliation/transaction/${transactionId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// Bulk reconcile multiple transactions
export async function bulkReconcileTransactions(
  dto: BulkReconcileDto
): Promise<ApiResponse<number>> {
  return apiRequest("/api/reconciliation/bulk", {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// Create/complete a reconciliation record
export async function createReconciliationRecord(
  dto: CreateReconciliationDto
): Promise<ApiResponse<ReconciliationResponseDto>> {
  return apiRequest("/api/reconciliation", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// Get reconciliation history
export async function getReconciliationHistory(
  accountType?: AccountType,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PagedResult<ReconciliationResponseDto>>> {
  const params = new URLSearchParams();
  if (accountType !== undefined)
    params.append("accountType", accountType.toString());
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  return apiRequest(`/api/reconciliation?${params.toString()}`);
}

// Complete a reconciliation (mark as finalized)
export async function completeReconciliation(
  reconciliationId: string
): Promise<ApiResponse<ReconciliationResponseDto>> {
  return apiRequest(`/api/reconciliation/${reconciliationId}/complete`, {
    method: "POST",
  });
}

// Legacy function - kept for backwards compatibility
export async function getReconciliations(
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PagedResult<ReconciliationDto>>> {
  return apiRequest(`/api/reconciliation?page=${page}&pageSize=${pageSize}`);
}

// Legacy function - kept for backwards compatibility
export async function createReconciliation(
  dto: any
): Promise<ApiResponse<ReconciliationDto>> {
  return apiRequest("/api/reconciliation", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
// ==============================================
// CLIENT PORTAL API FUNCTIONS
// ==============================================

const PORTAL_BASE = "/api/portal";

// Dashboard
export async function getClientDashboard(): Promise<
  ApiResponse<ClientDashboardDto>
> {
  return apiRequest(`${PORTAL_BASE}/dashboard`);
}

// Profile
export async function getClientProfile(): Promise<
  ApiResponse<ClientProfileDto>
> {
  return apiRequest(`${PORTAL_BASE}/profile`);
}

export async function updateClientProfile(
  dto: UpdateClientProfileDto
): Promise<ApiResponse<ClientProfileDto>> {
  return apiRequest(`${PORTAL_BASE}/profile`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// Transactions
export async function getClientTransactions(
  page: number = 1,
  pageSize: number = 20,
  filters?: Partial<PortalTransactionFilters>
): Promise<ApiResponse<PagedResult<ClientTransactionDto>>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.currency !== undefined)
    params.append("currency", filters.currency.toString());
  if (filters?.type !== undefined)
    params.append("type", filters.type.toString());
  if (filters?.search) params.append("search", filters.search);
  return apiRequest(`${PORTAL_BASE}/transactions?${params}`);
}

export async function getClientTransactionById(
  transactionId: string
): Promise<ApiResponse<ClientTransactionDto>> {
  return apiRequest(`${PORTAL_BASE}/transactions/${transactionId}`);
}

export async function downloadTransactionReceipt(
  transactionId: string
): Promise<Blob> {
  const auth = getStoredAuth();
  const headers: Record<string, string> = {};
  if (auth?.token) headers["Authorization"] = `Bearer ${auth.token}`;
  if (auth?.user?.companyId) headers["X-Company-Id"] = auth.user.companyId;
  if (auth?.user?.id) headers["X-User-Id"] = auth.user.id;

  const response = await fetch(
    `${API_BASE_URL}${PORTAL_BASE}/transactions/${transactionId}/receipt`,
    { headers }
  );
  return response.blob();
}

export async function exportTransactionsCsv(
  startDate?: string,
  endDate?: string,
  currency?: Currency
): Promise<Blob> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (currency !== undefined) params.append("currency", currency.toString());

  const auth = getStoredAuth();
  const headers: Record<string, string> = {};
  if (auth?.token) headers["Authorization"] = `Bearer ${auth.token}`;
  if (auth?.user?.companyId) headers["X-Company-Id"] = auth.user.companyId;
  if (auth?.user?.id) headers["X-User-Id"] = auth.user.id;

  const response = await fetch(
    `${API_BASE_URL}${PORTAL_BASE}/transactions/export?${params}`,
    { headers }
  );
  return response.blob();
}

// Statement
export async function getClientPortalStatement(
  startDate: string,
  endDate: string,
  currency?: Currency
): Promise<ApiResponse<ClientStatementDto>> {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (currency !== undefined) params.append("currency", currency.toString());
  return apiRequest(`${PORTAL_BASE}/statement?${params}`);
}

export async function downloadStatementPdf(
  startDate: string,
  endDate: string,
  currency?: Currency
): Promise<Blob> {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (currency !== undefined) params.append("currency", currency.toString());

  const auth = getStoredAuth();
  const headers: Record<string, string> = {};
  if (auth?.token) headers["Authorization"] = `Bearer ${auth.token}`;
  if (auth?.user?.companyId) headers["X-Company-Id"] = auth.user.companyId;
  if (auth?.user?.id) headers["X-User-Id"] = auth.user.id;

  const response = await fetch(
    `${API_BASE_URL}${PORTAL_BASE}/statement/pdf?${params}`,
    { headers }
  );
  return response.blob();
}

// Alerts
export async function getClientAlerts(
  page: number = 1,
  pageSize: number = 20,
  unreadOnly: boolean = false
): Promise<ApiResponse<PagedResult<ClientAlertDto>>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  params.append("unreadOnly", unreadOnly.toString());
  return apiRequest(`${PORTAL_BASE}/alerts?${params}`);
}

export async function getUnreadAlertsCount(): Promise<ApiResponse<number>> {
  return apiRequest(`${PORTAL_BASE}/alerts/unread-count`);
}

export async function markAlertAsRead(
  alertId: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`${PORTAL_BASE}/alerts/${alertId}/read`, {
    method: "POST",
  });
}

export async function markAllAlertsAsRead(): Promise<ApiResponse<boolean>> {
  return apiRequest(`${PORTAL_BASE}/alerts/read-all`, { method: "POST" });
}

// Analytics
export async function getClientAnalytics(
  months: number = 6
): Promise<ApiResponse<ClientAnalyticsDto>> {
  return apiRequest(`${PORTAL_BASE}/analytics?months=${months}`);
}
// Reset client password (Office user action)
// =====================================================
// ADD THIS TO YOUR api.ts FILE
// =====================================================

// DTO for reset password request
export interface ResetClientPasswordDto {
  newPassword: string;
}

// Reset client password (Office user action)
// Endpoint: POST /api/client/{id}/reset-password
export async function resetClientPassword(
  clientId: string,
  newPassword: string
): Promise<ApiResponse<boolean>> {
  return apiRequest<boolean>(`/api/client/${clientId}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
}
// Security
export async function changeClientPassword(
  dto: ChangePasswordDto
): Promise<ApiResponse<boolean>> {
  return apiRequest(`${PORTAL_BASE}/change-password`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// ==============================================
// Report API Functions
// ==============================================

export async function getDailyReport(date: string): Promise<ApiResponse<any>> {
  return apiRequest(`/api/report/daily?date=${date}`);
}

export async function getMonthlyReport(
  year: number,
  month: number
): Promise<ApiResponse<any>> {
  return apiRequest(`/api/report/monthly?year=${year}&month=${month}`);
}

export async function getClientStatementReport(
  clientId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<any>> {
  return apiRequest(
    `/api/report/client-statement?clientId=${clientId}&startDate=${startDate}&endDate=${endDate}`
  );
}

// ==============================================
// Company API Functions (Super Admin)
// ==============================================

export async function getCompanies(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<ApiResponse<PagedResult<CompanyDto>>> {
  let url = `/api/company?page=${page}&pageSize=${pageSize}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return apiRequest(url);
}

export async function getCompanyById(
  id: string
): Promise<ApiResponse<CompanyDto>> {
  return apiRequest(`/api/company/${id}`);
}

export async function createCompany(
  dto: any
): Promise<ApiResponse<CompanyDto>> {
  return apiRequest("/api/company", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateCompany(
  id: string,
  dto: any
): Promise<ApiResponse<CompanyDto>> {
  return apiRequest(`/api/company/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function activateCompany(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/company/${id}/activate`, { method: "POST" });
}

export async function deactivateCompany(
  id: string
): Promise<ApiResponse<boolean>> {
  return apiRequest(`/api/company/${id}/deactivate`, { method: "POST" });
}

export async function getCompanySummary(
  id: string
): Promise<ApiResponse<CompanySummaryDto>> {
  return apiRequest(`/api/company/${id}/summary`);
}

export async function getAllCompanySummaries(): Promise<
  ApiResponse<CompanySummaryDto[]>
> {
  return apiRequest("/api/company/summaries");
}

// ==============================================
// Audit Log API Functions (Super Admin)
// ==============================================

export async function getAuditLogs(
  page: number = 1,
  pageSize: number = 50,
  companyId?: string
): Promise<ApiResponse<PagedResult<AuditLogDto>>> {
  let url = `/api/audit?page=${page}&pageSize=${pageSize}`;
  if (companyId) url += `&companyId=${companyId}`;
  return apiRequest(url);
}

export async function getLoginHistory(
  page: number = 1,
  pageSize: number = 50,
  companyId?: string,
  userId?: string
): Promise<ApiResponse<PagedResult<LoginHistoryDto>>> {
  let url = `/api/audit/login-history?page=${page}&pageSize=${pageSize}`;
  if (companyId) url += `&companyId=${companyId}`;
  if (userId) url += `&userId=${userId}`;
  return apiRequest(url);
}

// ==============================================
// Helper Functions
// ==============================================

export function formatCurrency(
  amount: number,
  currency: Currency | string
): string {
  const currencyCode =
    typeof currency === "number"
      ? currency === Currency.KES
        ? "KES"
        : "USD"
      : currency;
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-KE").format(num);
}

export function getCurrencyLabel(currency: Currency): string {
  return currency === Currency.KES ? "KES" : "USD";
}

export function getTransactionTypeLabel(type: TransactionType): string {
  return type === TransactionType.Debit
    ? "Debit (Money In)"
    : "Credit (Money Out)";
}

export function getAccountTypeLabel(type: AccountType): string {
  const labels: Record<AccountType, string> = {
    [AccountType.Cash]: "Cash",
    [AccountType.Bank]: "Bank",
    [AccountType.Mpesa]: "M-Pesa",
    [AccountType.Client]: "Client",
  };
  return labels[type] || "Unknown";
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: "Cash",
    [PaymentMethod.Bank]: "Bank Transfer",
    [PaymentMethod.Mpesa]: "M-Pesa",
    [PaymentMethod.AccountTransfer]: "Account Transfer",
  };
  return labels[method] || "Unknown";
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.SuperAdmin]: "Super Admin",
    [UserRole.OfficeUser]: "Office User",
    [UserRole.Client]: "Client",
  };
  return labels[role] || "Unknown";
}

export function getClientTypeLabel(type: ClientType): string {
  return type === ClientType.Permanent ? "Permanent" : "Temporary";
}

export function getReconciliationStatusLabel(
  status: ReconciliationStatus
): string {
  const labels: Record<ReconciliationStatus, string> = {
    [ReconciliationStatus.Pending]: "Pending",
    [ReconciliationStatus.Matched]: "Matched",
    [ReconciliationStatus.Unmatched]: "Unmatched",
  };
  return labels[status] || "Unknown";
}
