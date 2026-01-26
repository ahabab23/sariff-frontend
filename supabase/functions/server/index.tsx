import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(prefix: string, counter: number): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(counter).padStart(4, '0')}`;
}

async function getNextId(counterKey: string, prefix: string): Promise<string> {
  let counter = await kv.get(counterKey) || 0;
  counter++;
  await kv.set(counterKey, counter);
  return generateId(prefix, counter);
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/make-server-32ed8237/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// INITIALIZATION
// ============================================

app.post("/make-server-32ed8237/initialize", async (c) => {
  try {
    // Initialize counters
    await kv.set('counter:account', 100);
    await kv.set('counter:bank', 10);
    await kv.set('counter:agent', 10);
    await kv.set('counter:client', 10);
    await kv.set('counter:transaction', 0);
    await kv.set('counter:invoice', 0);

    // Initialize Accounts with timestamps
    const now = new Date().toISOString();
    const accounts = [
      { 
        id: 'ACC-2026-0001', 
        name: 'Cash at Hand - KES', 
        type: 'Cash', 
        currency: 'KES', 
        balance: 500000.00,
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0002', 
        name: 'Cash at Hand - USD', 
        type: 'Cash', 
        currency: 'USD', 
        balance: 5000.00,
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0003', 
        name: 'Exchange Account - KES', 
        type: 'Exchange', 
        currency: 'KES', 
        balance: 2000000.00,
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0004', 
        name: 'Exchange Account - USD', 
        type: 'Exchange', 
        currency: 'USD', 
        balance: 15000.00,
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0005', 
        name: 'John Kamau', 
        type: 'Client', 
        currency: 'KES', 
        balance: 125000.00,
        email: 'john.kamau@example.com',
        phone: '+254700123456',
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0006', 
        name: 'Sarah Wanjiku', 
        type: 'Client', 
        currency: 'USD', 
        balance: 850.00,
        email: 'sarah.w@example.com',
        phone: '+254700234567',
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0007', 
        name: 'Walk-in Holding - KES', 
        type: 'Walk-in', 
        currency: 'KES', 
        balance: 50000.00,
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'ACC-2026-0008', 
        name: 'Walk-in Holding - USD', 
        type: 'Walk-in', 
        currency: 'USD', 
        balance: 500.00,
        createdAt: now,
        updatedAt: now
      },
    ];

    // Initialize Banks
    const banks = [
      { 
        id: 'BNK-2026-0001', 
        name: 'Equity Bank', 
        accountName: 'Sarif Exchange - Operating',
        accountNumber: '0123456789', 
        currency: 'KES', 
        balance: 1500000.00,
        branch: 'Nairobi Central',
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'BNK-2026-0002', 
        name: 'KCB Bank', 
        accountName: 'Sarif Exchange - Reserve',
        accountNumber: '9876543210', 
        currency: 'KES', 
        balance: 800000.00,
        branch: 'Westlands',
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'BNK-2026-0003', 
        name: 'NCBA Bank', 
        accountName: 'Sarif Exchange - USD',
        accountNumber: '5551234567', 
        currency: 'USD', 
        balance: 10000.00,
        branch: 'CBD',
        createdAt: now,
        updatedAt: now
      },
    ];

    // Initialize M-Pesa Agents
    const agents = [
      { 
        id: 'AGT-2026-0001', 
        name: 'Safaricom M-Pesa - Downtown', 
        phoneNumber: '254123456789',
        tillNumber: '123456',
        currency: 'KES', 
        balance: 150000.00,
        location: 'Downtown Plaza',
        createdAt: now,
        updatedAt: now
      },
      { 
        id: 'AGT-2026-0002', 
        name: 'Safaricom M-Pesa - Westlands', 
        phoneNumber: '254234567890',
        tillNumber: '234567',
        currency: 'KES', 
        balance: 200000.00,
        location: 'Westlands Mall',
        createdAt: now,
        updatedAt: now
      },
    ];

    // Save to KV store
    for (const account of accounts) {
      await kv.set(`account:${account.id}`, account);
    }
    for (const bank of banks) {
      await kv.set(`bank:${bank.id}`, bank);
    }
    for (const agent of agents) {
      await kv.set(`agent:${agent.id}`, agent);
    }

    return c.json({ 
      success: true, 
      message: 'System initialized successfully',
      counts: {
        accounts: accounts.length,
        banks: banks.length,
        agents: agents.length
      }
    });
  } catch (error) {
    console.error('Error initializing data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// ACCOUNTS - CRUD OPERATIONS
// ============================================

// GET all accounts
app.get("/make-server-32ed8237/accounts", async (c) => {
  try {
    const accounts = await kv.getByPrefix('account:');
    return c.json({ success: true, accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// GET single account
app.get("/make-server-32ed8237/accounts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const account = await kv.get(`account:${id}`);
    
    if (!account) {
      return c.json({ success: false, error: 'Account not found' }, 404);
    }
    
    return c.json({ success: true, account });
  } catch (error) {
    console.error('Error fetching account:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// CREATE account
app.post("/make-server-32ed8237/accounts", async (c) => {
  try {
    const body = await c.req.json();
    const { name, type, currency, balance, email, phone } = body;

    // Validation
    if (!name || !type || !currency) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: name, type, currency' 
      }, 400);
    }

    // Generate ID
    const id = await getNextId('counter:account', 'ACC');

    const now = new Date().toISOString();
    const account = {
      id,
      name,
      type,
      currency,
      balance: parseFloat(balance) || 0.00,
      email: email || null,
      phone: phone || null,
      createdAt: now,
      updatedAt: now
    };

    await kv.set(`account:${id}`, account);

    return c.json({ success: true, account });
  } catch (error) {
    console.error('Error creating account:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// UPDATE account
app.put("/make-server-32ed8237/accounts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const account = await kv.get(`account:${id}`);
    if (!account) {
      return c.json({ success: false, error: 'Account not found' }, 404);
    }

    // Update fields
    const updatedAccount = {
      ...account,
      name: body.name !== undefined ? body.name : account.name,
      type: body.type !== undefined ? body.type : account.type,
      currency: body.currency !== undefined ? body.currency : account.currency,
      email: body.email !== undefined ? body.email : account.email,
      phone: body.phone !== undefined ? body.phone : account.phone,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`account:${id}`, updatedAccount);

    return c.json({ success: true, account: updatedAccount });
  } catch (error) {
    console.error('Error updating account:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DELETE account
app.delete("/make-server-32ed8237/accounts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const account = await kv.get(`account:${id}`);
    if (!account) {
      return c.json({ success: false, error: 'Account not found' }, 404);
    }

    // Check if account has balance
    if (account.balance !== 0) {
      return c.json({ 
        success: false, 
        error: 'Cannot delete account with non-zero balance. Please transfer funds first.' 
      }, 400);
    }

    await kv.del(`account:${id}`);

    return c.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// BANKS - CRUD OPERATIONS
// ============================================

// GET all banks
app.get("/make-server-32ed8237/banks", async (c) => {
  try {
    const banks = await kv.getByPrefix('bank:');
    return c.json({ success: true, banks });
  } catch (error) {
    console.error('Error fetching banks:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// CREATE bank
app.post("/make-server-32ed8237/banks", async (c) => {
  try {
    const body = await c.req.json();
    const { name, accountName, accountNumber, currency, balance, branch } = body;

    if (!name || !accountNumber || !currency) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: name, accountNumber, currency' 
      }, 400);
    }

    const id = await getNextId('counter:bank', 'BNK');
    const now = new Date().toISOString();

    const bank = {
      id,
      name,
      accountName: accountName || name,
      accountNumber,
      currency,
      balance: parseFloat(balance) || 0.00,
      branch: branch || '',
      createdAt: now,
      updatedAt: now
    };

    await kv.set(`bank:${id}`, bank);

    return c.json({ success: true, bank });
  } catch (error) {
    console.error('Error creating bank:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// UPDATE bank
app.put("/make-server-32ed8237/banks/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const bank = await kv.get(`bank:${id}`);
    if (!bank) {
      return c.json({ success: false, error: 'Bank not found' }, 404);
    }

    const updatedBank = {
      ...bank,
      name: body.name !== undefined ? body.name : bank.name,
      accountName: body.accountName !== undefined ? body.accountName : bank.accountName,
      accountNumber: body.accountNumber !== undefined ? body.accountNumber : bank.accountNumber,
      currency: body.currency !== undefined ? body.currency : bank.currency,
      branch: body.branch !== undefined ? body.branch : bank.branch,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`bank:${id}`, updatedBank);

    return c.json({ success: true, bank: updatedBank });
  } catch (error) {
    console.error('Error updating bank:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DELETE bank
app.delete("/make-server-32ed8237/banks/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const bank = await kv.get(`bank:${id}`);
    if (!bank) {
      return c.json({ success: false, error: 'Bank not found' }, 404);
    }

    if (bank.balance !== 0) {
      return c.json({ 
        success: false, 
        error: 'Cannot delete bank account with non-zero balance' 
      }, 400);
    }

    await kv.del(`bank:${id}`);

    return c.json({ success: true, message: 'Bank deleted successfully' });
  } catch (error) {
    console.error('Error deleting bank:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// M-PESA AGENTS - CRUD OPERATIONS
// ============================================

// GET all agents
app.get("/make-server-32ed8237/agents", async (c) => {
  try {
    const agents = await kv.getByPrefix('agent:');
    return c.json({ success: true, agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// CREATE agent
app.post("/make-server-32ed8237/agents", async (c) => {
  try {
    const body = await c.req.json();
    const { name, phoneNumber, tillNumber, balance, location } = body;

    if (!name || !phoneNumber) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: name, phoneNumber' 
      }, 400);
    }

    const id = await getNextId('counter:agent', 'AGT');
    const now = new Date().toISOString();

    const agent = {
      id,
      name,
      phoneNumber,
      tillNumber: tillNumber || '',
      currency: 'KES', // M-Pesa is always KES
      balance: parseFloat(balance) || 0.00,
      location: location || '',
      createdAt: now,
      updatedAt: now
    };

    await kv.set(`agent:${id}`, agent);

    return c.json({ success: true, agent });
  } catch (error) {
    console.error('Error creating agent:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// UPDATE agent
app.put("/make-server-32ed8237/agents/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const agent = await kv.get(`agent:${id}`);
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }

    const updatedAgent = {
      ...agent,
      name: body.name !== undefined ? body.name : agent.name,
      phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber : agent.phoneNumber,
      tillNumber: body.tillNumber !== undefined ? body.tillNumber : agent.tillNumber,
      location: body.location !== undefined ? body.location : agent.location,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`agent:${id}`, updatedAgent);

    return c.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DELETE agent
app.delete("/make-server-32ed8237/agents/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const agent = await kv.get(`agent:${id}`);
    if (!agent) {
      return c.json({ success: false, error: 'Agent not found' }, 404);
    }

    if (agent.balance !== 0) {
      return c.json({ 
        success: false, 
        error: 'Cannot delete agent with non-zero balance' 
      }, 400);
    }

    await kv.del(`agent:${id}`);

    return c.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// TRANSACTIONS - CRUD & ACCOUNTING LOGIC
// ============================================

// GET all transactions
app.get("/make-server-32ed8237/transactions", async (c) => {
  try {
    const transactions = await kv.getByPrefix('transaction:txn-');
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// CREATE transaction with full double-entry accounting
app.post("/make-server-32ed8237/transactions", async (c) => {
  try {
    const body = await c.req.json();
    const {
      type, // 'debit' or 'credit'
      primaryAccountId,
      method, // 'cash', 'bank', 'mpesa', 'account'
      secondaryAccountId, // For account-to-account
      bankId, // For bank transfers
      agentId, // For M-Pesa
      amount,
      description,
      category,
      date,
      exchangeRate
    } = body;

    // Validation
    if (!type || !primaryAccountId || !method || !amount || !description || !date) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, 400);
    }

    // Get primary account
    const primaryAccount = await kv.get(`account:${primaryAccountId}`);
    if (!primaryAccount) {
      return c.json({ success: false, error: 'Primary account not found' }, 404);
    }

    let secondaryEntity = null;
    let secondaryKey = '';
    let secondaryAmount = parseFloat(amount);
    const primaryAmount = parseFloat(amount);

    // Get secondary entity based on method
    if (method === 'account' && secondaryAccountId) {
      secondaryEntity = await kv.get(`account:${secondaryAccountId}`);
      secondaryKey = `account:${secondaryAccountId}`;
    } else if (method === 'bank' && bankId) {
      secondaryEntity = await kv.get(`bank:${bankId}`);
      secondaryKey = `bank:${bankId}`;
    } else if (method === 'mpesa' && agentId) {
      secondaryEntity = await kv.get(`agent:${agentId}`);
      secondaryKey = `agent:${agentId}`;
    }

    // Handle currency conversion if needed
    let appliedExchangeRate = null;
    if (secondaryEntity && primaryAccount.currency !== secondaryEntity.currency) {
      if (!exchangeRate) {
        return c.json({ 
          success: false, 
          error: 'Exchange rate required for cross-currency transactions' 
        }, 400);
      }
      
      appliedExchangeRate = parseFloat(exchangeRate);
      
      // Calculate secondary amount based on currencies
      if (primaryAccount.currency === 'KES' && secondaryEntity.currency === 'USD') {
        secondaryAmount = primaryAmount / appliedExchangeRate;
      } else if (primaryAccount.currency === 'USD' && secondaryEntity.currency === 'KES') {
        secondaryAmount = primaryAmount * appliedExchangeRate;
      }
    }

    // DOUBLE-ENTRY ACCOUNTING LOGIC
    if (type === 'credit') {
      // Credit primary account (increase)
      primaryAccount.balance += primaryAmount;
      
      // Debit secondary entity (decrease)
      if (secondaryEntity) {
        secondaryEntity.balance -= secondaryAmount;
        
        // Validate no negative balance
        if (secondaryEntity.balance < 0) {
          return c.json({ 
            success: false, 
            error: `Insufficient funds in ${secondaryEntity.name}. Available: ${secondaryEntity.balance + secondaryAmount}` 
          }, 400);
        }
      }
    } else { // debit
      // Debit primary account (decrease)
      primaryAccount.balance -= primaryAmount;
      
      // Validate no negative balance
      if (primaryAccount.balance < 0) {
        return c.json({ 
          success: false, 
          error: `Insufficient funds in ${primaryAccount.name}. Available: ${primaryAccount.balance + primaryAmount}` 
        }, 400);
      }
      
      // Credit secondary entity (increase)
      if (secondaryEntity) {
        secondaryEntity.balance += secondaryAmount;
      }
    }

    // Generate transaction ID
    const txnId = await getNextId('counter:transaction', 'TXN');
    const now = new Date().toISOString();

    // Create transaction record
    const transaction = {
      id: txnId,
      type,
      primaryAccountId,
      primaryAccountName: primaryAccount.name,
      method,
      secondaryId: secondaryEntity?.id || null,
      secondaryName: secondaryEntity?.name || 'Cash Transaction',
      amount: primaryAmount,
      currency: primaryAccount.currency,
      secondaryAmount: secondaryEntity ? secondaryAmount : null,
      secondaryCurrency: secondaryEntity?.currency || null,
      exchangeRate: appliedExchangeRate,
      description,
      category: category || 'General',
      date,
      createdAt: now,
      updatedAt: now,
      status: 'completed'
    };

    // Save everything
    primaryAccount.updatedAt = now;
    await kv.set(`account:${primaryAccountId}`, primaryAccount);
    
    if (secondaryEntity && secondaryKey) {
      secondaryEntity.updatedAt = now;
      await kv.set(secondaryKey, secondaryEntity);
    }
    
    await kv.set(`transaction:${txnId.toLowerCase()}`, transaction);

    return c.json({ 
      success: true, 
      transaction,
      balances: {
        primary: primaryAccount.balance,
        secondary: secondaryEntity?.balance || null
      }
    });

  } catch (error) {
    console.error('Error processing transaction:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// DELETE transaction (with balance reversal)
app.delete("/make-server-32ed8237/transactions/:id", async (c) => {
  try {
    const id = c.req.param('id').toLowerCase();
    
    const transaction = await kv.get(`transaction:${id}`);
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404);
    }

    // Get accounts
    const primaryAccount = await kv.get(`account:${transaction.primaryAccountId}`);
    if (!primaryAccount) {
      return c.json({ success: false, error: 'Primary account not found' }, 404);
    }

    let secondaryEntity = null;
    let secondaryKey = '';
    
    if (transaction.method === 'account' && transaction.secondaryId) {
      secondaryEntity = await kv.get(`account:${transaction.secondaryId}`);
      secondaryKey = `account:${transaction.secondaryId}`;
    } else if (transaction.method === 'bank' && transaction.secondaryId) {
      secondaryEntity = await kv.get(`bank:${transaction.secondaryId}`);
      secondaryKey = `bank:${transaction.secondaryId}`;
    } else if (transaction.method === 'mpesa' && transaction.secondaryId) {
      secondaryEntity = await kv.get(`agent:${transaction.secondaryId}`);
      secondaryKey = `agent:${transaction.secondaryId}`;
    }

    // REVERSE THE TRANSACTION
    const primaryAmount = transaction.amount;
    const secondaryAmount = transaction.secondaryAmount || transaction.amount;

    if (transaction.type === 'credit') {
      // Reverse credit: decrease primary, increase secondary
      primaryAccount.balance -= primaryAmount;
      if (secondaryEntity) {
        secondaryEntity.balance += secondaryAmount;
      }
    } else {
      // Reverse debit: increase primary, decrease secondary
      primaryAccount.balance += primaryAmount;
      if (secondaryEntity) {
        secondaryEntity.balance -= secondaryAmount;
      }
    }

    const now = new Date().toISOString();
    primaryAccount.updatedAt = now;
    await kv.set(`account:${transaction.primaryAccountId}`, primaryAccount);
    
    if (secondaryEntity && secondaryKey) {
      secondaryEntity.updatedAt = now;
      await kv.set(secondaryKey, secondaryEntity);
    }

    // Delete transaction
    await kv.del(`transaction:${id}`);

    return c.json({ 
      success: true, 
      message: 'Transaction deleted and balances reversed',
      balances: {
        primary: primaryAccount.balance,
        secondary: secondaryEntity?.balance || null
      }
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// CLIENT PASSWORD MANAGEMENT
// ============================================

// SET client password
app.post("/make-server-32ed8237/clients/:id/password", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return c.json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      }, 400);
    }

    const account = await kv.get(`account:${id}`);
    if (!account) {
      return c.json({ success: false, error: 'Client not found' }, 404);
    }

    if (account.type !== 'Client') {
      return c.json({ success: false, error: 'Account is not a client account' }, 400);
    }

    // In production, hash the password!
    account.password = password; // Should use bcrypt or similar
    account.passwordSetAt = new Date().toISOString();
    account.updatedAt = new Date().toISOString();

    await kv.set(`account:${id}`, account);

    return c.json({ 
      success: true, 
      message: 'Password set successfully for ' + account.name 
    });
  } catch (error) {
    console.error('Error setting password:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// DASHBOARD STATISTICS
// ============================================

app.get("/make-server-32ed8237/dashboard/stats", async (c) => {
  try {
    const accounts = await kv.getByPrefix('account:');
    const banks = await kv.getByPrefix('bank:');
    const agents = await kv.getByPrefix('agent:');
    const transactions = await kv.getByPrefix('transaction:txn-');
    
    // Calculate totals by type and currency
    const stats = {
      cash: {
        kes: accounts.filter(a => a.type === 'Cash' && a.currency === 'KES')
          .reduce((sum, a) => sum + a.balance, 0),
        usd: accounts.filter(a => a.type === 'Cash' && a.currency === 'USD')
          .reduce((sum, a) => sum + a.balance, 0)
      },
      banks: {
        kes: banks.filter(b => b.currency === 'KES')
          .reduce((sum, b) => sum + b.balance, 0),
        usd: banks.filter(b => b.currency === 'USD')
          .reduce((sum, b) => sum + b.balance, 0)
      },
      mpesa: {
        total: agents.reduce((sum, a) => sum + a.balance, 0)
      },
      exchange: {
        kes: accounts.filter(a => a.type === 'Exchange' && a.currency === 'KES')
          .reduce((sum, a) => sum + a.balance, 0),
        usd: accounts.filter(a => a.type === 'Exchange' && a.currency === 'USD')
          .reduce((sum, a) => sum + a.balance, 0)
      },
      clients: {
        kes: accounts.filter(a => a.type === 'Client' && a.currency === 'KES')
          .reduce((sum, a) => sum + a.balance, 0),
        usd: accounts.filter(a => a.type === 'Client' && a.currency === 'USD')
          .reduce((sum, a) => sum + a.balance, 0)
      },
      walkin: {
        kes: accounts.filter(a => a.type === 'Walk-in' && a.currency === 'KES')
          .reduce((sum, a) => sum + a.balance, 0),
        usd: accounts.filter(a => a.type === 'Walk-in' && a.currency === 'USD')
          .reduce((sum, a) => sum + a.balance, 0)
      }
    };

    // Today's transactions
    const today = new Date().toISOString().split('T')[0];
    const todayTxns = transactions.filter(t => t.date?.split('T')[0] === today);

    const kesCredits = todayTxns.filter(t => t.type === 'credit' && t.currency === 'KES')
      .reduce((sum, t) => sum + t.amount, 0);
    const kesDebits = todayTxns.filter(t => t.type === 'debit' && t.currency === 'KES')
      .reduce((sum, t) => sum + t.amount, 0);
    const usdCredits = todayTxns.filter(t => t.type === 'credit' && t.currency === 'USD')
      .reduce((sum, t) => sum + t.amount, 0);
    const usdDebits = todayTxns.filter(t => t.type === 'debit' && t.currency === 'USD')
      .reduce((sum, t) => sum + t.amount, 0);

    const daily = {
      credits: kesCredits + usdCredits,
      debits: kesDebits + usdDebits,
      net: (kesCredits + usdCredits) - (kesDebits + usdDebits),
      byCurrency: {
        kes: {
          credits: kesCredits,
          debits: kesDebits,
          net: kesCredits - kesDebits
        },
        usd: {
          credits: usdCredits,
          debits: usdDebits,
          net: usdCredits - usdDebits
        }
      }
    };

    return c.json({
      success: true,
      stats: {
        ...stats,
        daily,
        counts: {
          accounts: accounts.length,
          banks: banks.length,
          agents: agents.length,
          transactions: transactions.length,
          todayTransactions: todayTxns.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// SETTINGS
// ============================================

// GET settings
app.get("/make-server-32ed8237/settings", async (c) => {
  try {
    const settings = await kv.get('settings:global') || {
      companyName: 'Sarif Money Exchange',
      companyLogo: null,
      officeName: 'Nairobi Central Office',
      officeEmail: 'nairobi@sarifexchange.com',
      officePhone: '+254 712 345 678',
      defaultCurrency: 'KES',
      autoReconcile: true,
      emailNotifications: true
    };

    return c.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// UPDATE settings
app.put("/make-server-32ed8237/settings", async (c) => {
  try {
    const body = await c.req.json();
    
    const currentSettings = await kv.get('settings:global') || {};
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString()
    };

    await kv.set('settings:global', updatedSettings);

    return c.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// EXCHANGE RATES
// ============================================

// GET current exchange rates
app.get("/make-server-32ed8237/exchange-rates", async (c) => {
  try {
    const rates = await kv.get('exchange:rates') || {
      usdToKes: {
        buy: 130.50,
        sell: 131.50,
        mid: 131.00,
        updatedAt: new Date().toISOString()
      }
    };

    return c.json({ success: true, rates });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// UPDATE exchange rates
app.put("/make-server-32ed8237/exchange-rates", async (c) => {
  try {
    const body = await c.req.json();
    const { buy, sell } = body;

    if (!buy || !sell) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: buy, sell' 
      }, 400);
    }

    const buyRate = parseFloat(buy);
    const sellRate = parseFloat(sell);

    if (buyRate <= 0 || sellRate <= 0) {
      return c.json({ 
        success: false, 
        error: 'Rates must be positive numbers' 
      }, 400);
    }

    const rates = {
      usdToKes: {
        buy: buyRate,
        sell: sellRate,
        mid: (buyRate + sellRate) / 2,
        updatedAt: new Date().toISOString()
      }
    };

    await kv.set('exchange:rates', rates);

    return c.json({ success: true, rates });
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// PROCESS currency exchange
app.post("/make-server-32ed8237/exchange", async (c) => {
  try {
    const body = await c.req.json();
    const { fromCurrency, toCurrency, amount, clientId, rate } = body;

    if (!fromCurrency || !toCurrency || !amount || !rate) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, 400);
    }

    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(rate);

    // Get exchange accounts
    const fromAccount = await kv.get(`account:ACC-2026-000${fromCurrency === 'KES' ? '3' : '4'}`); // Exchange accounts
    const toAccount = await kv.get(`account:ACC-2026-000${toCurrency === 'KES' ? '3' : '4'}`);

    if (!fromAccount || !toAccount) {
      return c.json({ success: false, error: 'Exchange accounts not found' }, 404);
    }

    // Calculate converted amount
    const convertedAmount = fromCurrency === 'USD' ? amountNum * rateNum : amountNum / rateNum;

    // Check if exchange account has enough balance
    if (toAccount.balance < convertedAmount) {
      return c.json({ 
        success: false, 
        error: `Insufficient ${toCurrency} in exchange account` 
      }, 400);
    }

    // Update balances
    fromAccount.balance += amountNum;
    toAccount.balance -= convertedAmount;

    const now = new Date().toISOString();
    fromAccount.updatedAt = now;
    toAccount.updatedAt = now;

    // Create transaction record
    const txnId = await getNextId('counter:transaction', 'TXN');
    
    const transaction = {
      id: txnId,
      type: 'exchange',
      fromCurrency,
      toCurrency,
      fromAmount: amountNum,
      toAmount: convertedAmount,
      rate: rateNum,
      clientId: clientId || null,
      description: `Exchange ${amountNum} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`,
      category: 'Exchange',
      date: new Date().toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now,
      status: 'completed'
    };

    // Save everything
    await kv.set(`account:${fromAccount.id}`, fromAccount);
    await kv.set(`account:${toAccount.id}`, toAccount);
    await kv.set(`transaction:${txnId.toLowerCase()}`, transaction);

    return c.json({ 
      success: true, 
      transaction,
      balances: {
        [fromCurrency]: fromAccount.balance,
        [toCurrency]: toAccount.balance
      },
      exchanged: {
        from: amountNum,
        to: convertedAmount,
        rate: rateNum
      }
    });

  } catch (error) {
    console.error('Error processing exchange:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);