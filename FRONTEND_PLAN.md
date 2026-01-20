# 🎨 AgentShop Frontend - Complete Implementation Plan

**Date:** January 16, 2026  
**Backend Status:** ✅ Fully Operational  
**Frontend Status:** 🚧 To Be Built

---

## 📊 ANALYSIS #1: Backend API Structure

### Available Endpoints

| Category | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| **Products** | GET | `/api/products` | List all active products |
| | GET | `/api/products/:id` | Get product details |
| | POST | `/api/products` | Create new product |
| **Orders** | POST | `/api/orders` | Create order after payment |
| | POST | `/api/orders/:id/create-escrow` | Create on-chain escrow |
| | POST | `/api/orders/:id/deliver` | Merchant delivers product |
| | GET | `/api/orders/:id` | Get order details |
| | GET | `/api/orders` | List all orders |
| **x402 Payments** | POST | `/api/x402/payment-intent` | Create payment requirements |
| | POST | `/api/x402/confirm` | Verify and confirm payment |
| | GET | `/api/x402/payment/:id/status` | Check payment status |
| **Agent** | POST | `/api/agent/execute` | Execute agent task with prompt |
| | POST | `/api/agent/budget` | Set user's agent budget |
| | GET | `/api/agent/budget/:userId` | Get budget details |
| **Verifier** | POST | `/api/orders/:orderId/hire-verifier` | Hire verifier for order |
| | POST | `/api/verify/:jobId/run` | Run verification job |
| | GET | `/api/verifier/stats` | Get verifier earnings stats |
| **Feed** | GET | `/api/feed` | Get transaction activity feed |

---

## 📊 ANALYSIS #2: User Flows & Features

### Core Flows Identified:

#### 1. **Merchant Flow** (Product Creation)
```
Landing → Connect Wallet → Dashboard → Create Product Form
→ Submit to Backend → On-chain Transaction → Product Listed
```

#### 2. **Buyer Flow** (Direct Purchase)
```
Browse Products → Product Detail → Click "Buy Now"
→ x402 Payment Modal → Sign EIP-3009 → Payment Confirmed
→ Create Order → Wait for Delivery → View Order Status
```

#### 3. **Agent Flow** (AI-Powered Purchase)
```
Agent Chat Interface → Enter Prompt: "Buy API X"
→ Agent Reasoning Display → Budget Check → Search Products
→ x402 Payment #1 (buyer → merchant)
→ Create Order → Hire Verifier (if required)
→ x402 Payment #2 (agent → verifier)
→ Wait for Verification → Escrow Release
```

#### 4. **Verifier Dashboard** (THE WOW FEATURE)
```
Verifier Stats Page → Show Total Jobs: 623
→ Show Total Earned: $12.47 USDC
→ Show Success Rate: 94.3%
→ Recent Jobs List → Job Details
```

#### 5. **Transaction Feed**
```
Real-time Feed → Show All Activity
→ Purchases, Verifications, Releases, Refunds
→ Live Updates (WebSocket or Polling)
```

---

## 🎯 Frontend Tech Stack

### Core Framework
- **Next.js 14** (App Router, TypeScript, Server Components)
- **TailwindCSS** (Styling)
- **shadcn/ui** (Components)

### Web3 Integration
- **viem** (Ethereum interactions)
- **wagmi** (React hooks for Ethereum)
- **@crypto.com/facilitator-client** (x402 SDK)
- **RainbowKit** or **ConnectKit** (Wallet connection)

### State Management
- **Zustand** (Global state)
- **TanStack Query** (Server state, caching)

### UI Components
- **Lucide React** (Icons)
- **Recharts** (Charts for verifier stats)
- **Framer Motion** (Animations)
- **React Hot Toast** (Notifications)

