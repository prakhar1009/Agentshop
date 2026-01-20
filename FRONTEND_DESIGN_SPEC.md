# 🎨 AgentShop Frontend - DataForge-Inspired Design

**Reference:** https://data-forge-seven.vercel.app/  
**Goal:** Modern, clean UI inspired by DataForge, adapted for AgentShop

---

## 📊 DataForge Analysis

### **Design Elements Identified:**

1. **Navigation Bar**
   - Logo (left)
   - Links: Marketplace, Upload, Dashboard (center/right)
   - Clean, minimal design
   - Likely sticky on scroll

2. **Hero Section**
   - Large headline (2 lines, bold)
   - Subheadline (description)
   - CTA buttons
   - Gradient background or animated background

3. **Value Proposition Cards** (3 cards)
   - Icon + Headline + Description
   - Grid layout (3 columns)
   - Card hover effects

4. **Features Section**
   - Section title + description
   - 6 feature cards in grid (2 rows × 3 cols)
   - Icon + Headline + Description per card

5. **Problem/Solution Section**
   - Two-column comparison
   - "Current Problems" vs "How We Solve It"
   - 4 points each side
   - Icon bullets

6. **Stats Section**
   - 4 stat cards
   - Large numbers
   - Labels below
   - Horizontal layout

7. **Footer**
   - Platform, Resources, Company, Legal sections
   - Social links
   - Copyright

### **Color Scheme (Inferred):**
- Primary: Blue/Purple gradients
- Background: Dark or gradient
- Cards: White/light with shadows
- Text: Dark on light, light on dark
- Accents: Bright colors for CTAs

### **Typography:**
- Large, bold headlines
- Clean sans-serif font (likely Inter or similar)
- Good spacing and hierarchy
- Readable descriptions

---

## 🎯 AgentShop Adaptation

### **Mapping DataForge → AgentShop**

| DataForge Concept | AgentShop Equivalent |
|-------------------|---------------------|
| "Monetize Your Content for AI" | "AI Agents Buy Digital Products. Gasless. Autonomous." |
| IpNFT Minting | Product Listing with Smart Contracts |
| Fixed-Price AI Licensing | x402 Gasless Payments |
| Automated Royalties | Escrow & Auto-Release |
| Social Integration | Agent Chat Interface |
| Real-time Analytics | Verifier Stats Dashboard |
| Decentralized Marketplace | Product Marketplace |

---

## 📱 Page Structure

### **1. Landing Page** (`/`)

**Navigation:**
```
[🤖 AgentShop]    Marketplace | Agent Chat | Verifier | Dashboard    [Connect Wallet]
```

**Hero Section:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        AI Agents Buy Digital Products
         Gasless. Autonomous. Verified.
         
  The first marketplace where AI agents purchase and verify
  products autonomously with zero gas fees using Cronos x402
  
  [Browse Products]  [Try Agent Chat]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: Gradient (purple/blue) with subtle animation
```

**Value Props Section:** (3 cards)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   💸 Zero    │  │   🤖 AI      │  │   ✅ Auto    │
│   Gas Fees   │  │   Powered    │  │   Verified   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ x402 gasless │  │ Autonomous   │  │ Verifier     │
│ payments for │  │ agents buy & │  │ agents test  │
│ all txs      │  │ verify goods │  │ & confirm    │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Features Section:** (6 feature cards)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Powerful Features for Agent Commerce
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Row 1:
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 🛍️ Product      │ │ 💳 x402         │ │ 🔒 Smart       │
│ Marketplace     │ │ Payments        │ │ Contracts      │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ List digital    │ │ EIP-3009 gasless│ │ Escrow vault    │
│ products with   │ │ payments with   │ │ protects buyers │
│ on-chain proof  │ │ instant settle  │ │ until delivery  │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Row 2:
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 🤖 Agent Chat   │ │ ✅ Verification │ │ 📊 Real-time    │
│ Interface       │ │ Service         │ │ Feed            │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ AI agents       │ │ Verifier agents │ │ Live activity   │
│ execute         │ │ test products   │ │ stream of all   │
│ purchases       │ │ and earn fees   │ │ transactions    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Problem/Solution Section:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Solving AI Agent Commerce Challenges
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────┐   ┌─────────────────────────┐
│ Current Industry        │   │ How AgentShop Solves    │
│ Problems                │   │ These Problems          │
├─────────────────────────┤   ├─────────────────────────┤
│ ❌ High Gas Fees        │   │ ✅ Zero Gas x402        │
│ Agents need ETH for     │   │ Gasless payments via    │
│ every transaction       │   │ EIP-3009 signatures     │
│                         │   │                         │
│ ❌ No Trust Layer       │   │ ✅ Escrow Protection    │
│ Direct payments risk    │   │ Smart contracts hold    │
│ fraud and scams         │   │ funds until delivery    │
│                         │   │                         │
│ ❌ Manual Verification  │   │ ✅ Autonomous Verifiers │
│ Buyers must test        │   │ AI agents verify for    │
│ products themselves     │   │ small fee ($0.02)       │
│                         │   │                         │
│ ❌ Complex Integration  │   │ ✅ Simple API           │
│ Hard to integrate       │   │ REST API + Agent SDK    │
│ payments into agents    │   │ ready to use            │
└─────────────────────────┘   └─────────────────────────┘
```

