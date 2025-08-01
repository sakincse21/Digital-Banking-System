# 🏦 Digital Banking System

A secure, scalable, and feature-rich **digital banking system** built with **Node.js, Express, TypeScript, MongoDB (Mongoose)**, and **JWT-based authentication**. This backend supports user roles, wallet management, transaction processing and admin controls.

---

## 🚀 Features

- **Multi-role Authentication**: Users, Agents, Admins, and Super Admin.
- **Wallet System**: Each user has a wallet with initial 50 balance and balance tracking.
- **Transaction Management**: Send money, add money, withdraw, cash-in, cash-out, refund.
- **Search & Filter**: Search users and transactions with query parameters.
- **Input Validation**: Zod-based schema validation.
- **Error Handling**: Centralized error handling with custom error classes.
- **JWT Authentication & Authorization**: Role-based access control with `jsonwebtoken`.
- **Secure Passwords**: Hashed using `bcryptjs`.
- **RESTful API Design** with proper routes.

---

## ⚙️ Tech Stack

| Layer             | Technology                         |
|------------------|------------------------------------|
| Backend          | Node.js + Express.js               |
| Language         | TypeScript                         |
| Database         | MongoDB (Mongoose)         |
| Authentication   | JWT (jsonweboken)              |
| Validation       | Zod                                |
| Error Handling   | Custom Error Classes               |
| Deployment       | Vercel                             |

---

## 🔐 Roles & Permissions

| Role           | Permissions |
|----------------|------------|
| `USER`         | View own profile, wallet and transactions, Add money request, Send Money |
| `AGENT`        | Cash in, Confirm add money requests, view own transactions |
| `ADMIN`        | Update user roles/status, Suspend/approve users/agents, View all users, Delete user |
| `SUPER_ADMIN`  | Delete users, create admin, full access |

---


## 📂 Project Structure

```
sakincse21-digital-banking-system/
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── app/
│       ├── config/           # Environment setup
│       ├── errorHelpers/     # Custom error classes
│       ├── interface/        # TypeScript interfaces
│       ├── middlewares/      # Auth, validation, error handling
│       ├── modules/          # User, Wallet, Transaction
│       ├── routes/           # API route definitions
│       └── utils/            # JWT, async wrapper, response sender
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```
---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-banking-system.git
   cd digital-banking-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in the required values.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm run build
   npm start
   ```

---
## Data Models

### User Model
```typescript
interface IUser {
    name: string;
    phoneNo: string;
    email: string;
    role: IRole; // 'AGENT' | 'ADMIN' | 'USER' | 'SUPER_ADMIN'
    address: string;
    password: string;
    isVerified: boolean;
    nidNo: string;
    status: IStatus; // 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETE'
    walletId: Types.ObjectId;
}
```

### Wallet Model
```typescript
interface IWallet {
    balance: number;
    transactionId: Types.ObjectId[];
    userId: Types.ObjectId;
}
```

### Transaction Model
```typescript
interface ITransaction {
    from: Types.ObjectId;
    to: Types.ObjectId;
    amount: number;
    status: ITransactionStatus; // 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED'
    type: ITransactionType; // 'SEND_MONEY' | 'ADD_MONEY' | 'WITHDRAW' | 'CASH_IN' | 'REFUND'
}
```
---

## API Routes

### Auth Routes (`/api/v1/auth`)
- `POST /login` - User login

### User Routes (`/api/v1/user`)
- `POST /create` - Create a new user
- `PATCH /:id` - Update user information
- `PATCH /admin/:id` - Admin update user (role/status/verification)
- `GET /me` - Get current user info
- `GET /:id` - Get user by ID (admin only)
- `GET /` - Get all users with queries (admin only)
- `DELETE /:id` - Delete user (admin only)

### Wallet Routes (`/api/v1/wallet`)
- `GET /:id` - Get wallet by ID (own/admin)
- `PATCH /:id` - Update wallet (admin only)
- `GET /` - Get all wallets (admin only)

### Transaction Routes (`/api/v1/transaction`)
- `POST /add-money` - Request agent to add money (user only)
- `POST /add-money-confirm/:id` - Confirmed add money request (agent only)
- `POST /withdraw` - Withdraw money (user only)
- `POST /cash-in` - Cash in money (agent only)
- `POST /send-money` - Send money to another user(same role)
- `GET /:id` - Get transaction by ID (own / admins)
- `GET /` - Get all transactions (admin only)

---

## 📜 License

MIT License © [Saleheen Uddin Sakin](https://github.com/sakincse21)

---

## 📬 Contact

- GitHub: [@sakincse21](https://github.com/sakincse21)
- Email: saleheen.sakin@gmail.com
- LinkedIn: [Saleheen Uddin Sakin](https://linkedin.com/in/saleheen-sakin)

---

 Live API: [https://digital-banking-system-sakincse21.vercel.app](https://digital-banking-system-sakincse21.vercel.app)
```