### Real-time Updates
- **Polling** or **WebSockets** (Transaction feed)

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── products/
│   │   │   ├── page.tsx                # Product listing
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Product detail + Buy button
│   │   ├── agent/
│   │   │   └── page.tsx                # Agent chat interface
│   │   ├── verifier/
│   │   │   └── page.tsx                # Verifier stats dashboard
│   │   └── feed/
│   │       └── page.tsx                # Transaction feed
│   ├── (authenticated)/
│   │   └── dashboard/
│   │       ├── page.tsx                # Merchant dashboard
│   │       ├── products/
│   │       │   ├── page.tsx            # My products
│   │       │   └── new/
│   │       │       └── page.tsx        # Create product form
│   │       ├── orders/
│   │       │   ├── page.tsx            # My orders (buyer)
│   │       │   └── [id]/
│   │       │       └── page.tsx        # Order detail
│   │       └── settings/
│   │           └── page.tsx            # Agent budget settings
│   ├── layout.tsx                      # Root layout
│   └── providers.tsx                   # Web3 providers
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.tsx                  # Top navigation
│   │   ├── Footer.tsx                  # Footer
│   │   └── WalletButton.tsx            # Connect wallet button
│   ├── product/
│   │   ├── ProductCard.tsx             # Product card component
│   │   ├── ProductGrid.tsx             # Grid of products
│   │   └── ProductDetailView.tsx       # Product detail view
│   ├── payment/
│   │   ├── X402PaymentModal.tsx        # x402 payment flow
│   │   ├── PaymentProgress.tsx         # Payment progress indicator
│   │   └── PaymentConfirmation.tsx     # Success/failure UI
│   ├── agent/
│   │   ├── ChatInterface.tsx           # Chat UI
│   │   ├── ReasoningDisplay.tsx        # Show agent thinking
│   │   ├── BudgetControls.tsx          # Budget settings
│   │   └── ToolCallVisualization.tsx   # Show tool executions
│   ├── verifier/
│   │   ├── StatsCard.tsx               # Stat display card
│   │   ├── EarningsChart.tsx           # Earnings over time
│   │   └── JobsList.tsx                # Recent jobs list
│   ├── order/
│   │   ├── OrderStatusBadge.tsx        # Status indicator
│   │   ├── OrderTimeline.tsx           # Order progress timeline
│   │   └── OrderDetails.tsx            # Full order info
│   └── feed/
│       ├── FeedItem.tsx                # Transaction feed item
│       └── FeedList.tsx                # Feed list with auto-refresh
├── lib/
│   ├── api/
│   │   ├── products.ts                 # Product API calls
│   │   ├── orders.ts                   # Order API calls
│   │   ├── x402.ts                     # x402 API calls
│   │   ├── agent.ts                    # Agent API calls
│   │   ├── verifier.ts                 # Verifier API calls
│   │   └── feed.ts                     # Feed API calls
│   ├── hooks/
│   │   ├── useProducts.ts              # Product hooks
│   │   ├── useOrders.ts                # Order hooks
│   │   ├── useX402Payment.ts           # x402 payment hook
│   │   ├── useAgent.ts                 # Agent execution hook
│   │   └── useFeed.ts                  # Feed hook with polling
│   ├── x402/
│   │   ├── client.ts                   # x402 facilitator client
│   │   ├── paymentFlow.ts              # Complete payment flow logic
│   │   └── types.ts                    # x402 TypeScript types
│   ├── store/
│   │   ├── walletStore.ts              # Wallet state
│   │   ├── cartStore.ts                # Shopping cart (optional)
│   │   └── agentStore.ts               # Agent chat state
│   └── utils/
│       ├── format.ts                   # Formatting helpers
│       ├── constants.ts                # App constants
│       └── validation.ts               # Form validation
├── types/
│   ├── api.ts                          # API response types
│   ├── product.ts                      # Product types
│   ├── order.ts                        # Order types
│   └── agent.ts                        # Agent types
├── public/
│   ├── logo.svg
│   └── images/
├── .env.local                          # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Page-by-Page Implementation Plan

### **1. Landing Page** (`app/page.tsx`)

**Purpose:** First impression, explain AgentShop concept

**Sections:**
1. **Hero Section**
   - Headline: "AI Agents Buy Digital Goods. Gasless. Autonomous."
   - Subheadline: "First marketplace where agents verify products with $0 gas fees"
   - CTA: "Browse Products" + "Try Agent"
   - Background: Gradient with animated particles

2. **How It Works** (3 columns)
   - Column 1: "🛍️ Merchants Create" - List digital products
   - Column 2: "🤖 Agents Purchase" - AI agents buy & verify autonomously
   - Column 3: "✅ Verifiers Earn" - Get paid to test products

3. **Live Stats**
   - Total Products Listed
   - Total Orders Completed
   - Verifier Earnings Today
   - (Fetch from `/api/verifier/stats` and aggregate)

4. **Featured Products** (Carousel)
   - Show 4-6 products from `/api/products`
   - Product cards with name, price, verification badge

5. **x402 Benefits**
   - "Zero Gas Fees"
   - "Instant Settlement"
   - "EIP-3009 Security"
   - Icons + short descriptions

