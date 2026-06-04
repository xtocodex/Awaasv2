# Real Estate VR Development Platform - Codebase Analysis

## Project Overview

**Project Name:** Real Estate VR Development Platform (nb-dashboard)  
**Technology Stack:** React + Vite + Tailwind CSS + Firebase  
**Purpose:** A full-fledged web application for VR Real Estate Management with role-based access control

---

## Architecture & High-Level Structure

### Tech Stack
- **Frontend Framework:** React 18+ with Vite (build tool)
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** Radix UI + custom shadcn components
- **Authentication:** Firebase (custom email/password login)
- **Database:** Firebase Firestore (NoSQL)
- **Routing:** React Router
- **Icons:** Lucide React, Material-UI Icons
- **State Management:** React Context API (AuthContext)

### Key Dependencies
- `@radix-ui/*` - Headless UI components (40+ components)
- `@mui/material` - Material Design components
- `firebase` - Backend services
- `date-fns` - Date utilities
- `embla-carousel-react` - Carousel component
- `canvas-confetti` - Animation effects

---

## Application Structure

### Pages (Routes)
```
/ (Landing)           → Public landing page
/login               → Login page (role-based)
/dashboard           → Protected dashboard (admin/builder/sales_manager/member)
/* (404)             → Not found page
```

### Core Authentication Flow

**AuthContext** (`src/context/AuthContext.jsx`)
- Manages user profile, role, and loading state
- Provides `login()` and `logoutUser()` methods
- Persists session in localStorage via `getSession()`

**ProtectedRoute** (`src/components/ProtectedRoute.jsx`)
- Wrapper component that redirects unauthenticated users to login
- Guards the `/dashboard` route

**Role-Based Users**
```
└── Admin
    └── Builder(s)
        └── Sales Manager(s)
            └── Member(s)
└── Player (flat hierarchy, separate collection)
```

### Firebase Services

#### 1. **Authentication Service** (`src/firebase/authService.js`)
- `loginWithEmail(email, password)` - Multi-collection login (searches across all 4 roles)
- `createUser()` - Creates users in appropriate Firestore collection
- `deleteUser()` - Deletes user documents
- `getSession()` / `saveSession()` - localStorage session management
- Uses **plaintext passwords** (⚠️ Security concern - should use hashing)

**Firestore Collections:**
- `admins` - Admin users
- `builders` - Builder users
- `salesmanager` - Sales manager users
- `members` - Member users
- (Players stored separately in `players` collection)

#### 2. **User Service** (`src/firebase/userService.js`)
- `getBuildersByAdmin(adminEmail)` - Hierarchical data retrieval
- `getSalesManagersByBuilder(builderEmail)`
- `getMembersBySalesManager(smEmail)`
- `getAllUsersUnderAdmin(adminEmail)` - Full hierarchy
- `getPlayers()` - Fetch all players
- `getNextType()` - Generate next sequential type ID
- Uses `created_by` field to track user hierarchy

#### 3. **Firebase Config** (`src/firebase/config.js`)
- Initializes Firebase app with `nelachala-homes` project credentials
- Exports Firestore instance

---

## Component Architecture

### Layout Components
```
Layout                  → Main layout wrapper with sidebar
├── Sidebar              → Navigation with role-based menu items
└── Main Content Area    → Page-specific content
```

### Dashboard Components
```
Dashboard
├── StatsCard(s)         → KPI/metric display cards
├── UserTable            → Generic reusable table component
│   ├── Builders Table
│   ├── Sales Managers Table
│   ├── Members Table
│   └── Players Table
├── CreateUserModal      → Modal for user creation
└── PlayerDetailSheet    → Slide-out detail view for players
```

### UI Components (shadcn-style custom components)
Located in `src/components/ui/`:
- `avatar.jsx` - Avatar component
- `badge.jsx` - Badge/tag component
- `button.jsx` - Button component
- `card.jsx` - Card container
- `dialog.jsx` - Modal dialog
- `input.jsx` - Input field
- `label.jsx` - Form label
- `separator.jsx` - Visual divider
- `sheet.jsx` - Slide-out panel
- `table.jsx` - Table markup

---

## Dashboard Features

### 1. **User Management Hierarchy**
Users can create and manage users in their hierarchy:
- Admin creates Builders
- Builder creates Sales Managers
- Sales Manager creates Members
- Hierarchy tracked via `created_by` field

### 2. **User CRUD Operations**
- **Create:** Modal form (`CreateUserModal`) with role-specific validation
- **Read:** Hierarchical queries to fetch users
- **Delete:** Delete user from Firestore (with confirmation)
- **View:** Detail sheet popup for player information

### 3. **Form Validation** (CreateUserModal)
- Email validation (regex check)
- Phone validation (requires digits)
- Builder-specific fields: company name, address, phone
- Sales Manager-specific fields: company name, address, phone
- Auto-generated type field

### 4. **Stats Display**
`StatsCard` component displays:
- Count badges
- Builder/Sales Manager/Member/Player counts
- Role-aware rendering

---

## State Management

