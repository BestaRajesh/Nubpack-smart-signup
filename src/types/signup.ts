export type AppView = 'landing' | 'terms' | 'signup' | 'success';

export interface SignupFormData {
  // Step 1: Verification
  email: string;
  otp: string;
  otpVerified: boolean;

  // Step 2: Personal Information
  fullName: string;
  age: number | null;
  dateOfBirth?: string;
  pronouns: 'He/Him' | 'She/Her' | 'They/Them' | 'Prefer not to say' | 'Other' | '';
  customPronouns?: string;
  phoneNumber?: string;
  avatarId: string;

  // Step 3: Campus & Academic Information
  state: string;
  city: string;
  college: string;
  customCollege?: string;
  degree: string;
  graduationYear: string;
  studentIdCardNumber?: string;

  // Step 4: Final Profile & Interests
  bio: string;
  interests: string[];
  acceptedEthics: boolean;
}

export type StepNumber = 1 | 2 | 3 | 4;

export interface SignupWizardState {
  currentStep: StepNumber;
  formData: SignupFormData;
  isLoading: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
  otpCountdown: number;
  canResendOtp: boolean;
  isOtpSending: boolean;
  isOtpVerifying: boolean;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage: string | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}