6. **CTA Section**
   - "Start Selling" (→ Dashboard)
   - "Chat with Agent" (→ Agent page)

**Components Needed:**
- `HeroSection.tsx`
- `HowItWorksSection.tsx`
- `LiveStatsSection.tsx`
- `FeaturedProductsCarousel.tsx`
- `BenefitsSection.tsx`

---

### **2. Product Listing Page** (`app/products/page.tsx`)

**Purpose:** Browse all available products

**Layout:**
- **Left Sidebar** (Filters)
  - Price range slider
  - Verification required toggle
  - Delivery type (INSTANT, VERIFICATION_REQUIRED)
  - Search bar

- **Main Content** (Grid)
  - Product cards (3-4 columns responsive)
  - Each card shows:
    - Product name
    - Price in USDC
    - Verification badge (if required)
    - Merchant address (truncated)
    - "Buy Now" button
  - Pagination or infinite scroll

- **Top Bar**
  - Sort by: Newest, Price (Low-High), Price (High-Low)
  - View toggle: Grid / List

**API Calls:**
- `GET /api/products` with filters

**Components:**
- `ProductFilters.tsx`
- `ProductGrid.tsx`
- `ProductCard.tsx`
- `SortControls.tsx`

---

### **3. Product Detail Page** (`app/products/[id]/page.tsx`)

**Purpose:** Show product details and enable purchase

**Layout:**
- **Left Side** (60%)
  - Product name (large heading)
  - Description (markdown support)
  - Price display (large, USDC badge)
  - Merchant info:
    - Wallet address
    - Link to Cronos explorer
  - Product metadata (JSON display)
  
- **Right Side** (40% - Sticky)
  - **Purchase Card**
    - Price summary
    - Platform fee (5% default)
    - Total amount
    - "Buy Now" button (primary, large)
    - "Buy with Agent" button (secondary)
  - **Product Info**
    - Delivery type
    - Timeout: X hours
    - Requires verification: Yes/No
  - **Recent Orders** (mini feed)
    - Show last 3 purchases

**User Actions:**
1. Click "Buy Now"
   - If no wallet: Show connect wallet modal
   - If wallet connected: Open X402PaymentModal
   
2. Click "Buy with Agent"
   - Redirect to `/agent?product=[id]`
   - Pre-fill prompt

**API Calls:**
- `GET /api/products/:id`
- `GET /api/feed?productId=:id` (optional)

**Components:**
- `ProductDetailView.tsx`
- `PurchaseCard.tsx`
- `MerchantInfo.tsx`
- `X402PaymentModal.tsx`

---

### **4. x402 Payment Modal** (Component)

**Purpose:** Handle complete x402 payment flow

**Flow:**
1. **Step 1: Preparing Payment**
   - Show loading spinner
   - Call `POST /api/x402/payment-intent`
   - Get paymentRequirements

2. **Step 2: Review Payment**
   - Show payment details:
     - Recipient address
     - Amount in USDC
     - Network: Cronos Testnet
   - "Confirm Payment" button

3. **Step 3: Sign Transaction**
   - Show MetaMask popup instruction
   - Call facilitator SDK to generate EIP-3009 signature
   - User signs in wallet (NO GAS FEE!)
   - Generate paymentHeader

4. **Step 4: Confirming Payment**
   - Show loading
   - Call `POST /api/x402/confirm` with paymentHeader
   - Backend verifies + settles on-chain

5. **Step 5: Success**
   - Show checkmark animation
   - Display transaction hash
   - Link to Cronos explorer
   - "View Order" button
   - Auto-close after 3 seconds

**Error Handling:**
- User rejects signature → Show retry
- Insufficient balance → Show error, suggest faucet
- Network error → Show retry button
- Backend error → Show contact support

**Components:**
- `X402PaymentModal.tsx`
- `PaymentStep.tsx`
- `PaymentSuccess.tsx`
- `PaymentError.tsx`

**Implementation:**
```typescript
// lib/x402/paymentFlow.ts
export async function executeX402Payment(
  recipient: string,
  amount: string,
  wallet: WalletClient
) {
  // 1. Get payment requirements from backend
  const { paymentRequirements } = await api.createPaymentIntent({
    recipient,
    amount,
    currency: 'USDC'
  });

  // 2. User signs EIP-3009 authorization (via facilitator SDK)
  const paymentHeader = await facilitatorClient.createPaymentHeader({
    requirements: paymentRequirements,
    wallet
  });

  // 3. Send to backend for verification & settlement
  const { verified, txHash } = await api.confirmPayment({
    paymentHeader,
    paymentRequirements
  });

  return { verified, txHash };
}
```