**Stats Section:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Live Platform Metrics (Cronos Testnet)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    47           12          $24.30        623
 Products     Merchants    Volume (USDC)  Verifications
  Listed       Active      Processed      Completed
```

**CTA Section:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         Ready to Experience Agent Commerce?
         
  [Start Selling] [Chat with Agent] [View Docs]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### **2. Marketplace Page** (`/marketplace`)

**DataForge style: Grid of content cards**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Marketplace              [Search...] [Filters▾]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sidebar:                Main Grid:
┌──────────┐           ┌────┐ ┌────┐ ┌────┐
│ Filters  │           │ P1 │ │ P2 │ │ P3 │
│          │           ├────┤ ├────┤ ├────┤
│ Price    │           │$0.1│ │$0.2│ │$0.5│
│ ▓▓░░░    │           └────┘ └────┘ └────┘
│          │
│ Type     │           ┌────┐ ┌────┐ ┌────┐
│ ☑ API    │           │ P4 │ │ P5 │ │ P6 │
│ ☐ Data   │           ├────┤ ├────┤ ├────┤
│ ☑ Access │           │$1.0│ │$0.3│ │$2.0│
│          │           └────┘ └────┘ └────┘
│ Verified │
│ ☑ Yes    │           ... more products
│ ☐ No     │
└──────────┘
```

**Product Card Design:**
```
┌─────────────────────────┐
│ [Image or Gradient]     │
│                         │
│ CoinGecko API Key       │
│ 🏪 0x5A40...4322        │
│                         │
│ Real-time crypto data   │
│ with 10K calls/month    │
│                         │
│ $0.10 USDC   [✅ Verified]│
│                         │
│ [Buy Now]    [Details]  │
└─────────────────────────┘
```

---

### **3. Product Detail Page** (`/products/[id]`)

**Layout inspired by DataForge's clean content pages:**

```
┌────────────────────────────────────┬──────────────────┐
│ [← Back to Marketplace]            │                  │
│                                    │  ┌─────────────┐ │
│ CoinGecko Pro API Key              │  │ $0.10 USDC  │ │
│ Listed by 0x5A40...4322            │  │             │ │
│                                    │  │ Platform Fee│ │
│ Description:                       │  │ $0.01 (5%)  │ │
│ Access to CoinGecko Pro API with   │  │             │ │
│ 10,000 API calls per month. Get    │  │ Total:      │ │
│ real-time crypto prices, market    │  │ $0.11 USDC  │ │
│ data, and historical charts.       │  │             │ │
│                                    │  │ [Buy Now]   │ │
│ ✅ Requires Verification           │  │             │ │
│ ⏱️ 1 hour delivery timeout         │  │ Or          │ │
│ 📦 Instant delivery type           │  │             │ │
│                                    │  │ [Buy with   │ │
│ Metadata:                          │  │  Agent]     │ │
│ {                                  │  │             │ │
│   "endpoint": "api.coingecko.com", │  └─────────────┘ │
│   "testCommand": "curl ..."        │                  │
│ }                                  │  Recent Orders:  │
│                                    │  • 2 min ago     │
│ On-chain Product ID:               │  • 15 min ago    │
│ 0xF21B698679e3d3C23216412...       │  • 1 hour ago    │
└────────────────────────────────────┴──────────────────┘
```

---

### **4. Agent Chat Page** (`/agent`)

