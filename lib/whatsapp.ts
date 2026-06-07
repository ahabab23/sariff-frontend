const formatPhone = (phone: string): string => {
  let clean = phone.replace(/[\s\-\(\)]/g, "");
  if (clean.startsWith("+")) clean = clean.slice(1);
  if (clean.startsWith("0") && clean.length === 10)
    clean = "254" + clean.slice(1);
  return clean;
};

export const shareViaWhatsApp = (phone: string, message: string): void => {
  window.open(
    `https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`,
    "_blank",
  );
};

export const buildCredentialMessage = (opts: {
  role: "office" | "client";
  fullName: string;
  code: string;
  password: string;
  companyName?: string;
}) => {
  const { role, fullName, code, password, companyName } = opts;
  if (role === "office") {
    return `*Welcome to ${companyName || "SARIFF"} Bureau!* 🏦\n\nHi ${fullName},\n\nYour office account has been created.\n\n*Login Code:* ${code}\n*Password:* ${password}\n\nPlease change your password after first login.`;
  }
  return `*Welcome to ${companyName || "SARIFF"}!* 🏦\n\nHi ${fullName},\n\nYour account has been created.\n\n*Login Code:* ${code}\n*Password:* ${password}\n\n📱 Download the SARIFF app to view your balance, statements, and transaction history.\n\nPlease change your password after first login.`;
};

export const buildTransactionMessage = (opts: {
  clientName: string;
  type: "Credit" | "Debit";
  amount: string;
  currency: string;
  balanceKES: string;
  balanceUSD: string;
  code: string;
  description: string;
  date: string;
}) => {
  const {
    clientName,
    type,
    amount,
    currency,
    balanceKES,
    balanceUSD,
    code,
    description,
    date,
  } = opts;
  const action = type === "Credit" ? "credited to" : "debited from";
  const emoji = type === "Credit" ? "✅" : "📤";
  return `${emoji} *Transaction Confirmation*\n\nHi ${clientName},\n\n${currency} ${amount} has been ${action} your account.\n\n*Reference:* ${code}\n*Description:* ${description}\n*KES Balance:* KES ${balanceKES}\n*USD Balance:* USD ${balanceUSD}\n*Date:* ${date}\n\nThank you for choosing SARIFF.`;
};

export const buildExchangeMessage = (opts: {
  clientName: string;
  direction: string;
  amountGiven: string;
  currencyGiven: string;
  amountReceived: string;
  currencyReceived: string;
  rate: string;
  code: string;
  date: string;
}) => {
  return `💱 *Exchange Confirmation*\n\nHi ${opts.clientName},\n\nYour exchange has been completed.\n\n*Direction:* ${opts.direction}\n*Given:* ${opts.currencyGiven} ${opts.amountGiven}\n*Received:* ${opts.currencyReceived} ${opts.amountReceived}\n*Rate:* ${opts.rate}\n*Reference:* ${opts.code}\n*Date:* ${opts.date}\n\nThank you for choosing SARIFF.`;
};

export const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
