# Admin Authentication & End-to-End Password Reset

Revamp the Admin login interface on `/admin` to eliminate pre-filled credentials and demo helper pills, and introduce an end-to-end "Forgot Password" self-service flow powered by Firebase Authentication password reset emails.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during clarification:
> - **Authentication Method**: Admin portal will authenticate using administrator email and password with real Firebase password reset capabilities (while maintaining graceful backward compatibility for local studio admin credentials).
> - **Forgot Password UI**: Clean, in-place view toggle on the Admin card featuring email input, status feedback, resend options, and quick return to the login view.
> - **Email Delivery**: Allows password reset dispatch to any registered administrator email address via Firebase `sendPasswordResetEmail()`.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades the Studio Admin Suite entry page (`/admin`) to a secure, uncluttered login portal. All default inputs start empty with no visible hint boxes or auto-fill demo credentials. Users who have forgotten their admin password can click "Forgot password?", enter their email address, and receive an authentic password reset link in their email inbox to set a new password.
- **Target Audience**: Store owner (Neha Arora / Ganpati) and authorized store administrators.
- **Key Value**: Professional security posture, eliminates exposure of credentials on the screen, and provides self-service password recovery directly via email.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────────────────────────────────────────────────┐
│                      /admin Route                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [ Clean Admin Login ]          [ Forgot Password View ]
       - Empty Email/ID input         - Registered Email input
       - Empty Password input         - "Send Reset Email" action
       - "Forgot Password?" link ───► - Success banner & instructions
       - Submit "Access Portal"       - "Return to Login" link
               │                               ▲
               │ (Authenticates)               │
               ▼                               │ (Reset email sent)
       [ Live Admin Dashboard ] ───────────────┘
```

1. **Admin Login View (Default)**:
   - Header with studio monogram, "OpenToSeeYourFuture", and title "Studio Admin Suite".
   - Clean form with empty email/ID and password inputs with intuitive icons and placeholding.
   - No demo helper box or auto-fill buttons.
   - Subtle "Forgot password?" action aligned right below the password field.
   - Primary action: "Access Admin Portal".
2. **Forgot Password View (In-Place Toggle)**:
   - Header changes smoothly to "Reset Admin Access" with a key icon.
   - Guidance text instructing the administrator to provide their registered email address.
   - Dedicated Email input with real-time validation.
   - "Send Password Reset Link" button with loading spinner state.
   - Upon dispatch: clear confirmation badge showing the recipient email, advice to check inbox and spam folders, and a "Resend Link" cooldown.
   - "Back to Login" button to immediately return to the credentials view.

---

## 3. Technical Architecture & Component Mapping

```
┌──────────────────────────────────────────────────────────────┐
│                    src/pages/AdminPage.tsx                   │
│                                                              │
│  State:                                                      │
│  - adminEmailOrId: string ('')                               │
│  - password: string ('')                                     │
│  - isForgotPassword: boolean (false)                         │
│  - resetEmail: string ('')                                   │
│  - resetStatus: 'idle' | 'sending' | 'sent' | 'error'        │
│                                                              │
│  Handlers:                                                   │
│  - handleLogin(e): validates & signs in via Firebase/Store   │
│  - handleSendReset(e): calls sendPasswordResetEmail(auth, ..)│
│  - toggleForgotPassword(): switches between login & reset    │
└──────────────────────────────┬───────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       [ Firebase Auth ]            [ StoreContext ]
       - signInWithEmailAndPassword - isAdmin session
       - sendPasswordResetEmail     - Product & review CRUD
```

### Key Changes
1. **Empty State & Removal of Demo Box**:
   - In `src/pages/AdminPage.tsx`: change `useState('admin')` to `useState('')`.
   - Remove lines 402–422 (the `<div className="mt-5 rounded-xl border border-[#e6b967]/25 ...">` credentials box and `⚡ Auto-fill Demo` button).
2. **Interactive Password Reset Logic**:
   - Import `sendPasswordResetEmail` and `signInWithEmailAndPassword` from `firebase/auth` and `auth` from `../firebase`.
   - Implement `handleSendPasswordReset` with robust error messaging (invalid email, user not found, network failure, etc.).
   - Support both Firebase administrator email login and legacy store administrator ID/password authentication in `handleLogin`.
3. **Responsive Visual Polish**:
   - Maintain the cosmic luxury theme (`#080914`, `#111326`, `#e6b967`) adhering to the anti-slop guidelines (clean typography, no pill badges, accessible focus rings).

---

## 4. Verification Plan

1. **Compilation**: Run `compile_applet` and `lint_applet` to ensure zero TypeScript errors or missing imports.
2. **Visual Inspection**:
   - Navigate to `/admin`.
   - Verify inputs are completely blank on first load.
   - Verify no helper pills, passwords, or demo credentials are visible on screen.
3. **Functional Testing**:
   - Click "Forgot Password?" and verify seamless switch to the reset view.
   - Test submitting with valid email format and check feedback state and confirmation message.
   - Test "Back to Login" transition and verify clean state recovery.
   - Test admin login with valid credentials and verify access to the admin dashboard.