---

### **5. Agent Chat Interface** (`app/agent/page.tsx`)

**Purpose:** Main AI agent interaction page - THE CORE FEATURE

**Layout:**

- **Top Bar**
  - "Agent Chat" title
  - Budget display: "$5.00 / $10.00 remaining today"
  - Settings button (→ budget modal)

- **Chat Area** (60% width, center)
  - Message list (scrollable)
  - Types of messages:
    1. **User messages** (right-aligned, blue bubble)
    2. **Agent messages** (left-aligned, gray bubble)
    3. **Reasoning steps** (expandable cards)
       - Thinking: "Analyzing your request..."
       - Tool call: "Searching products..."
       - Decision: "Found API key for $0.10"
    4. **Action cards** (special UI)
       - Payment request: "Approve $0.10 payment?"
       - Verification needed: "Hire verifier for $0.02?"
       - Order created: "Order #XYZ created"

- **Input Area** (Bottom, sticky)
  - Text input (large)
  - "Send" button
  - Suggested prompts (chips):
    - "Buy Market Data API"
    - "Find cheapest API under $1"
    - "Verify my last purchase"

- **Right Sidebar** (30% width)
  - **Active Execution** (if running)
    - Progress indicator
    - Current step
    - Time elapsed
  - **Recent Executions** (List)
    - Show last 5 agent tasks
    - Status badges: Success, Failed, Running
    - Click to expand details
  - **Budget Breakdown**
    - Daily limit
    - Spent today
    - Per transaction limit

**Agent Message Flow:**
1. User sends: "Buy Market Data API"
2. Agent reasoning (displayed in real-time):
   - "💭 Thinking: User wants to purchase an API key"
   - "🔍 Tool Call: search_products('Market Data API')"
   - "📊 Result: Found 3 matching products"
   - "💰 Tool Call: check_budget($0.10)"
   - "✅ Decision: Budget approved"
   - "💳 Action Required: Approve payment"
3. Show payment approval card
4. User clicks "Approve"
5. x402 payment flow (modal)
6. Agent continues:
   - "✅ Payment confirmed"
   - "📦 Creating order..."
   - "🔍 Product requires verification"
   - "💳 Action Required: Hire verifier ($0.02)"
7. User clicks "Approve Verifier Payment"
8. 2nd x402 payment
9. Agent shows:
   - "✅ Verifier hired"
   - "🧪 Verification in progress..."
   - "✅ Verification passed!"
   - "💰 Escrow released to merchant"
   - "🎉 Purchase complete!"

**API Calls:**
- `POST /api/agent/execute` (with streaming if possible)
- `GET /api/agent/budget/:userId`
- `POST /api/agent/budget` (for settings)

**Components:**
- `ChatInterface.tsx`
- `MessageBubble.tsx`
- `ReasoningStepCard.tsx`
- `ActionCard.tsx`
- `BudgetSidebar.tsx`
- `ExecutionHistory.tsx`
- `BudgetSettingsModal.tsx`

**State Management:**
```typescript
// lib/store/agentStore.ts
interface AgentState {
  messages: Message[];
  currentExecution: Execution | null;
  isExecuting: boolean;
  budget: Budget;
  addMessage: (msg: Message) => void;
  startExecution: (prompt: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
}
```

---

### **6. Merchant Dashboard** (`app/dashboard/page.tsx`)

**Purpose:** Merchant management hub

**Layout:**

- **Stats Cards** (Top row, 4 cards)
  1. Total Products: 12
  2. Total Orders: 47
  3. Revenue: $24.30 USDC
  4. Pending Deliveries: 3

- **Quick Actions** (Buttons)
  - "Create New Product"
  - "View All Orders"
  - "Withdraw Earnings"

- **Recent Orders** (Table)
  - Columns: Order ID, Product, Buyer, Amount, Status, Actions
  - Status badges: PAID, ESCROW_CREATED, DELIVERED, COMPLETED, REFUNDED
  - Actions: "Deliver" button (if status = ESCROW_CREATED)

- **My Products** (Table or Grid)
  - Columns: Name, Price, Orders, Status, Actions
  - Actions: Edit, Deactivate, View Details

**API Calls:**
- `GET /api/products` (filtered by merchant)
- `GET /api/orders` (filtered by merchant)
- Aggregate stats from both

