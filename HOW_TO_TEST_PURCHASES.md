# 🧪 HOW TO TEST PURCHASES - STEP BY STEP

## ✅ **Servers Running!**

- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000

---

## 🎯 **Test MetaMask Purchase (Manual Buy)**

### **Step 1: Open Application**
Click the browser preview button above, or go to:
```
http://localhost:3000
```

### **Step 2: Connect Wallet**
1. Click **"Connect Wallet"** button in top right
2. Select **MetaMask**
3. Approve connection
4. Make sure you're on **Cronos Testnet** (Chain ID 338)

### **Step 3: Go to Marketplace**
1. Click **"Marketplace"** in navigation
2. You should see your 4 products:
   - news api key ($0.02)
   - CoinDCX API Key ($0.01)
   - vjhmvh ($0.01)
   - CoinDCX API Key ($0.04)

### **Step 4: Buy a Product**
1. Click on any product (e.g., "news api key")
2. Click **"Buy Now"** button
3. **MetaMask popup will appear**
4. Click **"Confirm"** in MetaMask
5. Wait 15-20 seconds

### **Step 5: See Success!**
You should see:
```
✅ Toast: "🎉 Purchase successful! Transaction confirmed."
✅ Automatically redirects to Dashboard
✅ Order shows in dashboard as "PAID"
```

---

## 🤖 **Test Agent Purchase (AI Auto-Buy)**

### **Step 1: Go to Agent Chat**
Click **"Agent Chat"** in navigation, or go to:
```
http://localhost:3000/agent
```

### **Step 2: Search Products**
Type in chat:
```
show me all products under $1
```

**You should see:**
```
Found 3 products:

1. news api key - $0.02
   Merchant: 0x769A...5DC2

2. CoinDCX API Key - $0.01
   Merchant: 0x769A...5DC2

3. vjhmvh - $0.01
   Merchant: 0x769A...5DC2
```

### **Step 3: Buy via Agent**
Type in chat:
```
buy the news api
```

**You should see:**
```
✅ Successfully purchased news api key!

Order ID: abc123...
Amount: $0.02
```

### **Step 4: Check Dashboard**
1. Click **"Dashboard"** in navigation
2. You should see the order listed as **"PAID"**

---

## 📊 **Where to See Purchased Orders**

### **Dashboard View**
Go to: http://localhost:3000/dashboard

**You should see:**
- **Recent Orders** section
- Each order shows:
  - ✅ Product name
  - ✅ Amount paid
  - ✅ Status: **PAID** (green badge)
  - ✅ Buyer address
  - ✅ Date/time

**Stats at top:**
- **0 Orders** → Changes to **1, 2, 3...** as you buy
- **$0.00 Revenue** → Updates to total of all purchases

---

## 🔍 **How to Verify It's Working**

### **After Purchase, Check These 3 Places:**

**1. Browser Toast Notifications**
```
1. "Creating order..." (loading)
2. "Order created! Sending payment..." (success)
3. "⏳ Waiting for transaction confirmation..." (loading)
4. "🎉 Purchase successful! Transaction confirmed." (success)
```

**2. MetaMask Activity**
```
Open MetaMask → Activity tab
You should see: "Sent" with green "Confirmed" status
```

**3. Dashboard**
```
Go to Dashboard
See your order with "PAID" badge
Revenue counter updates
```

---

## 🐛 **If Purchase Gets Stuck**

If you see "⏳ Waiting for transaction confirmation..." forever:

### **Clear Browser Cache**
```bash
1. Press Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
2. Select "All time"
3. Check ALL boxes
4. Click "Clear data"
5. Refresh page (Cmd+R)
```

### **Check Browser Console**
```bash
1. Press F12 or Cmd+Option+I
2. Click "Console" tab
3. Look for these logs:
   - "Sending transaction to: 0x..."
   - "Transaction sent, waiting for confirmation..."
   - "Transaction confirmed! Calling confirmPayment..."
   - "Payment confirmed: { success: true }"
```

If you see all these logs, transaction worked!

---

## ✅ **Expected User Flow**

### **Perfect Purchase Flow:**
```
1. Click "Buy Now" → MetaMask popup appears ✅
2. Click "Confirm" in MetaMask ✅
3. Wait 15-20 seconds → Toast shows confirmation ✅
4. Redirect to dashboard → Order shows as PAID ✅
5. Revenue updates ✅
6. Buy button changes to "Already Purchased" ✅
```

### **What You'll See in Dashboard:**

**Before Purchase:**
```
Recent Orders: "📦 No orders yet"
Revenue: "$0.00"
Orders: "0"
```

**After 1st Purchase:**
```
Recent Orders:
  news api key
  $0.02 USDC
  PAID ✅
  Jan 22, 2026

Revenue: "$0.02"
Orders: "1"
```

**After 2nd Purchase:**
```
Recent Orders:
  CoinDCX API Key (newest)
  $0.01 USDC
  PAID ✅
  
  news api key
  $0.02 USDC
  PAID ✅

Revenue: "$0.03"
Orders: "2"
```

---

## 🎯 **Quick Test Checklist**

### **Test 1: MetaMask Purchase**
- [ ] Connect wallet
- [ ] Go to marketplace
- [ ] Click product
- [ ] Click "Buy Now"
- [ ] Approve MetaMask
- [ ] Wait for confirmation
- [ ] Check dashboard shows PAID

### **Test 2: Agent Purchase**
- [ ] Go to Agent Chat
- [ ] Type "show me all products"
- [ ] Type "buy the news api"
- [ ] See success message
- [ ] Check dashboard shows PAID

### **Test 3: Multiple Purchases**
- [ ] Buy 2-3 different products
- [ ] Check revenue counter increases
- [ ] Check all orders show as PAID
- [ ] Check order count increases

---

## 📸 **What to Document**

For your hackathon submission, screenshot:

1. **MetaMask confirmation** (shows transaction sent)
2. **Dashboard with PAID orders** (shows purchases completed)
3. **Agent chat success** (shows AI purchasing)
4. **Cronos Explorer transaction** (shows on-chain confirmation)

---

## 🚀 **Ready to Test!**

**Servers are running:**
- Backend: ✅ http://localhost:3001
- Frontend: ✅ http://localhost:3000

**Open the browser preview and start testing!** 🎉

Everything should work perfectly now!
