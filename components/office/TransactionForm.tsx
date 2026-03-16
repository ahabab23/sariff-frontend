// // import { useEffect, useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Hash,
// //   Building2,
// //   User,
// //   RefreshCw,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Debit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   const [sourceAccountType, setSourceAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [sourceAccountId, setSourceAccountId] = useState("");
// //   const [destAccountType, setDestAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [destAccountId, setDestAccountId] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [method, setMethod] = useState<"cash" | "bank" | "mpesa" | "account">(
// //     "cash"
// //   );

// //   const generateReference = () => {
// //     const date = new Date();
// //     const year = date.getFullYear();
// //     const random = Math.floor(Math.random() * 10000)
// //       .toString()
// //       .padStart(4, "0");
// //     return `TXN-${year}-${random}`;
// //   };

// //   const [reference] = useState(generateReference());

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000), // Get all clients
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);
// //   // Get accounts by type for dropdown
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES, // M-Pesa is always KES
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         return clients.map((c) => ({
// //           id: c.id,
// //           name: `${c.fullName} (${c.code})`,
// //           type: AccountType.Client,
// //           currency: Currency.KES, // Default, clients can have both
// //           balance: c.balanceKES + c.balanceUSD,
// //           isActive: c.isActive !== false,
// //         }));
// //       default:
// //         return [];
// //     }
// //   };
// //   // Get destination account type based on payment method
// //   const getDestAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };
// //   // Update destination account type when payment method changes
// //   useEffect(() => {
// //     const newDestType = getDestAccountTypeFromPayment(paymentMethod);
// //     setDestAccountType(newDestType);
// //     setDestAccountId(""); // Reset selection
// //   }, [paymentMethod]);
// //   // Check if exchange rate is needed
// //   const needsExchangeRate = () => {
// //     const sourceAcc = getAccountsByType(sourceAccountType).find(
// //       (a) => a.id === sourceAccountId
// //     );
// //     const destAcc = getAccountsByType(destAccountType).find(
// //       (a) => a.id === destAccountId
// //     );

// //     if (sourceAcc && destAcc) {
// //       return sourceAcc.currency !== destAcc.currency;
// //     }
// //     return false;
// //   };
// //   // Get selected account currency
// //   const getSelectedAccountCurrency = (
// //     type: AccountType,
// //     id: string
// //   ): Currency | null => {
// //     const accounts = getAccountsByType(type);
// //     const account = accounts.find((a) => a.id === id);
// //     return account?.currency ?? null;
// //   };
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       // Validation
// //       if (!sourceAccountId) {
// //         throw new Error("Please select a source account");
// //       }
// //       if (!destAccountId) {
// //         throw new Error("Please select a destination account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: sourceAccountType,
// //         sourceAccountId: sourceAccountId,
// //         destAccountType: destAccountType,
// //         destAccountId: destAccountId,
// //         amount: parseFloat(amount),
// //         currency: currency,
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //         exchangeRate: needsExchangeRate()
// //           ? parseFloat(exchangeRate)
// //           : undefined,
// //         paymentMethod: paymentMethod,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Debit ? "Debit" : "Credit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };
// //   // Get selected item currency

// //   //Notes placehoders

// //   const getNotesPlaceholder = () => {
// //     switch (method) {
// //       case "cash":
// //         return "Name & Telephone Number";
// //       case "bank":
// //       case "mpesa":
// //         return "Transaction message / reference details";
// //       case "account":
// //         return "Internal transfer notes";
// //       default:
// //         return "Enter notes";
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Compact Header */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Credit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Credit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 Process {transactionType} transaction
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Compact Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle - Inline */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Primary Account to Debit/Credit */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Wallet className="w-3 h-3 inline mr-1" />
// //               Account to{" "}
// //               {transactionType === TransactionType.Debit ? "Debit" : "Credit"} *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={sourceAccountType}
// //                 onChange={(e) => {
// //                   setSourceAccountType(Number(e.target.value) as AccountType);
// //                   setSourceAccountId("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <select
// //                 value={sourceAccountId}
// //                 onChange={(e) => setSourceAccountId(e.target.value)}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //                 required
// //               >
// //                 <option value="">Select account...</option>
// //                 {getAccountsByType(sourceAccountType).map((account) => (
// //                   <option key={account.id} value={account.id}>
// //                     {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                     {account.balance.toLocaleString()}
// //                   </option>
// //                 ))}
// //                 {transactionType === TransactionType.Credit ? "💰" : "💸"}
// //                 <span>
// //                   This account will be{" "}
// //                   {transactionType === TransactionType.Credit
// //                     ? "credited (money in)"
// //                     : "debited (money out)"}
// //                 </span>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Description - Full Width - MOVED HERE FOR VISIBILITY */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Transaction Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal, etc."
// //               required
// //             />
// //             <p className="text-[10px] text-blue-600 mt-1.5 font-semibold">
// //               💡 Brief description of what this transaction is for
// //             </p>
// //           </div>

// //           {/* Amount & Currency - 2 Columns */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm transition-all"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency *
// //               </label>
// //               <select
// //                 value={currency}
// //                 onChange={(e) =>
// //                   setCurrency(Number(e.target.value) as Currency)
// //                 }
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
// //                 required
// //               >
// //                 <option value={Currency.KES}>KES</option>
// //                 <option value={Currency.USD}>USD</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Reference & Date - 2 Columns */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <Hash className="w-3 h-3 inline mr-1" />
// //                 Reference
// //               </label>
// //               <input
// //                 type="text"
// //                 value={reference}
// //                 readOnly
// //                 className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <Calendar className="w-3 h-3 inline mr-1" />
// //                 Date *
// //               </label>
// //               <input
// //                 type="date"
// //                 value={dateValue}
// //                 onChange={(e) => setDateValue(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
// //                 required
// //               />
// //             </div>
// //           </div>

// //           {/* Payment Method - Compact Grid */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setMethod("cash")}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   method === "cash"
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     method === "cash"
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     method === "cash" ? "text-blue-700" : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setMethod("bank")}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   method === "bank"
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     method === "bank"
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     method === "bank" ? "text-blue-700" : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setMethod("mpesa")}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   method === "mpesa"
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     method === "mpesa"
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     method === "mpesa" ? "text-blue-700" : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setMethod("account")}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   method === "account"
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     method === "account"
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     method === "account" ? "text-blue-700" : "text-slate-600"
// //                   }`}
// //                 >
// //                   Account
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Conditional Selection Fields */}
// //           {method === "account" && (
// //             <motion.div
// //               initial={{ opacity: 0, height: 0 }}
// //               animate={{ opacity: 1, height: "auto" }}
// //               exit={{ opacity: 0, height: 0 }}
// //               transition={{ duration: 0.2 }}
// //             >
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                 Select Account *
// //               </label>
// //               <select
// //                 value={selectedAccount}
// //                 onChange={(e) => setSelectedAccount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
// //                 required
// //               >
// //                 <option value="" className="text-slate-500">
// //                   Choose an account...
// //                 </option>
// //                 {accounts.map((account) => (
// //                   <option
// //                     key={account.id}
// //                     value={account.id}
// //                     className="text-slate-900"
// //                   >
// //                     {account.name} ({account.type})
// //                   </option>
// //                 ))}
// //               </select>
// //             </motion.div>
// //           )}

// //           {method === "bank" && (
// //             <motion.div
// //               initial={{ opacity: 0, height: 0 }}
// //               animate={{ opacity: 1, height: "auto" }}
// //               exit={{ opacity: 0, height: 0 }}
// //               transition={{ duration: 0.2 }}
// //             >
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <Building2 className="w-3 h-3 inline mr-1" />
// //                 Select Bank Account *
// //               </label>
// //               <select
// //                 value={selectedBank}
// //                 onChange={(e) => setSelectedBank(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
// //                 required
// //               >
// //                 <option value="" className="text-slate-500">
// //                   Choose a bank...
// //                 </option>
// //                 {banks.map((bank) => (
// //                   <option
// //                     key={bank.id}
// //                     value={bank.id}
// //                     className="text-slate-900"
// //                   >
// //                     {bank.name} - A/C: {bank.accountNumber}
// //                   </option>
// //                 ))}
// //               </select>
// //             </motion.div>
// //           )}

// //           {method === "mpesa" && (
// //             <motion.div
// //               initial={{ opacity: 0, height: 0 }}
// //               animate={{ opacity: 1, height: "auto" }}
// //               exit={{ opacity: 0, height: 0 }}
// //               transition={{ duration: 0.2 }}
// //             >
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <User className="w-3 h-3 inline mr-1" />
// //                 Select M-Pesa Agent *
// //               </label>
// //               <select
// //                 value={selectedAgent}
// //                 onChange={(e) => setSelectedAgent(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
// //                 required
// //               >
// //                 <option value="" className="text-slate-500">
// //                   Choose an agent...
// //                 </option>
// //                 {agents.map((agent) => (
// //                   <option
// //                     key={agent.id}
// //                     value={agent.id}
// //                     className="text-slate-900"
// //                   >
// //                     {agent.name} - Agent #{agent.agentNumber}
// //                   </option>
// //                 ))}
// //               </select>
// //             </motion.div>
// //           )}

// //           {/* Exchange Rate Field */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -10 }}
// //               className="space-y-3"
// //             >
// //               {/* Currency Mismatch Alert */}
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     Transaction: {currency} → Account: {getSelectedCurrency()}
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Exchange Rate Input */}
// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   {getExchangeRateLabel()} *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm transition-all"
// //                   placeholder="Enter exchange rate"
// //                   step="0.0001"
// //                   required
// //                 />
// //                 <p className="text-[10px] text-amber-600 mt-1.5 font-semibold">
// //                   💱 This rate will be used to convert between {currency} and{" "}
// //                   {getSelectedCurrency()}
// //                 </p>
// //               </div>
// //             </motion.div>
// //           )}

// //           {/* Notes - Compact */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes *
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-none"
// //               rows={2}
// //               placeholder={getNotesPlaceholder()}
// //               required
// //             />
// //             <p className="text-[10px] text-slate-500 mt-1.5 flex items-start gap-1">
// //               <span>💡</span>
// //               <span>
// //                 {method === "cash" &&
// //                   "For cash transactions, include customer name and phone number"}
// //                 {method === "bank" &&
// //                   "Include bank transaction reference or message"}
// //                 {method === "mpesa" &&
// //                   "Include M-Pesa transaction code and details"}
// //                 {method === "account" &&
// //                   "Specify source and destination account details"}
// //               </span>
// //             </p>
// //           </div>

// //           {/* Compact Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === "debit"
// //                 ? "bg-red-50 border-red-500"
// //                 : "bg-emerald-50 border-emerald-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Summary
// //             </h4>
// //             <div className="grid grid-cols-2 gap-2 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === "debit"
// //                       ? "text-red-600"
// //                       : "text-emerald-600"
// //                   }`}
// //                 >
// //                   {transactionType === "debit" ? "Debit" : "Credit"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Method:</span>
// //                 <span className="font-bold capitalize text-slate-900">
// //                   {method}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {currency} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Ref:</span>
// //                 <span className="font-mono text-[10px] text-slate-700">
// //                   {reference}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Compact Footer Actions */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === "debit"
// //                 ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //                 : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting
// //               ? "Processing..."
// //               : `Process ${transactionType === "debit" ? "Debit" : "Credit"}`}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // import { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Hash,
// //   Building2,
// //   User,
// //   RefreshCw,
// //   Loader2,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }

// // // Combined account interface for unified selection
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Debit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   const [sourceAccountType, setSourceAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [sourceAccountId, setSourceAccountId] = useState("");
// //   const [destAccountType, setDestAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [destAccountId, setDestAccountId] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000), // Get all clients
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);