**Components:**
- `DashboardStatsCards.tsx`
- `RecentOrdersTable.tsx`
- `ProductsTable.tsx`
- `DeliverOrderModal.tsx`

---

### **7. Create Product Page** (`app/dashboard/products/new/page.tsx`)

**Purpose:** Form to create new product

**Form Fields:**
1. **Product Name** (required)
   - Text input
   - Example: "CoinGecko API Key"

2. **Description** (required)
   - Textarea with markdown support
   - Preview tab
   - Example: "Access to CoinGecko Pro API with 10,000 calls/month"

3. **Price in USDC** (required)
   - Number input
   - Min: 0.01
   - Example: 0.10

4. **Delivery Type** (required)
   - Radio buttons:
     - ○ Instant Delivery (no verification)
     - ○ Requires Verification (agent tests product)

5. **Delivery Timeout** (optional)
   - Number input (seconds)
   - Default: 3600 (1 hour)
   - Helper text: "Time merchant has to deliver"

6. **Platform Fee** (optional)
   - Number input (basis points)
   - Default: 500 (5%)
   - Disabled (show info tooltip)

7. **Metadata JSON** (optional)
   - JSON textarea
   - Validator
   - Example:
   ```json
   {
     "apiEndpoint": "https://api.coingecko.com",
     "testCommand": "curl -H 'X-API-Key: {key}' https://api.coingecko.com/api/v3/ping"
   }
   ```

**Form Actions:**
- "Create Product" (primary button)
  - Shows confirmation modal
  - "This will create an on-chain transaction"
  - Estimate: ~0.01 TCRO gas
- "Save as Draft" (secondary) - optional
- "Cancel" (text button)

**Flow:**
1. Fill form
2. Click "Create Product"
3. Show confirmation
4. Call `POST /api/products`
5. Backend creates on-chain tx
6. Show loading (tx pending)
7. Success! Show product URL
8. Redirect to dashboard

**API Calls:**
- `POST /api/products`

**Components:**
- `CreateProductForm.tsx`
- `MarkdownEditor.tsx`
- `JSONEditor.tsx`
- `CreateProductConfirmation.tsx`

---

### **8. Order Detail Page** (`app/dashboard/orders/[id]/page.tsx`)

**Purpose:** Complete order information and actions

**Layout:**

- **Order Header**
  - Order ID (large)
  - Status badge
  - Created date
  - Timeout countdown (if pending)

- **Order Timeline** (Visual progress)
  ```
  PAID → ESCROW_CREATED → DELIVERED → (VERIFIED) → COMPLETED
  ```
  - Show current step highlighted
  - Show timestamp for each completed step
  - Show "Waiting..." for pending steps

- **Product Info Card**
  - Product name
  - Price
  - Merchant address
  - Product link

- **Payment Info Card**
  - Amount paid
  - Payment proof hash
  - x402 transaction link

- **Escrow Info Card** (if created)
  - Escrow tx hash
  - Locked amount
  - Release conditions

- **Delivery Info Card** (if delivered)
  - Delivered at timestamp
  - Delivery proof hash
  - Encrypted secret (if buyer)

- **Verification Info Card** (if verification required)
  - Verifier hired
  - Verification job ID
  - Verifier fee paid
  - Test result: ✅ Passed / ❌ Failed
  - Evidence hash

- **Actions** (Based on role & status)
  - **Merchant Actions:**
    - "Deliver Order" button (if ESCROW_CREATED)
  - **Buyer Actions:**
    - "View Secret" button (if COMPLETED)
    - "Request Refund" button (if timeout passed)
  - **Agent Actions:**
    - "Hire Verifier" button (if DELIVERED && requiresVerification)

**API Calls:**
- `GET /api/orders/:id`

**Components:**
- `OrderTimeline.tsx`
- `OrderInfoCard.tsx`
- `DeliverOrderModal.tsx`
- `ViewSecretModal.tsx`

---

### **9. Verifier Stats Page** (`app/verifier/page.tsx`)

**Purpose:** THE WOW FEATURE - Show verifier agent earnings

**This page is what judges will remember!**

**Layout:**

- **Hero Stats** (Large cards, top)
  1. **Total Earned** (HUGE number)
     - $12.47 USDC
     - Animated counter
     - Green color
  2. **Jobs Completed**
     - 623 jobs
     - Sparkline chart
  3. **Success Rate**
     - 94.3%
     - Circular progress bar
  4. **Avg Response Time**
     - 2.3 seconds
     - Lightning icon

