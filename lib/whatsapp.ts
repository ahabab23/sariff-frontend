// ============================================================
// WhatsApp Deep Link Utility for SARIFF Web Frontend
// ============================================================

/**
 * Format phone number for wa.me link
 */
const formatPhone = (phone: string): string => {
  let clean = phone.replace(/[\s\-\(\)]/g, "");
  if (clean.startsWith("+")) clean = clean.slice(1);
  if (clean.startsWith("0") && clean.length === 10) clean = "254" + clean.slice(1);
  return clean;
};

/**
 * Open WhatsApp with pre-filled message
 */
export const shareViaWhatsApp = (phone: string, message: string): void => {
  const formatted = formatPhone(phone);
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${formatted}?text=${encoded}`, "_blank");
};

/**
 * Copy message to clipboard (fallback)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// ==================== MESSAGE TEMPLATES ====================

export const buildCredentialMessage = (opts: {
  role: "office" | "client";
  fullName: string;
  code: string;
  password: string;
  companyName?: string;
}): string => {
  const { role, fullName, code, password, companyName } = opts;
  if (role === "office") {
    return (
      `*Welcome to ${companyName || "SARIFF"} Bureau!* 🏦\n\n` +
      `Hi ${fullName},\n\n` +
      `Your office account has been created.\n\n` +
      `*Login Code:* ${code}\n` +
      `*Password:* ${password}\n\n` +
      `Please change your password after first login.\n` +
      `If you have any questions, contact your administrator.`
    );
  }
  return (
    `*Welcome to ${companyName || "SARIFF"}!* 🏦\n\n` +
    `Hi ${fullName},\n\n` +
    `Your account has been created.\n\n` +
    `*Login Code:* ${code}\n` +
    `*Password:* ${password}\n\n` +
    `📱 Download the SARIFF app and login to view your account balance, statements, and transaction history.\n\n` +
    `Please change your password after first login.`
  );
};

export const buildPasswordResetMessage = (opts: {
  fullName: string;
  code: string;
  newPassword: string;
}): string => {
  return (
    `*Password Reset* 🔐\n\n` +
    `Hi ${opts.fullName},\n\n` +
    `Your password has been reset.\n\n` +
    `*Login Code:* ${opts.code}\n` +
    `*New Password:* ${opts.newPassword}\n\n` +
    `Please change your password after login.`
  );
};

export const buildTransactionMessage = (opts: {
  clientName: string;
  type: "Credit" | "Debit";
  amount: string;
  currency: string;
  balance: string;
  code: string;
  description: string;
  date: string;
}): string => {
  const { clientName, type, amount, currency, balance, code, description, date } = opts;
  const action = type === "Credit" ? "credited to" : "debited from";
  const emoji = type === "Credit" ? "✅" : "📤";
  const balanceLine = balance.includes('|') ? `*New Balance:* ${balance}` : `*New Balance:* ${currency} ${balance}`;
  return (
    `${emoji} *Transaction Confirmation*\n\n` +
    `Hi ${clientName},\n\n` +
    `${currency} ${amount} has been ${action} your account.\n\n` +
    `*Reference:* ${code}\n` +
    `*Description:* ${description}\n` +
    `${balanceLine}\n` +
    `*Date:* ${date}\n\n` +
    `Thank you for choosing SARIFF.`
  );
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
}): string => {
  return (
    `💱 *Exchange Confirmation*\n\n` +
    `Hi ${opts.clientName},\n\n` +
    `Your exchange has been completed.\n\n` +
    `*Direction:* ${opts.direction}\n` +
    `*Given:* ${opts.currencyGiven} ${opts.amountGiven}\n` +
    `*Received:* ${opts.currencyReceived} ${opts.amountReceived}\n` +
    `*Rate:* ${opts.rate}\n` +
    `*Reference:* ${opts.code}\n` +
    `*Date:* ${opts.date}\n\n` +
    `Thank you for choosing SARIFF.`
  );
};
