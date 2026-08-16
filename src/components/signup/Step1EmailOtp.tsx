import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1EmailSchema, Step1EmailValues } from '../../schemas/signupSchema';
import { SignupFormData } from '../../types/signup';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../context/ToastContext';

interface Step1EmailOtpProps {
  formData: SignupFormData;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  onNext: () => void;
  isOtpSending: boolean;
  isOtpVerifying: boolean;
  otpCountdown: number;
  canResendOtp: boolean;
  handleSendOtp: (email: string) => Promise<{ success: boolean; message: string; previewCode?: string }>;
  handleVerifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
}

export function Step1EmailOtp({
  formData,
  updateFormData,
  onNext,
  isOtpSending,
  isOtpVerifying,
  otpCountdown,
  canResendOtp,
  handleSendOtp,
  handleVerifyOtp
}: Step1EmailOtpProps) {
  const { success, error: toastError, info } = useToast();
  const [otpSent, setOtpSent] = useState<boolean>(formData.otpVerified || !!formData.otp);
  const [otpDigits, setOtpDigits] = useState<string[]>(
    formData.otp ? formData.otp.split('').slice(0, 6) : ['', '', '', '', '', '']
  );
  const [otpError, setOtpError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<Step1EmailValues>({
    resolver: zodResolver(step1EmailSchema),
    defaultValues: {
      email: formData.email || ''
    },
    mode: 'onTouched'
  });

  const watchedEmail = watch('email');
  const isVerified = formData.otpVerified;

  useEffect(() => {
    if (formData.otpVerified) {
      setOtpSent(true);
    }
    if (formData.otp) {
      setOtpDigits(formData.otp.split('').slice(0, 6));
    }
    if (formData.email) {
      setValue('email', formData.email);
    }
  }, [formData.otpVerified, formData.otp, formData.email, setValue]);

  useEffect(() => {
    if (otpSent && !isVerified && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [otpSent, isVerified]);

  const onEmailSubmit = async (data: Step1EmailValues) => {
    try {
      const result = await handleSendOtp(data.email);
      setOtpSent(true);
      setOtpError(null);
      success(result.message || 'Verification code sent to your email!', 'Code Dispatched');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP code';
      toastError(msg, 'Verification Error');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    // If full 6-digit code was pasted or inserted by mobile auto-fill
    if (cleanValue.length === 6) {
      handleOtpPaste(cleanValue);
      return;
    }

    // If typing over an existing single character, take the newest character
    const char = cleanValue.length > 0 ? cleanValue.slice(-1) : '';

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setOtpError(null);

    const fullCode = newDigits.join('');
    updateFormData({ otp: fullCode });

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '') && fullCode.length === 6) {
      triggerVerification(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (pastedText: string) => {
    const numericOnly = pastedText.replace(/\D/g, '').slice(0, 6);
    if (!numericOnly) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < numericOnly.length; i++) {
      newDigits[i] = numericOnly[i];
    }
    setOtpDigits(newDigits);
    setOtpError(null);

    const fullCode = newDigits.join('');
    updateFormData({ otp: fullCode });

    const focusIndex = Math.min(numericOnly.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (numericOnly.length === 6) {
      triggerVerification(numericOnly);
    }
  };

  const triggerVerification = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    try {
      setOtpError(null);
      const email = watchedEmail || formData.email;
      const res = await handleVerifyOtp(email, code);
      success(res.message, 'Email Verified!');
      setTimeout(() => {
        onNext();
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP code. Please try again.';
      setOtpError(msg);
      toastError(msg, 'Verification Failed');
    }
  };

  const onResend = async () => {
    if (!canResendOtp || isOtpSending) return;
    try {
      const email = watchedEmail || formData.email;
      await handleSendOtp(email);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      info(`New verification code sent to ${email}`, 'Code Resent');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP';
      toastError(msg);
    }
  };

  const fillMockOtp = () => {
    const mockCode = '123456';
    handleOtpPaste(mockCode);
  };

  return (
    <div className="w-full text-left" id="step-1-container">
      {/* Step Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          Verify your email
        </h2>
        <p className="text-sm text-[#64748B] font-medium leading-relaxed">
          Please provide your institutional or student email to authenticate your pack credentials.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!otpSent && !isVerified ? (
          /* PHASE 1: EMAIL INPUT */
          <motion.form
            key="email-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit(onEmailSubmit)}
            className="flex flex-col gap-6"
            id="email-verification-form"
          >
            <Input
              id="signup-email-input"
              label="Student Email Address"
              type="email"
              placeholder="e.g. alexander@university.edu"
              leftIcon={<Mail className="w-4 h-4 text-[#64748B]" />}
              error={errors.email?.message}
              helperText="Campus domains (.edu, .ac.in) receive instant automated college badges."
              required
              autoFocus
              {...register('email')}
              onChange={(e) => {
                setValue('email', e.target.value, { shouldValidate: true });
                updateFormData({ email: e.target.value });
              }}
            />

            {/* Feature perks banner */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#5E2EEF]/10 text-[#5E2EEF] shrink-0 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#64748B] font-medium leading-relaxed">
                <strong className="text-[#0F172A] font-bold">Precision & Security:</strong> Nubpack ensures an authentic, spam-free ecosystem for verified college peers.
              </div>
            </div>

            <div className="pt-2">
              <Button
                id="send-otp-btn"
                type="submit"
                size="lg"
                fullWidth
                isLoading={isOtpSending}
                loadingText="Sending Verification Code..."
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Send Verification Code
              </Button>
            </div>
          </motion.form>
        ) : (
          /* PHASE 2: 6-DIGIT OTP */
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
            id="otp-verification-container"
          >
            {/* Email pill with edit option */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#5E2EEF]/10 text-[#5E2EEF] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">Code sent to:</span>
                  <span className="text-sm font-bold text-[#0F172A] truncate block">
                    {watchedEmail || formData.email}
                  </span>
                </div>
              </div>
              {!isVerified && (
                <button
                  type="button"
                  id="change-email-btn"
                  disabled={isOtpSending || isOtpVerifying}
                  onClick={() => {
                    setOtpSent(false);
                    updateFormData({ otpVerified: false });
                  }}
                  className="text-xs font-bold text-[#5E2EEF] hover:underline transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#5E2EEF]/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Change
                </button>
              )}
            </div>

            {/* OTP 6-box input container */}
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="otp-box-0" className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider self-start">
                Enter 6-Digit Code <span className="text-rose-500">*</span>
              </label>

              <div
                className="grid grid-cols-6 gap-2 sm:gap-3 w-full"
                onPaste={(e) => {
                  if (isVerified || isOtpVerifying) return;
                  e.preventDefault();
                  const pasteData = e.clipboardData.getData('text');
                  handleOtpPaste(pasteData);
                }}
              >
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={isVerified || isOtpVerifying || isOtpSending}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    aria-label={`Digit ${idx + 1} of 6`}
                    className={`w-full aspect-square text-center text-xl sm:text-2xl font-extrabold font-mono rounded-2xl border-2 transition-all duration-200 outline-none select-none disabled:opacity-75 ${
                      isVerified
                        ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                        : otpError
                        ? 'border-rose-500 bg-rose-50/50 text-[#0F172A] focus:border-rose-600 focus:bg-white'
                        : digit
                        ? 'border-[#5E2EEF] bg-[#5E2EEF]/5 text-[#0F172A]'
                        : 'border-transparent bg-[#F1F5F9] text-[#0F172A] focus:border-[#5E2EEF] focus:bg-white'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p id="otp-error-msg" className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 mt-1 self-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {otpError}
                </p>
              )}

              {isVerified && (
                <div id="otp-verified-badge" className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold w-full animate-fadeIn">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Email verified! You are ready to configure your profile.</span>
                </div>
              )}
            </div>

            {/* Resend & Demo OTP Controls */}
            {!isVerified && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                  <span>Didn&apos;t receive code?</span>
                  {otpCountdown > 0 ? (
                    <span className="font-mono text-[#5E2EEF] font-bold">
                      Resend in {otpCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      id="resend-otp-btn"
                      onClick={onResend}
                      disabled={!canResendOtp || isOtpSending || isOtpVerifying}
                      className="text-[#5E2EEF] hover:underline font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isOtpSending ? 'animate-spin' : ''}`} />
                      <span>{isOtpSending ? 'Sending Code...' : 'Resend Code'}</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  id="fill-demo-otp-btn"
                  onClick={fillMockOtp}
                  disabled={isOtpSending || isOtpVerifying}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo: <strong>123456</strong> (Auto-fill)</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <Button
                id="verify-continue-btn"
                size="lg"
                fullWidth
                isLoading={isOtpVerifying}
                loadingText="Verifying Code..."
                disabled={(otpDigits.some((d) => d === '') && !isVerified) || isOtpVerifying || isOtpSending}
                onClick={() => {
                  if (isVerified) {
                    onNext();
                  } else {
                    triggerVerification();
                  }
                }}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {isVerified ? 'Continue to Personal Details' : 'Verify & Continue'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