- **Earnings Chart** (Line chart)
  - X-axis: Time (last 7 days)
  - Y-axis: Cumulative earnings in USDC
  - Show steady growth
  - Tooltip on hover

- **Recent Jobs** (Table)
  - Columns: Job ID, Product, Result, Fee, Time
  - Last 20 jobs
  - Status badges: ✅ Passed, ❌ Failed
  - Click to expand job details

- **Verifier Info Card**
  - Verifier wallet address
  - On-chain verification count
  - Link to Cronos explorer
  - "How Verification Works" (info icon)

- **Live Feed** (Right sidebar)
  - Real-time job completions
  - "🧪 Testing API #XYZ..."
  - "✅ Test passed! Earned $0.02"
  - Auto-scroll

**Mock Data for Demo:**
```typescript
const DEMO_STATS = {
  totalEarned: "12.47",
  jobsCompleted: 623,
  jobsPassed: 587,
  jobsFailed: 36,
  successRate: 94.3,
  avgResponseTime: 2300, // ms
  earningsHistory: [
    { date: "Jan 9", amount: 2.14 },
    { date: "Jan 10", amount: 4.28 },
    // ... 7 days of data
    { date: "Jan 15", amount: 12.47 }
  ]
};
```

**API Calls:**
- `GET /api/verifier/stats`

**Components:**
- `HeroStatsCards.tsx`
- `EarningsChart.tsx` (Recharts)
- `RecentJobsTable.tsx`
- `VerifierInfoCard.tsx`
- `LiveJobsFeed.tsx`

**Animation Ideas:**
- Number counter animation (0 → 12.47)
- Chart animation on load
- Confetti when page loads (celebrate earnings!)
- Pulse effect on "Total Earned"

---

### **10. Transaction Feed Page** (`app/feed/page.tsx`)

**Purpose:** Real-time activity stream

**Layout:**

- **Feed Header**
  - "Live Activity" title
  - Filter buttons: All, Purchases, Verifications, Releases, Refunds
  - Auto-refresh toggle (on by default)

- **Feed List** (Scrollable)
  - Each item shows:
    - Icon (based on type)
    - Description
    - Amount (if applicable)
    - From/To addresses (truncated)
    - Transaction hash (link)
    - Timestamp (relative: "2 min ago")
  - Grouped by date: "Today", "Yesterday", etc.
  - Load more button at bottom

- **Feed Item Examples:**
  ```
  🛍️ Order Created
  Buyer 0x5A40...4322 purchased "Market Data API" for $0.10 USDC
  2 minutes ago | Tx: 0xabc...
  
  ✅ Verification Completed
  Verifier tested product #12 - Result: Passed
  5 minutes ago | Tx: 0xdef...
  
  💰 Escrow Released
  Merchant 0x769A...5DC2 received $0.10 USDC
  10 minutes ago | Tx: 0xghi...
  
  🔄 Refund Processed
  Timeout expired - Buyer refunded $0.10 USDC
  1 hour ago | Tx: 0xjkl...
  ```

**Real-time Updates:**
- Poll `GET /api/feed` every 5 seconds
- Use React Query with `refetchInterval`
- Show notification toast when new item appears
- Option: WebSocket for instant updates (advanced)

**API Calls:**
- `GET /api/feed?limit=50`

**Components:**
- `FeedList.tsx`
- `FeedItem.tsx`
- `FeedFilters.tsx`
- `AutoRefreshToggle.tsx`

---

## 🔧 Shared Components

### **Navbar** (`components/layout/Navbar.tsx`)

**Desktop:**
```
[Logo] AgentShop    Products | Agent | Verifier | Feed    [Wallet: 0x5A40...4322 ▼]
```

**Dropdown menu (Wallet button):**
- Dashboard
- My Orders
- Settings
- Disconnect

**Mobile:**
- Hamburger menu
- Same links

### **Footer** (`components/layout/Footer.tsx`)

**3 columns:**
1. About
   - How it works
   - Docs
   - GitHub
2. Resources
   - Cronos Docs
   - x402 Guide
   - Smart Contracts
3. Social
   - Twitter
   - Discord
   - Telegram

**Bottom:**
- © 2026 AgentShop | Built with Cronos x402

---

## 🚀 Implementation Timeline

### **Week 1: Setup & Core Pages**

**Day 1: Project Setup (4 hours)**
- [ ] Create Next.js app with TypeScript + Tailwind
- [ ] Install dependencies (wagmi, viem, x402 SDK, shadcn/ui)
- [ ] Setup Web3 providers (RainbowKit/ConnectKit)
- [ ] Configure environment variables
- [ ] Setup API client with axios/fetch

