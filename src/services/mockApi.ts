import { SignupFormData } from '../types/signup';

// Helper for realistic async delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock simulation configuration (can be toggled for evaluation testing)
export interface MockApiConfig {
  forceOtpFailure: boolean;
  forceSubmitFailure: boolean;
  mockOtpCode: string;
  simulatedDelayMs: number;
}

export const mockConfig: MockApiConfig = {
  forceOtpFailure: false,
  forceSubmitFailure: false,
  mockOtpCode: '123456',
  simulatedDelayMs: 900
};

export async function sendOtp(email: string): Promise<{ success: boolean; message: string; previewCode?: string }> {
  await delay(mockConfig.simulatedDelayMs);

  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  // Simulated email domain verification check
  const isCollegeDomain = email.endsWith('.edu') || email.endsWith('.ac.in') || email.endsWith('.edu.in');
  
  return {
    success: true,
    message: isCollegeDomain
      ? `Student verification code sent to ${email} (Instant verification active)`
      : `Verification code sent to ${email}`,
    previewCode: mockConfig.mockOtpCode
  };
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  await delay(mockConfig.simulatedDelayMs);

  if (mockConfig.forceOtpFailure) {
    throw new Error('Invalid verification code. Please try again.');
  }

  const cleanOtp = otp.trim();
  if (cleanOtp !== mockConfig.mockOtpCode) {
    throw new Error('Invalid verification code. Please try again.');
  }

  return {
    success: true,
    message: 'Verification successful.'
  };
}

export async function submitSignup(
  formData: SignupFormData
): Promise<{ success: boolean; studentId: string; user: SignupFormData }> {
  await delay(1200);

  if (mockConfig.forceSubmitFailure) {
    throw new Error('Simulated network error. Nubpack servers are temporarily unavailable. Please retry.');
  }

  // Generate random student pack ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const studentId = `NUB-${new Date().getFullYear()}-${randomSuffix}`;

  return {
    success: true,
    studentId,
    user: formData
  };
}