### Global State (AuthContext)
```javascript
{
  profile: { 
    docId, role, email, type, created_by, name, company_name 
  },
  role: 'admin' | 'builder' | 'sales_manager' | 'member',
  loading: boolean,
  login(userData): void,
  logoutUser(): void
}
```

### Local State (Dashboard)
```javascript
{
  data: { builders, salesManagers, members, players },
  loading: boolean,
  error: string,
  modalOpen: boolean,
  modalTargetRole: string,
  selectedPlayer: object | null,
  playerSheetOpen: boolean
}
```

---

## Data Flow

### Login Flow
1. User enters email + password
2. `loginWithEmail()` searches across all 4 collections
3. Matches email/password against document fields or nested `users` array
4. Returns user data with role, name, company_name
5. Calls `login()` to update AuthContext
6. Session saved to localStorage
7. Redirect to `/dashboard`

### User Creation Flow
1. Admin/Builder/Sales Manager opens create modal
2. Fills form (name, email, password, company info)
3. Generates next `type` via Firestore counter
4. Calls `createUser()` which:
   - Validates email uniqueness in collection
   - Creates new document with user data + timestamp
   - Sets `created_by` to current user's email
5. Table refreshes with new user
6. Modal closes

### Data Fetch Flow
1. Dashboard loads → `useEffect` calls `fetchData()`
2. Based on user role, fetches hierarchical data:
   - Admin: fetches all builders
   - Builder: fetches sales managers
   - Sales Manager: fetches members
   - Also fetches players (independent collection)
3. State updates, tables render with data

---

## Current Implementation Details

### Session Management
- Uses localStorage with key: session data serialized as JSON
- Auto-loads on app startup via `AuthContext` useEffect
- **Security Note:** Uses plaintext passwords in both localStorage and Firestore

### Hierarchy Lookup
- Searches by `created_by` field matching email addresses
- Supports compound format: `"email | company_name"`
- Uses `Promise.all()` for concurrent collection queries

### UI Pattern
- Consistent Card-based layout with badge counts
- Table action buttons: View (Eye icon), Delete (Trash icon), Add (Plus icon)
- Modal dialogs for creation, slide-out sheets for detail views
- Responsive design with Tailwind (min-h-screen, flex layouts)

---

## Key Files & Their Responsibilities

| File | Purpose |
|------|---------|
| `App.jsx` | Main routing, AuthProvider wrapper |
| `src/context/AuthContext.jsx` | Global auth state management |
| `src/firebase/authService.js` | Login, user CRUD, session |
| `src/firebase/userService.js` | Hierarchical data queries |
| `src/pages/Dashboard.jsx` | Main dashboard orchestration |
| `src/pages/Login.jsx` | Login UI with role selection |
| `src/components/Layout.jsx` | Main layout wrapper |
| `src/components/Sidebar.jsx` | Navigation menu |
| `src/components/UserTable.jsx` | Generic table display |
| `src/components/CreateUserModal.jsx` | User creation form |
| `src/components/PlayerDetailSheet.jsx` | Player detail view |

---

## Potential Issues & Observations

### 🔴 Security Concerns
1. **Plaintext Passwords:** Passwords stored in Firestore unencrypted
   - Recommendation: Use Firebase Authentication SDK instead
   
2. **Credentials in Code:** Firebase API key exposed in `config.js`
   - Recommendation: Move to environment variables (.env)

3. **No Input Sanitization:** User inputs not sanitized before database writes
   - Recommendation: Add validation and sanitization layer

### ⚠️ Architecture Issues
1. **Mixed Data Structures:** Some documents have nested `users` arrays, others are flat
   - Recommendation: Standardize schema

2. **Inefficient Queries:** `getCreatedByCandidates()` creates multiple query variations
   - Recommendation: Normalize email format in data model

3. **No Error Boundaries:** React components lack error boundary wrappers
   - Recommendation: Add error boundaries for graceful error handling

### 📋 Missing Features
1. No logout functionality (button exists but not fully wired)
2. No user edit/update functionality
3. No pagination for large datasets
4. No search/filter on tables
5. No role-based UI restrictions (all users see same interface)

### 🧹 Code Quality
1. Some unused imports (e.g., `Building` icon in Login.jsx)
2. Inconsistent error handling patterns
3. Loading states not fully managed across all async operations
4. No TypeScript for type safety

---

## Development & Build

### Available Scripts
```bash
npm run dev     # Start Vite dev server (localhost:5173)
npm run build   # Production build
npm run lint    # Run ESLint
npm run preview # Preview production build
```

### Build Configuration
- **Vite** for fast HMR development
- **Tailwind** with PostCSS for styling
- **ESLint** for code quality
- **Components.json** for UI component configuration

---

## Summary

This is a **role-based admin dashboard** for real estate management built with React and Vite. It implements a **hierarchical user management system** where admins can create builders, builders can create sales managers, and sales managers can create members. The app uses Firebase Firestore for persistence and localStorage for session management.

**Strengths:**
- Clean component structure with reusable patterns
- Well-organized file hierarchy
- Uses modern React patterns (hooks, context)
- Comprehensive UI library with Radix UI

**Areas for Improvement:**
- Security hardening (password hashing, env vars)
- Schema standardization
- Error handling and validation
- Testing coverage
- TypeScript adoption