**Day 2: Layout & Navigation (4 hours)**
- [ ] Build Navbar with wallet connection
- [ ] Build Footer
- [ ] Setup routing structure
- [ ] Create basic layouts
- [ ] Test wallet connection

**Day 3: Landing Page (6 hours)**
- [ ] Hero section with animations
- [ ] How it works section
- [ ] Live stats (fetch from API)
- [ ] Featured products carousel
- [ ] Benefits section
- [ ] Responsive design

**Day 4-5: Product Pages (8 hours)**
- [ ] Product listing page with filters
- [ ] Product card component
- [ ] Product detail page
- [ ] Purchase card component
- [ ] API integration
- [ ] Loading states

### **Week 2: Payment & Agent**

**Day 6-7: x402 Payment Flow (10 hours)**
- [ ] Study facilitator SDK
- [ ] Build X402PaymentModal
- [ ] Implement payment steps (1-5)
- [ ] Handle EIP-3009 signing
- [ ] Backend integration (payment-intent + confirm)
- [ ] Error handling
- [ ] Success animations
- [ ] Test with real testnet USDC

**Day 8-10: Agent Chat Interface (12 hours)**
- [ ] Chat UI layout
- [ ] Message components
- [ ] Reasoning step display
- [ ] Action cards (payment approval)
- [ ] Streaming messages (if supported)
- [ ] Budget sidebar
- [ ] Budget settings modal
- [ ] Execution history
- [ ] API integration
- [ ] Test agent flow

### **Week 3: Dashboard & Verifier**

**Day 11-12: Merchant Dashboard (8 hours)**
- [ ] Dashboard layout
- [ ] Stats cards
- [ ] Recent orders table
- [ ] My products table
- [ ] Create product page
- [ ] Deliver order modal
- [ ] Form validation
- [ ] API integration

**Day 13-14: Verifier Stats Page (8 hours)**
- [ ] Hero stats cards with animations
- [ ] Earnings chart (Recharts)
- [ ] Recent jobs table
- [ ] Live feed component
- [ ] Mock data for demo
- [ ] API integration
- [ ] Confetti animation
- [ ] Polish animations

**Day 15: Order & Feed Pages (6 hours)**
- [ ] Order detail page
- [ ] Order timeline component
- [ ] Transaction feed page
- [ ] Feed item component
- [ ] Auto-refresh logic
- [ ] Filters

### **Week 4: Polish & Testing**

**Day 16-17: UI Polish (8 hours)**
- [ ] Responsive design fixes
- [ ] Dark mode (optional)
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Animations polish
- [ ] Accessibility (a11y)

**Day 18-19: Testing (8 hours)**
- [ ] Test complete buyer flow
- [ ] Test agent flow with 2 payments
- [ ] Test merchant flow
- [ ] Test verifier stats
- [ ] Test all error cases
- [ ] Cross-browser testing
- [ ] Mobile testing

**Day 20: Demo Preparation (4 hours)**
- [ ] Create demo products
- [ ] Fund demo wallets
- [ ] Seed verifier stats
- [ ] Practice demo script
- [ ] Record demo video
- [ ] Screenshots for README

---

## 📦 Package Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    
    // Web3
    "viem": "^2.7.0",
    "wagmi": "^2.5.0",
    "@crypto.com/facilitator-client": "^1.0.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    
    // UI
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "lucide-react": "^0.344.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    
    // State & Data
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.20.0",
    "axios": "^1.6.7",
    
    // Charts & Animation
    "recharts": "^2.12.0",
    "framer-motion": "^11.0.3",
    "react-hot-toast": "^2.4.1",
    
    // Utils
    "date-fns": "^3.3.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

---

## 🎯 Critical Implementation Notes

### **x402 Integration Priority**

The x402 payment flow is THE core feature. Spend extra time here:

1. **Study the SDK thoroughly**
   - Read @crypto.com/facilitator-client docs
   - Understand EIP-3009 flow
   - Test in isolation first

2. **Handle all edge cases**
   - User rejects signature
   - Network errors
   - Insufficient balance
   - Invalid payment requirements

3. **User experience**
   - Clear instructions at each step
   - Show "NO GAS FEES" prominently
   - Loading states
   - Success celebration

### **Agent Chat UX**

The agent interface sells the vision:

