# InvoNest ⚡

**InvoNest** is an intelligent Accounts Receivable (A/R) lifecycle engine and collections automation manager. Designed to help finance divisions streamline cash operations, InvoNest leverages machine learning to predict payment risk, parse invoices using OCR, model solvency scenarios via a Digital Twin simulator, and automate reminder cycles.

---

## 🚀 Workspace Features

1. **A/R Ledger & Status Manager**
   * High-contrast dark green ledger table showing total outstanding invoices, due dates, risk scores, and current payment state.
   * Real-time status updates via interactive dropdown cells (`DRAFT`, `SENT`, `VIEWED`, `DUE`, `OVERDUE`, `PAID`) syncing with the backend database.
   * Integrated **Mock Payment Flow** simulating Stripe Checkout for instant invoice settlement and dynamic update of Recovery Rate KPIs.

2. **AI Invoice OCR Scanner**
   * Upload scanned invoices (PDF, PNG, JPG) using a native browser file selector.
   * High-capacity payload processing (supporting up to 50MB documents).
   * Extracts dates, amounts, billing credentials, and automatically populates the ledger.

3. **AI CFO Copilot & Risk Engine**
   * Real-time chat assistant querying outstanding balances, cash-flow risks, and operational hiring thresholds.
   * Pre-packaged CFO queries for instant solvency checks and balance analyses.

4. **Scenario Simulator (Financial Digital Twin)**
   * Run scenarios (e.g. late customer payments, payroll hikes) to model runway solvency outcomes in real-time.

5. **Automated collections cycles**
   * Visually inspect email/WhatsApp automated escalation schedules inside the Documentation panel.

---

## 🏛️ Architecture

Below is the conceptual architecture flow of InvoNest's digital ledger audit and automated collections lifecycle system:

```mermaid
graph TD
    subgraph Client Interface (Next.js)
        UI[Web Frontend Dashboard]
        OCR[Native File Upload]
        Pay[Stripe Mock Payment Checkout]
    end

    subgraph Backend Core Service (NestJS API)
        Route[Express Controller Endpoints]
        OCREngine[OCR Parsing Controller]
        RiskEng[ML Risk Score Engine]
        CFOCopilot[AI CFO Copilot Chat Service]
        Sim[Scenario Digital Twin Simulator]
        Dunning[Automation Reminder Scheduler]
    end

    subgraph Data Store Layer
        Prisma[Prisma Database Client]
        DB[(PostgreSQL Database)]
    end

    subgraph Channels Gateway
        Email[SMTP Mail Dispatcher]
        WhatsApp[WhatsApp Reminder Gateway]
    end

    OCR -->|Base64 Document| OCREngine
    Pay -->|Record Settlement| Route
    UI -->|State Mutation Requests| Route
    
    OCREngine -->|Save invoice fields| Prisma
    Route -->|Query Ledger| Prisma
    RiskEng -->|Calculate Delay Risk| Prisma
    CFOCopilot -->|Synthesize Solvency Forecast| Prisma
    Sim -->|Run Solvency Projections| UI
    
    Prisma -->|Read/Write Operations| DB
    
    Dunning -->|Read Overdue Ledgers| Prisma
    Dunning -->|Email Notifications| Email
    Dunning -->|WhatsApp Notifications| WhatsApp
```

---

## 📊 Accounts Receivable Ledger
### List of Outstanding Billing Agreements

| Invoice # | Client | Amount | Due Date | Status | Delay Risk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **INV-9420** | ABC Corp | ₹53,100 | 2026-08-22 | `SENT` | **30%** |
| **INV-8091** | ABC Corp | ₹53,100 | 2026-08-22 | `OVERDUE` | **30%** |
| **INV-5631** | Acquirer Corp | ₹53,100 | 2026-08-22 | `DRAFT` | **30%** |
| **INV-4493** | XYZ Ltd | ₹53,100 | 2026-08-22 | `DRAFT` | **30%** |
| **INV-3002** | Acquirer Corp | ₹4,00,000 | 2026-07-11 | `OVERDUE` | **84%** |

---

## 🛠️ Technology Stack

* **Frontend**: Next.js (React 18), Tailwind CSS, Framer Motion, Lucide icons
* **Backend**: NestJS (TypeScript), Express
* **Database**: PostgreSQL (Prisma ORM)
* **Local Mock Server**: PGlite / PostgreSQL mock instance

---

## 💻 Local Quickstart

### Prerequisites
* Node.js (v18 or higher)
* NPM

### Setup Instructions

1. **Clone the repository and install root dependencies**:
   ```bash
   cd invonest
   npm install
   ```

2. **Configure local database**:
   Configure database schema inside `backend/prisma/schema.prisma` and run:
   ```bash
   npm run prisma:generate
   ```

3. **Start the database and background servers**:
   In separate terminals (or via concurrently):
   
   * **Start Database Server**:
     ```bash
     node pg-server.js
     ```
   * **Start Backend API (runs on port 3001)**:
     ```bash
     npm run dev:backend
     ```
   * **Start Frontend Client (runs on port 3000)**:
     ```bash
     npm run dev:frontend
     ```

---

## 📡 Production Deployment Checklist

### Database (Supabase)
1. Initialize a free PostgreSQL cluster on [Supabase](https://supabase.com).
2. Copy the database connection URI string.

### Backend (Render / Railway)
1. Deploy `backend` root subfolder as a Node Web Service.
2. Set Environment Variables:
   * `DATABASE_URL`: `[Supabase connection URI]`
   * `PORT`: `3001`
   * `JWT_SECRET`: `[Secure key string]`
3. Set Build command: `npm install && npm run build`
4. Set Start command: `npx prisma db push && npm run start:prod`

### Frontend (Vercel)
1. Import repository and set root directory to `frontend`.
2. Configure Environment Variable:
   * `NEXT_PUBLIC_API_URL`: `[Deployed NestJS Backend Domain URL]`
3. Deploy!

---

## 📄 License
This project is licensed under the MIT License.
