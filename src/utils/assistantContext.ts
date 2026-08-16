import { AppView, StepNumber, SignupFormData } from '../types/signup';
import { AssistantContext } from '../types/assistant';
import {
  step1EmailSchema,
  step2PersonalSchema,
  step3ProfileSchema,
  step4ConfirmationSchema
} from '../schemas/signupSchema';

/**
 * Computes live validation errors for the current active step without exposing sensitive fields.
 */
export function getStepValidationErrors(
  step: StepNumber,
  formData: SignupFormData,
  currentView: AppView
): Record<string, string> {
  if (currentView !== 'signup') return {};

  const errors: Record<string, string> = {};

  if (step === 1) {
    const res = step1EmailSchema.safeParse({ email: formData.email });
    if (!res.success) {
      for (const issue of res.error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      }
    }
  } else if (step === 2) {
    const res = step2PersonalSchema.safeParse({
      fullName: formData.fullName,
      age: formData.age,
      pronouns: formData.pronouns,
      customPronouns: formData.customPronouns,
      phoneNumber: formData.phoneNumber,
      avatarId: formData.avatarId
    });
    if (!res.success) {
      for (const issue of res.error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      }
    }
  } else if (step === 3) {
    const res = step3ProfileSchema.safeParse({
      state: formData.state,
      city: formData.city,
      college: formData.college,
      customCollege: formData.customCollege,
      degree: formData.degree,
      graduationYear: formData.graduationYear,
      studentIdCardNumber: formData.studentIdCardNumber
    });
    if (!res.success) {
      for (const issue of res.error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      }
    }
  } else if (step === 4) {
    const res = step4ConfirmationSchema.safeParse({
      bio: formData.bio,
      interests: formData.interests,
      acceptedEthics: formData.acceptedEthics
    });
    if (!res.success) {
      for (const issue of res.error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      }
    }
  }

  return errors;
}

/**
 * Builds a clean, privacy-conscious AssistantContext object.
 * SECURITY: Strips out raw OTP values and any sensitive tokens.
 */
export function buildAssistantContext(
  currentView: AppView,
  currentStep: StepNumber,
  formData: SignupFormData,
  isOtpSent: boolean = false
): AssistantContext {
  // Omit OTP code completely from AI payload
  const { otp, ...safeData } = formData;

  const validationErrors = getStepValidationErrors(currentStep, formData, currentView);

  return {
    currentPage: currentView,
    currentStep,
    signupData: safeData,
    validationErrors,
    isOtpSent: isOtpSent || !!formData.otp || formData.otpVerified,
    isOtpVerified: formData.otpVerified
  };
}