1. **Show reasoning in real-time**
   - Don't just show final result
   - Display thinking process
   - Make it feel alive

2. **Clear action cards**
   - Payment approvals should be obvious
   - Show amounts clearly
   - "Approve $0.10 payment to merchant"
   - "Approve $0.02 payment to verifier"

3. **Visual feedback**
   - Progress indicators
   - Tool call animations
   - Success checkmarks

### **Verifier Stats Impact**

This page wins the demo:

1. **Make numbers impressive**
   - Use mock data if needed
   - 623 jobs, $12.47 earned
   - Animate on load

2. **Visual appeal**
   - Beautiful charts
   - Green money colors
   - Confetti effect

3. **Tell the story**
   - "This verifier agent has autonomously earned $12.47"
   - "94.3% success rate across 623 jobs"
   - "Average 2.3s response time"

---

## 🎬 Demo Script (90 seconds)

Use this script when recording:

```
[0-10s] Landing Page
"AgentShop - where AI agents buy and verify digital products with zero gas fees"

[10-20s] Browse Products
"Merchants list digital goods - API keys, datasets, access tokens"

[20-35s] Agent Chat
"Let's ask our agent: 'Buy and verify the Market Data API'"
- Show reasoning: Search → Check budget → Purchase
- Show x402 payment #1: $0.10, $0 gas fee

[35-50s] Verifier Hiring
"Agent detects verification needed"
- Show x402 payment #2: $0.02 to verifier agent
- Show verifier testing in real-time
- "Test passed! ✅"

[50-65s] Escrow Release
"Verification complete - escrow releases to merchant"
- Show order timeline
- Show transaction on Cronos explorer

[65-90s] THE REVEAL
"Here's the magic - our verifier agent:"
- Show stats: 623 jobs completed
- $12.47 USDC earned autonomously
- 94.3% success rate
"This is the future of agent economy - autonomous agents earning money by providing value"
```

---

## ✅ Definition of Done

Frontend is complete when:

1. [ ] All 10 pages implemented and functional
2. [ ] x402 payment flow works end-to-end
3. [ ] Agent chat executes purchases successfully
4. [ ] Verifier stats display real/mock data
5. [ ] Responsive design (mobile, tablet, desktop)
6. [ ] All API endpoints integrated
7. [ ] Error handling on all forms
8. [ ] Loading states everywhere
9. [ ] Transaction feed updates in real-time
10. [ ] Demo video recorded (<90 seconds)
11. [ ] Deployed to Vercel
12. [ ] README with screenshots

---

## 🚨 Potential Blockers

### **1. x402 SDK Documentation**
- **Risk:** SDK may be incomplete or undocumented
- **Mitigation:** Study official Cronos examples, join Discord for help, read SDK source code

### **2. EIP-3009 Signing**
- **Risk:** Complex to implement correctly
- **Mitigation:** Use facilitator client library, don't implement from scratch

### **3. Agent Streaming**
- **Risk:** Backend may not support SSE/WebSocket
- **Mitigation:** Use polling with fast interval (500ms) to simulate real-time

### **4. Verifier Stats**
- **Risk:** May not have enough real data for impressive demo
- **Mitigation:** Use mock data generator, seed database with fake jobs

### **5. Mobile Responsiveness**
- **Risk:** Complex layouts may break on mobile
- **Mitigation:** Mobile-first design, test early and often

---

## 📚 Resources

**Cronos Documentation:**
- x402 API Reference: https://docs.cronos.org/cronos-x402-facilitator/api-reference
- x402 Guide: https://docs.cronos.org/cronos-x402-facilitator
- Cronos Testnet: https://docs.cronos.org/getting-started/cronos-testnet-faucet

**Web3 Libraries:**
- viem: https://viem.sh
- wagmi: https://wagmi.sh
- RainbowKit: https://rainbowkit.com

**UI Libraries:**
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Recharts: https://recharts.org

**Next.js:**
- App Router: https://nextjs.org/docs/app
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## 🎉 Success Metrics

Frontend is successful if:

1. **Functional:** All user flows work without errors
2. **Beautiful:** Modern, polished UI that impresses judges
3. **Fast:** Pages load quickly, interactions feel snappy
4. **Clear:** User understands x402 benefits immediately
5. **Impressive:** Verifier stats make judges say "wow"

---

**Next Step:** Start with project setup (Day 1). Create Next.js app and install dependencies.

**Estimated Total Time:** 80-100 hours (4 weeks)

**Ready to build?** Let's create the future of agent commerce! 🚀