// //   // Get accounts by type for dropdown
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES, // M-Pesa is always KES
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         return clients.map((c) => ({
// //           id: c.id,
// //           name: `${c.fullName} (${c.code})`,
// //           type: AccountType.Client,
// //           currency: Currency.KES, // Default, clients can have both
// //           balance: c.balanceKES,
// //           isActive: c.isActive !== false,
// //         }));
// //       default:
// //         return [];
// //     }
// //   };

// //   // Get destination account type based on payment method
// //   const getDestAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };

// //   // Update destination account type when payment method changes
// //   useEffect(() => {
// //     const newDestType = getDestAccountTypeFromPayment(paymentMethod);
// //     setDestAccountType(newDestType);
// //     setDestAccountId(""); // Reset selection
// //   }, [paymentMethod]);

// //   // Check if exchange rate is needed
// //   const needsExchangeRate = () => {
// //     const sourceAcc = getAccountsByType(sourceAccountType).find(
// //       (a) => a.id === sourceAccountId
// //     );
// //     const destAcc = getAccountsByType(destAccountType).find(
// //       (a) => a.id === destAccountId
// //     );

// //     if (sourceAcc && destAcc) {
// //       return sourceAcc.currency !== destAcc.currency;
// //     }
// //     return false;
// //   };

// //   // Get selected account currency
// //   const getSelectedAccountCurrency = (
// //     type: AccountType,
// //     id: string
// //   ): Currency | null => {
// //     const accounts = getAccountsByType(type);
// //     const account = accounts.find((a) => a.id === id);
// //     return account?.currency ?? null;
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       // Validation
// //       if (!sourceAccountId) {
// //         throw new Error("Please select a source account");
// //       }
// //       if (!destAccountId) {
// //         throw new Error("Please select a destination account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: sourceAccountType,
// //         sourceAccountId: sourceAccountId,
// //         destAccountType: destAccountType,
// //         destAccountId: destAccountId,
// //         amount: parseFloat(amount),
// //         currency: currency,
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //         exchangeRate: needsExchangeRate()
// //           ? parseFloat(exchangeRate)
// //           : undefined,
// //         paymentMethod: paymentMethod,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Debit ? "Debit" : "Credit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //         <div className="bg-white p-8 text-center">
// //           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading accounts...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Header */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Debit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Debit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 {transactionType === TransactionType.Debit
// //                   ? "Debit (Money In)"
// //                   : "Credit (Money Out)"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Source Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               <User className="w-3 h-3 inline mr-1" />
// //               Source Account *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={sourceAccountType}
// //                 onChange={(e) => {
// //                   setSourceAccountType(Number(e.target.value) as AccountType);
// //                   setSourceAccountId("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <select
// //                 value={sourceAccountId}
// //                 onChange={(e) => setSourceAccountId(e.target.value)}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //                 required
// //               >
// //                 <option value="">Select account...</option>
// //                 {getAccountsByType(sourceAccountType).map((account) => (
// //                   <option key={account.id} value={account.id}>
// //                     {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                     {account.balance.toLocaleString()}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           {/* Payment Method */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Cash
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Bank
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Mpesa
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.AccountTransfer
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Transfer
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Destination Account Selection */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               {paymentMethod === PaymentMethod.Cash && (
// //                 <>
// //                   <Wallet className="w-3 h-3 inline mr-1" />
// //                   Cash Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Bank && (
// //                 <>
// //                   <Building2 className="w-3 h-3 inline mr-1" />
// //                   Bank Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Mpesa && (
// //                 <>
// //                   <Smartphone className="w-3 h-3 inline mr-1" />
// //                   M-Pesa Agent *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.AccountTransfer && (
// //                 <>
// //                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                   Destination Account *
// //                 </>
// //               )}
// //             </label>
// //             <select
// //               value={destAccountId}
// //               onChange={(e) => setDestAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">
// //                 Select{" "}
// //                 {paymentMethod === PaymentMethod.Cash
// //                   ? "cash account"
// //                   : paymentMethod === PaymentMethod.Bank
// //                   ? "bank"
// //                   : paymentMethod === PaymentMethod.Mpesa
// //                   ? "M-Pesa agent"
// //                   : "account"}
// //                 ...
// //               </option>
// //               {getAccountsByType(destAccountType).map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Amount & Currency */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 min="0"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency *
// //               </label>
// //               <select
// //                 value={currency}
// //                 onChange={(e) =>
// //                   setCurrency(Number(e.target.value) as Currency)
// //                 }
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //                 required
// //               >
// //                 <option value={Currency.KES}>KES</option>
// //                 <option value={Currency.USD}>USD</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Exchange Rate (if needed) */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="space-y-2"
// //             >
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     Different currencies detected between accounts
// //                   </p>
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   Exchange Rate *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
// //                   placeholder="Enter exchange rate"
// //                   step="0.0001"
// //                   required
// //                 />
// //               </div>
// //             </motion.div>
// //           )}

// //           {/* Description */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
// //               required
// //             />
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Calendar className="w-3 h-3 inline mr-1" />
// //               Transaction Date *
// //             </label>
// //             <input
// //               type="date"
// //               value={dateValue}
// //               onChange={(e) => setDateValue(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //               required
// //             />
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes (Optional)
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
// //               rows={2}
// //               placeholder="Additional notes or reference details..."
// //             />
// //           </div>

// //           {/* Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === TransactionType.Credit
// //                 ? "bg-red-50 border-red-500"
// //                 : "bg-emerald-50 border-emerald-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Summary
// //             </h4>
// //             <div className="grid grid-cols-2 gap-2 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === TransactionType.Credit
// //                       ? "text-red-600"
// //                       : "text-emerald-600"
// //                   }`}
// //                 >
// //                   {transactionType === TransactionType.Debit
// //                     ? "Debit (In)"
// //                     : "Credit (Out)"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Method:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {paymentMethod === PaymentMethod.Cash
// //                     ? "Cash"
// //                     : paymentMethod === PaymentMethod.Bank
// //                     ? "Bank"
// //                     : paymentMethod === PaymentMethod.Mpesa
// //                     ? "M-Pesa"
// //                     : "Transfer"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {getCurrencyLabel(currency)} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Date:</span>
// //                 <span className="font-bold text-slate-900">{dateValue}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Footer */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === TransactionType.Credit
// //                 ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //                 : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
// //                 Processing...
// //               </>
// //             ) : (
// //               `Process ${
// //                 transactionType === TransactionType.Debit ? "Debit" : "Credit"
// //               }`
// //             )}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // import { useState, useEffect, useMemo } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Hash,
// //   Building2,
// //   User,
// //   RefreshCw,
// //   Loader2,
// //   Search,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }

// // // Combined account interface for unified selection
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// //   // For clients, we need to track which currency account this represents
// //   clientId?: string;
// //   currencyType?: "KES" | "USD";
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Debit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   const [sourceAccountType, setSourceAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [sourceAccountId, setSourceAccountId] = useState("");
// //   const [destAccountType, setDestAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [destAccountId, setDestAccountId] = useState("");

// //   // Search states for dropdowns
// //   const [sourceSearchTerm, setSourceSearchTerm] = useState("");
// //   const [destSearchTerm, setDestSearchTerm] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000), // Get all clients
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);

// //   // Get accounts by type for dropdown
// //   // For clients, returns TWO entries per client (KES and USD accounts)
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES, // M-Pesa is always KES
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         // Create TWO entries per client - one for KES and one for USD
// //         const clientAccounts: AccountOption[] = [];
// //         clients.forEach((c) => {
// //           // KES Account
// //           clientAccounts.push({
// //             id: `${c.id}_KES`, // Unique ID for KES account
// //             name: `${c.name || c.fullName} (${c.code}) - KES`,
// //             type: AccountType.Client,
// //             currency: Currency.KES,
// //             balance: c.balanceKES || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "KES",
// //           });
// //           // USD Account
// //           clientAccounts.push({
// //             id: `${c.id}_USD`, // Unique ID for USD account
// //             name: `${c.name || c.fullName} (${c.code}) - USD`,
// //             type: AccountType.Client,
// //             currency: Currency.USD,
// //             balance: c.balanceUSD || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "USD",
// //           });
// //         });
// //         return clientAccounts;
// //       default:
// //         return [];
// //     }
// //   };

// //   // Get filtered accounts based on search term
// //   const getFilteredAccounts = (
// //     type: AccountType,
// //     searchTerm: string
// //   ): AccountOption[] => {
// //     const accounts = getAccountsByType(type);
// //     if (!searchTerm.trim()) {
// //       return accounts;
// //     }
// //     const lowerSearch = searchTerm.toLowerCase();
// //     return accounts.filter(
// //       (account) =>
// //         account.name?.toLowerCase().includes(lowerSearch) ||
// //         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
// //         account.agentNumber?.toLowerCase().includes(lowerSearch)
// //     );
// //   };

// //   // Memoized filtered source accounts
// //   const filteredSourceAccounts = useMemo(() => {
// //     return getFilteredAccounts(sourceAccountType, sourceSearchTerm);
// //   }, [
// //     sourceAccountType,
// //     sourceSearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // Memoized filtered destination accounts
// //   const filteredDestAccounts = useMemo(() => {
// //     return getFilteredAccounts(destAccountType, destSearchTerm);
// //   }, [
// //     destAccountType,
// //     destSearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // Get the actual client ID from the composite ID (e.g., "uuid_KES" -> "uuid")
// //   const getActualClientId = (compositeId: string): string => {
// //     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
// //       return compositeId.slice(0, -4); // Remove "_KES" or "_USD"
// //     }
// //     return compositeId;
// //   };

// //   // Get destination account type based on payment method
// //   const getDestAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };

// //   // Update destination account type when payment method changes
// //   useEffect(() => {
// //     const newDestType = getDestAccountTypeFromPayment(paymentMethod);
// //     setDestAccountType(newDestType);
// //     setDestAccountId(""); // Reset selection
// //     setDestSearchTerm(""); // Reset search
// //   }, [paymentMethod]);

// //   // Reset search when account type changes
// //   useEffect(() => {
// //     setSourceSearchTerm("");
// //     setSourceAccountId("");
// //   }, [sourceAccountType]);

// //   // Check if exchange rate is needed
// //   const needsExchangeRate = () => {
// //     const sourceAccounts = getAccountsByType(sourceAccountType);
// //     const destAccounts = getAccountsByType(destAccountType);

// //     const sourceAcc = sourceAccounts.find((a) => a.id === sourceAccountId);
// //     const destAcc = destAccounts.find((a) => a.id === destAccountId);

// //     if (sourceAcc && destAcc) {
// //       return sourceAcc.currency !== destAcc.currency;
// //     }
// //     return false;
// //   };

// //   // Get selected account currency
// //   const getSelectedAccountCurrency = (
// //     type: AccountType,
// //     id: string
// //   ): Currency | null => {
// //     const accounts = getAccountsByType(type);
// //     const account = accounts.find((a) => a.id === id);
// //     return account?.currency ?? null;
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       // Validation
// //       if (!sourceAccountId) {
// //         throw new Error("Please select a source account");
// //       }
// //       if (!destAccountId) {
// //         throw new Error("Please select a destination account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       // Get actual client IDs (strip currency suffix if present)
// //       const actualSourceId =
// //         sourceAccountType === AccountType.Client
// //           ? getActualClientId(sourceAccountId)
// //           : sourceAccountId;
// //       const actualDestId =
// //         destAccountType === AccountType.Client
// //           ? getActualClientId(destAccountId)
// //           : destAccountId;

// //       // Determine the currency based on selected account for clients
// //       let transactionCurrency = currency;
// //       if (sourceAccountType === AccountType.Client) {
// //         const sourceAcc = getAccountsByType(sourceAccountType).find(
// //           (a) => a.id === sourceAccountId
// //         );
// //         if (sourceAcc) {
// //           transactionCurrency = sourceAcc.currency;
// //         }
// //       }

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: sourceAccountType,
// //         sourceAccountId: actualSourceId,
// //         destAccountType: destAccountType,
// //         destAccountId: actualDestId,
// //         amount: parseFloat(amount),
// //         currency: transactionCurrency,
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //         exchangeRate: needsExchangeRate()
// //           ? parseFloat(exchangeRate)
// //           : undefined,
// //         paymentMethod: paymentMethod,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Debit ? "Debit" : "Credit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //         <div className="bg-white p-8 text-center">
// //           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading accounts...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Header */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Debit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Debit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 {transactionType === TransactionType.Debit
// //                   ? "Debit (Money In)"
// //                   : "Credit (Money Out)"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Source Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               <User className="w-3 h-3 inline mr-1" />
// //               Source Account *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={sourceAccountType}
// //                 onChange={(e) => {
// //                   setSourceAccountType(Number(e.target.value) as AccountType);
// //                   setSourceAccountId("");
// //                   setSourceSearchTerm("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <div className="relative">
// //                 {/* Search input for filtering */}
// //                 <div className="relative">
// //                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                   <input
// //                     type="text"
// //                     value={sourceSearchTerm}
// //                     onChange={(e) => setSourceSearchTerm(e.target.value)}
// //                     placeholder="Search..."
// //                     className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Account dropdown */}
// //             <select
// //               value={sourceAccountId}
// //               onChange={(e) => setSourceAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">Select account...</option>
// //               {filteredSourceAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {sourceAccountType === AccountType.Client &&
// //               filteredSourceAccounts.length === 0 &&
// //               sourceSearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{sourceSearchTerm}"
// //                 </p>
// //               )}
// //             {sourceAccountType === AccountType.Client && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Payment Method */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Cash
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Bank
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Mpesa
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.AccountTransfer
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Transfer
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Destination Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               {paymentMethod === PaymentMethod.Cash && (
// //                 <>
// //                   <Wallet className="w-3 h-3 inline mr-1" />
// //                   Cash Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Bank && (
// //                 <>
// //                   <Building2 className="w-3 h-3 inline mr-1" />
// //                   Bank Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Mpesa && (
// //                 <>
// //                   <Smartphone className="w-3 h-3 inline mr-1" />
// //                   M-Pesa Agent *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.AccountTransfer && (
// //                 <>
// //                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                   Destination Account *
// //                 </>
// //               )}
// //             </label>

// //             {/* Search for destination (only show for Client/Transfer) */}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={destSearchTerm}
// //                   onChange={(e) => setDestSearchTerm(e.target.value)}
// //                   placeholder="Search clients..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             )}

// //             <select
// //               value={destAccountId}
// //               onChange={(e) => setDestAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">
// //                 Select{" "}
// //                 {paymentMethod === PaymentMethod.Cash
// //                   ? "cash account"
// //                   : paymentMethod === PaymentMethod.Bank
// //                   ? "bank"
// //                   : paymentMethod === PaymentMethod.Mpesa
// //                   ? "M-Pesa agent"
// //                   : "account"}
// //                 ...
// //               </option>
// //               {filteredDestAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {paymentMethod === PaymentMethod.AccountTransfer &&
// //               filteredDestAccounts.length === 0 &&
// //               destSearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{destSearchTerm}"
// //                 </p>
// //               )}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Amount & Currency */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 min="0"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency *
// //               </label>
// //               <select
// //                 value={currency}
// //                 onChange={(e) =>
// //                   setCurrency(Number(e.target.value) as Currency)
// //                 }
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //                 required
// //               >
// //                 <option value={Currency.KES}>KES</option>
// //                 <option value={Currency.USD}>USD</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Exchange Rate (if needed) */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="space-y-2"
// //             >
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     Different currencies detected between accounts
// //                   </p>
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   Exchange Rate *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
// //                   placeholder="Enter exchange rate"
// //                   step="0.0001"
// //                   required
// //                 />
// //               </div>
// //             </motion.div>
// //           )}

// //           {/* Description */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
// //               required
// //             />
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Calendar className="w-3 h-3 inline mr-1" />
// //               Transaction Date *
// //             </label>
// //             <input
// //               type="date"
// //               value={dateValue}
// //               onChange={(e) => setDateValue(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //               required
// //             />
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes (Optional)
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
// //               rows={2}
// //               placeholder="Additional notes or reference details..."
// //             />
// //           </div>

// //           {/* Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === TransactionType.Credit
// //                 ? "bg-red-50 border-red-500"
// //                 : "bg-emerald-50 border-emerald-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Summary
// //             </h4>
// //             <div className="grid grid-cols-2 gap-2 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === TransactionType.Credit
// //                       ? "text-red-600"
// //                       : "text-emerald-600"
// //                   }`}
// //                 >
// //                   {transactionType === TransactionType.Debit
// //                     ? "Debit (In)"
// //                     : "Credit (Out)"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Method:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {paymentMethod === PaymentMethod.Cash
// //                     ? "Cash"
// //                     : paymentMethod === PaymentMethod.Bank
// //                     ? "Bank"
// //                     : paymentMethod === PaymentMethod.Mpesa
// //                     ? "M-Pesa"
// //                     : "Transfer"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {getCurrencyLabel(currency)} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Date:</span>
// //                 <span className="font-bold text-slate-900">{dateValue}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Footer */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === TransactionType.Credit
// //                 ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //                 : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
// //                 Processing...
// //               </>
// //             ) : (
// //               `Process ${
// //                 transactionType === TransactionType.Debit ? "Debit" : "Credit"
// //               }`
// //             )}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // import { useState, useEffect, useMemo } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Building2,
// //   User,
// //   RefreshCw,
// //   Loader2,
// //   Search,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }

// // // Combined account interface for unified selection
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// //   clientId?: string;
// //   currencyType?: "KES" | "USD";
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   // ACCOUNTING PRINCIPLES:
// //   // - CREDIT = Money IN to account (balance increases) = GREEN
// //   // - DEBIT = Money OUT from account (balance decreases) = RED
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Credit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
// //   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [primaryAccountId, setPrimaryAccountId] = useState("");
// //   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
// //   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [counterAccountId, setCounterAccountId] = useState("");

// //   // Search states
// //   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
// //   const [counterSearchTerm, setCounterSearchTerm] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000),
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);

// //   // Get accounts by type for dropdown
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         const clientAccounts: AccountOption[] = [];
// //         clients.forEach((c) => {
// //           // KES Account
// //           clientAccounts.push({
// //             id: `${c.id}_KES`,
// //             name: `${c.name || c.fullName} (${c.code}) - KES`,
// //             type: AccountType.Client,
// //             currency: Currency.KES,
// //             balance: c.balanceKES || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "KES",
// //           });
// //           // USD Account
// //           clientAccounts.push({
// //             id: `${c.id}_USD`,
// //             name: `${c.name || c.fullName} (${c.code}) - USD`,
// //             type: AccountType.Client,
// //             currency: Currency.USD,
// //             balance: c.balanceUSD || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "USD",
// //           });
// //         });
// //         return clientAccounts;
// //       default:
// //         return [];
// //     }
// //   };

// //   // Get filtered accounts based on search term
// //   const getFilteredAccounts = (
// //     type: AccountType,
// //     searchTerm: string
// //   ): AccountOption[] => {
// //     const accounts = getAccountsByType(type);
// //     if (!searchTerm.trim()) {
// //       return accounts;
// //     }
// //     const lowerSearch = searchTerm.toLowerCase();
// //     return accounts.filter(
// //       (account) =>
// //         account.name.toLowerCase().includes(lowerSearch) ||
// //         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
// //         account.agentNumber?.toLowerCase().includes(lowerSearch)
// //     );
// //   };

// //   // Memoized filtered accounts
// //   const filteredPrimaryAccounts = useMemo(() => {
// //     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
// //   }, [
// //     primaryAccountType,
// //     primarySearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const filteredCounterAccounts = useMemo(() => {
// //     return getFilteredAccounts(counterAccountType, counterSearchTerm);
// //   }, [
// //     counterAccountType,
// //     counterSearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // Get actual client ID from composite ID
// //   const getActualClientId = (compositeId: string): string => {
// //     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
// //       return compositeId.slice(0, -4);
// //     }
// //     return compositeId;
// //   };

// //   // Get counter account type based on payment method
// //   const getCounterAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };

// //   // Update counter account type when payment method changes
// //   useEffect(() => {
// //     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
// //     setCounterAccountType(newCounterType);
// //     setCounterAccountId("");
// //     setCounterSearchTerm("");
// //   }, [paymentMethod]);

// //   // Reset search when primary account type changes
// //   useEffect(() => {
// //     setPrimarySearchTerm("");
// //     setPrimaryAccountId("");
// //   }, [primaryAccountType]);

// //   // Get selected accounts
// //   const primaryAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(primaryAccountType).find(
// //         (a) => a.id === primaryAccountId
// //       ) || null
// //     );
// //   }, [
// //     primaryAccountType,
// //     primaryAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const counterAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(counterAccountType).find(
// //         (a) => a.id === counterAccountId
// //       ) || null
// //     );
// //   }, [
// //     counterAccountType,
// //     counterAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // AUTO-SET CURRENCY based on counter account selection
// //   useEffect(() => {
// //     if (counterAccount) {
// //       setCurrency(counterAccount.currency);
// //     }
// //   }, [counterAccount]);

// //   // Check if exchange rate is needed (currencies differ)
// //   const needsExchangeRate = (): boolean => {
// //     if (!primaryAccount || !counterAccount) return false;
// //     return primaryAccount.currency !== counterAccount.currency;
// //   };

// //   // Calculate converted amount for primary account
// //   // Amount is entered in COUNTER account currency
// //   // We need to calculate what goes to PRIMARY account
// //   const getConvertedAmount = (): {
// //     amount: number;
// //     currency: Currency;
// //   } | null => {
// //     if (!needsExchangeRate()) return null;
// //     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
// //       return null;

// //     const amountNum = parseFloat(amount);
// //     const rateNum = parseFloat(exchangeRate);

// //     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

// //     // Counter account currency is what user enters
// //     // Primary account currency is what we calculate
// //     // Rate is always: 1 USD = X KES

// //     if (
// //       counterAccount.currency === Currency.USD &&
// //       primaryAccount.currency === Currency.KES
// //     ) {
// //       // User enters USD, primary account is KES
// //       // KES amount = USD * rate
// //       return { amount: amountNum * rateNum, currency: Currency.KES };
// //     } else if (
// //       counterAccount.currency === Currency.KES &&
// //       primaryAccount.currency === Currency.USD
// //     ) {
// //       // User enters KES, primary account is USD
// //       // USD amount = KES / rate
// //       return { amount: amountNum / rateNum, currency: Currency.USD };
// //     }

// //     return null;
// //   };

// //   const convertedAmount = getConvertedAmount();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       if (!primaryAccountId) {
// //         throw new Error(
// //           `Please select an account to ${
// //             transactionType === TransactionType.Credit ? "credit" : "debit"
// //           }`
// //         );
// //       }
// //       if (!counterAccountId) {
// //         throw new Error("Please select a counter account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       const actualPrimaryId =
// //         primaryAccountType === AccountType.Client
// //           ? getActualClientId(primaryAccountId)
// //           : primaryAccountId;
// //       const actualCounterId =
// //         counterAccountType === AccountType.Client
// //           ? getActualClientId(counterAccountId)
// //           : counterAccountId;

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: primaryAccountType,
// //         sourceAccountId: actualPrimaryId,
// //         destAccountType: counterAccountType,
// //         destAccountId: actualCounterId,
// //         amount: parseFloat(amount),
// //         currency: currency,
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //         exchangeRate: needsExchangeRate()
// //           ? parseFloat(exchangeRate)
// //           : undefined,
// //         paymentMethod: paymentMethod,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //         <div className="bg-white p-8 text-center">
// //           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading accounts...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Header - Credit=GREEN, Debit=RED */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Credit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Credit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 {transactionType === TransactionType.Credit
// //                   ? "Credit (Money In)"
// //                   : "Debit (Money Out)"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               {/* CREDIT = Money IN = GREEN */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               {/* DEBIT = Money OUT = RED */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Primary Account - Label changes based on transaction type */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               <User className="w-3 h-3 inline mr-1" />
// //               {transactionType === TransactionType.Credit
// //                 ? "Select Account to Credit *"
// //                 : "Select Account to Debit *"}
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={primaryAccountType}
// //                 onChange={(e) => {
// //                   setPrimaryAccountType(Number(e.target.value) as AccountType);
// //                   setPrimaryAccountId("");
// //                   setPrimarySearchTerm("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={primarySearchTerm}
// //                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
// //                   placeholder="Search..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             </div>
// //             <select
// //               value={primaryAccountId}
// //               onChange={(e) => setPrimaryAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">Select account...</option>
// //               {filteredPrimaryAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {primaryAccountType === AccountType.Client &&
// //               filteredPrimaryAccounts.length === 0 &&
// //               primarySearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{primarySearchTerm}"
// //                 </p>
// //               )}
// //             {primaryAccountType === AccountType.Client && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Payment Method */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Cash
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Bank
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Mpesa
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.AccountTransfer
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Transfer
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Counter Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               {paymentMethod === PaymentMethod.Cash && (
// //                 <>
// //                   <Wallet className="w-3 h-3 inline mr-1" />
// //                   Cash Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Bank && (
// //                 <>
// //                   <Building2 className="w-3 h-3 inline mr-1" />
// //                   Bank Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Mpesa && (
// //                 <>
// //                   <Smartphone className="w-3 h-3 inline mr-1" />
// //                   M-Pesa Agent *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.AccountTransfer && (
// //                 <>
// //                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                   Counter Account *
// //                 </>
// //               )}
// //             </label>

// //             {/* Search for counter account (only for Transfer) */}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={counterSearchTerm}
// //                   onChange={(e) => setCounterSearchTerm(e.target.value)}
// //                   placeholder="Search clients..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             )}

// //             <select
// //               value={counterAccountId}
// //               onChange={(e) => setCounterAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">
// //                 Select{" "}
// //                 {paymentMethod === PaymentMethod.Cash
// //                   ? "cash account"
// //                   : paymentMethod === PaymentMethod.Bank
// //                   ? "bank"
// //                   : paymentMethod === PaymentMethod.Mpesa
// //                   ? "M-Pesa agent"
// //                   : "account"}
// //                 ...
// //               </option>
// //               {filteredCounterAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {paymentMethod === PaymentMethod.AccountTransfer &&
// //               filteredCounterAccounts.length === 0 &&
// //               counterSearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{counterSearchTerm}"
// //                 </p>
// //               )}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Amount & Currency */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount (
// //                 {counterAccount
// //                   ? getCurrencyLabel(counterAccount.currency)
// //                   : "Select account"}
// //                 ) *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 min="0"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency (Auto)
// //               </label>
// //               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
// //                 {getCurrencyLabel(currency)}
// //                 {counterAccount && (
// //                   <span className="text-xs text-slate-500 ml-2">
// //                     (from{" "}
// //                     {paymentMethod === PaymentMethod.Cash
// //                       ? "cash"
// //                       : paymentMethod === PaymentMethod.Bank
// //                       ? "bank"
// //                       : paymentMethod === PaymentMethod.Mpesa
// //                       ? "M-Pesa"
// //                       : "counter"}{" "}
// //                     account)
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Exchange Rate (if needed) */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="space-y-3"
// //             >
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     {counterAccount?.name} (
// //                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
// //                     {primaryAccount?.name} (
// //                     {getCurrencyLabel(primaryAccount?.currency!)})
// //                   </p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   Exchange Rate (1 USD = ? KES) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
// //                   placeholder="e.g., 130.50"
// //                   step="0.01"
// //                   required
// //                 />
// //               </div>

// //               {/* Conversion Preview */}
// //               {convertedAmount && amount && (
// //                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
// //                   <p className="text-xs font-bold text-blue-900 mb-1">
// //                     Conversion Preview
// //                   </p>
// //                   <div className="text-sm text-blue-800">
// //                     {counterAccount?.currency === Currency.USD ? (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">×</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     ) : (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">÷</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     )}
// //                   </div>
// //                   <p className="text-[10px] text-blue-600 mt-2">
// //                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}{" "}
// //                     will be{" "}
// //                     {transactionType === TransactionType.Credit
// //                       ? "credited to"
// //                       : "debited from"}{" "}
// //                     <strong>{primaryAccount?.name}</strong>
// //                   </p>
// //                 </div>
// //               )}
// //             </motion.div>
// //           )}

// //           {/* Description */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
// //               required
// //             />
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Calendar className="w-3 h-3 inline mr-1" />
// //               Transaction Date *
// //             </label>
// //             <input
// //               type="date"
// //               value={dateValue}
// //               onChange={(e) => setDateValue(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //               required
// //             />
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes (Optional)
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
// //               rows={2}
// //               placeholder="Additional notes or reference details..."
// //             />
// //           </div>

// //           {/* Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === TransactionType.Credit
// //                 ? "bg-emerald-50 border-emerald-500"
// //                 : "bg-red-50 border-red-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Transaction Summary
// //             </h4>
// //             <div className="space-y-1 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === TransactionType.Credit
// //                       ? "text-emerald-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {transactionType === TransactionType.Credit
// //                     ? "Credit (Money In)"
// //                     : "Debit (Money Out)"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Account:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {primaryAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Via:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {counterAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {getCurrencyLabel(currency)} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               {convertedAmount && (
// //                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
// //                   <span className="text-slate-600">
// //                     To {primaryAccount?.name?.split(" ")[0]}:
// //                   </span>
// //                   <span className="font-bold text-amber-600">
// //                     {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}
// //                   </span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Date:</span>
// //                 <span className="font-bold text-slate-900">{dateValue}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Footer */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === TransactionType.Credit
// //                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
// //                 Processing...
// //               </>
// //             ) : (
// //               `Process ${
// //                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //               }`
// //             )}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // import { useState, useEffect, useMemo } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Building2,
// //   User,
// //   RefreshCw,
// //   Loader2,
// //   Search,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }

// // // Combined account interface for unified selection
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// //   clientId?: string;
// //   currencyType?: "KES" | "USD";
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   // ACCOUNTING PRINCIPLES:
// //   // - CREDIT = Money IN to account (balance increases) = GREEN
// //   // - DEBIT = Money OUT from account (balance decreases) = RED
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Credit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
// //   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [primaryAccountId, setPrimaryAccountId] = useState("");
// //   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
// //   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [counterAccountId, setCounterAccountId] = useState("");

// //   // Search states
// //   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
// //   const [counterSearchTerm, setCounterSearchTerm] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000),
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);

// //   // Get accounts by type for dropdown
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         const clientAccounts: AccountOption[] = [];
// //         clients.forEach((c) => {
// //           // KES Account
// //           clientAccounts.push({
// //             id: `${c.id}_KES`,
// //             name: `${c.name || c.fullName} (${c.code}) - KES`,
// //             type: AccountType.Client,
// //             currency: Currency.KES,
// //             balance: c.balanceKES || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "KES",
// //           });
// //           // USD Account
// //           clientAccounts.push({
// //             id: `${c.id}_USD`,
// //             name: `${c.name || c.fullName} (${c.code}) - USD`,
// //             type: AccountType.Client,
// //             currency: Currency.USD,
// //             balance: c.balanceUSD || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "USD",
// //           });
// //         });
// //         return clientAccounts;
// //       default:
// //         return [];
// //     }
// //   };

// //   // Get filtered accounts based on search term
// //   const getFilteredAccounts = (
// //     type: AccountType,
// //     searchTerm: string
// //   ): AccountOption[] => {
// //     const accounts = getAccountsByType(type);
// //     if (!searchTerm.trim()) {
// //       return accounts;
// //     }
// //     const lowerSearch = searchTerm.toLowerCase();
// //     return accounts.filter(
// //       (account) =>
// //         account.name.toLowerCase().includes(lowerSearch) ||
// //         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
// //         account.agentNumber?.toLowerCase().includes(lowerSearch)
// //     );
// //   };

// //   // Memoized filtered accounts
// //   const filteredPrimaryAccounts = useMemo(() => {
// //     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
// //   }, [
// //     primaryAccountType,
// //     primarySearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const filteredCounterAccounts = useMemo(() => {
// //     return getFilteredAccounts(counterAccountType, counterSearchTerm);
// //   }, [
// //     counterAccountType,
// //     counterSearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // Get actual client ID from composite ID
// //   const getActualClientId = (compositeId: string): string => {
// //     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
// //       return compositeId.slice(0, -4);
// //     }
// //     return compositeId;
// //   };

// //   // Get counter account type based on payment method
// //   const getCounterAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };

// //   // Update counter account type when payment method changes
// //   useEffect(() => {
// //     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
// //     setCounterAccountType(newCounterType);
// //     setCounterAccountId("");
// //     setCounterSearchTerm("");
// //   }, [paymentMethod]);

// //   // Reset search when primary account type changes
// //   useEffect(() => {
// //     setPrimarySearchTerm("");
// //     setPrimaryAccountId("");
// //   }, [primaryAccountType]);

// //   // Get selected accounts
// //   const primaryAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(primaryAccountType).find(
// //         (a) => a.id === primaryAccountId
// //       ) || null
// //     );
// //   }, [
// //     primaryAccountType,
// //     primaryAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const counterAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(counterAccountType).find(
// //         (a) => a.id === counterAccountId
// //       ) || null
// //     );
// //   }, [
// //     counterAccountType,
// //     counterAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // AUTO-SET CURRENCY based on counter account selection
// //   useEffect(() => {
// //     if (counterAccount) {
// //       setCurrency(counterAccount.currency);
// //     }
// //   }, [counterAccount]);

// //   // Check if exchange rate is needed (currencies differ)
// //   const needsExchangeRate = (): boolean => {
// //     if (!primaryAccount || !counterAccount) return false;
// //     return primaryAccount.currency !== counterAccount.currency;
// //   };

// //   // Calculate converted amount for primary account
// //   // Amount is entered in COUNTER account currency
// //   // We need to calculate what goes to PRIMARY account
// //   const getConvertedAmount = (): {
// //     amount: number;
// //     currency: Currency;
// //   } | null => {
// //     if (!needsExchangeRate()) return null;
// //     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
// //       return null;

// //     const amountNum = parseFloat(amount);
// //     const rateNum = parseFloat(exchangeRate);

// //     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

// //     // Counter account currency is what user enters
// //     // Primary account currency is what we calculate
// //     // Rate is always: 1 USD = X KES

// //     if (
// //       counterAccount.currency === Currency.USD &&
// //       primaryAccount.currency === Currency.KES
// //     ) {
// //       // User enters USD, primary account is KES
// //       // KES amount = USD * rate
// //       return { amount: amountNum * rateNum, currency: Currency.KES };
// //     } else if (
// //       counterAccount.currency === Currency.KES &&
// //       primaryAccount.currency === Currency.USD
// //     ) {
// //       // User enters KES, primary account is USD
// //       // USD amount = KES / rate
// //       return { amount: amountNum / rateNum, currency: Currency.USD };
// //     }

// //     return null;
// //   };

// //   const convertedAmount = getConvertedAmount();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       if (!primaryAccountId) {
// //         throw new Error(
// //           `Please select an account to ${
// //             transactionType === TransactionType.Credit ? "credit" : "debit"
// //           }`
// //         );
// //       }
// //       if (!counterAccountId) {
// //         throw new Error("Please select a counter account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       const actualPrimaryId =
// //         primaryAccountType === AccountType.Client
// //           ? getActualClientId(primaryAccountId)
// //           : primaryAccountId;
// //       const actualCounterId =
// //         counterAccountType === AccountType.Client
// //           ? getActualClientId(counterAccountId)
// //           : counterAccountId;

// //       // IMPORTANT: We need to send the PRIMARY account's currency and the amount
// //       // that will affect the PRIMARY account (converted if exchange is involved)
// //       let finalAmount = parseFloat(amount);
// //       let finalCurrency = currency; // Default: counter account currency

// //       if (needsExchangeRate() && primaryAccount && counterAccount) {
// //         // Set currency to PRIMARY account's currency (the one being debited/credited)
// //         finalCurrency = primaryAccount.currency;

// //         // Calculate the converted amount for the primary account
// //         const rateNum = parseFloat(exchangeRate);
// //         if (
// //           counterAccount.currency === Currency.USD &&
// //           primaryAccount.currency === Currency.KES
// //         ) {
// //           // Counter is USD, Primary is KES: USD * rate = KES
// //           finalAmount = parseFloat(amount) * rateNum;
// //         } else if (
// //           counterAccount.currency === Currency.KES &&
// //           primaryAccount.currency === Currency.USD
// //         ) {
// //           // Counter is KES, Primary is USD: KES / rate = USD
// //           finalAmount = parseFloat(amount) / rateNum;
// //         }
// //       } else if (primaryAccount) {
// //         // No exchange needed - use primary account's currency
// //         finalCurrency = primaryAccount.currency;
// //       }

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: primaryAccountType,
// //         sourceAccountId: actualPrimaryId,
// //         destAccountType: counterAccountType,
// //         destAccountId: actualCounterId,
// //         amount: finalAmount,
// //         currency: finalCurrency, // PRIMARY account's currency
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //         exchangeRate: needsExchangeRate()
// //           ? parseFloat(exchangeRate)
// //           : undefined,
// //         paymentMethod: paymentMethod,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //         <div className="bg-white p-8 text-center">
// //           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading accounts...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Header - Credit=GREEN, Debit=RED */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Credit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Credit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 {transactionType === TransactionType.Credit
// //                   ? "Credit (Money In)"
// //                   : "Debit (Money Out)"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               {/* CREDIT = Money IN = GREEN */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               {/* DEBIT = Money OUT = RED */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Primary Account - Label changes based on transaction type */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               <User className="w-3 h-3 inline mr-1" />
// //               {transactionType === TransactionType.Credit
// //                 ? "Select Account to Credit *"
// //                 : "Select Account to Debit *"}
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={primaryAccountType}
// //                 onChange={(e) => {
// //                   setPrimaryAccountType(Number(e.target.value) as AccountType);
// //                   setPrimaryAccountId("");
// //                   setPrimarySearchTerm("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={primarySearchTerm}
// //                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
// //                   placeholder="Search..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             </div>
// //             <select
// //               value={primaryAccountId}
// //               onChange={(e) => setPrimaryAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">Select account...</option>
// //               {filteredPrimaryAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {primaryAccountType === AccountType.Client &&
// //               filteredPrimaryAccounts.length === 0 &&
// //               primarySearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{primarySearchTerm}"
// //                 </p>
// //               )}
// //             {primaryAccountType === AccountType.Client && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Payment Method */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Cash
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Bank
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Mpesa
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.AccountTransfer
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Transfer
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Counter Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               {paymentMethod === PaymentMethod.Cash && (
// //                 <>
// //                   <Wallet className="w-3 h-3 inline mr-1" />
// //                   Cash Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Bank && (
// //                 <>
// //                   <Building2 className="w-3 h-3 inline mr-1" />
// //                   Bank Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Mpesa && (
// //                 <>
// //                   <Smartphone className="w-3 h-3 inline mr-1" />
// //                   M-Pesa Agent *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.AccountTransfer && (
// //                 <>
// //                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                   Counter Account *
// //                 </>
// //               )}
// //             </label>

// //             {/* Search for counter account (only for Transfer) */}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={counterSearchTerm}
// //                   onChange={(e) => setCounterSearchTerm(e.target.value)}
// //                   placeholder="Search clients..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             )}

// //             <select
// //               value={counterAccountId}
// //               onChange={(e) => setCounterAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">
// //                 Select{" "}
// //                 {paymentMethod === PaymentMethod.Cash
// //                   ? "cash account"
// //                   : paymentMethod === PaymentMethod.Bank
// //                   ? "bank"
// //                   : paymentMethod === PaymentMethod.Mpesa
// //                   ? "M-Pesa agent"
// //                   : "account"}
// //                 ...
// //               </option>
// //               {filteredCounterAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {paymentMethod === PaymentMethod.AccountTransfer &&
// //               filteredCounterAccounts.length === 0 &&
// //               counterSearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{counterSearchTerm}"
// //                 </p>
// //               )}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Amount & Currency */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount (
// //                 {counterAccount
// //                   ? getCurrencyLabel(counterAccount.currency)
// //                   : "Select account"}
// //                 ) *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 min="0"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency (Auto)
// //               </label>
// //               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
// //                 {getCurrencyLabel(currency)}
// //                 {counterAccount && (
// //                   <span className="text-xs text-slate-500 ml-2">
// //                     (from{" "}
// //                     {paymentMethod === PaymentMethod.Cash
// //                       ? "cash"
// //                       : paymentMethod === PaymentMethod.Bank
// //                       ? "bank"
// //                       : paymentMethod === PaymentMethod.Mpesa
// //                       ? "M-Pesa"
// //                       : "counter"}{" "}
// //                     account)
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Exchange Rate (if needed) */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="space-y-3"
// //             >
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     {counterAccount?.name} (
// //                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
// //                     {primaryAccount?.name} (
// //                     {getCurrencyLabel(primaryAccount?.currency!)})
// //                   </p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   Exchange Rate (1 USD = ? KES) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
// //                   placeholder="e.g., 130.50"
// //                   step="0.01"
// //                   required
// //                 />
// //               </div>

// //               {/* Conversion Preview */}
// //               {convertedAmount && amount && (
// //                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
// //                   <p className="text-xs font-bold text-blue-900 mb-1">
// //                     Conversion Preview
// //                   </p>
// //                   <div className="text-sm text-blue-800">
// //                     {counterAccount?.currency === Currency.USD ? (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">×</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     ) : (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">÷</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     )}
// //                   </div>
// //                   <p className="text-[10px] text-blue-600 mt-2">
// //                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}{" "}
// //                     will be{" "}
// //                     {transactionType === TransactionType.Credit
// //                       ? "credited to"
// //                       : "debited from"}{" "}
// //                     <strong>{primaryAccount?.name}</strong>
// //                   </p>
// //                 </div>
// //               )}
// //             </motion.div>
// //           )}

// //           {/* Description */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
// //               required
// //             />
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Calendar className="w-3 h-3 inline mr-1" />
// //               Transaction Date *
// //             </label>
// //             <input
// //               type="date"
// //               value={dateValue}
// //               onChange={(e) => setDateValue(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //               required
// //             />
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes (Optional)
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
// //               rows={2}
// //               placeholder="Additional notes or reference details..."
// //             />
// //           </div>

// //           {/* Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === TransactionType.Credit
// //                 ? "bg-emerald-50 border-emerald-500"
// //                 : "bg-red-50 border-red-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Transaction Summary
// //             </h4>
// //             <div className="space-y-1 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === TransactionType.Credit
// //                       ? "text-emerald-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {transactionType === TransactionType.Credit
// //                     ? "Credit (Money In)"
// //                     : "Debit (Money Out)"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Account:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {primaryAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Via:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {counterAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {getCurrencyLabel(currency)} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               {convertedAmount && (
// //                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
// //                   <span className="text-slate-600">
// //                     To {primaryAccount?.name?.split(" ")[0]}:
// //                   </span>
// //                   <span className="font-bold text-amber-600">
// //                     {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}
// //                   </span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Date:</span>
// //                 <span className="font-bold text-slate-900">{dateValue}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Footer */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === TransactionType.Credit
// //                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
// //                 Processing...
// //               </>
// //             ) : (
// //               `Process ${
// //                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //               }`
// //             )}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // import { useState, useEffect, useMemo } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Building2,
// //   User,
// //   RefreshCw,
// //   Loader2,
// //   Search,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }

// // // Combined account interface for unified selection
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// //   clientId?: string;
// //   currencyType?: "KES" | "USD";
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   // ACCOUNTING PRINCIPLES:
// //   // - CREDIT = Money IN to account (balance increases) = GREEN
// //   // - DEBIT = Money OUT from account (balance decreases) = RED
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Credit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
// //   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [primaryAccountId, setPrimaryAccountId] = useState("");
// //   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
// //   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [counterAccountId, setCounterAccountId] = useState("");

// //   // Search states
// //   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
// //   const [counterSearchTerm, setCounterSearchTerm] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000),
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);

// //   // Get accounts by type for dropdown
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         const clientAccounts: AccountOption[] = [];
// //         clients.forEach((c) => {
// //           // KES Account
// //           clientAccounts.push({
// //             id: `${c.id}_KES`,
// //             name: `${c.name || c.fullName} (${c.code}) - KES`,
// //             type: AccountType.Client,
// //             currency: Currency.KES,
// //             balance: c.balanceKES || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "KES",
// //           });
// //           // USD Account
// //           clientAccounts.push({
// //             id: `${c.id}_USD`,
// //             name: `${c.name || c.fullName} (${c.code}) - USD`,
// //             type: AccountType.Client,
// //             currency: Currency.USD,
// //             balance: c.balanceUSD || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "USD",
// //           });
// //         });
// //         return clientAccounts;
// //       default:
// //         return [];
// //     }
// //   };

// //   // Get filtered accounts based on search term
// //   const getFilteredAccounts = (
// //     type: AccountType,
// //     searchTerm: string
// //   ): AccountOption[] => {
// //     const accounts = getAccountsByType(type);
// //     if (!searchTerm.trim()) {
// //       return accounts;
// //     }
// //     const lowerSearch = searchTerm.toLowerCase();
// //     return accounts.filter(
// //       (account) =>
// //         account.name.toLowerCase().includes(lowerSearch) ||
// //         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
// //         account.agentNumber?.toLowerCase().includes(lowerSearch)
// //     );
// //   };

// //   // Memoized filtered accounts
// //   const filteredPrimaryAccounts = useMemo(() => {
// //     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
// //   }, [
// //     primaryAccountType,
// //     primarySearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const filteredCounterAccounts = useMemo(() => {
// //     return getFilteredAccounts(counterAccountType, counterSearchTerm);
// //   }, [
// //     counterAccountType,
// //     counterSearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // Get actual client ID from composite ID
// //   const getActualClientId = (compositeId: string): string => {
// //     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
// //       return compositeId.slice(0, -4);
// //     }
// //     return compositeId;
// //   };

// //   // Get counter account type based on payment method
// //   const getCounterAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };

// //   // Update counter account type when payment method changes
// //   useEffect(() => {
// //     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
// //     setCounterAccountType(newCounterType);
// //     setCounterAccountId("");
// //     setCounterSearchTerm("");
// //   }, [paymentMethod]);

// //   // Reset search when primary account type changes
// //   useEffect(() => {
// //     setPrimarySearchTerm("");
// //     setPrimaryAccountId("");
// //   }, [primaryAccountType]);

// //   // Get selected accounts
// //   const primaryAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(primaryAccountType).find(
// //         (a) => a.id === primaryAccountId
// //       ) || null
// //     );
// //   }, [
// //     primaryAccountType,
// //     primaryAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const counterAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(counterAccountType).find(
// //         (a) => a.id === counterAccountId
// //       ) || null
// //     );
// //   }, [
// //     counterAccountType,
// //     counterAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // AUTO-SET CURRENCY based on counter account selection
// //   useEffect(() => {
// //     if (counterAccount) {
// //       setCurrency(counterAccount.currency);
// //     }
// //   }, [counterAccount]);

// //   // Check if exchange rate is needed (currencies differ)
// //   const needsExchangeRate = (): boolean => {
// //     if (!primaryAccount || !counterAccount) return false;
// //     return primaryAccount.currency !== counterAccount.currency;
// //   };

// //   // Calculate converted amount for primary account
// //   // Amount is entered in COUNTER account currency
// //   // We need to calculate what goes to PRIMARY account
// //   const getConvertedAmount = (): {
// //     amount: number;
// //     currency: Currency;
// //   } | null => {
// //     if (!needsExchangeRate()) return null;
// //     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
// //       return null;

// //     const amountNum = parseFloat(amount);
// //     const rateNum = parseFloat(exchangeRate);

// //     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

// //     // Counter account currency is what user enters
// //     // Primary account currency is what we calculate
// //     // Rate is always: 1 USD = X KES

// //     if (
// //       counterAccount.currency === Currency.USD &&
// //       primaryAccount.currency === Currency.KES
// //     ) {
// //       // User enters USD, primary account is KES
// //       // KES amount = USD * rate
// //       return { amount: amountNum * rateNum, currency: Currency.KES };
// //     } else if (
// //       counterAccount.currency === Currency.KES &&
// //       primaryAccount.currency === Currency.USD
// //     ) {
// //       // User enters KES, primary account is USD
// //       // USD amount = KES / rate
// //       return { amount: amountNum / rateNum, currency: Currency.USD };
// //     }

// //     return null;
// //   };

// //   const convertedAmount = getConvertedAmount();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       if (!primaryAccountId) {
// //         throw new Error(
// //           `Please select an account to ${
// //             transactionType === TransactionType.Credit ? "credit" : "debit"
// //           }`
// //         );
// //       }
// //       if (!counterAccountId) {
// //         throw new Error("Please select a counter account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       const actualPrimaryId =
// //         primaryAccountType === AccountType.Client
// //           ? getActualClientId(primaryAccountId)
// //           : primaryAccountId;
// //       const actualCounterId =
// //         counterAccountType === AccountType.Client
// //           ? getActualClientId(counterAccountId)
// //           : counterAccountId;

// //       // FOREX TRANSACTION LOGIC:
// //       // - User enters amount in COUNTER account currency (e.g., KES 13,000 or USD 100)
// //       // - COUNTER account is affected by ORIGINAL amount (what user entered)
// //       // - PRIMARY account is affected by CONVERTED amount (using exchange rate)

// //       const originalAmount = parseFloat(amount); // What user entered (counter currency)
// //       let primaryAmount = originalAmount;
// //       let primaryCurrency = primaryAccount?.currency || currency;
// //       let counterCurrency = counterAccount?.currency || currency;

// //       if (needsExchangeRate() && primaryAccount && counterAccount) {
// //         const rateNum = parseFloat(exchangeRate);

// //         if (
// //           counterAccount.currency === Currency.USD &&
// //           primaryAccount.currency === Currency.KES
// //         ) {
// //           // User entered USD, Primary is KES
// //           // Primary gets: USD * rate = KES
// //           primaryAmount = originalAmount * rateNum;
// //         } else if (
// //           counterAccount.currency === Currency.KES &&
// //           primaryAccount.currency === Currency.USD
// //         ) {
// //           // User entered KES, Primary is USD
// //           // Primary gets: KES / rate = USD
// //           primaryAmount = originalAmount / rateNum;
// //         }

// //         primaryCurrency = primaryAccount.currency;
// //         counterCurrency = counterAccount.currency;
// //       }

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: primaryAccountType,
// //         sourceAccountId: actualPrimaryId,
// //         destAccountType: counterAccountType,
// //         destAccountId: actualCounterId,
// //         // Primary account: converted amount in primary currency
// //         amount: primaryAmount,
// //         currency: primaryCurrency,
// //         // Counter account: original amount (add this field for backend)
// //         counterAmount: originalAmount,
// //         counterCurrency: counterCurrency,
// //         // Exchange rate for reference
// //         exchangeRate: needsExchangeRate()
// //           ? parseFloat(exchangeRate)
// //           : undefined,
// //         paymentMethod: paymentMethod,
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //         <div className="bg-white p-8 text-center">
// //           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading accounts...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Header - Credit=GREEN, Debit=RED */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Credit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Credit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 {transactionType === TransactionType.Credit
// //                   ? "Credit (Money In)"
// //                   : "Debit (Money Out)"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               {/* CREDIT = Money IN = GREEN */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               {/* DEBIT = Money OUT = RED */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Primary Account - Label changes based on transaction type */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               <User className="w-3 h-3 inline mr-1" />
// //               {transactionType === TransactionType.Credit
// //                 ? "Select Account to Credit *"
// //                 : "Select Account to Debit *"}
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={primaryAccountType}
// //                 onChange={(e) => {
// //                   setPrimaryAccountType(Number(e.target.value) as AccountType);
// //                   setPrimaryAccountId("");
// //                   setPrimarySearchTerm("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={primarySearchTerm}
// //                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
// //                   placeholder="Search..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             </div>
// //             <select
// //               value={primaryAccountId}
// //               onChange={(e) => setPrimaryAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">Select account...</option>
// //               {filteredPrimaryAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {primaryAccountType === AccountType.Client &&
// //               filteredPrimaryAccounts.length === 0 &&
// //               primarySearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{primarySearchTerm}"
// //                 </p>
// //               )}
// //             {primaryAccountType === AccountType.Client && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Payment Method */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Cash
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Bank
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Mpesa
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.AccountTransfer
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Transfer
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Counter Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               {paymentMethod === PaymentMethod.Cash && (
// //                 <>
// //                   <Wallet className="w-3 h-3 inline mr-1" />
// //                   Cash Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Bank && (
// //                 <>
// //                   <Building2 className="w-3 h-3 inline mr-1" />
// //                   Bank Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Mpesa && (
// //                 <>
// //                   <Smartphone className="w-3 h-3 inline mr-1" />
// //                   M-Pesa Agent *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.AccountTransfer && (
// //                 <>
// //                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                   Counter Account *
// //                 </>
// //               )}
// //             </label>

// //             {/* Search for counter account (only for Transfer) */}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={counterSearchTerm}
// //                   onChange={(e) => setCounterSearchTerm(e.target.value)}
// //                   placeholder="Search clients..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             )}

// //             <select
// //               value={counterAccountId}
// //               onChange={(e) => setCounterAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">
// //                 Select{" "}
// //                 {paymentMethod === PaymentMethod.Cash
// //                   ? "cash account"
// //                   : paymentMethod === PaymentMethod.Bank
// //                   ? "bank"
// //                   : paymentMethod === PaymentMethod.Mpesa
// //                   ? "M-Pesa agent"
// //                   : "account"}
// //                 ...
// //               </option>
// //               {filteredCounterAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {paymentMethod === PaymentMethod.AccountTransfer &&
// //               filteredCounterAccounts.length === 0 &&
// //               counterSearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{counterSearchTerm}"
// //                 </p>
// //               )}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Amount & Currency */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount (
// //                 {counterAccount
// //                   ? getCurrencyLabel(counterAccount.currency)
// //                   : "Select account"}
// //                 ) *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 min="0"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency (Auto)
// //               </label>
// //               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
// //                 {getCurrencyLabel(currency)}
// //                 {counterAccount && (
// //                   <span className="text-xs text-slate-500 ml-2">
// //                     (from{" "}
// //                     {paymentMethod === PaymentMethod.Cash
// //                       ? "cash"
// //                       : paymentMethod === PaymentMethod.Bank
// //                       ? "bank"
// //                       : paymentMethod === PaymentMethod.Mpesa
// //                       ? "M-Pesa"
// //                       : "counter"}{" "}
// //                     account)
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Exchange Rate (if needed) */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="space-y-3"
// //             >
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     {counterAccount?.name} (
// //                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
// //                     {primaryAccount?.name} (
// //                     {getCurrencyLabel(primaryAccount?.currency!)})
// //                   </p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   Exchange Rate (1 USD = ? KES) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
// //                   placeholder="e.g., 130.50"
// //                   step="0.01"
// //                   required
// //                 />
// //               </div>

// //               {/* Conversion Preview */}
// //               {convertedAmount && amount && (
// //                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
// //                   <p className="text-xs font-bold text-blue-900 mb-1">
// //                     Conversion Preview
// //                   </p>
// //                   <div className="text-sm text-blue-800">
// //                     {counterAccount?.currency === Currency.USD ? (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">×</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     ) : (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">÷</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     )}
// //                   </div>
// //                   <p className="text-[10px] text-blue-600 mt-2">
// //                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}{" "}
// //                     will be{" "}
// //                     {transactionType === TransactionType.Credit
// //                       ? "credited to"
// //                       : "debited from"}{" "}
// //                     <strong>{primaryAccount?.name}</strong>
// //                   </p>
// //                 </div>
// //               )}
// //             </motion.div>
// //           )}

// //           {/* Description */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
// //               required
// //             />
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Calendar className="w-3 h-3 inline mr-1" />
// //               Transaction Date *
// //             </label>
// //             <input
// //               type="date"
// //               value={dateValue}
// //               onChange={(e) => setDateValue(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //               required
// //             />
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes (Optional)
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
// //               rows={2}
// //               placeholder="Additional notes or reference details..."
// //             />
// //           </div>

// //           {/* Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === TransactionType.Credit
// //                 ? "bg-emerald-50 border-emerald-500"
// //                 : "bg-red-50 border-red-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Transaction Summary
// //             </h4>
// //             <div className="space-y-1 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === TransactionType.Credit
// //                       ? "text-emerald-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {transactionType === TransactionType.Credit
// //                     ? "Credit (Money In)"
// //                     : "Debit (Money Out)"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Account:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {primaryAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Via:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {counterAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {getCurrencyLabel(currency)} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               {convertedAmount && (
// //                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
// //                   <span className="text-slate-600">
// //                     To {primaryAccount?.name?.split(" ")[0]}:
// //                   </span>
// //                   <span className="font-bold text-amber-600">
// //                     {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}
// //                   </span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Date:</span>
// //                 <span className="font-bold text-slate-900">{dateValue}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Footer */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === TransactionType.Credit
// //                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
// //                 Processing...
// //               </>
// //             ) : (
// //               `Process ${
// //                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //               }`
// //             )}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // import { useState, useEffect, useMemo } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   X,
// //   ArrowUpCircle,
// //   ArrowDownCircle,
// //   Wallet,
// //   CreditCard,
// //   Smartphone,
// //   ArrowLeftRight,
// //   Calendar,
// //   DollarSign,
// //   FileText,
// //   Building2,
// //   User,
// //   RefreshCw,
// //   Loader2,
// //   Search,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import {
// //   createTransaction,
// //   getBankAccounts,
// //   getMpesaAgents,
// //   getCashAccounts,
// //   getClients,
// //   TransactionType,
// //   AccountType,
// //   PaymentMethod,
// //   Currency,
// //   BankAccountDto,
// //   MpesaAgentDto,
// //   CashAccountDto,
// //   ClientDto,
// //   CreateTransactionDto,
// //   getCurrencyLabel,
// // } from "@/lib/api";

// // interface TransactionFormProps {
// //   onClose: () => void;
// //   onSuccess?: () => void;
// // }

// // // Combined account interface for unified selection
// // interface AccountOption {
// //   id: string;
// //   name: string;
// //   type: AccountType;
// //   currency: Currency;
// //   balance: number;
// //   isActive: boolean;
// //   accountNumber?: string;
// //   agentNumber?: string;
// //   clientId?: string;
// //   currencyType?: "KES" | "USD";
// // }

// // export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
// //   // Form state
// //   // ACCOUNTING PRINCIPLES:
// //   // - CREDIT = Money IN to account (balance increases) = GREEN
// //   // - DEBIT = Money OUT from account (balance decreases) = RED
// //   const [transactionType, setTransactionType] = useState<TransactionType>(
// //     TransactionType.Credit
// //   );
// //   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
// //     PaymentMethod.Cash
// //   );
// //   const [currency, setCurrency] = useState<Currency>(Currency.KES);
// //   const [amount, setAmount] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [exchangeRate, setExchangeRate] = useState("");
// //   const [dateValue, setDateValue] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   // Account selection
// //   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
// //   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
// //     AccountType.Client
// //   );
// //   const [primaryAccountId, setPrimaryAccountId] = useState("");
// //   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
// //   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
// //     AccountType.Cash
// //   );
// //   const [counterAccountId, setCounterAccountId] = useState("");

// //   // Search states
// //   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
// //   const [counterSearchTerm, setCounterSearchTerm] = useState("");

// //   // Data from API
// //   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
// //   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
// //   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
// //   const [clients, setClients] = useState<ClientDto[]>([]);

// //   // Loading states
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Fetch all accounts on mount
// //   useEffect(() => {
// //     const fetchAccounts = async () => {
// //       setIsLoading(true);
// //       try {
// //         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
// //           getCashAccounts(),
// //           getBankAccounts(),
// //           getMpesaAgents(),
// //           getClients(1, 1000),
// //         ]);

// //         if (cashRes.success && cashRes.data) {
// //           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (bankRes.success && bankRes.data) {
// //           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (mpesaRes.success && mpesaRes.data) {
// //           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
// //         }
// //         if (clientRes.success && clientRes.data?.items) {
// //           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch accounts:", error);
// //         toast.error("Failed to load accounts");
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchAccounts();
// //   }, []);

// //   // Get accounts by type for dropdown
// //   const getAccountsByType = (type: AccountType): AccountOption[] => {
// //     switch (type) {
// //       case AccountType.Cash:
// //         return cashAccounts.map((a) => ({
// //           id: a.id,
// //           name: a.name,
// //           type: AccountType.Cash,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //         }));
// //       case AccountType.Bank:
// //         return bankAccounts.map((a) => ({
// //           id: a.id,
// //           name: `${a.bankName} - ${a.accountNumber}`,
// //           type: AccountType.Bank,
// //           currency: a.currency,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           accountNumber: a.accountNumber,
// //         }));
// //       case AccountType.Mpesa:
// //         return mpesaAgents.map((a) => ({
// //           id: a.id,
// //           name: `${a.agentName} - ${a.agentNumber}`,
// //           type: AccountType.Mpesa,
// //           currency: Currency.KES,
// //           balance: a.balance,
// //           isActive: a.isActive !== false,
// //           agentNumber: a.agentNumber,
// //         }));
// //       case AccountType.Client:
// //         const clientAccounts: AccountOption[] = [];
// //         clients.forEach((c) => {
// //           // KES Account
// //           clientAccounts.push({
// //             id: `${c.id}_KES`,
// //             name: `${c.name || c.fullName} (${c.code}) - KES`,
// //             type: AccountType.Client,
// //             currency: Currency.KES,
// //             balance: c.balanceKES || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "KES",
// //           });
// //           // USD Account
// //           clientAccounts.push({
// //             id: `${c.id}_USD`,
// //             name: `${c.name || c.fullName} (${c.code}) - USD`,
// //             type: AccountType.Client,
// //             currency: Currency.USD,
// //             balance: c.balanceUSD || 0,
// //             isActive: c.isActive !== false,
// //             clientId: c.id,
// //             currencyType: "USD",
// //           });
// //         });
// //         return clientAccounts;
// //       default:
// //         return [];
// //     }
// //   };

// //   // Get filtered accounts based on search term
// //   const getFilteredAccounts = (
// //     type: AccountType,
// //     searchTerm: string
// //   ): AccountOption[] => {
// //     const accounts = getAccountsByType(type);
// //     if (!searchTerm.trim()) {
// //       return accounts;
// //     }
// //     const lowerSearch = searchTerm.toLowerCase();
// //     return accounts.filter(
// //       (account) =>
// //         account.name.toLowerCase().includes(lowerSearch) ||
// //         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
// //         account.agentNumber?.toLowerCase().includes(lowerSearch)
// //     );
// //   };

// //   // Memoized filtered accounts
// //   const filteredPrimaryAccounts = useMemo(() => {
// //     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
// //   }, [
// //     primaryAccountType,
// //     primarySearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const filteredCounterAccounts = useMemo(() => {
// //     return getFilteredAccounts(counterAccountType, counterSearchTerm);
// //   }, [
// //     counterAccountType,
// //     counterSearchTerm,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // Get actual client ID from composite ID
// //   const getActualClientId = (compositeId: string): string => {
// //     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
// //       return compositeId.slice(0, -4);
// //     }
// //     return compositeId;
// //   };

// //   // Get counter account type based on payment method
// //   const getCounterAccountTypeFromPayment = (
// //     method: PaymentMethod
// //   ): AccountType => {
// //     switch (method) {
// //       case PaymentMethod.Cash:
// //         return AccountType.Cash;
// //       case PaymentMethod.Bank:
// //         return AccountType.Bank;
// //       case PaymentMethod.Mpesa:
// //         return AccountType.Mpesa;
// //       case PaymentMethod.AccountTransfer:
// //         return AccountType.Client;
// //       default:
// //         return AccountType.Cash;
// //     }
// //   };

// //   // Update counter account type when payment method changes
// //   useEffect(() => {
// //     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
// //     setCounterAccountType(newCounterType);
// //     setCounterAccountId("");
// //     setCounterSearchTerm("");
// //   }, [paymentMethod]);

// //   // Reset search when primary account type changes
// //   useEffect(() => {
// //     setPrimarySearchTerm("");
// //     setPrimaryAccountId("");
// //   }, [primaryAccountType]);

// //   // Get selected accounts
// //   const primaryAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(primaryAccountType).find(
// //         (a) => a.id === primaryAccountId
// //       ) || null
// //     );
// //   }, [
// //     primaryAccountType,
// //     primaryAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   const counterAccount = useMemo(() => {
// //     return (
// //       getAccountsByType(counterAccountType).find(
// //         (a) => a.id === counterAccountId
// //       ) || null
// //     );
// //   }, [
// //     counterAccountType,
// //     counterAccountId,
// //     clients,
// //     cashAccounts,
// //     bankAccounts,
// //     mpesaAgents,
// //   ]);

// //   // AUTO-SET CURRENCY based on counter account selection
// //   useEffect(() => {
// //     if (counterAccount) {
// //       setCurrency(counterAccount.currency);
// //     }
// //   }, [counterAccount]);

// //   // Check if exchange rate is needed (currencies differ)
// //   const needsExchangeRate = (): boolean => {
// //     if (!primaryAccount || !counterAccount) return false;
// //     return primaryAccount.currency !== counterAccount.currency;
// //   };

// //   // Calculate converted amount for primary account
// //   // Amount is entered in COUNTER account currency
// //   // We need to calculate what goes to PRIMARY account
// //   const getConvertedAmount = (): {
// //     amount: number;
// //     currency: Currency;
// //   } | null => {
// //     if (!needsExchangeRate()) return null;
// //     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
// //       return null;

// //     const amountNum = parseFloat(amount);
// //     const rateNum = parseFloat(exchangeRate);

// //     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

// //     // Counter account currency is what user enters
// //     // Primary account currency is what we calculate
// //     // Rate is always: 1 USD = X KES

// //     if (
// //       counterAccount.currency === Currency.USD &&
// //       primaryAccount.currency === Currency.KES
// //     ) {
// //       // User enters USD, primary account is KES
// //       // KES amount = USD * rate
// //       return { amount: amountNum * rateNum, currency: Currency.KES };
// //     } else if (
// //       counterAccount.currency === Currency.KES &&
// //       primaryAccount.currency === Currency.USD
// //     ) {
// //       // User enters KES, primary account is USD
// //       // USD amount = KES / rate
// //       return { amount: amountNum / rateNum, currency: Currency.USD };
// //     }

// //     return null;
// //   };

// //   const convertedAmount = getConvertedAmount();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       if (!primaryAccountId) {
// //         throw new Error(
// //           `Please select an account to ${
// //             transactionType === TransactionType.Credit ? "credit" : "debit"
// //           }`
// //         );
// //       }
// //       if (!counterAccountId) {
// //         throw new Error("Please select a counter account");
// //       }
// //       if (!amount || parseFloat(amount) <= 0) {
// //         throw new Error("Please enter a valid amount greater than 0");
// //       }
// //       if (!description.trim()) {
// //         throw new Error("Please enter a description");
// //       }
// //       if (
// //         needsExchangeRate() &&
// //         (!exchangeRate || parseFloat(exchangeRate) <= 0)
// //       ) {
// //         throw new Error("Please enter a valid exchange rate");
// //       }

// //       const actualPrimaryId =
// //         primaryAccountType === AccountType.Client
// //           ? getActualClientId(primaryAccountId)
// //           : primaryAccountId;
// //       const actualCounterId =
// //         counterAccountType === AccountType.Client
// //           ? getActualClientId(counterAccountId)
// //           : counterAccountId;

// //       // FOREX TRANSACTION LOGIC:
// //       // - User enters amount in COUNTER account currency (e.g., KES 13,000 or USD 100)
// //       // - COUNTER account is affected by ORIGINAL amount (what user entered)
// //       // - PRIMARY account is affected by CONVERTED amount (using exchange rate)

// //       const originalAmount = parseFloat(amount); // What user entered (counter currency)
// //       let primaryAmount = originalAmount;
// //       let primaryCurrency = primaryAccount?.currency || currency;
// //       let counterCurrency = counterAccount?.currency || currency;

// //       if (needsExchangeRate() && primaryAccount && counterAccount) {
// //         const rateNum = parseFloat(exchangeRate);

// //         if (
// //           counterAccount.currency === Currency.USD &&
// //           primaryAccount.currency === Currency.KES
// //         ) {
// //           // User entered USD, Primary is KES
// //           // Primary gets: USD * rate = KES
// //           primaryAmount = originalAmount * rateNum;
// //         } else if (
// //           counterAccount.currency === Currency.KES &&
// //           primaryAccount.currency === Currency.USD
// //         ) {
// //           // User entered KES, Primary is USD
// //           // Primary gets: KES / rate = USD
// //           primaryAmount = originalAmount / rateNum;
// //         }

// //         primaryCurrency = primaryAccount.currency;
// //         counterCurrency = counterAccount.currency;
// //       }

// //       // Determine if this is a forex transaction
// //       const isForex = needsExchangeRate();

// //       const payload: CreateTransactionDto = {
// //         transactionType: transactionType,
// //         sourceAccountType: primaryAccountType,
// //         sourceAccountId: actualPrimaryId,
// //         destAccountType: counterAccountType,
// //         destAccountId: actualCounterId,
// //         // Primary account: converted amount in primary currency
// //         amount: primaryAmount,
// //         currency: primaryCurrency,
// //         // Counter account: original amount (only for forex transactions)
// //         counterAmount: isForex ? originalAmount : undefined,
// //         counterCurrency: isForex ? counterCurrency : undefined,
// //         // Exchange rate for reference
// //         exchangeRate: isForex ? parseFloat(exchangeRate) : undefined,
// //         paymentMethod: paymentMethod,
// //         description: description.trim(),
// //         notes: notes.trim() || undefined,
// //       };

// //       console.log("Submitting transaction:", payload);

// //       const result = await createTransaction(payload);

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to process transaction");
// //       }

// //       toast.success(
// //         `✅ ${
// //           transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //         } transaction completed! Code: ${result.data?.code || "N/A"}`,
// //         { duration: 4000 }
// //       );

// //       if (onSuccess) {
// //         onSuccess();
// //       }
// //       onClose();
// //     } catch (error) {
// //       console.error("Transaction error:", error);
// //       toast.error(
// //         `❌ Transaction failed: ${
// //           error instanceof Error ? error.message : "Unknown error"
// //         }`,
// //         { duration: 5000 }
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //         <div className="bg-white p-8 text-center">
// //           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
// //           <p className="text-slate-600 font-medium">Loading accounts...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.97, y: 20 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         exit={{ opacity: 0, scale: 0.97, y: 20 }}
// //         transition={{ type: "spring", damping: 30, stiffness: 400 }}
// //         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
// //       >
// //         {/* Header - Credit=GREEN, Debit=RED */}
// //         <div
// //           className={`relative p-5 bg-gradient-to-r ${
// //             transactionType === TransactionType.Credit
// //               ? "from-emerald-600 to-teal-600"
// //               : "from-red-600 to-rose-600"
// //           } text-white transition-all duration-300`}
// //         >
// //           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

// //           <button
// //             onClick={onClose}
// //             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>

// //           <div className="relative flex items-center gap-3">
// //             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
// //               {transactionType === TransactionType.Credit ? (
// //                 <ArrowUpCircle className="w-5 h-5" />
// //               ) : (
// //                 <ArrowDownCircle className="w-5 h-5" />
// //               )}
// //             </div>
// //             <div>
// //               <h2 className="text-lg font-bold">New Transaction</h2>
// //               <p className="text-xs opacity-90">
// //                 {transactionType === TransactionType.Credit
// //                   ? "Credit (Money In)"
// //                   : "Debit (Money Out)"}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
// //         >
// //           {/* Transaction Type Toggle */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Transaction Type *
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               {/* CREDIT = Money IN = GREEN */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Credit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Credit
// //                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
// //                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Credit
// //                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
// //                         : "bg-slate-100 group-hover:bg-emerald-100"
// //                     }`}
// //                   >
// //                     <ArrowUpCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Credit
// //                           ? "text-emerald-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Credit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money In</div>
// //                   </div>
// //                 </div>
// //               </button>

// //               {/* DEBIT = Money OUT = RED */}
// //               <button
// //                 type="button"
// //                 onClick={() => setTransactionType(TransactionType.Debit)}
// //                 className={`group relative p-3 border-2 transition-all duration-200 ${
// //                   transactionType === TransactionType.Debit
// //                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
// //                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
// //                 }`}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <div
// //                     className={`w-8 h-8 flex items-center justify-center transition-all ${
// //                       transactionType === TransactionType.Debit
// //                         ? "bg-red-500 shadow-lg shadow-red-500/30"
// //                         : "bg-slate-100 group-hover:bg-red-100"
// //                     }`}
// //                   >
// //                     <ArrowDownCircle
// //                       className={`w-4 h-4 ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-white"
// //                           : "text-slate-500"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="text-left">
// //                     <div
// //                       className={`text-sm font-bold ${
// //                         transactionType === TransactionType.Debit
// //                           ? "text-red-700"
// //                           : "text-slate-700"
// //                       }`}
// //                     >
// //                       Debit
// //                     </div>
// //                     <div className="text-[10px] text-slate-500">Money Out</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Primary Account - Label changes based on transaction type */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               <User className="w-3 h-3 inline mr-1" />
// //               {transactionType === TransactionType.Credit
// //                 ? "Select Account to Credit *"
// //                 : "Select Account to Debit *"}
// //             </label>
// //             <div className="grid grid-cols-2 gap-2">
// //               <select
// //                 value={primaryAccountType}
// //                 onChange={(e) => {
// //                   setPrimaryAccountType(Number(e.target.value) as AccountType);
// //                   setPrimaryAccountId("");
// //                   setPrimarySearchTerm("");
// //                 }}
// //                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               >
// //                 <option value={AccountType.Client}>Client</option>
// //                 <option value={AccountType.Cash}>Cash</option>
// //                 <option value={AccountType.Bank}>Bank</option>
// //                 <option value={AccountType.Mpesa}>M-Pesa</option>
// //               </select>
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={primarySearchTerm}
// //                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
// //                   placeholder="Search..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none
// //                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             </div>
// //             <select
// //               value={primaryAccountId}
// //               onChange={(e) => setPrimaryAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">Select account...</option>
// //               {filteredPrimaryAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {primaryAccountType === AccountType.Client &&
// //               filteredPrimaryAccounts.length === 0 &&
// //               primarySearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{primarySearchTerm}"
// //                 </p>
// //               )}
// //             {primaryAccountType === AccountType.Client && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Payment Method */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
// //               Payment Method *
// //             </label>
// //             <div className="grid grid-cols-4 gap-2">
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Cash
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Wallet
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Cash
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Cash
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Bank
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <CreditCard
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Bank
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Bank
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.Mpesa
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <Smartphone
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.Mpesa
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   M-Pesa
// //                 </div>
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
// //                 className={`group p-2.5 border-2 transition-all ${
// //                   paymentMethod === PaymentMethod.AccountTransfer
// //                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
// //                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
// //                 }`}
// //               >
// //                 <ArrowLeftRight
// //                   className={`w-5 h-5 mx-auto mb-1 ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-600"
// //                       : "text-slate-400 group-hover:text-blue-500"
// //                   }`}
// //                 />
// //                 <div
// //                   className={`text-[10px] font-bold ${
// //                     paymentMethod === PaymentMethod.AccountTransfer
// //                       ? "text-blue-700"
// //                       : "text-slate-600"
// //                   }`}
// //                 >
// //                   Transfer
// //                 </div>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Counter Account Selection */}
// //           <div className="space-y-2">
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
// //               {paymentMethod === PaymentMethod.Cash && (
// //                 <>
// //                   <Wallet className="w-3 h-3 inline mr-1" />
// //                   Cash Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Bank && (
// //                 <>
// //                   <Building2 className="w-3 h-3 inline mr-1" />
// //                   Bank Account *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.Mpesa && (
// //                 <>
// //                   <Smartphone className="w-3 h-3 inline mr-1" />
// //                   M-Pesa Agent *
// //                 </>
// //               )}
// //               {paymentMethod === PaymentMethod.AccountTransfer && (
// //                 <>
// //                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
// //                   Counter Account *
// //                 </>
// //               )}
// //             </label>

// //             {/* Search for counter account (only for Transfer) */}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
// //                 <input
// //                   type="text"
// //                   value={counterSearchTerm}
// //                   onChange={(e) => setCounterSearchTerm(e.target.value)}
// //                   placeholder="Search clients..."
// //                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //                 />
// //               </div>
// //             )}

// //             <select
// //               value={counterAccountId}
// //               onChange={(e) => setCounterAccountId(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
// //               required
// //             >
// //               <option value="">
// //                 Select{" "}
// //                 {paymentMethod === PaymentMethod.Cash
// //                   ? "cash account"
// //                   : paymentMethod === PaymentMethod.Bank
// //                   ? "bank"
// //                   : paymentMethod === PaymentMethod.Mpesa
// //                   ? "M-Pesa agent"
// //                   : "account"}
// //                 ...
// //               </option>
// //               {filteredCounterAccounts.map((account) => (
// //                 <option key={account.id} value={account.id}>
// //                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
// //                   {account.balance.toLocaleString()}
// //                 </option>
// //               ))}
// //             </select>
// //             {paymentMethod === PaymentMethod.AccountTransfer &&
// //               filteredCounterAccounts.length === 0 &&
// //               counterSearchTerm && (
// //                 <p className="text-xs text-amber-600">
// //                   No clients found matching "{counterSearchTerm}"
// //                 </p>
// //               )}
// //             {paymentMethod === PaymentMethod.AccountTransfer && (
// //               <p className="text-[10px] text-slate-500">
// //                 💡 Each client has separate KES and USD accounts
// //               </p>
// //             )}
// //           </div>

// //           {/* Amount & Currency */}
// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 <DollarSign className="w-3 h-3 inline mr-1" />
// //                 Amount (
// //                 {counterAccount
// //                   ? getCurrencyLabel(counterAccount.currency)
// //                   : "Select account"}
// //                 ) *
// //               </label>
// //               <input
// //                 type="number"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
// //                 placeholder="0.00"
// //                 step="0.01"
// //                 min="0"
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //                 Currency (Auto)
// //               </label>
// //               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
// //                 {getCurrencyLabel(currency)}
// //                 {counterAccount && (
// //                   <span className="text-xs text-slate-500 ml-2">
// //                     (from{" "}
// //                     {paymentMethod === PaymentMethod.Cash
// //                       ? "cash"
// //                       : paymentMethod === PaymentMethod.Bank
// //                       ? "bank"
// //                       : paymentMethod === PaymentMethod.Mpesa
// //                       ? "M-Pesa"
// //                       : "counter"}{" "}
// //                     account)
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Exchange Rate (if needed) */}
// //           {needsExchangeRate() && (
// //             <motion.div
// //               initial={{ opacity: 0, y: -10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="space-y-3"
// //             >
// //               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
// //                 <RefreshCw
// //                   className="w-4 h-4 text-amber-600 animate-spin"
// //                   style={{ animationDuration: "3s" }}
// //                 />
// //                 <div className="flex-1">
// //                   <p className="text-xs font-bold text-amber-900">
// //                     Currency Exchange Required
// //                   </p>
// //                   <p className="text-[10px] text-amber-700">
// //                     {counterAccount?.name} (
// //                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
// //                     {primaryAccount?.name} (
// //                     {getCurrencyLabel(primaryAccount?.currency!)})
// //                   </p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
// //                   <RefreshCw className="w-3 h-3 inline mr-1" />
// //                   Exchange Rate (1 USD = ? KES) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={exchangeRate}
// //                   onChange={(e) => setExchangeRate(e.target.value)}
// //                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
// //                   placeholder="e.g., 130.50"
// //                   step="0.01"
// //                   required
// //                 />
// //               </div>

// //               {/* Conversion Preview */}
// //               {convertedAmount && amount && (
// //                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
// //                   <p className="text-xs font-bold text-blue-900 mb-1">
// //                     Conversion Preview
// //                   </p>
// //                   <div className="text-sm text-blue-800">
// //                     {counterAccount?.currency === Currency.USD ? (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">×</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     ) : (
// //                       <>
// //                         <span className="font-mono">
// //                           {getCurrencyLabel(Currency.KES)}{" "}
// //                           {parseFloat(amount).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">÷</span>
// //                         <span className="font-mono">
// //                           {parseFloat(exchangeRate).toLocaleString()}
// //                         </span>
// //                         <span className="mx-2">=</span>
// //                         <span className="font-bold text-emerald-700">
// //                           {getCurrencyLabel(Currency.USD)}{" "}
// //                           {convertedAmount.amount.toLocaleString(undefined, {
// //                             minimumFractionDigits: 2,
// //                             maximumFractionDigits: 2,
// //                           })}
// //                         </span>
// //                       </>
// //                     )}
// //                   </div>
// //                   <p className="text-[10px] text-blue-600 mt-2">
// //                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}{" "}
// //                     will be{" "}
// //                     {transactionType === TransactionType.Credit
// //                       ? "credited to"
// //                       : "debited from"}{" "}
// //                     <strong>{primaryAccount?.name}</strong>
// //                   </p>
// //                 </div>
// //               )}
// //             </motion.div>
// //           )}

// //           {/* Description */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <FileText className="w-3 h-3 inline mr-1" />
// //               Description *
// //             </label>
// //             <input
// //               type="text"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
// //               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
// //               required
// //             />
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               <Calendar className="w-3 h-3 inline mr-1" />
// //               Transaction Date *
// //             </label>
// //             <input
// //               type="date"
// //               value={dateValue}
// //               onChange={(e) => setDateValue(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
// //               required
// //             />
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
// //               Notes (Optional)
// //             </label>
// //             <textarea
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
// //               rows={2}
// //               placeholder="Additional notes or reference details..."
// //             />
// //           </div>

// //           {/* Summary */}
// //           <div
// //             className={`p-3 border-l-4 ${
// //               transactionType === TransactionType.Credit
// //                 ? "bg-emerald-50 border-emerald-500"
// //                 : "bg-red-50 border-red-500"
// //             }`}
// //           >
// //             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
// //               Transaction Summary
// //             </h4>
// //             <div className="space-y-1 text-xs">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Type:</span>
// //                 <span
// //                   className={`font-bold ${
// //                     transactionType === TransactionType.Credit
// //                       ? "text-emerald-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {transactionType === TransactionType.Credit
// //                     ? "Credit (Money In)"
// //                     : "Debit (Money Out)"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Account:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {primaryAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Via:</span>
// //                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
// //                   {counterAccount?.name || "Not selected"}
// //                 </span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Amount:</span>
// //                 <span className="font-bold text-slate-900">
// //                   {getCurrencyLabel(currency)} {amount || "0.00"}
// //                 </span>
// //               </div>
// //               {convertedAmount && (
// //                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
// //                   <span className="text-slate-600">
// //                     To {primaryAccount?.name?.split(" ")[0]}:
// //                   </span>
// //                   <span className="font-bold text-amber-600">
// //                     {getCurrencyLabel(convertedAmount.currency)}{" "}
// //                     {convertedAmount.amount.toLocaleString(undefined, {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}
// //                   </span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between">
// //                 <span className="text-slate-600">Date:</span>
// //                 <span className="font-bold text-slate-900">{dateValue}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </form>

// //         {/* Footer */}
// //         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
// //             disabled={isSubmitting}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             onClick={handleSubmit}
// //             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
// //               transactionType === TransactionType.Credit
// //                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
// //                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
// //             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
// //             disabled={isSubmitting}
// //           >
// //             {isSubmitting ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
// //                 Processing...
// //               </>
// //             ) : (
// //               `Process ${
// //                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
// //               }`
// //             )}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
//   Search,
//   Plus,
//   Minus,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
//   clientId?: string;
//   currencyType?: "KES" | "USD";
// }

// // ============================================================
// // TRADITIONAL ACCOUNTING RULES
// // ============================================================
// // ASSET accounts (Cash, Bank, M-Pesa):
// //   - DEBIT = Balance INCREASES (money comes IN)
// //   - CREDIT = Balance DECREASES (money goes OUT)
// //
// // LIABILITY accounts (Client - we hold their money):
// //   - DEBIT = Balance DECREASES (client withdraws)
// //   - CREDIT = Balance INCREASES (client deposits)
// // ============================================================

// const isAssetAccount = (accountType: AccountType): boolean => {
//   return (
//     accountType === AccountType.Cash ||
//     accountType === AccountType.Bank ||
//     accountType === AccountType.Mpesa
//   );
// };

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Credit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [primaryAccountId, setPrimaryAccountId] = useState("");
//   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [counterAccountId, setCounterAccountId] = useState("");

//   // Search states
//   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
//   const [counterSearchTerm, setCounterSearchTerm] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ============================================================
//   // DETERMINE BALANCE EFFECT
//   // ============================================================
//   // For ASSET accounts: Debit = Increase, Credit = Decrease
//   // For LIABILITY (Client): Credit = Increase, Debit = Decrease
//   const isBalanceIncrease = useMemo(() => {
//     if (isAssetAccount(primaryAccountType)) {
//       return transactionType === TransactionType.Debit;
//     } else {
//       return transactionType === TransactionType.Credit;
//     }
//   }, [primaryAccountType, transactionType]);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000),
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Reset transaction type when primary account type changes
//   // Default to the "increase" action for better UX
//   useEffect(() => {
//     if (isAssetAccount(primaryAccountType)) {
//       setTransactionType(TransactionType.Debit); // Debit increases assets
//     } else {
//       setTransactionType(TransactionType.Credit); // Credit increases client balance
//     }
//   }, [primaryAccountType]);

//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name || `Cash ${a.currency}`,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         const clientAccounts: AccountOption[] = [];
//         clients.forEach((c) => {
//           clientAccounts.push({
//             id: `${c.id}_KES`,
//             name: `${c.name || c.fullName} (${c.code}) - KES`,
//             type: AccountType.Client,
//             currency: Currency.KES,
//             balance: c.balanceKES || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "KES",
//           });
//           clientAccounts.push({
//             id: `${c.id}_USD`,
//             name: `${c.name || c.fullName} (${c.code}) - USD`,
//             type: AccountType.Client,
//             currency: Currency.USD,
//             balance: c.balanceUSD || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "USD",
//           });
//         });
//         return clientAccounts;
//       default:
//         return [];
//     }
//   };

//   // Get filtered accounts based on search term
//   const getFilteredAccounts = (
//     type: AccountType,
//     searchTerm: string
//   ): AccountOption[] => {
//     const accounts = getAccountsByType(type);
//     if (!searchTerm.trim()) {
//       return accounts;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     return accounts.filter(
//       (account) =>
//         account.name.toLowerCase().includes(lowerSearch) ||
//         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
//         account.agentNumber?.toLowerCase().includes(lowerSearch)
//     );
//   };

//   // Memoized filtered accounts
//   const filteredPrimaryAccounts = useMemo(() => {
//     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
//   }, [
//     primaryAccountType,
//     primarySearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const filteredCounterAccounts = useMemo(() => {
//     return getFilteredAccounts(counterAccountType, counterSearchTerm);
//   }, [
//     counterAccountType,
//     counterSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Get actual client ID from composite ID
//   const getActualClientId = (compositeId: string): string => {
//     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
//       return compositeId.slice(0, -4);
//     }
//     return compositeId;
//   };

//   // Get counter account type based on payment method
//   const getCounterAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update counter account type when payment method changes
//   useEffect(() => {
//     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
//     setCounterAccountType(newCounterType);
//     setCounterAccountId("");
//     setCounterSearchTerm("");
//   }, [paymentMethod]);

//   // Reset search when primary account type changes
//   useEffect(() => {
//     setPrimarySearchTerm("");
//     setPrimaryAccountId("");
//   }, [primaryAccountType]);

//   // Get selected accounts
//   const primaryAccount = useMemo(() => {
//     return (
//       getAccountsByType(primaryAccountType).find(
//         (a) => a.id === primaryAccountId
//       ) || null
//     );
//   }, [
//     primaryAccountType,
//     primaryAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const counterAccount = useMemo(() => {
//     return (
//       getAccountsByType(counterAccountType).find(
//         (a) => a.id === counterAccountId
//       ) || null
//     );
//   }, [
//     counterAccountType,
//     counterAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // AUTO-SET CURRENCY based on counter account selection
//   useEffect(() => {
//     if (counterAccount) {
//       setCurrency(counterAccount.currency);
//     }
//   }, [counterAccount]);

//   // Check if exchange rate is needed (currencies differ)
//   const needsExchangeRate = (): boolean => {
//     if (!primaryAccount || !counterAccount) return false;
//     return primaryAccount.currency !== counterAccount.currency;
//   };

//   // Calculate converted amount for primary account
//   const getConvertedAmount = (): {
//     amount: number;
//     currency: Currency;
//   } | null => {
//     if (!needsExchangeRate()) return null;
//     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
//       return null;

//     const amountNum = parseFloat(amount);
//     const rateNum = parseFloat(exchangeRate);

//     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

//     if (
//       counterAccount.currency === Currency.USD &&
//       primaryAccount.currency === Currency.KES
//     ) {
//       return { amount: amountNum * rateNum, currency: Currency.KES };
//     } else if (
//       counterAccount.currency === Currency.KES &&
//       primaryAccount.currency === Currency.USD
//     ) {
//       return { amount: amountNum / rateNum, currency: Currency.USD };
//     }

//     return null;
//   };

//   const convertedAmount = getConvertedAmount();

//   // ============================================================
//   // GET USER-FRIENDLY LABELS BASED ON ACCOUNT TYPE
//   // ============================================================
//   const getActionLabels = () => {
//     if (isAssetAccount(primaryAccountType)) {
//       // For ASSET accounts: Debit = IN (green), Credit = OUT (red)
//       return {
//         increase: {
//           label: "Receive",
//           description: "Money In (Debit)",
//           type: TransactionType.Debit,
//           icon: Plus,
//           colorClass: "emerald",
//         },
//         decrease: {
//           label: "Pay Out",
//           description: "Money Out (Credit)",
//           type: TransactionType.Credit,
//           icon: Minus,
//           colorClass: "red",
//         },
//       };
//     } else {
//       // For CLIENT accounts: Credit = deposit (green), Debit = withdraw (red)
//       return {
//         increase: {
//           label: "Deposit",
//           description: "Client Deposit (Credit)",
//           type: TransactionType.Credit,
//           icon: Plus,
//           colorClass: "emerald",
//         },
//         decrease: {
//           label: "Withdraw",
//           description: "Client Withdrawal (Debit)",
//           type: TransactionType.Debit,
//           icon: Minus,
//           colorClass: "red",
//         },
//       };
//     }
//   };

//   const actionLabels = getActionLabels();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!primaryAccountId) {
//         throw new Error("Please select an account");
//       }
//       if (!counterAccountId) {
//         throw new Error("Please select a counter account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const actualPrimaryId =
//         primaryAccountType === AccountType.Client
//           ? getActualClientId(primaryAccountId)
//           : primaryAccountId;
//       const actualCounterId =
//         counterAccountType === AccountType.Client
//           ? getActualClientId(counterAccountId)
//           : counterAccountId;

//       const originalAmount = parseFloat(amount);
//       let primaryAmount = originalAmount;
//       let primaryCurrency = primaryAccount?.currency || currency;
//       let counterCurrency = counterAccount?.currency || currency;

//       if (needsExchangeRate() && primaryAccount && counterAccount) {
//         const rateNum = parseFloat(exchangeRate);

//         if (
//           counterAccount.currency === Currency.USD &&
//           primaryAccount.currency === Currency.KES
//         ) {
//           primaryAmount = originalAmount * rateNum;
//         } else if (
//           counterAccount.currency === Currency.KES &&
//           primaryAccount.currency === Currency.USD
//         ) {
//           primaryAmount = originalAmount / rateNum;
//         }

//         primaryCurrency = primaryAccount.currency;
//         counterCurrency = counterAccount.currency;
//       }

//       const isForex = needsExchangeRate();

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: primaryAccountType,
//         sourceAccountId: actualPrimaryId,
//         destAccountType: counterAccountType,
//         destAccountId: actualCounterId,
//         amount: primaryAmount,
//         currency: primaryCurrency,
//         counterAmount: isForex ? originalAmount : undefined,
//         counterCurrency: isForex ? counterCurrency : undefined,
//         exchangeRate: isForex ? parseFloat(exchangeRate) : undefined,
//         paymentMethod: paymentMethod,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       const actionText = isBalanceIncrease
//         ? isAssetAccount(primaryAccountType)
//           ? "Received"
//           : "Deposited"
//         : isAssetAccount(primaryAccountType)
//         ? "Paid out"
//         : "Withdrawn";

//       toast.success(
//         `✅ ${actionText} successfully! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   // Dynamic colors based on balance effect
//   const headerGradient = isBalanceIncrease
//     ? "from-emerald-600 to-teal-600"
//     : "from-red-600 to-rose-600";

//   const buttonGradient = isBalanceIncrease
//     ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//     : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30";

//   const summaryBorderColor = isBalanceIncrease
//     ? "bg-emerald-50 border-emerald-500"
//     : "bg-red-50 border-red-500";

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header - Color based on balance effect */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${headerGradient} text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {isBalanceIncrease ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {isBalanceIncrease ? "Balance Increase" : "Balance Decrease"} •{" "}
//                 {transactionType === TransactionType.Debit ? "Debit" : "Credit"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Primary Account Selection FIRST */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               Select Account *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={primaryAccountType}
//                 onChange={(e) => {
//                   setPrimaryAccountType(Number(e.target.value) as AccountType);
//                   setPrimaryAccountId("");
//                   setPrimarySearchTerm("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={primarySearchTerm}
//                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
//                   placeholder="Search..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>
//             <select
//               value={primaryAccountId}
//               onChange={(e) => setPrimaryAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">Select account...</option>
//               {filteredPrimaryAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {primaryAccountType === AccountType.Client &&
//               filteredPrimaryAccounts.length === 0 &&
//               primarySearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{primarySearchTerm}"
//                 </p>
//               )}
//             {primaryAccountType === AccountType.Client && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Transaction Type Toggle - DYNAMIC based on account type */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {/* INCREASE Button (Green) */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(actionLabels.increase.type)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   isBalanceIncrease
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       isBalanceIncrease
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <Plus
//                       className={`w-4 h-4 ${
//                         isBalanceIncrease ? "text-white" : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         isBalanceIncrease
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       {actionLabels.increase.label}
//                     </div>
//                     <div className="text-[10px] text-slate-500">
//                       {actionLabels.increase.description}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-400">
//                   {actionLabels.increase.type === TransactionType.Debit
//                     ? "DR"
//                     : "CR"}
//                 </div>
//               </button>

//               {/* DECREASE Button (Red) */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(actionLabels.decrease.type)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   !isBalanceIncrease
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       !isBalanceIncrease
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <Minus
//                       className={`w-4 h-4 ${
//                         !isBalanceIncrease ? "text-white" : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         !isBalanceIncrease ? "text-red-700" : "text-slate-700"
//                       }`}
//                     >
//                       {actionLabels.decrease.label}
//                     </div>
//                     <div className="text-[10px] text-slate-500">
//                       {actionLabels.decrease.description}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-400">
//                   {actionLabels.decrease.type === TransactionType.Debit
//                     ? "DR"
//                     : "CR"}
//                 </div>
//               </button>
//             </div>

//             {/* Accounting hint */}
//             <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded">
//               <p className="text-[10px] text-slate-600 flex items-center gap-1">
//                 <span>📚</span>
//                 <span>
//                   {isAssetAccount(primaryAccountType) ? (
//                     <>
//                       <strong>Asset account:</strong> Debit = Balance ↑
//                       (increase), Credit = Balance ↓ (decrease)
//                     </>
//                   ) : (
//                     <>
//                       <strong>Client account:</strong> Credit = Balance ↑
//                       (deposit), Debit = Balance ↓ (withdraw)
//                     </>
//                   )}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Via (Counter Account) *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Counter Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Counter Account *
//                 </>
//               )}
//             </label>

//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={counterSearchTerm}
//                   onChange={(e) => setCounterSearchTerm(e.target.value)}
//                   placeholder="Search clients..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             )}

//             <select
//               value={counterAccountId}
//               onChange={(e) => setCounterAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {filteredCounterAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {paymentMethod === PaymentMethod.AccountTransfer &&
//               filteredCounterAccounts.length === 0 &&
//               counterSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{counterSearchTerm}"
//                 </p>
//               )}
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount (
//                 {counterAccount
//                   ? getCurrencyLabel(counterAccount.currency)
//                   : "Select account"}
//                 ) *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency (Auto)
//               </label>
//               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
//                 {getCurrencyLabel(currency)}
//               </div>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-3"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     {counterAccount?.name} (
//                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
//                     {primaryAccount?.name} (
//                     {getCurrencyLabel(primaryAccount?.currency!)})
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate (1 USD = ? KES) *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="e.g., 130.50"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               {convertedAmount && amount && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
//                   <p className="text-xs font-bold text-blue-900 mb-1">
//                     Conversion Preview
//                   </p>
//                   <div className="text-sm text-blue-800">
//                     {counterAccount?.currency === Currency.USD ? (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">×</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">÷</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Client deposit, Cash receipt, Bank transfer..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes..."
//             />
//           </div>

//           {/* Summary */}
//           <div className={`p-3 border-l-4 ${summaryBorderColor}`}>
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Transaction Summary
//             </h4>
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Action:</span>
//                 <span
//                   className={`font-bold ${
//                     isBalanceIncrease ? "text-emerald-600" : "text-red-600"
//                   }`}
//                 >
//                   {isBalanceIncrease
//                     ? actionLabels.increase.label
//                     : actionLabels.decrease.label}{" "}
//                   ({transactionType === TransactionType.Debit ? "DR" : "CR"})
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Account:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {primaryAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Via:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {counterAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               {convertedAmount && (
//                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
//                   <span className="text-slate-600">Converted:</span>
//                   <span className="font-bold text-amber-600">
//                     {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Balance Effect:</span>
//                 <span
//                   className={`font-bold ${
//                     isBalanceIncrease ? "text-emerald-600" : "text-red-600"
//                   }`}
//                 >
//                   {isBalanceIncrease ? "↑ Increase" : "↓ Decrease"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${buttonGradient} text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 {isBalanceIncrease ? (
//                   <Plus className="w-4 h-4 inline mr-1" />
//                 ) : (
//                   <Minus className="w-4 h-4 inline mr-1" />
//                 )}
//                 {isBalanceIncrease
//                   ? actionLabels.increase.label
//                   : actionLabels.decrease.label}
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Hash,
//   Building2,
//   User,
//   RefreshCw,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Debit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   const [sourceAccountType, setSourceAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [sourceAccountId, setSourceAccountId] = useState("");
//   const [destAccountType, setDestAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [destAccountId, setDestAccountId] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [method, setMethod] = useState<"cash" | "bank" | "mpesa" | "account">(
//     "cash"
//   );

//   const generateReference = () => {
//     const date = new Date();
//     const year = date.getFullYear();
//     const random = Math.floor(Math.random() * 10000)
//       .toString()
//       .padStart(4, "0");
//     return `TXN-${year}-${random}`;
//   };

//   const [reference] = useState(generateReference());

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000), // Get all clients
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);
//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES, // M-Pesa is always KES
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         return clients.map((c) => ({
//           id: c.id,
//           name: `${c.fullName} (${c.code})`,
//           type: AccountType.Client,
//           currency: Currency.KES, // Default, clients can have both
//           balance: c.balanceKES + c.balanceUSD,
//           isActive: c.isActive !== false,
//         }));
//       default:
//         return [];
//     }
//   };
//   // Get destination account type based on payment method
//   const getDestAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };
//   // Update destination account type when payment method changes
//   useEffect(() => {
//     const newDestType = getDestAccountTypeFromPayment(paymentMethod);
//     setDestAccountType(newDestType);
//     setDestAccountId(""); // Reset selection
//   }, [paymentMethod]);
//   // Check if exchange rate is needed
//   const needsExchangeRate = () => {
//     const sourceAcc = getAccountsByType(sourceAccountType).find(
//       (a) => a.id === sourceAccountId
//     );
//     const destAcc = getAccountsByType(destAccountType).find(
//       (a) => a.id === destAccountId
//     );

//     if (sourceAcc && destAcc) {
//       return sourceAcc.currency !== destAcc.currency;
//     }
//     return false;
//   };
//   // Get selected account currency
//   const getSelectedAccountCurrency = (
//     type: AccountType,
//     id: string
//   ): Currency | null => {
//     const accounts = getAccountsByType(type);
//     const account = accounts.find((a) => a.id === id);
//     return account?.currency ?? null;
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validation
//       if (!sourceAccountId) {
//         throw new Error("Please select a source account");
//       }
//       if (!destAccountId) {
//         throw new Error("Please select a destination account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: sourceAccountType,
//         sourceAccountId: sourceAccountId,
//         destAccountType: destAccountType,
//         destAccountId: destAccountId,
//         amount: parseFloat(amount),
//         currency: currency,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//         exchangeRate: needsExchangeRate()
//           ? parseFloat(exchangeRate)
//           : undefined,
//         paymentMethod: paymentMethod,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Debit ? "Debit" : "Credit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   // Get selected item currency

//   //Notes placehoders

//   const getNotesPlaceholder = () => {
//     switch (method) {
//       case "cash":
//         return "Name & Telephone Number";
//       case "bank":
//       case "mpesa":
//         return "Transaction message / reference details";
//       case "account":
//         return "Internal transfer notes";
//       default:
//         return "Enter notes";
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Compact Header */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Credit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Credit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 Process {transactionType} transaction
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Compact Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle - Inline */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Primary Account to Debit/Credit */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Wallet className="w-3 h-3 inline mr-1" />
//               Account to{" "}
//               {transactionType === TransactionType.Debit ? "Debit" : "Credit"} *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={sourceAccountType}
//                 onChange={(e) => {
//                   setSourceAccountType(Number(e.target.value) as AccountType);
//                   setSourceAccountId("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <select
//                 value={sourceAccountId}
//                 onChange={(e) => setSourceAccountId(e.target.value)}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//                 required
//               >
//                 <option value="">Select account...</option>
//                 {getAccountsByType(sourceAccountType).map((account) => (
//                   <option key={account.id} value={account.id}>
//                     {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                     {account.balance.toLocaleString()}
//                   </option>
//                 ))}
//                 {transactionType === TransactionType.Credit ? "💰" : "💸"}
//                 <span>
//                   This account will be{" "}
//                   {transactionType === TransactionType.Credit
//                     ? "credited (money in)"
//                     : "debited (money out)"}
//                 </span>
//               </select>
//             </div>
//           </div>

//           {/* Description - Full Width - MOVED HERE FOR VISIBILITY */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Transaction Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal, etc."
//               required
//             />
//             <p className="text-[10px] text-blue-600 mt-1.5 font-semibold">
//               💡 Brief description of what this transaction is for
//             </p>
//           </div>

//           {/* Amount & Currency - 2 Columns */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm transition-all"
//                 placeholder="0.00"
//                 step="0.01"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency *
//               </label>
//               <select
//                 value={currency}
//                 onChange={(e) =>
//                   setCurrency(Number(e.target.value) as Currency)
//                 }
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
//                 required
//               >
//                 <option value={Currency.KES}>KES</option>
//                 <option value={Currency.USD}>USD</option>
//               </select>
//             </div>
//           </div>

//           {/* Reference & Date - 2 Columns */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <Hash className="w-3 h-3 inline mr-1" />
//                 Reference
//               </label>
//               <input
//                 type="text"
//                 value={reference}
//                 readOnly
//                 className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs"
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <Calendar className="w-3 h-3 inline mr-1" />
//                 Date *
//               </label>
//               <input
//                 type="date"
//                 value={dateValue}
//                 onChange={(e) => setDateValue(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
//                 required
//               />
//             </div>
//           </div>

//           {/* Payment Method - Compact Grid */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setMethod("cash")}
//                 className={`group p-2.5 border-2 transition-all ${
//                   method === "cash"
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     method === "cash"
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     method === "cash" ? "text-blue-700" : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setMethod("bank")}
//                 className={`group p-2.5 border-2 transition-all ${
//                   method === "bank"
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     method === "bank"
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     method === "bank" ? "text-blue-700" : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setMethod("mpesa")}
//                 className={`group p-2.5 border-2 transition-all ${
//                   method === "mpesa"
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     method === "mpesa"
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     method === "mpesa" ? "text-blue-700" : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setMethod("account")}
//                 className={`group p-2.5 border-2 transition-all ${
//                   method === "account"
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     method === "account"
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     method === "account" ? "text-blue-700" : "text-slate-600"
//                   }`}
//                 >
//                   Account
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Conditional Selection Fields */}
//           {method === "account" && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                 Select Account *
//               </label>
//               <select
//                 value={selectedAccount}
//                 onChange={(e) => setSelectedAccount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
//                 required
//               >
//                 <option value="" className="text-slate-500">
//                   Choose an account...
//                 </option>
//                 {accounts.map((account) => (
//                   <option
//                     key={account.id}
//                     value={account.id}
//                     className="text-slate-900"
//                   >
//                     {account.name} ({account.type})
//                   </option>
//                 ))}
//               </select>
//             </motion.div>
//           )}

//           {method === "bank" && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <Building2 className="w-3 h-3 inline mr-1" />
//                 Select Bank Account *
//               </label>
//               <select
//                 value={selectedBank}
//                 onChange={(e) => setSelectedBank(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
//                 required
//               >
//                 <option value="" className="text-slate-500">
//                   Choose a bank...
//                 </option>
//                 {banks.map((bank) => (
//                   <option
//                     key={bank.id}
//                     value={bank.id}
//                     className="text-slate-900"
//                   >
//                     {bank.name} - A/C: {bank.accountNumber}
//                   </option>
//                 ))}
//               </select>
//             </motion.div>
//           )}

//           {method === "mpesa" && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <User className="w-3 h-3 inline mr-1" />
//                 Select M-Pesa Agent *
//               </label>
//               <select
//                 value={selectedAgent}
//                 onChange={(e) => setSelectedAgent(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
//                 required
//               >
//                 <option value="" className="text-slate-500">
//                   Choose an agent...
//                 </option>
//                 {agents.map((agent) => (
//                   <option
//                     key={agent.id}
//                     value={agent.id}
//                     className="text-slate-900"
//                   >
//                     {agent.name} - Agent #{agent.agentNumber}
//                   </option>
//                 ))}
//               </select>
//             </motion.div>
//           )}

//           {/* Exchange Rate Field */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="space-y-3"
//             >
//               {/* Currency Mismatch Alert */}
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     Transaction: {currency} → Account: {getSelectedCurrency()}
//                   </p>
//                 </div>
//               </div>

//               {/* Exchange Rate Input */}
//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   {getExchangeRateLabel()} *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm transition-all"
//                   placeholder="Enter exchange rate"
//                   step="0.0001"
//                   required
//                 />
//                 <p className="text-[10px] text-amber-600 mt-1.5 font-semibold">
//                   💱 This rate will be used to convert between {currency} and{" "}
//                   {getSelectedCurrency()}
//                 </p>
//               </div>
//             </motion.div>
//           )}

//           {/* Notes - Compact */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes *
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-none"
//               rows={2}
//               placeholder={getNotesPlaceholder()}
//               required
//             />
//             <p className="text-[10px] text-slate-500 mt-1.5 flex items-start gap-1">
//               <span>💡</span>
//               <span>
//                 {method === "cash" &&
//                   "For cash transactions, include customer name and phone number"}
//                 {method === "bank" &&
//                   "Include bank transaction reference or message"}
//                 {method === "mpesa" &&
//                   "Include M-Pesa transaction code and details"}
//                 {method === "account" &&
//                   "Specify source and destination account details"}
//               </span>
//             </p>
//           </div>

//           {/* Compact Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === "debit"
//                 ? "bg-red-50 border-red-500"
//                 : "bg-emerald-50 border-emerald-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Summary
//             </h4>
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === "debit"
//                       ? "text-red-600"
//                       : "text-emerald-600"
//                   }`}
//                 >
//                   {transactionType === "debit" ? "Debit" : "Credit"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Method:</span>
//                 <span className="font-bold capitalize text-slate-900">
//                   {method}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {currency} {amount || "0.00"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Ref:</span>
//                 <span className="font-mono text-[10px] text-slate-700">
//                   {reference}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Compact Footer Actions */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === "debit"
//                 ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//                 : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//             } text-white font-bold text-sm transition-all shadow-md`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting
//               ? "Processing..."
//               : `Process ${transactionType === "debit" ? "Debit" : "Credit"}`}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Hash,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Debit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   const [sourceAccountType, setSourceAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [sourceAccountId, setSourceAccountId] = useState("");
//   const [destAccountType, setDestAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [destAccountId, setDestAccountId] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000), // Get all clients
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES, // M-Pesa is always KES
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         return clients.map((c) => ({
//           id: c.id,
//           name: `${c.fullName} (${c.code})`,
//           type: AccountType.Client,
//           currency: Currency.KES, // Default, clients can have both
//           balance: c.balanceKES,
//           isActive: c.isActive !== false,
//         }));
//       default:
//         return [];
//     }
//   };

//   // Get destination account type based on payment method
//   const getDestAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update destination account type when payment method changes
//   useEffect(() => {
//     const newDestType = getDestAccountTypeFromPayment(paymentMethod);
//     setDestAccountType(newDestType);
//     setDestAccountId(""); // Reset selection
//   }, [paymentMethod]);

//   // Check if exchange rate is needed
//   const needsExchangeRate = () => {
//     const sourceAcc = getAccountsByType(sourceAccountType).find(
//       (a) => a.id === sourceAccountId
//     );
//     const destAcc = getAccountsByType(destAccountType).find(
//       (a) => a.id === destAccountId
//     );

//     if (sourceAcc && destAcc) {
//       return sourceAcc.currency !== destAcc.currency;
//     }
//     return false;
//   };

//   // Get selected account currency
//   const getSelectedAccountCurrency = (
//     type: AccountType,
//     id: string
//   ): Currency | null => {
//     const accounts = getAccountsByType(type);
//     const account = accounts.find((a) => a.id === id);
//     return account?.currency ?? null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validation
//       if (!sourceAccountId) {
//         throw new Error("Please select a source account");
//       }
//       if (!destAccountId) {
//         throw new Error("Please select a destination account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: sourceAccountType,
//         sourceAccountId: sourceAccountId,
//         destAccountType: destAccountType,
//         destAccountId: destAccountId,
//         amount: parseFloat(amount),
//         currency: currency,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//         exchangeRate: needsExchangeRate()
//           ? parseFloat(exchangeRate)
//           : undefined,
//         paymentMethod: paymentMethod,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Debit ? "Debit" : "Credit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Debit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Debit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {transactionType === TransactionType.Debit
//                   ? "Debit (Money In)"
//                   : "Credit (Money Out)"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Source Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               Source Account *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={sourceAccountType}
//                 onChange={(e) => {
//                   setSourceAccountType(Number(e.target.value) as AccountType);
//                   setSourceAccountId("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <select
//                 value={sourceAccountId}
//                 onChange={(e) => setSourceAccountId(e.target.value)}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//                 required
//               >
//                 <option value="">Select account...</option>
//                 {getAccountsByType(sourceAccountType).map((account) => (
//                   <option key={account.id} value={account.id}>
//                     {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                     {account.balance.toLocaleString()}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Destination Account Selection */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Destination Account *
//                 </>
//               )}
//             </label>
//             <select
//               value={destAccountId}
//               onChange={(e) => setDestAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {getAccountsByType(destAccountType).map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency *
//               </label>
//               <select
//                 value={currency}
//                 onChange={(e) =>
//                   setCurrency(Number(e.target.value) as Currency)
//                 }
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//                 required
//               >
//                 <option value={Currency.KES}>KES</option>
//                 <option value={Currency.USD}>USD</option>
//               </select>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-2"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     Different currencies detected between accounts
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="Enter exchange rate"
//                   step="0.0001"
//                   required
//                 />
//               </div>
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes or reference details..."
//             />
//           </div>

//           {/* Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === TransactionType.Credit
//                 ? "bg-red-50 border-red-500"
//                 : "bg-emerald-50 border-emerald-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Summary
//             </h4>
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === TransactionType.Credit
//                       ? "text-red-600"
//                       : "text-emerald-600"
//                   }`}
//                 >
//                   {transactionType === TransactionType.Debit
//                     ? "Debit (In)"
//                     : "Credit (Out)"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Method:</span>
//                 <span className="font-bold text-slate-900">
//                   {paymentMethod === PaymentMethod.Cash
//                     ? "Cash"
//                     : paymentMethod === PaymentMethod.Bank
//                     ? "Bank"
//                     : paymentMethod === PaymentMethod.Mpesa
//                     ? "M-Pesa"
//                     : "Transfer"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Date:</span>
//                 <span className="font-bold text-slate-900">{dateValue}</span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === TransactionType.Credit
//                 ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//                 : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Process ${
//                 transactionType === TransactionType.Debit ? "Debit" : "Credit"
//               }`
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Hash,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
//   Search,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
//   // For clients, we need to track which currency account this represents
//   clientId?: string;
//   currencyType?: "KES" | "USD";
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Debit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   const [sourceAccountType, setSourceAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [sourceAccountId, setSourceAccountId] = useState("");
//   const [destAccountType, setDestAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [destAccountId, setDestAccountId] = useState("");

//   // Search states for dropdowns
//   const [sourceSearchTerm, setSourceSearchTerm] = useState("");
//   const [destSearchTerm, setDestSearchTerm] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000), // Get all clients
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Get accounts by type for dropdown
//   // For clients, returns TWO entries per client (KES and USD accounts)
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES, // M-Pesa is always KES
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         // Create TWO entries per client - one for KES and one for USD
//         const clientAccounts: AccountOption[] = [];
//         clients.forEach((c) => {
//           // KES Account
//           clientAccounts.push({
//             id: `${c.id}_KES`, // Unique ID for KES account
//             name: `${c.name || c.fullName} (${c.code}) - KES`,
//             type: AccountType.Client,
//             currency: Currency.KES,
//             balance: c.balanceKES || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "KES",
//           });
//           // USD Account
//           clientAccounts.push({
//             id: `${c.id}_USD`, // Unique ID for USD account
//             name: `${c.name || c.fullName} (${c.code}) - USD`,
//             type: AccountType.Client,
//             currency: Currency.USD,
//             balance: c.balanceUSD || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "USD",
//           });
//         });
//         return clientAccounts;
//       default:
//         return [];
//     }
//   };

//   // Get filtered accounts based on search term
//   const getFilteredAccounts = (
//     type: AccountType,
//     searchTerm: string
//   ): AccountOption[] => {
//     const accounts = getAccountsByType(type);
//     if (!searchTerm.trim()) {
//       return accounts;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     return accounts.filter(
//       (account) =>
//         account.name?.toLowerCase().includes(lowerSearch) ||
//         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
//         account.agentNumber?.toLowerCase().includes(lowerSearch)
//     );
//   };

//   // Memoized filtered source accounts
//   const filteredSourceAccounts = useMemo(() => {
//     return getFilteredAccounts(sourceAccountType, sourceSearchTerm);
//   }, [
//     sourceAccountType,
//     sourceSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Memoized filtered destination accounts
//   const filteredDestAccounts = useMemo(() => {
//     return getFilteredAccounts(destAccountType, destSearchTerm);
//   }, [
//     destAccountType,
//     destSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Get the actual client ID from the composite ID (e.g., "uuid_KES" -> "uuid")
//   const getActualClientId = (compositeId: string): string => {
//     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
//       return compositeId.slice(0, -4); // Remove "_KES" or "_USD"
//     }
//     return compositeId;
//   };

//   // Get destination account type based on payment method
//   const getDestAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update destination account type when payment method changes
//   useEffect(() => {
//     const newDestType = getDestAccountTypeFromPayment(paymentMethod);
//     setDestAccountType(newDestType);
//     setDestAccountId(""); // Reset selection
//     setDestSearchTerm(""); // Reset search
//   }, [paymentMethod]);

//   // Reset search when account type changes
//   useEffect(() => {
//     setSourceSearchTerm("");
//     setSourceAccountId("");
//   }, [sourceAccountType]);

//   // Check if exchange rate is needed
//   const needsExchangeRate = () => {
//     const sourceAccounts = getAccountsByType(sourceAccountType);
//     const destAccounts = getAccountsByType(destAccountType);

//     const sourceAcc = sourceAccounts.find((a) => a.id === sourceAccountId);
//     const destAcc = destAccounts.find((a) => a.id === destAccountId);

//     if (sourceAcc && destAcc) {
//       return sourceAcc.currency !== destAcc.currency;
//     }
//     return false;
//   };

//   // Get selected account currency
//   const getSelectedAccountCurrency = (
//     type: AccountType,
//     id: string
//   ): Currency | null => {
//     const accounts = getAccountsByType(type);
//     const account = accounts.find((a) => a.id === id);
//     return account?.currency ?? null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validation
//       if (!sourceAccountId) {
//         throw new Error("Please select a source account");
//       }
//       if (!destAccountId) {
//         throw new Error("Please select a destination account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       // Get actual client IDs (strip currency suffix if present)
//       const actualSourceId =
//         sourceAccountType === AccountType.Client
//           ? getActualClientId(sourceAccountId)
//           : sourceAccountId;
//       const actualDestId =
//         destAccountType === AccountType.Client
//           ? getActualClientId(destAccountId)
//           : destAccountId;

//       // Determine the currency based on selected account for clients
//       let transactionCurrency = currency;
//       if (sourceAccountType === AccountType.Client) {
//         const sourceAcc = getAccountsByType(sourceAccountType).find(
//           (a) => a.id === sourceAccountId
//         );
//         if (sourceAcc) {
//           transactionCurrency = sourceAcc.currency;
//         }
//       }

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: sourceAccountType,
//         sourceAccountId: actualSourceId,
//         destAccountType: destAccountType,
//         destAccountId: actualDestId,
//         amount: parseFloat(amount),
//         currency: transactionCurrency,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//         exchangeRate: needsExchangeRate()
//           ? parseFloat(exchangeRate)
//           : undefined,
//         paymentMethod: paymentMethod,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Debit ? "Debit" : "Credit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Debit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Debit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {transactionType === TransactionType.Debit
//                   ? "Debit (Money In)"
//                   : "Credit (Money Out)"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Source Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               Source Account *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={sourceAccountType}
//                 onChange={(e) => {
//                   setSourceAccountType(Number(e.target.value) as AccountType);
//                   setSourceAccountId("");
//                   setSourceSearchTerm("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <div className="relative">
//                 {/* Search input for filtering */}
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                   <input
//                     type="text"
//                     value={sourceSearchTerm}
//                     onChange={(e) => setSourceSearchTerm(e.target.value)}
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* Account dropdown */}
//             <select
//               value={sourceAccountId}
//               onChange={(e) => setSourceAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">Select account...</option>
//               {filteredSourceAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {sourceAccountType === AccountType.Client &&
//               filteredSourceAccounts.length === 0 &&
//               sourceSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{sourceSearchTerm}"
//                 </p>
//               )}
//             {sourceAccountType === AccountType.Client && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Destination Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Destination Account *
//                 </>
//               )}
//             </label>

//             {/* Search for destination (only show for Client/Transfer) */}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={destSearchTerm}
//                   onChange={(e) => setDestSearchTerm(e.target.value)}
//                   placeholder="Search clients..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             )}

//             <select
//               value={destAccountId}
//               onChange={(e) => setDestAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {filteredDestAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {paymentMethod === PaymentMethod.AccountTransfer &&
//               filteredDestAccounts.length === 0 &&
//               destSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{destSearchTerm}"
//                 </p>
//               )}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency *
//               </label>
//               <select
//                 value={currency}
//                 onChange={(e) =>
//                   setCurrency(Number(e.target.value) as Currency)
//                 }
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//                 required
//               >
//                 <option value={Currency.KES}>KES</option>
//                 <option value={Currency.USD}>USD</option>
//               </select>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-2"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     Different currencies detected between accounts
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="Enter exchange rate"
//                   step="0.0001"
//                   required
//                 />
//               </div>
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes or reference details..."
//             />
//           </div>

//           {/* Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === TransactionType.Credit
//                 ? "bg-red-50 border-red-500"
//                 : "bg-emerald-50 border-emerald-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Summary
//             </h4>
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === TransactionType.Credit
//                       ? "text-red-600"
//                       : "text-emerald-600"
//                   }`}
//                 >
//                   {transactionType === TransactionType.Debit
//                     ? "Debit (In)"
//                     : "Credit (Out)"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Method:</span>
//                 <span className="font-bold text-slate-900">
//                   {paymentMethod === PaymentMethod.Cash
//                     ? "Cash"
//                     : paymentMethod === PaymentMethod.Bank
//                     ? "Bank"
//                     : paymentMethod === PaymentMethod.Mpesa
//                     ? "M-Pesa"
//                     : "Transfer"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Date:</span>
//                 <span className="font-bold text-slate-900">{dateValue}</span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === TransactionType.Credit
//                 ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//                 : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Process ${
//                 transactionType === TransactionType.Debit ? "Debit" : "Credit"
//               }`
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
//   Search,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
//   clientId?: string;
//   currencyType?: "KES" | "USD";
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   // ACCOUNTING PRINCIPLES:
//   // - CREDIT = Money IN to account (balance increases) = GREEN
//   // - DEBIT = Money OUT from account (balance decreases) = RED
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Credit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
//   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [primaryAccountId, setPrimaryAccountId] = useState("");
//   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
//   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [counterAccountId, setCounterAccountId] = useState("");

//   // Search states
//   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
//   const [counterSearchTerm, setCounterSearchTerm] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000),
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         const clientAccounts: AccountOption[] = [];
//         clients.forEach((c) => {
//           // KES Account
//           clientAccounts.push({
//             id: `${c.id}_KES`,
//             name: `${c.name || c.fullName} (${c.code}) - KES`,
//             type: AccountType.Client,
//             currency: Currency.KES,
//             balance: c.balanceKES || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "KES",
//           });
//           // USD Account
//           clientAccounts.push({
//             id: `${c.id}_USD`,
//             name: `${c.name || c.fullName} (${c.code}) - USD`,
//             type: AccountType.Client,
//             currency: Currency.USD,
//             balance: c.balanceUSD || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "USD",
//           });
//         });
//         return clientAccounts;
//       default:
//         return [];
//     }
//   };

//   // Get filtered accounts based on search term
//   const getFilteredAccounts = (
//     type: AccountType,
//     searchTerm: string
//   ): AccountOption[] => {
//     const accounts = getAccountsByType(type);
//     if (!searchTerm.trim()) {
//       return accounts;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     return accounts.filter(
//       (account) =>
//         account.name.toLowerCase().includes(lowerSearch) ||
//         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
//         account.agentNumber?.toLowerCase().includes(lowerSearch)
//     );
//   };

//   // Memoized filtered accounts
//   const filteredPrimaryAccounts = useMemo(() => {
//     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
//   }, [
//     primaryAccountType,
//     primarySearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const filteredCounterAccounts = useMemo(() => {
//     return getFilteredAccounts(counterAccountType, counterSearchTerm);
//   }, [
//     counterAccountType,
//     counterSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Get actual client ID from composite ID
//   const getActualClientId = (compositeId: string): string => {
//     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
//       return compositeId.slice(0, -4);
//     }
//     return compositeId;
//   };

//   // Get counter account type based on payment method
//   const getCounterAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update counter account type when payment method changes
//   useEffect(() => {
//     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
//     setCounterAccountType(newCounterType);
//     setCounterAccountId("");
//     setCounterSearchTerm("");
//   }, [paymentMethod]);

//   // Reset search when primary account type changes
//   useEffect(() => {
//     setPrimarySearchTerm("");
//     setPrimaryAccountId("");
//   }, [primaryAccountType]);

//   // Get selected accounts
//   const primaryAccount = useMemo(() => {
//     return (
//       getAccountsByType(primaryAccountType).find(
//         (a) => a.id === primaryAccountId
//       ) || null
//     );
//   }, [
//     primaryAccountType,
//     primaryAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const counterAccount = useMemo(() => {
//     return (
//       getAccountsByType(counterAccountType).find(
//         (a) => a.id === counterAccountId
//       ) || null
//     );
//   }, [
//     counterAccountType,
//     counterAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // AUTO-SET CURRENCY based on counter account selection
//   useEffect(() => {
//     if (counterAccount) {
//       setCurrency(counterAccount.currency);
//     }
//   }, [counterAccount]);

//   // Check if exchange rate is needed (currencies differ)
//   const needsExchangeRate = (): boolean => {
//     if (!primaryAccount || !counterAccount) return false;
//     return primaryAccount.currency !== counterAccount.currency;
//   };

//   // Calculate converted amount for primary account
//   // Amount is entered in COUNTER account currency
//   // We need to calculate what goes to PRIMARY account
//   const getConvertedAmount = (): {
//     amount: number;
//     currency: Currency;
//   } | null => {
//     if (!needsExchangeRate()) return null;
//     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
//       return null;

//     const amountNum = parseFloat(amount);
//     const rateNum = parseFloat(exchangeRate);

//     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

//     // Counter account currency is what user enters
//     // Primary account currency is what we calculate
//     // Rate is always: 1 USD = X KES

//     if (
//       counterAccount.currency === Currency.USD &&
//       primaryAccount.currency === Currency.KES
//     ) {
//       // User enters USD, primary account is KES
//       // KES amount = USD * rate
//       return { amount: amountNum * rateNum, currency: Currency.KES };
//     } else if (
//       counterAccount.currency === Currency.KES &&
//       primaryAccount.currency === Currency.USD
//     ) {
//       // User enters KES, primary account is USD
//       // USD amount = KES / rate
//       return { amount: amountNum / rateNum, currency: Currency.USD };
//     }

//     return null;
//   };

//   const convertedAmount = getConvertedAmount();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!primaryAccountId) {
//         throw new Error(
//           `Please select an account to ${
//             transactionType === TransactionType.Credit ? "credit" : "debit"
//           }`
//         );
//       }
//       if (!counterAccountId) {
//         throw new Error("Please select a counter account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const actualPrimaryId =
//         primaryAccountType === AccountType.Client
//           ? getActualClientId(primaryAccountId)
//           : primaryAccountId;
//       const actualCounterId =
//         counterAccountType === AccountType.Client
//           ? getActualClientId(counterAccountId)
//           : counterAccountId;

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: primaryAccountType,
//         sourceAccountId: actualPrimaryId,
//         destAccountType: counterAccountType,
//         destAccountId: actualCounterId,
//         amount: parseFloat(amount),
//         currency: currency,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//         exchangeRate: needsExchangeRate()
//           ? parseFloat(exchangeRate)
//           : undefined,
//         paymentMethod: paymentMethod,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Credit ? "Credit" : "Debit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header - Credit=GREEN, Debit=RED */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Credit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Credit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {transactionType === TransactionType.Credit
//                   ? "Credit (Money In)"
//                   : "Debit (Money Out)"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {/* CREDIT = Money IN = GREEN */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               {/* DEBIT = Money OUT = RED */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Primary Account - Label changes based on transaction type */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               {transactionType === TransactionType.Credit
//                 ? "Select Account to Credit *"
//                 : "Select Account to Debit *"}
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={primaryAccountType}
//                 onChange={(e) => {
//                   setPrimaryAccountType(Number(e.target.value) as AccountType);
//                   setPrimaryAccountId("");
//                   setPrimarySearchTerm("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={primarySearchTerm}
//                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
//                   placeholder="Search..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>
//             <select
//               value={primaryAccountId}
//               onChange={(e) => setPrimaryAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">Select account...</option>
//               {filteredPrimaryAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {primaryAccountType === AccountType.Client &&
//               filteredPrimaryAccounts.length === 0 &&
//               primarySearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{primarySearchTerm}"
//                 </p>
//               )}
//             {primaryAccountType === AccountType.Client && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Counter Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Counter Account *
//                 </>
//               )}
//             </label>

//             {/* Search for counter account (only for Transfer) */}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={counterSearchTerm}
//                   onChange={(e) => setCounterSearchTerm(e.target.value)}
//                   placeholder="Search clients..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             )}

//             <select
//               value={counterAccountId}
//               onChange={(e) => setCounterAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {filteredCounterAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {paymentMethod === PaymentMethod.AccountTransfer &&
//               filteredCounterAccounts.length === 0 &&
//               counterSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{counterSearchTerm}"
//                 </p>
//               )}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount (
//                 {counterAccount
//                   ? getCurrencyLabel(counterAccount.currency)
//                   : "Select account"}
//                 ) *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency (Auto)
//               </label>
//               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
//                 {getCurrencyLabel(currency)}
//                 {counterAccount && (
//                   <span className="text-xs text-slate-500 ml-2">
//                     (from{" "}
//                     {paymentMethod === PaymentMethod.Cash
//                       ? "cash"
//                       : paymentMethod === PaymentMethod.Bank
//                       ? "bank"
//                       : paymentMethod === PaymentMethod.Mpesa
//                       ? "M-Pesa"
//                       : "counter"}{" "}
//                     account)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-3"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     {counterAccount?.name} (
//                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
//                     {primaryAccount?.name} (
//                     {getCurrencyLabel(primaryAccount?.currency!)})
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate (1 USD = ? KES) *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="e.g., 130.50"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               {/* Conversion Preview */}
//               {convertedAmount && amount && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
//                   <p className="text-xs font-bold text-blue-900 mb-1">
//                     Conversion Preview
//                   </p>
//                   <div className="text-sm text-blue-800">
//                     {counterAccount?.currency === Currency.USD ? (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">×</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">÷</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <p className="text-[10px] text-blue-600 mt-2">
//                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}{" "}
//                     will be{" "}
//                     {transactionType === TransactionType.Credit
//                       ? "credited to"
//                       : "debited from"}{" "}
//                     <strong>{primaryAccount?.name}</strong>
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes or reference details..."
//             />
//           </div>

//           {/* Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === TransactionType.Credit
//                 ? "bg-emerald-50 border-emerald-500"
//                 : "bg-red-50 border-red-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Transaction Summary
//             </h4>
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === TransactionType.Credit
//                       ? "text-emerald-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {transactionType === TransactionType.Credit
//                     ? "Credit (Money In)"
//                     : "Debit (Money Out)"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Account:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {primaryAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Via:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {counterAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               {convertedAmount && (
//                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
//                   <span className="text-slate-600">
//                     To {primaryAccount?.name?.split(" ")[0]}:
//                   </span>
//                   <span className="font-bold text-amber-600">
//                     {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Date:</span>
//                 <span className="font-bold text-slate-900">{dateValue}</span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === TransactionType.Credit
//                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Process ${
//                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
//               }`
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
//   Search,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
//   clientId?: string;
//   currencyType?: "KES" | "USD";
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   // ACCOUNTING PRINCIPLES:
//   // - CREDIT = Money IN to account (balance increases) = GREEN
//   // - DEBIT = Money OUT from account (balance decreases) = RED
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Credit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
//   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [primaryAccountId, setPrimaryAccountId] = useState("");
//   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
//   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [counterAccountId, setCounterAccountId] = useState("");

//   // Search states
//   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
//   const [counterSearchTerm, setCounterSearchTerm] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000),
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         const clientAccounts: AccountOption[] = [];
//         clients.forEach((c) => {
//           // KES Account
//           clientAccounts.push({
//             id: `${c.id}_KES`,
//             name: `${c.name || c.fullName} (${c.code}) - KES`,
//             type: AccountType.Client,
//             currency: Currency.KES,
//             balance: c.balanceKES || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "KES",
//           });
//           // USD Account
//           clientAccounts.push({
//             id: `${c.id}_USD`,
//             name: `${c.name || c.fullName} (${c.code}) - USD`,
//             type: AccountType.Client,
//             currency: Currency.USD,
//             balance: c.balanceUSD || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "USD",
//           });
//         });
//         return clientAccounts;
//       default:
//         return [];
//     }
//   };

//   // Get filtered accounts based on search term
//   const getFilteredAccounts = (
//     type: AccountType,
//     searchTerm: string
//   ): AccountOption[] => {
//     const accounts = getAccountsByType(type);
//     if (!searchTerm.trim()) {
//       return accounts;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     return accounts.filter(
//       (account) =>
//         account.name.toLowerCase().includes(lowerSearch) ||
//         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
//         account.agentNumber?.toLowerCase().includes(lowerSearch)
//     );
//   };

//   // Memoized filtered accounts
//   const filteredPrimaryAccounts = useMemo(() => {
//     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
//   }, [
//     primaryAccountType,
//     primarySearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const filteredCounterAccounts = useMemo(() => {
//     return getFilteredAccounts(counterAccountType, counterSearchTerm);
//   }, [
//     counterAccountType,
//     counterSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Get actual client ID from composite ID
//   const getActualClientId = (compositeId: string): string => {
//     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
//       return compositeId.slice(0, -4);
//     }
//     return compositeId;
//   };

//   // Get counter account type based on payment method
//   const getCounterAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update counter account type when payment method changes
//   useEffect(() => {
//     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
//     setCounterAccountType(newCounterType);
//     setCounterAccountId("");
//     setCounterSearchTerm("");
//   }, [paymentMethod]);

//   // Reset search when primary account type changes
//   useEffect(() => {
//     setPrimarySearchTerm("");
//     setPrimaryAccountId("");
//   }, [primaryAccountType]);

//   // Get selected accounts
//   const primaryAccount = useMemo(() => {
//     return (
//       getAccountsByType(primaryAccountType).find(
//         (a) => a.id === primaryAccountId
//       ) || null
//     );
//   }, [
//     primaryAccountType,
//     primaryAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const counterAccount = useMemo(() => {
//     return (
//       getAccountsByType(counterAccountType).find(
//         (a) => a.id === counterAccountId
//       ) || null
//     );
//   }, [
//     counterAccountType,
//     counterAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // AUTO-SET CURRENCY based on counter account selection
//   useEffect(() => {
//     if (counterAccount) {
//       setCurrency(counterAccount.currency);
//     }
//   }, [counterAccount]);

//   // Check if exchange rate is needed (currencies differ)
//   const needsExchangeRate = (): boolean => {
//     if (!primaryAccount || !counterAccount) return false;
//     return primaryAccount.currency !== counterAccount.currency;
//   };

//   // Calculate converted amount for primary account
//   // Amount is entered in COUNTER account currency
//   // We need to calculate what goes to PRIMARY account
//   const getConvertedAmount = (): {
//     amount: number;
//     currency: Currency;
//   } | null => {
//     if (!needsExchangeRate()) return null;
//     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
//       return null;

//     const amountNum = parseFloat(amount);
//     const rateNum = parseFloat(exchangeRate);

//     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

//     // Counter account currency is what user enters
//     // Primary account currency is what we calculate
//     // Rate is always: 1 USD = X KES

//     if (
//       counterAccount.currency === Currency.USD &&
//       primaryAccount.currency === Currency.KES
//     ) {
//       // User enters USD, primary account is KES
//       // KES amount = USD * rate
//       return { amount: amountNum * rateNum, currency: Currency.KES };
//     } else if (
//       counterAccount.currency === Currency.KES &&
//       primaryAccount.currency === Currency.USD
//     ) {
//       // User enters KES, primary account is USD
//       // USD amount = KES / rate
//       return { amount: amountNum / rateNum, currency: Currency.USD };
//     }

//     return null;
//   };

//   const convertedAmount = getConvertedAmount();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!primaryAccountId) {
//         throw new Error(
//           `Please select an account to ${
//             transactionType === TransactionType.Credit ? "credit" : "debit"
//           }`
//         );
//       }
//       if (!counterAccountId) {
//         throw new Error("Please select a counter account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const actualPrimaryId =
//         primaryAccountType === AccountType.Client
//           ? getActualClientId(primaryAccountId)
//           : primaryAccountId;
//       const actualCounterId =
//         counterAccountType === AccountType.Client
//           ? getActualClientId(counterAccountId)
//           : counterAccountId;

//       // IMPORTANT: We need to send the PRIMARY account's currency and the amount
//       // that will affect the PRIMARY account (converted if exchange is involved)
//       let finalAmount = parseFloat(amount);
//       let finalCurrency = currency; // Default: counter account currency

//       if (needsExchangeRate() && primaryAccount && counterAccount) {
//         // Set currency to PRIMARY account's currency (the one being debited/credited)
//         finalCurrency = primaryAccount.currency;

//         // Calculate the converted amount for the primary account
//         const rateNum = parseFloat(exchangeRate);
//         if (
//           counterAccount.currency === Currency.USD &&
//           primaryAccount.currency === Currency.KES
//         ) {
//           // Counter is USD, Primary is KES: USD * rate = KES
//           finalAmount = parseFloat(amount) * rateNum;
//         } else if (
//           counterAccount.currency === Currency.KES &&
//           primaryAccount.currency === Currency.USD
//         ) {
//           // Counter is KES, Primary is USD: KES / rate = USD
//           finalAmount = parseFloat(amount) / rateNum;
//         }
//       } else if (primaryAccount) {
//         // No exchange needed - use primary account's currency
//         finalCurrency = primaryAccount.currency;
//       }

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: primaryAccountType,
//         sourceAccountId: actualPrimaryId,
//         destAccountType: counterAccountType,
//         destAccountId: actualCounterId,
//         amount: finalAmount,
//         currency: finalCurrency, // PRIMARY account's currency
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//         exchangeRate: needsExchangeRate()
//           ? parseFloat(exchangeRate)
//           : undefined,
//         paymentMethod: paymentMethod,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Credit ? "Credit" : "Debit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header - Credit=GREEN, Debit=RED */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Credit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Credit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {transactionType === TransactionType.Credit
//                   ? "Credit (Money In)"
//                   : "Debit (Money Out)"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {/* CREDIT = Money IN = GREEN */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               {/* DEBIT = Money OUT = RED */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Primary Account - Label changes based on transaction type */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               {transactionType === TransactionType.Credit
//                 ? "Select Account to Credit *"
//                 : "Select Account to Debit *"}
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={primaryAccountType}
//                 onChange={(e) => {
//                   setPrimaryAccountType(Number(e.target.value) as AccountType);
//                   setPrimaryAccountId("");
//                   setPrimarySearchTerm("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={primarySearchTerm}
//                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
//                   placeholder="Search..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>
//             <select
//               value={primaryAccountId}
//               onChange={(e) => setPrimaryAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">Select account...</option>
//               {filteredPrimaryAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {primaryAccountType === AccountType.Client &&
//               filteredPrimaryAccounts.length === 0 &&
//               primarySearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{primarySearchTerm}"
//                 </p>
//               )}
//             {primaryAccountType === AccountType.Client && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Counter Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Counter Account *
//                 </>
//               )}
//             </label>

//             {/* Search for counter account (only for Transfer) */}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={counterSearchTerm}
//                   onChange={(e) => setCounterSearchTerm(e.target.value)}
//                   placeholder="Search clients..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             )}

//             <select
//               value={counterAccountId}
//               onChange={(e) => setCounterAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {filteredCounterAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {paymentMethod === PaymentMethod.AccountTransfer &&
//               filteredCounterAccounts.length === 0 &&
//               counterSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{counterSearchTerm}"
//                 </p>
//               )}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount (
//                 {counterAccount
//                   ? getCurrencyLabel(counterAccount.currency)
//                   : "Select account"}
//                 ) *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency (Auto)
//               </label>
//               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
//                 {getCurrencyLabel(currency)}
//                 {counterAccount && (
//                   <span className="text-xs text-slate-500 ml-2">
//                     (from{" "}
//                     {paymentMethod === PaymentMethod.Cash
//                       ? "cash"
//                       : paymentMethod === PaymentMethod.Bank
//                       ? "bank"
//                       : paymentMethod === PaymentMethod.Mpesa
//                       ? "M-Pesa"
//                       : "counter"}{" "}
//                     account)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-3"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     {counterAccount?.name} (
//                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
//                     {primaryAccount?.name} (
//                     {getCurrencyLabel(primaryAccount?.currency!)})
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate (1 USD = ? KES) *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="e.g., 130.50"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               {/* Conversion Preview */}
//               {convertedAmount && amount && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
//                   <p className="text-xs font-bold text-blue-900 mb-1">
//                     Conversion Preview
//                   </p>
//                   <div className="text-sm text-blue-800">
//                     {counterAccount?.currency === Currency.USD ? (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">×</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">÷</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <p className="text-[10px] text-blue-600 mt-2">
//                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}{" "}
//                     will be{" "}
//                     {transactionType === TransactionType.Credit
//                       ? "credited to"
//                       : "debited from"}{" "}
//                     <strong>{primaryAccount?.name}</strong>
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes or reference details..."
//             />
//           </div>

//           {/* Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === TransactionType.Credit
//                 ? "bg-emerald-50 border-emerald-500"
//                 : "bg-red-50 border-red-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Transaction Summary
//             </h4>
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === TransactionType.Credit
//                       ? "text-emerald-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {transactionType === TransactionType.Credit
//                     ? "Credit (Money In)"
//                     : "Debit (Money Out)"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Account:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {primaryAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Via:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {counterAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               {convertedAmount && (
//                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
//                   <span className="text-slate-600">
//                     To {primaryAccount?.name?.split(" ")[0]}:
//                   </span>
//                   <span className="font-bold text-amber-600">
//                     {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Date:</span>
//                 <span className="font-bold text-slate-900">{dateValue}</span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === TransactionType.Credit
//                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Process ${
//                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
//               }`
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
//   Search,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
//   clientId?: string;
//   currencyType?: "KES" | "USD";
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   // ACCOUNTING PRINCIPLES:
//   // - CREDIT = Money IN to account (balance increases) = GREEN
//   // - DEBIT = Money OUT from account (balance decreases) = RED
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Credit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
//   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [primaryAccountId, setPrimaryAccountId] = useState("");
//   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
//   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [counterAccountId, setCounterAccountId] = useState("");

//   // Search states
//   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
//   const [counterSearchTerm, setCounterSearchTerm] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000),
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         const clientAccounts: AccountOption[] = [];
//         clients.forEach((c) => {
//           // KES Account
//           clientAccounts.push({
//             id: `${c.id}_KES`,
//             name: `${c.name || c.fullName} (${c.code}) - KES`,
//             type: AccountType.Client,
//             currency: Currency.KES,
//             balance: c.balanceKES || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "KES",
//           });
//           // USD Account
//           clientAccounts.push({
//             id: `${c.id}_USD`,
//             name: `${c.name || c.fullName} (${c.code}) - USD`,
//             type: AccountType.Client,
//             currency: Currency.USD,
//             balance: c.balanceUSD || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "USD",
//           });
//         });
//         return clientAccounts;
//       default:
//         return [];
//     }
//   };

//   // Get filtered accounts based on search term
//   const getFilteredAccounts = (
//     type: AccountType,
//     searchTerm: string
//   ): AccountOption[] => {
//     const accounts = getAccountsByType(type);
//     if (!searchTerm.trim()) {
//       return accounts;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     return accounts.filter(
//       (account) =>
//         account.name.toLowerCase().includes(lowerSearch) ||
//         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
//         account.agentNumber?.toLowerCase().includes(lowerSearch)
//     );
//   };

//   // Memoized filtered accounts
//   const filteredPrimaryAccounts = useMemo(() => {
//     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
//   }, [
//     primaryAccountType,
//     primarySearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const filteredCounterAccounts = useMemo(() => {
//     return getFilteredAccounts(counterAccountType, counterSearchTerm);
//   }, [
//     counterAccountType,
//     counterSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Get actual client ID from composite ID
//   const getActualClientId = (compositeId: string): string => {
//     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
//       return compositeId.slice(0, -4);
//     }
//     return compositeId;
//   };

//   // Get counter account type based on payment method
//   const getCounterAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update counter account type when payment method changes
//   useEffect(() => {
//     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
//     setCounterAccountType(newCounterType);
//     setCounterAccountId("");
//     setCounterSearchTerm("");
//   }, [paymentMethod]);

//   // Reset search when primary account type changes
//   useEffect(() => {
//     setPrimarySearchTerm("");
//     setPrimaryAccountId("");
//   }, [primaryAccountType]);

//   // Get selected accounts
//   const primaryAccount = useMemo(() => {
//     return (
//       getAccountsByType(primaryAccountType).find(
//         (a) => a.id === primaryAccountId
//       ) || null
//     );
//   }, [
//     primaryAccountType,
//     primaryAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const counterAccount = useMemo(() => {
//     return (
//       getAccountsByType(counterAccountType).find(
//         (a) => a.id === counterAccountId
//       ) || null
//     );
//   }, [
//     counterAccountType,
//     counterAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // AUTO-SET CURRENCY based on counter account selection
//   useEffect(() => {
//     if (counterAccount) {
//       setCurrency(counterAccount.currency);
//     }
//   }, [counterAccount]);

//   // Check if exchange rate is needed (currencies differ)
//   const needsExchangeRate = (): boolean => {
//     if (!primaryAccount || !counterAccount) return false;
//     return primaryAccount.currency !== counterAccount.currency;
//   };

//   // Calculate converted amount for primary account
//   // Amount is entered in COUNTER account currency
//   // We need to calculate what goes to PRIMARY account
//   const getConvertedAmount = (): {
//     amount: number;
//     currency: Currency;
//   } | null => {
//     if (!needsExchangeRate()) return null;
//     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
//       return null;

//     const amountNum = parseFloat(amount);
//     const rateNum = parseFloat(exchangeRate);

//     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

//     // Counter account currency is what user enters
//     // Primary account currency is what we calculate
//     // Rate is always: 1 USD = X KES

//     if (
//       counterAccount.currency === Currency.USD &&
//       primaryAccount.currency === Currency.KES
//     ) {
//       // User enters USD, primary account is KES
//       // KES amount = USD * rate
//       return { amount: amountNum * rateNum, currency: Currency.KES };
//     } else if (
//       counterAccount.currency === Currency.KES &&
//       primaryAccount.currency === Currency.USD
//     ) {
//       // User enters KES, primary account is USD
//       // USD amount = KES / rate
//       return { amount: amountNum / rateNum, currency: Currency.USD };
//     }

//     return null;
//   };

//   const convertedAmount = getConvertedAmount();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!primaryAccountId) {
//         throw new Error(
//           `Please select an account to ${
//             transactionType === TransactionType.Credit ? "credit" : "debit"
//           }`
//         );
//       }
//       if (!counterAccountId) {
//         throw new Error("Please select a counter account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const actualPrimaryId =
//         primaryAccountType === AccountType.Client
//           ? getActualClientId(primaryAccountId)
//           : primaryAccountId;
//       const actualCounterId =
//         counterAccountType === AccountType.Client
//           ? getActualClientId(counterAccountId)
//           : counterAccountId;

//       // FOREX TRANSACTION LOGIC:
//       // - User enters amount in COUNTER account currency (e.g., KES 13,000 or USD 100)
//       // - COUNTER account is affected by ORIGINAL amount (what user entered)
//       // - PRIMARY account is affected by CONVERTED amount (using exchange rate)

//       const originalAmount = parseFloat(amount); // What user entered (counter currency)
//       let primaryAmount = originalAmount;
//       let primaryCurrency = primaryAccount?.currency || currency;
//       let counterCurrency = counterAccount?.currency || currency;

//       if (needsExchangeRate() && primaryAccount && counterAccount) {
//         const rateNum = parseFloat(exchangeRate);

//         if (
//           counterAccount.currency === Currency.USD &&
//           primaryAccount.currency === Currency.KES
//         ) {
//           // User entered USD, Primary is KES
//           // Primary gets: USD * rate = KES
//           primaryAmount = originalAmount * rateNum;
//         } else if (
//           counterAccount.currency === Currency.KES &&
//           primaryAccount.currency === Currency.USD
//         ) {
//           // User entered KES, Primary is USD
//           // Primary gets: KES / rate = USD
//           primaryAmount = originalAmount / rateNum;
//         }

//         primaryCurrency = primaryAccount.currency;
//         counterCurrency = counterAccount.currency;
//       }

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: primaryAccountType,
//         sourceAccountId: actualPrimaryId,
//         destAccountType: counterAccountType,
//         destAccountId: actualCounterId,
//         // Primary account: converted amount in primary currency
//         amount: primaryAmount,
//         currency: primaryCurrency,
//         // Counter account: original amount (add this field for backend)
//         counterAmount: originalAmount,
//         counterCurrency: counterCurrency,
//         // Exchange rate for reference
//         exchangeRate: needsExchangeRate()
//           ? parseFloat(exchangeRate)
//           : undefined,
//         paymentMethod: paymentMethod,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Credit ? "Credit" : "Debit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header - Credit=GREEN, Debit=RED */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Credit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Credit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {transactionType === TransactionType.Credit
//                   ? "Credit (Money In)"
//                   : "Debit (Money Out)"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {/* CREDIT = Money IN = GREEN */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               {/* DEBIT = Money OUT = RED */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Primary Account - Label changes based on transaction type */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               {transactionType === TransactionType.Credit
//                 ? "Select Account to Credit *"
//                 : "Select Account to Debit *"}
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={primaryAccountType}
//                 onChange={(e) => {
//                   setPrimaryAccountType(Number(e.target.value) as AccountType);
//                   setPrimaryAccountId("");
//                   setPrimarySearchTerm("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={primarySearchTerm}
//                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
//                   placeholder="Search..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>
//             <select
//               value={primaryAccountId}
//               onChange={(e) => setPrimaryAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">Select account...</option>
//               {filteredPrimaryAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {primaryAccountType === AccountType.Client &&
//               filteredPrimaryAccounts.length === 0 &&
//               primarySearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{primarySearchTerm}"
//                 </p>
//               )}
//             {primaryAccountType === AccountType.Client && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Counter Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Counter Account *
//                 </>
//               )}
//             </label>

//             {/* Search for counter account (only for Transfer) */}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={counterSearchTerm}
//                   onChange={(e) => setCounterSearchTerm(e.target.value)}
//                   placeholder="Search clients..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             )}

//             <select
//               value={counterAccountId}
//               onChange={(e) => setCounterAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {filteredCounterAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {paymentMethod === PaymentMethod.AccountTransfer &&
//               filteredCounterAccounts.length === 0 &&
//               counterSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{counterSearchTerm}"
//                 </p>
//               )}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount (
//                 {counterAccount
//                   ? getCurrencyLabel(counterAccount.currency)
//                   : "Select account"}
//                 ) *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency (Auto)
//               </label>
//               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
//                 {getCurrencyLabel(currency)}
//                 {counterAccount && (
//                   <span className="text-xs text-slate-500 ml-2">
//                     (from{" "}
//                     {paymentMethod === PaymentMethod.Cash
//                       ? "cash"
//                       : paymentMethod === PaymentMethod.Bank
//                       ? "bank"
//                       : paymentMethod === PaymentMethod.Mpesa
//                       ? "M-Pesa"
//                       : "counter"}{" "}
//                     account)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-3"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     {counterAccount?.name} (
//                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
//                     {primaryAccount?.name} (
//                     {getCurrencyLabel(primaryAccount?.currency!)})
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate (1 USD = ? KES) *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="e.g., 130.50"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               {/* Conversion Preview */}
//               {convertedAmount && amount && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
//                   <p className="text-xs font-bold text-blue-900 mb-1">
//                     Conversion Preview
//                   </p>
//                   <div className="text-sm text-blue-800">
//                     {counterAccount?.currency === Currency.USD ? (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">×</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">÷</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <p className="text-[10px] text-blue-600 mt-2">
//                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}{" "}
//                     will be{" "}
//                     {transactionType === TransactionType.Credit
//                       ? "credited to"
//                       : "debited from"}{" "}
//                     <strong>{primaryAccount?.name}</strong>
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes or reference details..."
//             />
//           </div>

//           {/* Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === TransactionType.Credit
//                 ? "bg-emerald-50 border-emerald-500"
//                 : "bg-red-50 border-red-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Transaction Summary
//             </h4>
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === TransactionType.Credit
//                       ? "text-emerald-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {transactionType === TransactionType.Credit
//                     ? "Credit (Money In)"
//                     : "Debit (Money Out)"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Account:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {primaryAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Via:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {counterAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               {convertedAmount && (
//                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
//                   <span className="text-slate-600">
//                     To {primaryAccount?.name?.split(" ")[0]}:
//                   </span>
//                   <span className="font-bold text-amber-600">
//                     {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Date:</span>
//                 <span className="font-bold text-slate-900">{dateValue}</span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === TransactionType.Credit
//                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Process ${
//                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
//               }`
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   CreditCard,
//   Smartphone,
//   ArrowLeftRight,
//   Calendar,
//   DollarSign,
//   FileText,
//   Building2,
//   User,
//   RefreshCw,
//   Loader2,
//   Search,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   createTransaction,
//   getBankAccounts,
//   getMpesaAgents,
//   getCashAccounts,
//   getClients,
//   TransactionType,
//   AccountType,
//   PaymentMethod,
//   Currency,
//   BankAccountDto,
//   MpesaAgentDto,
//   CashAccountDto,
//   ClientDto,
//   CreateTransactionDto,
//   getCurrencyLabel,
// } from "@/lib/api";

// interface TransactionFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// // Combined account interface for unified selection
// interface AccountOption {
//   id: string;
//   name: string;
//   type: AccountType;
//   currency: Currency;
//   balance: number;
//   isActive: boolean;
//   accountNumber?: string;
//   agentNumber?: string;
//   clientId?: string;
//   currencyType?: "KES" | "USD";
// }

// export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
//   // Form state
//   // ACCOUNTING PRINCIPLES:
//   // - CREDIT = Money IN to account (balance increases) = GREEN
//   // - DEBIT = Money OUT from account (balance decreases) = RED
//   const [transactionType, setTransactionType] = useState<TransactionType>(
//     TransactionType.Credit
//   );
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
//     PaymentMethod.Cash
//   );
//   const [currency, setCurrency] = useState<Currency>(Currency.KES);
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [dateValue, setDateValue] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Account selection
//   // "Primary Account" = The account being credited/debited (e.g., John's KES account)
//   const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
//     AccountType.Client
//   );
//   const [primaryAccountId, setPrimaryAccountId] = useState("");
//   // "Counter Account" = The other side (cash drawer, bank, mpesa, or another client)
//   const [counterAccountType, setCounterAccountType] = useState<AccountType>(
//     AccountType.Cash
//   );
//   const [counterAccountId, setCounterAccountId] = useState("");

//   // Search states
//   const [primarySearchTerm, setPrimarySearchTerm] = useState("");
//   const [counterSearchTerm, setCounterSearchTerm] = useState("");

//   // Data from API
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [clients, setClients] = useState<ClientDto[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all accounts on mount
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setIsLoading(true);
//       try {
//         const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
//           getCashAccounts(),
//           getBankAccounts(),
//           getMpesaAgents(),
//           getClients(1, 1000),
//         ]);

//         if (cashRes.success && cashRes.data) {
//           setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
//         }
//         if (bankRes.success && bankRes.data) {
//           setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
//         }
//         if (mpesaRes.success && mpesaRes.data) {
//           setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
//         }
//         if (clientRes.success && clientRes.data?.items) {
//           setClients(clientRes.data.items.filter((c) => c.isActive !== false));
//         }
//       } catch (error) {
//         console.error("Failed to fetch accounts:", error);
//         toast.error("Failed to load accounts");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // Get accounts by type for dropdown
//   const getAccountsByType = (type: AccountType): AccountOption[] => {
//     switch (type) {
//       case AccountType.Cash:
//         return cashAccounts.map((a) => ({
//           id: a.id,
//           name: a.name,
//           type: AccountType.Cash,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//         }));
//       case AccountType.Bank:
//         return bankAccounts.map((a) => ({
//           id: a.id,
//           name: `${a.bankName} - ${a.accountNumber}`,
//           type: AccountType.Bank,
//           currency: a.currency,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           accountNumber: a.accountNumber,
//         }));
//       case AccountType.Mpesa:
//         return mpesaAgents.map((a) => ({
//           id: a.id,
//           name: `${a.agentName} - ${a.agentNumber}`,
//           type: AccountType.Mpesa,
//           currency: Currency.KES,
//           balance: a.balance,
//           isActive: a.isActive !== false,
//           agentNumber: a.agentNumber,
//         }));
//       case AccountType.Client:
//         const clientAccounts: AccountOption[] = [];
//         clients.forEach((c) => {
//           // KES Account
//           clientAccounts.push({
//             id: `${c.id}_KES`,
//             name: `${c.name || c.fullName} (${c.code}) - KES`,
//             type: AccountType.Client,
//             currency: Currency.KES,
//             balance: c.balanceKES || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "KES",
//           });
//           // USD Account
//           clientAccounts.push({
//             id: `${c.id}_USD`,
//             name: `${c.name || c.fullName} (${c.code}) - USD`,
//             type: AccountType.Client,
//             currency: Currency.USD,
//             balance: c.balanceUSD || 0,
//             isActive: c.isActive !== false,
//             clientId: c.id,
//             currencyType: "USD",
//           });
//         });
//         return clientAccounts;
//       default:
//         return [];
//     }
//   };

//   // Get filtered accounts based on search term
//   const getFilteredAccounts = (
//     type: AccountType,
//     searchTerm: string
//   ): AccountOption[] => {
//     const accounts = getAccountsByType(type);
//     if (!searchTerm.trim()) {
//       return accounts;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     return accounts.filter(
//       (account) =>
//         account.name.toLowerCase().includes(lowerSearch) ||
//         account.accountNumber?.toLowerCase().includes(lowerSearch) ||
//         account.agentNumber?.toLowerCase().includes(lowerSearch)
//     );
//   };

//   // Memoized filtered accounts
//   const filteredPrimaryAccounts = useMemo(() => {
//     return getFilteredAccounts(primaryAccountType, primarySearchTerm);
//   }, [
//     primaryAccountType,
//     primarySearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const filteredCounterAccounts = useMemo(() => {
//     return getFilteredAccounts(counterAccountType, counterSearchTerm);
//   }, [
//     counterAccountType,
//     counterSearchTerm,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // Get actual client ID from composite ID
//   const getActualClientId = (compositeId: string): string => {
//     if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
//       return compositeId.slice(0, -4);
//     }
//     return compositeId;
//   };

//   // Get counter account type based on payment method
//   const getCounterAccountTypeFromPayment = (
//     method: PaymentMethod
//   ): AccountType => {
//     switch (method) {
//       case PaymentMethod.Cash:
//         return AccountType.Cash;
//       case PaymentMethod.Bank:
//         return AccountType.Bank;
//       case PaymentMethod.Mpesa:
//         return AccountType.Mpesa;
//       case PaymentMethod.AccountTransfer:
//         return AccountType.Client;
//       default:
//         return AccountType.Cash;
//     }
//   };

//   // Update counter account type when payment method changes
//   useEffect(() => {
//     const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
//     setCounterAccountType(newCounterType);
//     setCounterAccountId("");
//     setCounterSearchTerm("");
//   }, [paymentMethod]);

//   // Reset search when primary account type changes
//   useEffect(() => {
//     setPrimarySearchTerm("");
//     setPrimaryAccountId("");
//   }, [primaryAccountType]);

//   // Get selected accounts
//   const primaryAccount = useMemo(() => {
//     return (
//       getAccountsByType(primaryAccountType).find(
//         (a) => a.id === primaryAccountId
//       ) || null
//     );
//   }, [
//     primaryAccountType,
//     primaryAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   const counterAccount = useMemo(() => {
//     return (
//       getAccountsByType(counterAccountType).find(
//         (a) => a.id === counterAccountId
//       ) || null
//     );
//   }, [
//     counterAccountType,
//     counterAccountId,
//     clients,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   // AUTO-SET CURRENCY based on counter account selection
//   useEffect(() => {
//     if (counterAccount) {
//       setCurrency(counterAccount.currency);
//     }
//   }, [counterAccount]);

//   // Check if exchange rate is needed (currencies differ)
//   const needsExchangeRate = (): boolean => {
//     if (!primaryAccount || !counterAccount) return false;
//     return primaryAccount.currency !== counterAccount.currency;
//   };

//   // Calculate converted amount for primary account
//   // Amount is entered in COUNTER account currency
//   // We need to calculate what goes to PRIMARY account
//   const getConvertedAmount = (): {
//     amount: number;
//     currency: Currency;
//   } | null => {
//     if (!needsExchangeRate()) return null;
//     if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
//       return null;

//     const amountNum = parseFloat(amount);
//     const rateNum = parseFloat(exchangeRate);

//     if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

//     // Counter account currency is what user enters
//     // Primary account currency is what we calculate
//     // Rate is always: 1 USD = X KES

//     if (
//       counterAccount.currency === Currency.USD &&
//       primaryAccount.currency === Currency.KES
//     ) {
//       // User enters USD, primary account is KES
//       // KES amount = USD * rate
//       return { amount: amountNum * rateNum, currency: Currency.KES };
//     } else if (
//       counterAccount.currency === Currency.KES &&
//       primaryAccount.currency === Currency.USD
//     ) {
//       // User enters KES, primary account is USD
//       // USD amount = KES / rate
//       return { amount: amountNum / rateNum, currency: Currency.USD };
//     }

//     return null;
//   };

//   const convertedAmount = getConvertedAmount();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!primaryAccountId) {
//         throw new Error(
//           `Please select an account to ${
//             transactionType === TransactionType.Credit ? "credit" : "debit"
//           }`
//         );
//       }
//       if (!counterAccountId) {
//         throw new Error("Please select a counter account");
//       }
//       if (!amount || parseFloat(amount) <= 0) {
//         throw new Error("Please enter a valid amount greater than 0");
//       }
//       if (!description.trim()) {
//         throw new Error("Please enter a description");
//       }
//       if (
//         needsExchangeRate() &&
//         (!exchangeRate || parseFloat(exchangeRate) <= 0)
//       ) {
//         throw new Error("Please enter a valid exchange rate");
//       }

//       const actualPrimaryId =
//         primaryAccountType === AccountType.Client
//           ? getActualClientId(primaryAccountId)
//           : primaryAccountId;
//       const actualCounterId =
//         counterAccountType === AccountType.Client
//           ? getActualClientId(counterAccountId)
//           : counterAccountId;

//       // FOREX TRANSACTION LOGIC:
//       // - User enters amount in COUNTER account currency (e.g., KES 13,000 or USD 100)
//       // - COUNTER account is affected by ORIGINAL amount (what user entered)
//       // - PRIMARY account is affected by CONVERTED amount (using exchange rate)

//       const originalAmount = parseFloat(amount); // What user entered (counter currency)
//       let primaryAmount = originalAmount;
//       let primaryCurrency = primaryAccount?.currency || currency;
//       let counterCurrency = counterAccount?.currency || currency;

//       if (needsExchangeRate() && primaryAccount && counterAccount) {
//         const rateNum = parseFloat(exchangeRate);

//         if (
//           counterAccount.currency === Currency.USD &&
//           primaryAccount.currency === Currency.KES
//         ) {
//           // User entered USD, Primary is KES
//           // Primary gets: USD * rate = KES
//           primaryAmount = originalAmount * rateNum;
//         } else if (
//           counterAccount.currency === Currency.KES &&
//           primaryAccount.currency === Currency.USD
//         ) {
//           // User entered KES, Primary is USD
//           // Primary gets: KES / rate = USD
//           primaryAmount = originalAmount / rateNum;
//         }

//         primaryCurrency = primaryAccount.currency;
//         counterCurrency = counterAccount.currency;
//       }

//       // Determine if this is a forex transaction
//       const isForex = needsExchangeRate();

//       const payload: CreateTransactionDto = {
//         transactionType: transactionType,
//         sourceAccountType: primaryAccountType,
//         sourceAccountId: actualPrimaryId,
//         destAccountType: counterAccountType,
//         destAccountId: actualCounterId,
//         // Primary account: converted amount in primary currency
//         amount: primaryAmount,
//         currency: primaryCurrency,
//         // Counter account: original amount (only for forex transactions)
//         counterAmount: isForex ? originalAmount : undefined,
//         counterCurrency: isForex ? counterCurrency : undefined,
//         // Exchange rate for reference
//         exchangeRate: isForex ? parseFloat(exchangeRate) : undefined,
//         paymentMethod: paymentMethod,
//         description: description.trim(),
//         notes: notes.trim() || undefined,
//       };

//       console.log("Submitting transaction:", payload);

//       const result = await createTransaction(payload);

//       if (!result.success) {
//         throw new Error(result.message || "Failed to process transaction");
//       }

//       toast.success(
//         `✅ ${
//           transactionType === TransactionType.Credit ? "Credit" : "Debit"
//         } transaction completed! Code: ${result.data?.code || "N/A"}`,
//         { duration: 4000 }
//       );

//       if (onSuccess) {
//         onSuccess();
//       }
//       onClose();
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error(
//         `❌ Transaction failed: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { duration: 5000 }
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//         <div className="bg-white p-8 text-center">
//           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">Loading accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.97, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.97, y: 20 }}
//         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//         className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
//       >
//         {/* Header - Credit=GREEN, Debit=RED */}
//         <div
//           className={`relative p-5 bg-gradient-to-r ${
//             transactionType === TransactionType.Credit
//               ? "from-emerald-600 to-teal-600"
//               : "from-red-600 to-rose-600"
//           } text-white transition-all duration-300`}
//         >
//           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>

//           <div className="relative flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
//               {transactionType === TransactionType.Credit ? (
//                 <ArrowUpCircle className="w-5 h-5" />
//               ) : (
//                 <ArrowDownCircle className="w-5 h-5" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-lg font-bold">New Transaction</h2>
//               <p className="text-xs opacity-90">
//                 {transactionType === TransactionType.Credit
//                   ? "Credit (Money In)"
//                   : "Debit (Money Out)"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
//         >
//           {/* Transaction Type Toggle */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Transaction Type *
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               {/* CREDIT = Money IN = GREEN */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Credit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Credit
//                     ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
//                     : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Credit
//                         ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
//                         : "bg-slate-100 group-hover:bg-emerald-100"
//                     }`}
//                   >
//                     <ArrowUpCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Credit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Credit
//                           ? "text-emerald-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Credit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money In</div>
//                   </div>
//                 </div>
//               </button>

//               {/* DEBIT = Money OUT = RED */}
//               <button
//                 type="button"
//                 onClick={() => setTransactionType(TransactionType.Debit)}
//                 className={`group relative p-3 border-2 transition-all duration-200 ${
//                   transactionType === TransactionType.Debit
//                     ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
//                     : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className={`w-8 h-8 flex items-center justify-center transition-all ${
//                       transactionType === TransactionType.Debit
//                         ? "bg-red-500 shadow-lg shadow-red-500/30"
//                         : "bg-slate-100 group-hover:bg-red-100"
//                     }`}
//                   >
//                     <ArrowDownCircle
//                       className={`w-4 h-4 ${
//                         transactionType === TransactionType.Debit
//                           ? "text-white"
//                           : "text-slate-500"
//                       }`}
//                     />
//                   </div>
//                   <div className="text-left">
//                     <div
//                       className={`text-sm font-bold ${
//                         transactionType === TransactionType.Debit
//                           ? "text-red-700"
//                           : "text-slate-700"
//                       }`}
//                     >
//                       Debit
//                     </div>
//                     <div className="text-[10px] text-slate-500">Money Out</div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Primary Account - Label changes based on transaction type */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               <User className="w-3 h-3 inline mr-1" />
//               {transactionType === TransactionType.Credit
//                 ? "Select Account to Credit *"
//                 : "Select Account to Debit *"}
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <select
//                 value={primaryAccountType}
//                 onChange={(e) => {
//                   setPrimaryAccountType(Number(e.target.value) as AccountType);
//                   setPrimaryAccountId("");
//                   setPrimarySearchTerm("");
//                 }}
//                 className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               >
//                 <option value={AccountType.Client}>Client</option>
//                 <option value={AccountType.Cash}>Cash</option>
//                 <option value={AccountType.Bank}>Bank</option>
//                 <option value={AccountType.Mpesa}>M-Pesa</option>
//               </select>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={primarySearchTerm}
//                   onChange={(e) => setPrimarySearchTerm(e.target.value)}
//                   placeholder="Search..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none
//                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>
//             <select
//               value={primaryAccountId}
//               onChange={(e) => setPrimaryAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">Select account...</option>
//               {filteredPrimaryAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {primaryAccountType === AccountType.Client &&
//               filteredPrimaryAccounts.length === 0 &&
//               primarySearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{primarySearchTerm}"
//                 </p>
//               )}
//             {primaryAccountType === AccountType.Client && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
//               Payment Method *
//             </label>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Cash)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Cash
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Wallet
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Cash
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Cash
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Bank)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Bank
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <CreditCard
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Bank
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Bank
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.Mpesa
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <Smartphone
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.Mpesa
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   M-Pesa
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
//                 className={`group p-2.5 border-2 transition-all ${
//                   paymentMethod === PaymentMethod.AccountTransfer
//                     ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
//                     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
//                 }`}
//               >
//                 <ArrowLeftRight
//                   className={`w-5 h-5 mx-auto mb-1 ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-600"
//                       : "text-slate-400 group-hover:text-blue-500"
//                   }`}
//                 />
//                 <div
//                   className={`text-[10px] font-bold ${
//                     paymentMethod === PaymentMethod.AccountTransfer
//                       ? "text-blue-700"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   Transfer
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Counter Account Selection */}
//           <div className="space-y-2">
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
//               {paymentMethod === PaymentMethod.Cash && (
//                 <>
//                   <Wallet className="w-3 h-3 inline mr-1" />
//                   Cash Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Bank && (
//                 <>
//                   <Building2 className="w-3 h-3 inline mr-1" />
//                   Bank Account *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.Mpesa && (
//                 <>
//                   <Smartphone className="w-3 h-3 inline mr-1" />
//                   M-Pesa Agent *
//                 </>
//               )}
//               {paymentMethod === PaymentMethod.AccountTransfer && (
//                 <>
//                   <ArrowLeftRight className="w-3 h-3 inline mr-1" />
//                   Counter Account *
//                 </>
//               )}
//             </label>

//             {/* Search for counter account (only for Transfer) */}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   value={counterSearchTerm}
//                   onChange={(e) => setCounterSearchTerm(e.target.value)}
//                   placeholder="Search clients..."
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             )}

//             <select
//               value={counterAccountId}
//               onChange={(e) => setCounterAccountId(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
//               required
//             >
//               <option value="">
//                 Select{" "}
//                 {paymentMethod === PaymentMethod.Cash
//                   ? "cash account"
//                   : paymentMethod === PaymentMethod.Bank
//                   ? "bank"
//                   : paymentMethod === PaymentMethod.Mpesa
//                   ? "M-Pesa agent"
//                   : "account"}
//                 ...
//               </option>
//               {filteredCounterAccounts.map((account) => (
//                 <option key={account.id} value={account.id}>
//                   {account.name} - {getCurrencyLabel(account.currency)}{" "}
//                   {account.balance.toLocaleString()}
//                 </option>
//               ))}
//             </select>
//             {paymentMethod === PaymentMethod.AccountTransfer &&
//               filteredCounterAccounts.length === 0 &&
//               counterSearchTerm && (
//                 <p className="text-xs text-amber-600">
//                   No clients found matching "{counterSearchTerm}"
//                 </p>
//               )}
//             {paymentMethod === PaymentMethod.AccountTransfer && (
//               <p className="text-[10px] text-slate-500">
//                 💡 Each client has separate KES and USD accounts
//               </p>
//             )}
//           </div>

//           {/* Amount & Currency */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 <DollarSign className="w-3 h-3 inline mr-1" />
//                 Amount (
//                 {counterAccount
//                   ? getCurrencyLabel(counterAccount.currency)
//                   : "Select account"}
//                 ) *
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
//                 placeholder="0.00"
//                 step="0.01"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//                 Currency (Auto)
//               </label>
//               <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
//                 {getCurrencyLabel(currency)}
//                 {counterAccount && (
//                   <span className="text-xs text-slate-500 ml-2">
//                     (from{" "}
//                     {paymentMethod === PaymentMethod.Cash
//                       ? "cash"
//                       : paymentMethod === PaymentMethod.Bank
//                       ? "bank"
//                       : paymentMethod === PaymentMethod.Mpesa
//                       ? "M-Pesa"
//                       : "counter"}{" "}
//                     account)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Exchange Rate (if needed) */}
//           {needsExchangeRate() && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-3"
//             >
//               <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
//                 <RefreshCw
//                   className="w-4 h-4 text-amber-600 animate-spin"
//                   style={{ animationDuration: "3s" }}
//                 />
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-amber-900">
//                     Currency Exchange Required
//                   </p>
//                   <p className="text-[10px] text-amber-700">
//                     {counterAccount?.name} (
//                     {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
//                     {primaryAccount?.name} (
//                     {getCurrencyLabel(primaryAccount?.currency!)})
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
//                   <RefreshCw className="w-3 h-3 inline mr-1" />
//                   Exchange Rate (1 USD = ? KES) *
//                 </label>
//                 <input
//                   type="number"
//                   value={exchangeRate}
//                   onChange={(e) => setExchangeRate(e.target.value)}
//                   className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
//                   placeholder="e.g., 130.50"
//                   step="0.01"
//                   required
//                 />
//               </div>

//               {/* Conversion Preview */}
//               {convertedAmount && amount && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded">
//                   <p className="text-xs font-bold text-blue-900 mb-1">
//                     Conversion Preview
//                   </p>
//                   <div className="text-sm text-blue-800">
//                     {counterAccount?.currency === Currency.USD ? (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">×</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className="font-mono">
//                           {getCurrencyLabel(Currency.KES)}{" "}
//                           {parseFloat(amount).toLocaleString()}
//                         </span>
//                         <span className="mx-2">÷</span>
//                         <span className="font-mono">
//                           {parseFloat(exchangeRate).toLocaleString()}
//                         </span>
//                         <span className="mx-2">=</span>
//                         <span className="font-bold text-emerald-700">
//                           {getCurrencyLabel(Currency.USD)}{" "}
//                           {convertedAmount.amount.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <p className="text-[10px] text-blue-600 mt-2">
//                     💰 {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}{" "}
//                     will be{" "}
//                     {transactionType === TransactionType.Credit
//                       ? "credited to"
//                       : "debited from"}{" "}
//                     <strong>{primaryAccount?.name}</strong>
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <FileText className="w-3 h-3 inline mr-1" />
//               Description *
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
//               placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal..."
//               required
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               <Calendar className="w-3 h-3 inline mr-1" />
//               Transaction Date *
//             </label>
//             <input
//               type="date"
//               value={dateValue}
//               onChange={(e) => setDateValue(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
//               rows={2}
//               placeholder="Additional notes or reference details..."
//             />
//           </div>

//           {/* Summary */}
//           <div
//             className={`p-3 border-l-4 ${
//               transactionType === TransactionType.Credit
//                 ? "bg-emerald-50 border-emerald-500"
//                 : "bg-red-50 border-red-500"
//             }`}
//           >
//             <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
//               Transaction Summary
//             </h4>
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Type:</span>
//                 <span
//                   className={`font-bold ${
//                     transactionType === TransactionType.Credit
//                       ? "text-emerald-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {transactionType === TransactionType.Credit
//                     ? "Credit (Money In)"
//                     : "Debit (Money Out)"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Account:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {primaryAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Via:</span>
//                 <span className="font-bold text-slate-900 truncate max-w-[200px]">
//                   {counterAccount?.name || "Not selected"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Amount:</span>
//                 <span className="font-bold text-slate-900">
//                   {getCurrencyLabel(currency)} {amount || "0.00"}
//                 </span>
//               </div>
//               {convertedAmount && (
//                 <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
//                   <span className="text-slate-600">
//                     To {primaryAccount?.name?.split(" ")[0]}:
//                   </span>
//                   <span className="font-bold text-amber-600">
//                     {getCurrencyLabel(convertedAmount.currency)}{" "}
//                     {convertedAmount.amount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-slate-600">Date:</span>
//                 <span className="font-bold text-slate-900">{dateValue}</span>
//               </div>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
//               transactionType === TransactionType.Credit
//                 ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
//                 : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
//             } text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Process ${
//                 transactionType === TransactionType.Credit ? "Credit" : "Debit"
//               }`
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
  Smartphone,
  ArrowLeftRight,
  Calendar,
  DollarSign,
  FileText,
  Building2,
  User,
  RefreshCw,
  Loader2,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import {
  createTransaction,
  getBankAccounts,
  getMpesaAgents,
  getCashAccounts,
  getClients,
  TransactionType,
  AccountType,
  PaymentMethod,
  Currency,
  BankAccountDto,
  MpesaAgentDto,
  CashAccountDto,
  ClientDto,
  CreateTransactionDto,
  getCurrencyLabel,
} from "@/lib/api";

interface TransactionFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// Combined account interface for unified selection
interface AccountOption {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  isActive: boolean;
  accountNumber?: string;
  agentNumber?: string;
  clientId?: string;
  currencyType?: "KES" | "USD";
}

// ============================================================
// TRADITIONAL ACCOUNTING RULES
// ============================================================
// ASSET accounts (Cash, Bank, M-Pesa):
//   - DEBIT = Balance INCREASES (money comes IN)
//   - CREDIT = Balance DECREASES (money goes OUT)
//
// LIABILITY accounts (Client - we hold their money):
//   - DEBIT = Balance DECREASES (client withdraws)
//   - CREDIT = Balance INCREASES (client deposits)
// ============================================================

const isAssetAccount = (accountType: AccountType): boolean => {
  return (
    accountType === AccountType.Cash ||
    accountType === AccountType.Bank ||
    accountType === AccountType.Mpesa
  );
};

export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  // Form state
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.Credit
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Cash
  );
  const [currency, setCurrency] = useState<Currency>(Currency.KES);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [dateValue, setDateValue] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Account selection
  const [primaryAccountType, setPrimaryAccountType] = useState<AccountType>(
    AccountType.Client
  );
  const [primaryAccountId, setPrimaryAccountId] = useState("");
  const [counterAccountType, setCounterAccountType] = useState<AccountType>(
    AccountType.Cash
  );
  const [counterAccountId, setCounterAccountId] = useState("");

  // Search states
  const [primarySearchTerm, setPrimarySearchTerm] = useState("");
  const [counterSearchTerm, setCounterSearchTerm] = useState("");

  // Data from API
  const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
  const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================
  // DETERMINE BALANCE EFFECT
  // ============================================================
  // For ASSET accounts: Debit = Increase, Credit = Decrease
  // For LIABILITY (Client): Credit = Increase, Debit = Decrease
  const isBalanceIncrease = useMemo(() => {
    if (isAssetAccount(primaryAccountType)) {
      return transactionType === TransactionType.Debit;
    } else {
      return transactionType === TransactionType.Credit;
    }
  }, [primaryAccountType, transactionType]);

  // Fetch all accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const [cashRes, bankRes, mpesaRes, clientRes] = await Promise.all([
          getCashAccounts(),
          getBankAccounts(),
          getMpesaAgents(),
          getClients(1, 1000),
        ]);

        if (cashRes.success && cashRes.data) {
          setCashAccounts(cashRes.data.filter((a) => a.isActive !== false));
        }
        if (bankRes.success && bankRes.data) {
          setBankAccounts(bankRes.data.filter((a) => a.isActive !== false));
        }
        if (mpesaRes.success && mpesaRes.data) {
          setMpesaAgents(mpesaRes.data.filter((a) => a.isActive !== false));
        }
        if (clientRes.success && clientRes.data?.items) {
          setClients(clientRes.data.items.filter((c) => c.isActive !== false));
        }
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        toast.error("Failed to load accounts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Reset transaction type when primary account type changes
  // Default to the "increase" action for better UX
  useEffect(() => {
    if (isAssetAccount(primaryAccountType)) {
      setTransactionType(TransactionType.Debit); // Debit increases assets
    } else {
      setTransactionType(TransactionType.Credit); // Credit increases client balance
    }
  }, [primaryAccountType]);

  // Get accounts by type for dropdown
  const getAccountsByType = (type: AccountType): AccountOption[] => {
    switch (type) {
      case AccountType.Cash:
        return cashAccounts.map((a) => ({
          id: a.id,
          name: a.name || `Cash ${a.currency}`,
          type: AccountType.Cash,
          currency: a.currency,
          balance: a.balance,
          isActive: a.isActive !== false,
        }));
      case AccountType.Bank:
        return bankAccounts.map((a) => ({
          id: a.id,
          name: `${a.bankName} - ${a.accountNumber}`,
          type: AccountType.Bank,
          currency: a.currency,
          balance: a.balance,
          isActive: a.isActive !== false,
          accountNumber: a.accountNumber,
        }));
      case AccountType.Mpesa:
        return mpesaAgents.map((a) => ({
          id: a.id,
          name: `${a.agentName} - ${a.agentNumber}`,
          type: AccountType.Mpesa,
          currency: Currency.KES,
          balance: a.balance,
          isActive: a.isActive !== false,
          agentNumber: a.agentNumber,
        }));
      case AccountType.Client:
        const clientAccounts: AccountOption[] = [];
        clients.forEach((c) => {
          clientAccounts.push({
            id: `${c.id}_KES`,
            name: `${c.name || c.fullName} (${c.code}) - KES`,
            type: AccountType.Client,
            currency: Currency.KES,
            balance: c.balanceKES || 0,
            isActive: c.isActive !== false,
            clientId: c.id,
            currencyType: "KES",
          });
          clientAccounts.push({
            id: `${c.id}_USD`,
            name: `${c.name || c.fullName} (${c.code}) - USD`,
            type: AccountType.Client,
            currency: Currency.USD,
            balance: c.balanceUSD || 0,
            isActive: c.isActive !== false,
            clientId: c.id,
            currencyType: "USD",
          });
        });
        return clientAccounts;
      default:
        return [];
    }
  };

  // Get filtered accounts based on search term
  const getFilteredAccounts = (
    type: AccountType,
    searchTerm: string
  ): AccountOption[] => {
    const accounts = getAccountsByType(type);
    if (!searchTerm.trim()) {
      return accounts;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(lowerSearch) ||
        account.accountNumber?.toLowerCase().includes(lowerSearch) ||
        account.agentNumber?.toLowerCase().includes(lowerSearch)
    );
  };

  // Memoized filtered accounts
  const filteredPrimaryAccounts = useMemo(() => {
    return getFilteredAccounts(primaryAccountType, primarySearchTerm);
  }, [
    primaryAccountType,
    primarySearchTerm,
    clients,
    cashAccounts,
    bankAccounts,
    mpesaAgents,
  ]);

  const filteredCounterAccounts = useMemo(() => {
    const accounts = getFilteredAccounts(counterAccountType, counterSearchTerm);
    // Exclude the already-selected primary account if both account types are the same
    if (primaryAccountType === counterAccountType && primaryAccountId) {
      return accounts.filter((a) => a.id !== primaryAccountId);
    }
    return accounts;
  }, [
    counterAccountType,
    counterSearchTerm,
    clients,
    cashAccounts,
    bankAccounts,
    mpesaAgents,
    primaryAccountType,
    primaryAccountId,
  ]);

  // Get actual client ID from composite ID
  const getActualClientId = (compositeId: string): string => {
    if (compositeId.endsWith("_KES") || compositeId.endsWith("_USD")) {
      return compositeId.slice(0, -4);
    }
    return compositeId;
  };

  // Get counter account type based on payment method
  const getCounterAccountTypeFromPayment = (
    method: PaymentMethod
  ): AccountType => {
    switch (method) {
      case PaymentMethod.Cash:
        return AccountType.Cash;
      case PaymentMethod.Bank:
        return AccountType.Bank;
      case PaymentMethod.Mpesa:
        return AccountType.Mpesa;
      case PaymentMethod.AccountTransfer:
        return AccountType.Client;
      default:
        return AccountType.Cash;
    }
  };

  // Update counter account type when payment method changes
  useEffect(() => {
    const newCounterType = getCounterAccountTypeFromPayment(paymentMethod);
    setCounterAccountType(newCounterType);
    setCounterAccountId("");
    setCounterSearchTerm("");
  }, [paymentMethod]);

  // Clear counter account if it becomes the same as primary account
  useEffect(() => {
    if (
      primaryAccountType === counterAccountType &&
      primaryAccountId === counterAccountId &&
      primaryAccountId
    ) {
      setCounterAccountId("");
      setCounterSearchTerm("");
    }
  }, [primaryAccountId, primaryAccountType, counterAccountType]);

  // Reset search when primary account type changes
  useEffect(() => {
    setPrimarySearchTerm("");
    setPrimaryAccountId("");
  }, [primaryAccountType]);

  // Get selected accounts
  const primaryAccount = useMemo(() => {
    return (
      getAccountsByType(primaryAccountType).find(
        (a) => a.id === primaryAccountId
      ) || null
    );
  }, [
    primaryAccountType,
    primaryAccountId,
    clients,
    cashAccounts,
    bankAccounts,
    mpesaAgents,
  ]);

  const counterAccount = useMemo(() => {
    return (
      getAccountsByType(counterAccountType).find(
        (a) => a.id === counterAccountId
      ) || null
    );
  }, [
    counterAccountType,
    counterAccountId,
    clients,
    cashAccounts,
    bankAccounts,
    mpesaAgents,
  ]);

  // AUTO-SET CURRENCY based on counter account selection
  useEffect(() => {
    if (counterAccount) {
      setCurrency(counterAccount.currency);
    }
  }, [counterAccount]);

  // Check if exchange rate is needed (currencies differ)
  const needsExchangeRate = (): boolean => {
    if (!primaryAccount || !counterAccount) return false;
    return primaryAccount.currency !== counterAccount.currency;
  };

  // Calculate converted amount for primary account
  const getConvertedAmount = (): {
    amount: number;
    currency: Currency;
  } | null => {
    if (!needsExchangeRate()) return null;
    if (!amount || !exchangeRate || !primaryAccount || !counterAccount)
      return null;

    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(exchangeRate);

    if (isNaN(amountNum) || isNaN(rateNum) || rateNum <= 0) return null;

    if (
      counterAccount.currency === Currency.USD &&
      primaryAccount.currency === Currency.KES
    ) {
      return { amount: amountNum * rateNum, currency: Currency.KES };
    } else if (
      counterAccount.currency === Currency.KES &&
      primaryAccount.currency === Currency.USD
    ) {
      return { amount: amountNum / rateNum, currency: Currency.USD };
    }

    return null;
  };

  const convertedAmount = getConvertedAmount();

  // ============================================================
  // GET USER-FRIENDLY LABELS BASED ON ACCOUNT TYPE
  // ============================================================
  const getActionLabels = () => {
    if (isAssetAccount(primaryAccountType)) {
      // For ASSET accounts: Debit = IN (green), Credit = OUT (red)
      return {
        increase: {
          label: "Receive",
          description: "Money In (Debit)",
          type: TransactionType.Debit,
          icon: Plus,
          colorClass: "emerald",
        },
        decrease: {
          label: "Pay Out",
          description: "Money Out (Credit)",
          type: TransactionType.Credit,
          icon: Minus,
          colorClass: "red",
        },
      };
    } else {
      // For CLIENT accounts: Credit = deposit (green), Debit = withdraw (red)
      return {
        increase: {
          label: "Deposit",
          description: "Client Deposit (Credit)",
          type: TransactionType.Credit,
          icon: Plus,
          colorClass: "emerald",
        },
        decrease: {
          label: "Withdraw",
          description: "Client Withdrawal (Debit)",
          type: TransactionType.Debit,
          icon: Minus,
          colorClass: "red",
        },
      };
    }
  };

  const actionLabels = getActionLabels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!primaryAccountId) {
        throw new Error("Please select an account");
      }
      if (!counterAccountId) {
        throw new Error("Please select a counter account");
      }

      // Prevent selecting the same account on both sides
      if (
        primaryAccountType === counterAccountType &&
        primaryAccountId === counterAccountId
      ) {
        throw new Error(
          "Cannot select the same account on both sides. Please choose different accounts."
        );
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }
      if (!description.trim()) {
        throw new Error("Please enter a description");
      }
      if (
        needsExchangeRate() &&
        (!exchangeRate || parseFloat(exchangeRate) <= 0)
      ) {
        throw new Error("Please enter a valid exchange rate");
      }

      const actualPrimaryId =
        primaryAccountType === AccountType.Client
          ? getActualClientId(primaryAccountId)
          : primaryAccountId;
      const actualCounterId =
        counterAccountType === AccountType.Client
          ? getActualClientId(counterAccountId)
          : counterAccountId;

      const originalAmount = parseFloat(amount);
      let primaryAmount = originalAmount;
      let primaryCurrency = primaryAccount?.currency || currency;
      let counterCurrency = counterAccount?.currency || currency;

      if (needsExchangeRate() && primaryAccount && counterAccount) {
        const rateNum = parseFloat(exchangeRate);

        if (
          counterAccount.currency === Currency.USD &&
          primaryAccount.currency === Currency.KES
        ) {
          primaryAmount = originalAmount * rateNum;
        } else if (
          counterAccount.currency === Currency.KES &&
          primaryAccount.currency === Currency.USD
        ) {
          primaryAmount = originalAmount / rateNum;
        }

        primaryCurrency = primaryAccount.currency;
        counterCurrency = counterAccount.currency;
      }

      const isForex = needsExchangeRate();

      const payload: CreateTransactionDto = {
        transactionType: transactionType,
        sourceAccountType: primaryAccountType,
        sourceAccountId: actualPrimaryId,
        destAccountType: counterAccountType,
        destAccountId: actualCounterId,
        amount: primaryAmount,
        currency: primaryCurrency,
        counterAmount: isForex ? originalAmount : undefined,
        counterCurrency: isForex ? counterCurrency : undefined,
        exchangeRate: isForex ? parseFloat(exchangeRate) : undefined,
        paymentMethod: paymentMethod,
        description: description.trim(),
        notes: notes.trim() || undefined,
      };

      console.log("Submitting transaction:", payload);

      const result = await createTransaction(payload);

      if (!result.success) {
        throw new Error(result.message || "Failed to process transaction");
      }

      const actionText = isBalanceIncrease
        ? isAssetAccount(primaryAccountType)
          ? "Received"
          : "Deposited"
        : isAssetAccount(primaryAccountType)
        ? "Paid out"
        : "Withdrawn";

      toast.success(
        `✅ ${actionText} successfully! Code: ${result.data?.code || "N/A"}`,
        { duration: 4000 }
      );

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error(
        `❌ Transaction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading accounts...</p>
        </div>
      </div>
    );
  }

  // Dynamic colors based on balance effect
  const headerGradient = isBalanceIncrease
    ? "from-emerald-600 to-teal-600"
    : "from-red-600 to-rose-600";

  const buttonGradient = isBalanceIncrease
    ? "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
    : "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30";

  const summaryBorderColor = isBalanceIncrease
    ? "bg-emerald-50 border-emerald-500"
    : "bg-red-50 border-red-500";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
      >
        {/* Header - Color based on balance effect */}
        <div
          className={`relative p-5 bg-gradient-to-r ${headerGradient} text-white transition-all duration-300`}
        >
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
              {isBalanceIncrease ? (
                <ArrowUpCircle className="w-5 h-5" />
              ) : (
                <ArrowDownCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">New Transaction</h2>
              <p className="text-xs opacity-90">
                {isBalanceIncrease ? "Balance Increase" : "Balance Decrease"} •{" "}
                {transactionType === TransactionType.Debit ? "Debit" : "Credit"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          {/* Primary Account Selection FIRST */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              <User className="w-3 h-3 inline mr-1" />
              Select Account *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={primaryAccountType}
                onChange={(e) => {
                  setPrimaryAccountType(Number(e.target.value) as AccountType);
                  setPrimaryAccountId("");
                  setPrimarySearchTerm("");
                }}
                className="px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
              >
                <option value={AccountType.Client}>Client</option>
                <option value={AccountType.Cash}>Cash</option>
                <option value={AccountType.Bank}>Bank</option>
                <option value={AccountType.Mpesa}>M-Pesa</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={primarySearchTerm}
                  onChange={(e) => setPrimarySearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <select
              value={primaryAccountId}
              onChange={(e) => setPrimaryAccountId(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
              required
            >
              <option value="">Select account...</option>
              {filteredPrimaryAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {getCurrencyLabel(account.currency)}{" "}
                  {account.balance.toLocaleString()}
                </option>
              ))}
            </select>
            {primaryAccountType === AccountType.Client &&
              filteredPrimaryAccounts.length === 0 &&
              primarySearchTerm && (
                <p className="text-xs text-amber-600">
                  No clients found matching "{primarySearchTerm}"
                </p>
              )}
            {primaryAccountType === AccountType.Client && (
              <p className="text-[10px] text-slate-500">
                💡 Each client has separate KES and USD accounts
              </p>
            )}
          </div>

          {/* Transaction Type Toggle - DYNAMIC based on account type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* INCREASE Button (Green) */}
              <button
                type="button"
                onClick={() => setTransactionType(actionLabels.increase.type)}
                className={`group relative p-3 border-2 transition-all duration-200 ${
                  isBalanceIncrease
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 flex items-center justify-center transition-all ${
                      isBalanceIncrease
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                        : "bg-slate-100 group-hover:bg-emerald-100"
                    }`}
                  >
                    <Plus
                      className={`w-4 h-4 ${
                        isBalanceIncrease ? "text-white" : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-sm font-bold ${
                        isBalanceIncrease
                          ? "text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      {actionLabels.increase.label}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {actionLabels.increase.description}
                    </div>
                  </div>
                </div>
                <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-400">
                  {actionLabels.increase.type === TransactionType.Debit
                    ? "DR"
                    : "CR"}
                </div>
              </button>

              {/* DECREASE Button (Red) */}
              <button
                type="button"
                onClick={() => setTransactionType(actionLabels.decrease.type)}
                className={`group relative p-3 border-2 transition-all duration-200 ${
                  !isBalanceIncrease
                    ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
                    : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 flex items-center justify-center transition-all ${
                      !isBalanceIncrease
                        ? "bg-red-500 shadow-lg shadow-red-500/30"
                        : "bg-slate-100 group-hover:bg-red-100"
                    }`}
                  >
                    <Minus
                      className={`w-4 h-4 ${
                        !isBalanceIncrease ? "text-white" : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-sm font-bold ${
                        !isBalanceIncrease ? "text-red-700" : "text-slate-700"
                      }`}
                    >
                      {actionLabels.decrease.label}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {actionLabels.decrease.description}
                    </div>
                  </div>
                </div>
                <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-400">
                  {actionLabels.decrease.type === TransactionType.Debit
                    ? "DR"
                    : "CR"}
                </div>
              </button>
            </div>

            {/* Accounting hint */}
            <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded">
              <p className="text-[10px] text-slate-600 flex items-center gap-1">
                <span>📚</span>
                <span>
                  {isAssetAccount(primaryAccountType) ? (
                    <>
                      <strong>Asset account:</strong> Debit = Balance ↑
                      (increase), Credit = Balance ↓ (decrease)
                    </>
                  ) : (
                    <>
                      <strong>Client account:</strong> Credit = Balance ↑
                      (deposit), Debit = Balance ↓ (withdraw)
                    </>
                  )}
                </span>
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
              Via (Counter Account) *
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.Cash)}
                className={`group p-2.5 border-2 transition-all ${
                  paymentMethod === PaymentMethod.Cash
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <Wallet
                  className={`w-5 h-5 mx-auto mb-1 ${
                    paymentMethod === PaymentMethod.Cash
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    paymentMethod === PaymentMethod.Cash
                      ? "text-blue-700"
                      : "text-slate-600"
                  }`}
                >
                  Cash
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.Bank)}
                className={`group p-2.5 border-2 transition-all ${
                  paymentMethod === PaymentMethod.Bank
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <CreditCard
                  className={`w-5 h-5 mx-auto mb-1 ${
                    paymentMethod === PaymentMethod.Bank
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    paymentMethod === PaymentMethod.Bank
                      ? "text-blue-700"
                      : "text-slate-600"
                  }`}
                >
                  Bank
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.Mpesa)}
                className={`group p-2.5 border-2 transition-all ${
                  paymentMethod === PaymentMethod.Mpesa
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <Smartphone
                  className={`w-5 h-5 mx-auto mb-1 ${
                    paymentMethod === PaymentMethod.Mpesa
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    paymentMethod === PaymentMethod.Mpesa
                      ? "text-blue-700"
                      : "text-slate-600"
                  }`}
                >
                  M-Pesa
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.AccountTransfer)}
                className={`group p-2.5 border-2 transition-all ${
                  paymentMethod === PaymentMethod.AccountTransfer
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <ArrowLeftRight
                  className={`w-5 h-5 mx-auto mb-1 ${
                    paymentMethod === PaymentMethod.AccountTransfer
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    paymentMethod === PaymentMethod.AccountTransfer
                      ? "text-blue-700"
                      : "text-slate-600"
                  }`}
                >
                  Transfer
                </div>
              </button>
            </div>
          </div>

          {/* Counter Account Selection */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              {paymentMethod === PaymentMethod.Cash && (
                <>
                  <Wallet className="w-3 h-3 inline mr-1" />
                  Cash Account *
                </>
              )}
              {paymentMethod === PaymentMethod.Bank && (
                <>
                  <Building2 className="w-3 h-3 inline mr-1" />
                  Bank Account *
                </>
              )}
              {paymentMethod === PaymentMethod.Mpesa && (
                <>
                  <Smartphone className="w-3 h-3 inline mr-1" />
                  M-Pesa Agent *
                </>
              )}
              {paymentMethod === PaymentMethod.AccountTransfer && (
                <>
                  <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                  Counter Account *
                </>
              )}
            </label>

            {paymentMethod === PaymentMethod.AccountTransfer && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={counterSearchTerm}
                  onChange={(e) => setCounterSearchTerm(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            )}

            <select
              value={counterAccountId}
              onChange={(e) => setCounterAccountId(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm"
              required
            >
              <option value="">
                Select{" "}
                {paymentMethod === PaymentMethod.Cash
                  ? "cash account"
                  : paymentMethod === PaymentMethod.Bank
                  ? "bank"
                  : paymentMethod === PaymentMethod.Mpesa
                  ? "M-Pesa agent"
                  : "account"}
                ...
              </option>
              {filteredCounterAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {getCurrencyLabel(account.currency)}{" "}
                  {account.balance.toLocaleString()}
                </option>
              ))}
            </select>
            {paymentMethod === PaymentMethod.AccountTransfer &&
              filteredCounterAccounts.length === 0 &&
              counterSearchTerm && (
                <p className="text-xs text-amber-600">
                  No clients found matching "{counterSearchTerm}"
                </p>
              )}
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <DollarSign className="w-3 h-3 inline mr-1" />
                Amount (
                {counterAccount
                  ? getCurrencyLabel(counterAccount.currency)
                  : "Select account"}
                ) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Currency (Auto)
              </label>
              <div className="px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm">
                {getCurrencyLabel(currency)}
              </div>
            </div>
          </div>

          {/* Exchange Rate (if needed) */}
          {needsExchangeRate() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
                <RefreshCw
                  className="w-4 h-4 text-amber-600 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-900">
                    Currency Exchange Required
                  </p>
                  <p className="text-[10px] text-amber-700">
                    {counterAccount?.name} (
                    {getCurrencyLabel(counterAccount?.currency!)}) →{" "}
                    {primaryAccount?.name} (
                    {getCurrencyLabel(primaryAccount?.currency!)})
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  Exchange Rate (1 USD = ? KES) *
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm"
                  placeholder="e.g., 130.50"
                  step="0.01"
                  required
                />
              </div>

              {convertedAmount && amount && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-bold text-blue-900 mb-1">
                    Conversion Preview
                  </p>
                  <div className="text-sm text-blue-800">
                    {counterAccount?.currency === Currency.USD ? (
                      <>
                        <span className="font-mono">
                          {getCurrencyLabel(Currency.USD)}{" "}
                          {parseFloat(amount).toLocaleString()}
                        </span>
                        <span className="mx-2">×</span>
                        <span className="font-mono">
                          {parseFloat(exchangeRate).toLocaleString()}
                        </span>
                        <span className="mx-2">=</span>
                        <span className="font-bold text-emerald-700">
                          {getCurrencyLabel(Currency.KES)}{" "}
                          {convertedAmount.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono">
                          {getCurrencyLabel(Currency.KES)}{" "}
                          {parseFloat(amount).toLocaleString()}
                        </span>
                        <span className="mx-2">÷</span>
                        <span className="font-mono">
                          {parseFloat(exchangeRate).toLocaleString()}
                        </span>
                        <span className="mx-2">=</span>
                        <span className="font-bold text-emerald-700">
                          {getCurrencyLabel(Currency.USD)}{" "}
                          {convertedAmount.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              <FileText className="w-3 h-3 inline mr-1" />
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
              placeholder="e.g., Client deposit, Cash receipt, Bank transfer..."
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              <Calendar className="w-3 h-3 inline mr-1" />
              Transaction Date *
            </label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          {/* Summary */}
          <div className={`p-3 border-l-4 ${summaryBorderColor}`}>
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Transaction Summary
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Action:</span>
                <span
                  className={`font-bold ${
                    isBalanceIncrease ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isBalanceIncrease
                    ? actionLabels.increase.label
                    : actionLabels.decrease.label}{" "}
                  ({transactionType === TransactionType.Debit ? "DR" : "CR"})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Account:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">
                  {primaryAccount?.name || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Via:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">
                  {counterAccount?.name || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount:</span>
                <span className="font-bold text-slate-900">
                  {getCurrencyLabel(currency)} {amount || "0.00"}
                </span>
              </div>
              {convertedAmount && (
                <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
                  <span className="text-slate-600">Converted:</span>
                  <span className="font-bold text-amber-600">
                    {getCurrencyLabel(convertedAmount.currency)}{" "}
                    {convertedAmount.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Balance Effect:</span>
                <span
                  className={`font-bold ${
                    isBalanceIncrease ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isBalanceIncrease ? "↑ Increase" : "↓ Decrease"}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${buttonGradient} text-white font-bold text-sm transition-all shadow-md disabled:opacity-50`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Processing...
              </>
            ) : (
              <>
                {isBalanceIncrease ? (
                  <Plus className="w-4 h-4 inline mr-1" />
                ) : (
                  <Minus className="w-4 h-4 inline mr-1" />
                )}
                {isBalanceIncrease
                  ? actionLabels.increase.label
                  : actionLabels.decrease.label}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