**Clean chat interface like modern AI tools:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🤖 Agent Chat              Budget: $5.00/$10.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────┐
│                                             │
│  👤 Buy Market Data API                     │
│                                             │
│  🤖 Let me help you with that...            │
│                                             │
│     💭 Thinking: User wants API key         │
│     🔍 Searching products...                │
│     📊 Found 3 matching products            │
│     ✅ Best match: CoinGecko API - $0.10    │
│     💰 Checking budget... Approved!         │
│                                             │
│  🤖 I found CoinGecko API for $0.10 USDC    │
│                                             │
│     ┌─────────────────────────────┐         │
│     │ 💳 Payment Required         │         │
│     │ Amount: $0.10 USDC          │         │
│     │ To: Merchant 0x5A40...      │         │
│     │ [Approve Payment] [Cancel]  │         │
│     └─────────────────────────────┘         │
│                                             │
│  👤 [Approved]                              │
│                                             │
│  🤖 ✅ Payment confirmed!                   │
│     📦 Creating order...                    │
│     🔍 Product requires verification        │
│                                             │
│     ┌─────────────────────────────┐         │
│     │ 🧪 Hire Verifier?           │         │
│     │ Fee: $0.02 USDC             │         │
│     │ [Approve] [Skip]            │         │
│     └─────────────────────────────┘         │
└─────────────────────────────────────────────┘

Type your message...                    [Send]

Suggested prompts:
[Find cheapest API] [Verify my purchase] [Show my orders]
```

---

### **5. Verifier Stats Page** (`/verifier`)

**DataForge's stats section expanded into full page:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            Verifier Agent Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hero Stats (Large cards):
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   💰 Total   │ │   📊 Jobs    │ │   ✅ Success │ │   ⚡ Avg     │
│   Earned     │ │   Completed  │ │   Rate       │ │   Response   │
│              │ │              │ │              │ │              │
│   $12.47     │ │     623      │ │    94.3%     │ │    2.3s      │
│   USDC       │ │    jobs      │ │  rate        │ │  time        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

Earnings Chart:
┌────────────────────────────────────────────────────────┐
│ Cumulative Earnings Over Time                          │
│                                                    •   │
│                                               •        │
│                                          •             │
│                                     •                  │
│                                •                       │
│                           •                            │
│  0 ────────────────────────────────────────────── 15  │
│    Jan 9  Jan 10  Jan 11  Jan 12  Jan 13  Jan 14      │
└────────────────────────────────────────────────────────┘

Recent Jobs:
┌─────────────────────────────────────────────────────┐
│ Job ID        Product         Result  Fee    Time   │
├─────────────────────────────────────────────────────┤
│ #job-623      CoinGecko API   ✅ Pass $0.02  2.1s   │
│ #job-622      Twitter API     ✅ Pass $0.02  2.5s   │
│ #job-621      Weather API     ❌ Fail $0.00  1.8s   │
│ #job-620      News Feed       ✅ Pass $0.02  2.9s   │
└─────────────────────────────────────────────────────┘
```

---

### **6. Dashboard** (`/dashboard`)

**Merchant control panel:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Merchant Dashboard              [+ Create Product]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stats:
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Products   │ │ Orders     │ │ Revenue    │ │ Pending    │
│     12     │ │     47     │ │  $24.30    │ │      3     │
└────────────┘ └────────────┘ └────────────┘ └────────────┘

Recent Orders:
┌────────────────────────────────────────────────────────┐
│ Order ID     Product          Buyer     Status  Action │
├────────────────────────────────────────────────────────┤
│ #ord-47      CoinGecko API    0x5A4..  PAID    Deliver│
│ #ord-46      Twitter API      0x769..  DELIVERED   -  │
│ #ord-45      Weather Data     0xAbc..  COMPLETED   -  │
└────────────────────────────────────────────────────────┘

My Products:
┌────────────────────────────────────────────────────────┐
│ Name              Price    Orders   Status      Action │
├────────────────────────────────────────────────────────┤
│ CoinGecko API     $0.10       23    Active      Edit   │
│ Twitter API       $0.20       15    Active      Edit   │
│ Weather Data      $0.05        9    Inactive  Activate │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System

### **Colors** (DataForge-inspired)

```css
:root {
  /* Primary */
  --primary: 262 83% 58%; /* Purple/Blue */
  --primary-foreground: 0 0% 100%;
  
  /* Background */
  --background: 222 47% 11%; /* Dark blue-gray */
  --foreground: 213 31% 91%; /* Light text */
  
  /* Cards */
  --card: 217 33% 17%; /* Dark card bg */
  --card-foreground: 213 31% 91%;
  
  /* Accent */
  --accent: 262 83% 58%; /* Purple */
  --accent-foreground: 0 0% 100%;
  
  /* Success */
  --success: 142 76% 36%; /* Green */
  
  /* Warning */
  --warning: 38 92% 50%; /* Orange */
  
  /* Error */
  --destructive: 0 84% 60%; /* Red */
}
```

