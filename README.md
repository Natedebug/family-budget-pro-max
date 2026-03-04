
A fun, engaging family budget tracking app for iOS that makes saving money exciting through challenges, points, badges, and a family leaderboard system.

## ✨ Features

### 🎮 Gamification System
- **Daily Challenges**: Fresh challenges every day (No Coffee Shop Day, Pack Your Lunch, Zero Spending, etc.)
- **Weekly Challenges**: Bigger savings goals for the week (No Takeout Week, Weekly Savings Goal, etc.)
- **Member Challenges**: Family members can challenge each other to save more
- **Points & Rewards**: Earn 40-100 points for daily challenges, 300-750 for weekly challenges
- **Streak Tracking**: Build daily streaks with flame icons 🔥
- **Badge System**: Unlock 8 different achievements (First Challenge, Week Warrior, 7-Day Streak, etc.)
- **Family Leaderboard**: Real-time rankings showing everyone's points, streaks, and badges

### 💰 Budget Management
- **Category-Based Budgeting**: Track spending across multiple categories (Groceries, Gas, Dining, etc.)
- **Personal Budgets**: Separate fun money for Husband, Wife, and Kids
- **Monthly Overview**: See income, budgeted amounts, and remaining balance at a glance
- **Visual Progress Bars**: Color-coded indicators showing spending vs. budget
- **Transaction Tracking**: Record expenses with merchant, date, and category

### 💾 Modern Architecture
- **SwiftData + CloudKit**: Unlimited storage with automatic cloud sync across family devices
- **No Storage Limits**: No more 1MB iCloud Key-Value Store limitation
- **Proper Error Handling**: User-friendly error messages with recovery suggestions
- **Incremental Saves**: Only changed data is saved, improving performance
- **Modular Code Structure**: Clean separation of Models, Views, ViewModels, and Services

### 🎨 Bold, Fun UI
- **Vibrant Gradients**: Eye-catching color schemes (blue-purple, orange-red, yellow-green)
- **Playful Emojis**: Fun icons throughout (💰 📊 🎯 🔥 🏆 ⚔️)
- **Celebration Animations**: Confetti and point notifications when challenges are completed
- **Material Design**: Cards with shadows and depth
- **Tab Navigation**: Easy access to Budget, Challenges, Transactions, Savings, Chat, and Settings

## 📱 Screenshots

### Challenges Tab
- Family leaderboard with medals (🥇🥈🥉)
- Today's daily challenge with icon, description, and point reward
- This week's challenge card
- Member-to-member challenges with accept/decline buttons
- Celebration overlay when challenges are completed

### Budget Dashboard
- Monthly overview with income, budgeted, and remaining amounts
- Category cards with icons, spending progress, and remaining budget
- Latest transaction preview for each category
- Gradient "Add Expense" button

### Category Cards
- Circular icon with category color
- Progress bar showing spending vs. budget
- Color-coded remaining amount (green/red)
- Latest transaction details

## 🏗️ Architecture

### Models (SwiftData)
- `BudgetCategory` - Budget categories with allocated amounts
- `Transaction` - Expense transactions linked to categories
- `SavingsDeposit` - Savings tracking
- `DailyChallenge` - Daily and weekly challenge templates
- `FamilyMember` - Family member profiles with points, badges, streaks
- `Challenge` - Member-to-member challenges
- `ChatMessage` - Family chat messages
- `AppSettings` - App configuration

### ViewModels (@Observable)
- `BudgetViewModel` - Budget dashboard state and logic
- `SavingsViewModel` - Savings tracking state

### Services
- `DataService` - SwiftData persistence with CloudKit sync
- `ReceiptStorageService` - Image storage with compression (max 500KB)

### Views
- **Main/** - Tab navigation
- **Budget/** - Budget dashboard and transaction entry
- **Challenges/** - Challenge system, leaderboard, celebrations
- **Transactions/** - Transaction list with search and filtering
- **Savings/** - Savings tracking
- **Chat/** - Family chat (expandable)
- **Settings/** - App settings
- **Components/** - Reusable UI components

## 🚀 Getting Started

### Prerequisites
- Xcode 15.0 or later
- iOS 17.0 or later
- Apple Developer Account (for CloudKit)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/family-budget-app.git
cd family-budget-app
```

2. Open the project in Xcode:
```bash
open FamilyBudgetApp/FamilyBudgetApp.xcodeproj
```

3. Enable CloudKit:
   - Select the project in Xcode
   - Go to **Signing & Capabilities**
   - Click **+ Capability**
   - Add **iCloud**
   - Check **CloudKit**
   - Select or create a CloudKit container

4. Build and run on your device or simulator

### First Launch
On first launch, the app will automatically:
- Create default budget categories (Groceries, Gas, Utilities, etc.)
- Set up default family members (Dad, Mom, Kids)
- Generate the first daily and weekly challenges
- Initialize app settings

## 📊 Data Models

### Challenge Generation
- **Daily challenges** are auto-generated each day from 10 templates
- **Weekly challenges** are auto-generated each week from 5 templates
- Challenges include icon, color, description, target savings, and point rewards

### Gamification
- **Points**: Awarded for completing challenges (40-750 points)
- **Streaks**: Consecutive days of activity, resets if skipped
- **Badges**: 8 achievements unlocked through various milestones
- **Leaderboard**: Sorted by total points, showing streaks and badges

## 🔄 CloudKit Sync

All data syncs automatically across family devices:
- Budget categories and allocations
- Transactions and receipts
- Savings deposits
- Challenges and completions
- Family member points, streaks, and badges
- Chat messages

Changes are saved incrementally and sync in the background. No manual sync needed!

## 🎯 Usage

### Completing Challenges
1. Go to the **Challenges** tab
2. Select your family member from the top-right menu
3. Tap **Complete Challenge** on today's or this week's challenge
4. See your celebration animation and points awarded!
5. Check the leaderboard to see your family ranking

### Creating Member Challenges
1. Go to the **Challenges** tab
2. Tap the **+** button in the Member Challenges section
3. Select a challenge template
4. Choose who to challenge
5. Set the target savings amount
6. Send the challenge!

### Adding Transactions
1. Go to the **Budget** tab
2. Tap the **Add Expense** button
3. Enter amount, merchant, category, who paid, and date
4. Tap **Add**
5. Watch your budget update in real-time!

## 🛠️ Technical Highlights

- **SwiftData** for modern data persistence (iOS 17+)
- **@Observable** macro for reactive ViewModels
- **@Query** for automatic data updates
- **CloudKit** integration for family sharing
- **FetchDescriptor** with predicates for efficient queries
- **AsyncImage** for photo handling
- **Proper error handling** with user-friendly messages
- **Type-safe** with Swift's modern concurrency

## 📝 Migration Notes

This app is a complete rewrite from a monolithic 4,252-line file to a modern, modular architecture:

**Before:**
- Single massive file
- AppStorage/iCloud KVS (1MB limit)
- Manual JSON encoding/decoding
- No error handling
- Re-saved everything on every change

**After:**
- Clean modular structure (40+ files)
- SwiftData + CloudKit (unlimited storage)
- Automatic persistence
- Comprehensive error handling
- Incremental saves (performance optimized)

## 🤝 Contributing

This is a personal/family project, but suggestions are welcome! Feel free to open issues for bugs or feature requests.

## 📄 License

This project is for personal use. Feel free to use it as inspiration for your own family budget app!

## 🙏 Acknowledgments

Built with love for families who want to make saving money fun! 💰🎉

---

**Made with SwiftUI, SwiftData, and CloudKit**
