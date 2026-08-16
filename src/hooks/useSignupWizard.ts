import { useState, useEffect, useCallback } from 'react';
import { SignupFormData, StepNumber, SignupWizardState } from '../types/signup';
import { sendOtp, verifyOtp, submitSignup } from '../services/mockApi';

export const INITIAL_SIGNUP_DATA: SignupFormData = {
  email: '',
  otp: '',
  otpVerified: false,
  fullName: '',
  age: null,
  dateOfBirth: '',
  pronouns: '',
  customPronouns: '',
  phoneNumber: '',
  avatarId: 'avatar-1',
  state: '',
  city: '',
  college: '',
  customCollege: '',
  degree: '',
  graduationYear: '2026',
  studentIdCardNumber: '',
  bio: '',
  interests: [],
  acceptedEthics: false
};

const STORAGE_KEY = 'nubpack_signup_wizard_state_v1';

export function useSignupWizard() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_SIGNUP_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [canResendOtp, setCanResendOtp] = useState<boolean>(true);
  const [isOtpSending, setIsOtpSending] = useState<boolean>(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedStudentId, setGeneratedStudentId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          setFormData((prev) => ({ ...prev, ...parsed.formData }));
        }
        if (parsed.currentStep && parsed.currentStep >= 1 && parsed.currentStep <= 4) {
          // If OTP was not verified, keep at step 1
          if (parsed.currentStep > 1 && !parsed.formData?.otpVerified) {
            setCurrentStep(1);
          } else {
            setCurrentStep(parsed.currentStep);
          }
        }
        setLastSavedAt(parsed.savedAt || Date.now());
      }
    } catch {
      console.warn('Could not parse saved signup state from localStorage');
    }
  }, []);

  // Autosave to LocalStorage when data or step changes
  useEffect(() => {
    try {
      setIsSaving(true);
      const payload = {
        formData,
        currentStep,
        savedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSavedAt(Date.now());
      const timer = setTimeout(() => setIsSaving(false), 400);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Failed to autosave wizard state', e);
      setIsSaving(false);
    }
  }, [formData, currentStep]);

  // OTP Countdown timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpCountdown]);

  const updateFormData = useCallback((updates: Partial<SignupFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      // Cross field logic: if state is changed or updated to a different value, clear city
      if (updates.state !== undefined && updates.state !== prev.state) {
        next.city = '';
      }
      return next;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < 4) {
        return (prev + 1) as StepNumber;
      }
      return prev;
    });
    setErrorMessage(null);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 1) {
        return (prev - 1) as StepNumber;
      }
      return prev;
    });
    setErrorMessage(null);
  }, []);

  const goToStep = useCallback((step: StepNumber) => {
    if (step >= 1 && step <= 4) {
      // Don't allow jumping ahead without completing step 1
      if (step > 1 && !formData.otpVerified) {
        setErrorMessage('Please verify your email address to proceed.');
        return;
      }
      setCurrentStep(step);
      setErrorMessage(null);
    }
  }, [formData.otpVerified]);

  const resetWizard = useCallback(() => {
    setFormData(INITIAL_SIGNUP_DATA);
    setCurrentStep(1);
    setSubmissionStatus('idle');
    setErrorMessage(null);
    setGeneratedStudentId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Quick fill sample data helper for evaluators
  const fillSampleData = useCallback(() => {
    const sample: SignupFormData = {
      email: 'alex.rivers@campus.edu.in',
      otp: '123456',
      otpVerified: true,
      fullName: 'Alex Rivers',
      age: 21,
      dateOfBirth: '2005-04-15',
      pronouns: 'They/Them',
      customPronouns: '',
      phoneNumber: '9876543210',
      avatarId: 'avatar-3',
      state: 'Telangana',
      city: 'Hyderabad',
      college: 'BITS Pilani Hyderabad Campus',
      customCollege: '',
      degree: 'B.Tech / B.E. Computer Science',
      graduationYear: '2026',
      studentIdCardNumber: 'BITS2026-CS-409',
      bio: 'Full stack developer & campus robotics lead. Passionate about AI hackathons and campus community events.',
      interests: ['tech', 'hackathons', 'startups', 'gaming'],
      acceptedEthics: true
    };
    setFormData(sample);
  }, []);

  // Handler for sending OTP
  const handleSendOtp = async (email: string) => {
    setIsOtpSending(true);
    setErrorMessage(null);
    try {
      const response = await sendOtp(email);
      updateFormData({ email });
      setOtpCountdown(30);
      setCanResendOtp(false);
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP code';
      setErrorMessage(msg);
      throw err;
    } finally {
      setIsOtpSending(false);
    }
  };

  // Handler for verifying OTP
  const handleVerifyOtp = async (email: string, otp: string) => {
    setIsOtpVerifying(true);
    setErrorMessage(null);
    try {
      const cleanOtp = (otp || '').trim();
      const response = await verifyOtp(email, cleanOtp);
      updateFormData({ otp: cleanOtp, otpVerified: true });
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setErrorMessage(msg);
      updateFormData({ otpVerified: false });
      throw err;
    } finally {
      setIsOtpVerifying(false);
    }
  };

  // Handler for final form submission
  const handleFinalSubmit = async () => {
    if (submissionStatus === 'submitting') return; // Prevent double submission
    
    setSubmissionStatus('submitting');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await submitSignup(formData);
      setGeneratedStudentId(result.studentId);
      setSubmissionStatus('success');
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete signup. Please try again.';
      setErrorMessage(msg);
      setSubmissionStatus('error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const wizardState: SignupWizardState = {
    currentStep,
    formData,
    isLoading,
    isSaving,
    lastSavedAt,
    otpCountdown,
    canResendOtp,
    isOtpSending,
    isOtpVerifying,
    submissionStatus,
    errorMessage
  };

  return {
    wizardState,
    currentStep,
    formData,
    isLoading,
    isSaving,
    lastSavedAt,
    otpCountdown,
    canResendOtp,
    isOtpSending,
    isOtpVerifying,
    submissionStatus,
    errorMessage,
    generatedStudentId,
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    resetWizard,
    fillSampleData,
    handleSendOtp,
    handleVerifyOtp,
    handleFinalSubmit,
    setErrorMessage
  };
}