### **Typography**

```css
/* Headings */
h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; }
h2 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
h3 { font-size: 1.75rem; font-weight: 600; line-height: 1.3; }

/* Body */
body { font-family: 'Inter', sans-serif; font-size: 1rem; line-height: 1.6; }

/* Large text */
.hero-text { font-size: 4rem; font-weight: 900; }
.stat-number { font-size: 3rem; font-weight: 800; }
```

### **Spacing**

```css
/* Container */
.container { max-width: 1280px; padding: 0 2rem; margin: 0 auto; }

/* Sections */
.section { padding: 6rem 0; }

/* Cards */
.card { padding: 2rem; border-radius: 1rem; }

/* Grid */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
```

### **Effects**

```css
/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

/* Gradient backgrounds */
.gradient-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-card {
  background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
}

/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 🚀 Implementation Steps

### **Phase 1: Setup (Day 1)**

```bash
# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app

cd frontend

# Install dependencies
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast \
  lucide-react class-variance-authority clsx tailwind-merge \
  zustand @tanstack/react-query axios \
  viem wagmi @rainbow-me/rainbowkit \
  recharts framer-motion react-hot-toast \
  date-fns zod

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

### **Phase 2: Design System (Day 1-2)**

1. **Configure Tailwind** with DataForge colors
2. **Setup shadcn/ui** components
3. **Create base layout** (Navbar, Footer)
4. **Setup Web3 providers**

### **Phase 3: Landing Page (Day 2-3)**

1. Hero section with gradient
2. Value props cards (3 cards)
3. Features grid (6 cards)
4. Problem/Solution section
5. Stats section
6. CTA section

### **Phase 4: Core Pages (Day 4-7)**

1. Marketplace page with filters
2. Product detail page
3. Agent chat interface
4. Verifier stats dashboard
5. Merchant dashboard

### **Phase 5: x402 Integration (Day 8-10)**

1. Payment modal component
2. EIP-3009 signing flow
3. Backend API integration
4. Error handling

### **Phase 6: Polish (Day 11-14)**

1. Animations (Framer Motion)
2. Loading states
3. Mobile responsive
4. Testing

---

## 📋 Components to Build

### **Layout Components**
- `Navbar.tsx` - Top navigation with wallet
- `Footer.tsx` - Footer with links
- `Container.tsx` - Max-width wrapper
- `Section.tsx` - Page section wrapper

### **Landing Page**
- `HeroSection.tsx` - Hero with gradient
- `ValuePropCard.tsx` - 3 value prop cards
- `FeatureCard.tsx` - 6 feature cards
- `ProblemSolutionSection.tsx` - Comparison
- `StatsSection.tsx` - Live metrics
- `CTASection.tsx` - Final CTA

### **Marketplace**
- `ProductGrid.tsx` - Grid of products
- `ProductCard.tsx` - Single product card
- `FilterSidebar.tsx` - Filters
- `SearchBar.tsx` - Search input

### **Product Detail**
- `ProductHero.tsx` - Product header
- `PurchaseCard.tsx` - Sticky buy card
- `ProductMetadata.tsx` - Metadata display

### **Agent Chat**
- `ChatInterface.tsx` - Main chat UI
- `MessageBubble.tsx` - Message component
- `ReasoningCard.tsx` - Agent thinking display
- `ActionCard.tsx` - Payment approval card
- `BudgetBar.tsx` - Budget display

### **Verifier**
- `StatCard.tsx` - Large stat display
- `EarningsChart.tsx` - Line chart
- `JobsTable.tsx` - Recent jobs table

### **Dashboard**
- `DashboardStats.tsx` - 4 stat cards
- `OrdersTable.tsx` - Orders list
- `ProductsTable.tsx` - Products list

### **Shared**
- `Card.tsx` - Base card component
- `Button.tsx` - Button variants
- `Badge.tsx` - Status badges
- `Loading.tsx` - Loading spinner
- `Modal.tsx` - Modal wrapper

---

## 🎬 Next Steps

1. **Review this design spec**
2. **Start with Phase 1** - Project setup
3. **Follow DataForge's visual style**
4. **Integrate with AgentShop backend**

Ready to build? Let's create a beautiful frontend! 🚀
