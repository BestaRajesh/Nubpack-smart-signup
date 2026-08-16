# Nubpack Smart Signup

An AI-assisted, responsive signup and onboarding web application inspired by the Nubpack mobile signup experience.

The application provides a smooth 4-step registration process with form validation, OTP verification simulation, profile information collection, error handling, loading states, and an AI Signup Assistant that guides users throughout the onboarding process.

---

## 🚀 Features

### 🏠 Landing Page
- Modern responsive landing page
- Clear signup call-to-action
- Responsive design for mobile, tablet, and desktop

### 📜 Terms & Conditions
- Dedicated Terms & Conditions page
- Scrollable content
- Accept and continue functionality
- Back navigation

### 📝 4-Step Signup Wizard

The application uses progressive disclosure to collect user information step by step.

#### Step 1 — Email Verification
- Email input
- Real-time validation
- Invalid email detection
- Mock OTP verification
- Loading state
- Error handling

#### Step 2 — Personal Information
- Name
- Age
- Pronouns
- Required-field validation
- Age validation
- Users under 18 are prevented from continuing

#### Step 3 — Profile Information
- Profile-related information
- State selection
- City selection
- State → City dependent dropdown
- Required-field validation

#### Step 4 — Confirmation
- Final profile validation
- Review information
- Final submission
- Loading state
- Success and failure handling

---

## 🤖 AI Signup Assistant

The application includes a context-aware AI Signup Assistant designed to help users complete the registration process.

The assistant can:

- Explain form fields
- Explain validation errors
- Guide users through each signup step
- Help with email validation
- Explain OTP verification
- Explain age requirements
- Help with State/City selection
- Check incomplete fields
- Provide contextual signup guidance

The assistant is designed as an optional layer and does not prevent users from completing signup if the AI service is unavailable.

---

## ✨ User Experience

The application includes:

- Responsive mobile-first design
- Progressive signup flow
- Back and Next navigation
- Form state preservation
- Real-time/on-blur validation
- Contextual error messages
- Toast notifications
- Loading indicators
- OTP input handling
- OTP resend functionality
- Duplicate submission prevention
- Success state
- Failure and retry states
- LocalStorage-based progress persistence
- Keyboard-friendly interactions
- Accessible form controls

---

## 🛠️ Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- LocalStorage

### AI

The AI assistant is designed to work with an AI/LLM service through a secure service layer.

API keys should never be exposed directly in frontend source code.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── assistant/
│   │   ├── AIAssistant.tsx
│   │   ├── AssistantButton.tsx
│   │   ├── AssistantPanel.tsx
│   │   ├── ChatMessage.tsx
│   │   └── TypingIndicator.tsx
│   │
│   ├── signup/
│   │   ├── StepEmail.tsx
│   │   ├── StepOtp.tsx
│   │   ├── StepPersonal.tsx
│   │   ├── StepProfile.tsx
│   │   └── StepConfirmation.tsx
│   │
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Toast.tsx
│   └── ProgressIndicator.tsx
│
├── pages/
│   ├── LandingPage.tsx
│   ├── TermsPage.tsx
│   ├── SignupPage.tsx
│   └── SuccessPage.tsx
│
├── hooks/
│   ├── useSignupWizard.ts
│   └── useAIAssistant.ts
│
├── services/
│   ├── mockApi.ts
│   └── aiAssistant.ts
│
├── schemas/
│   └── signupSchema.ts
│
├── types/
│   ├── signup.ts
│   └── assistant.ts
│
└── App.tsx