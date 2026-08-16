import { StepNumber, SignupFormData } from '../types/signup';
import { NubpackLogo } from '../components/ui/NubpackLogo';
import { Step1EmailOtp } from '../components/signup/Step1EmailOtp';
import { Step2Personal } from '../components/signup/Step2Personal';
import { Step3Profile } from '../components/signup/Step3Profile';
import { Step4Confirmation } from '../components/signup/Step4Confirmation';
import { ArrowLeft, RotateCcw, Cloud, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SignupPageProps {
  currentStep: StepNumber;
  formData: SignupFormData;
  isLoading: boolean;
  isSaving: boolean;
  lastSavedAt: number | null;
  otpCountdown: number;
  canResendOtp: boolean;
  isOtpSending: boolean;
  isOtpVerifying: boolean;
  errorMessage: string | null;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onGoToStep: (step: StepNumber) => void;
  onReset: () => void;
  onExitToLanding: () => void;
  handleSendOtp: (email: string) => Promise<{ success: boolean; message: string; previewCode?: string }>;
  handleVerifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  handleFinalSubmit: () => Promise<{ success: boolean; studentId: string; user: SignupFormData } | undefined>;
}

const STEP_INFO: Record<StepNumber, { headline: string; description: string; stepLabel: string }> = {
  1: {
    headline: 'Join the verified student circle.',
    description: 'Experience the next generation of digital campus networking with precision and security.',
    stepLabel: 'Verification'
  },
  2: {
    headline: 'Tell us about yourself.',
    description: 'Create your personal campus persona and verified profile as it appears on your student ID.',
    stepLabel: 'Personal'
  },
  3: {
    headline: 'Connect your institution.',
    description: 'Link your university, department, and graduation year to unlock localized campus packs.',
    stepLabel: 'Academic'
  },
  4: {
    headline: 'Customize your campus packs.',
    description: 'Select your interests to join peer study circles, hackathon groups, and campus clubs.',
    stepLabel: 'Interests'
  }
};

export function SignupPage({
  currentStep,
  formData,
  isLoading,
  isSaving,
  lastSavedAt,
  otpCountdown,
  canResendOtp,
  isOtpSending,
  isOtpVerifying,
  errorMessage,
  updateFormData,
  onNextStep,
  onPreviousStep,
  onGoToStep,
  onReset,
  onExitToLanding,
  handleSendOtp,
  handleVerifyOtp,
  handleFinalSubmit
}: SignupPageProps) {
  const steps: StepNumber[] = [1, 2, 3, 4];
  const stepInfo = STEP_INFO[currentStep];

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-[#F8FAFC] text-[#0F172A] p-4 sm:p-6 lg:p-8">
      {/* Background Geometric Accents */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />

      {/* Main Geometric Balance Container Card */}
      <div
        className="w-full max-w-5xl rounded-[32px] bg-white border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col lg:flex-row relative z-10 my-auto"
        id="signup-geometric-card"
      >
        {/* Left Column: Geometric Balance Accent Panel */}
        <div className="w-full lg:w-[380px] xl:w-[410px] bg-[#5E2EEF] flex flex-col justify-between p-8 lg:p-12 text-white relative overflow-hidden shrink-0">
          {/* Subtle Geometric Circles */}
          <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-white/10 pointer-events-none" />

          {/* Top: Brand Logo & Dynamic Headline */}
          <div className="relative z-10">
            <div className="mb-8 lg:mb-16">
              <NubpackLogo size="md" variant="whiteOnPurple" />
            </div>

            <motion.h1
              key={`headline-${currentStep}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-4 sm:mb-6"
            >
              {stepInfo.headline}
            </motion.h1>

            <motion.p
              key={`desc-${currentStep}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed font-normal"
            >
              {stepInfo.description}
            </motion.p>
          </div>

          {/* Bottom: Geometric Progress Pill Bars */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15 lg:border-t-0">
            <div className="flex gap-2 mb-4">
              {steps.map((step) => {
                const isActive = step <= currentStep;
                return (
                  <div
                    key={`pill-step-${step}`}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest">
              Step {currentStep} of 4 — {stepInfo.stepLabel}
            </p>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white min-h-[600px]">
          {/* Top Bar inside Form Panel */}
          <div className="flex justify-between items-center pb-6 mb-6 border-b border-[#E2E8F0]">
            <button
              type="button"
              id="signup-exit-btn"
              onClick={onExitToLanding}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Persistence Status & Reset */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold"
                title="Your signup progress is saved locally"
              >
                {isSaving ? (
                  <span className="text-[#5E2EEF] flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5 animate-pulse" /> Saving...
                  </span>
                ) : lastSavedAt ? (
                  <span className="text-[#10B981] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                ) : null}
              </div>

              <span className="w-1 h-1 bg-[#CBD5E1] rounded-full hidden sm:inline-block" />

              <button
                type="button"
                id="signup-reset-form-btn"
                onClick={onReset}
                className="p-1.5 text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Reset Form"
                aria-label="Reset Signup Form"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Step Form View */}
          <div className="max-w-[480px] mx-auto w-full flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1-wrapper"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <Step1EmailOtp
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={onNextStep}
                    isOtpSending={isOtpSending}
                    isOtpVerifying={isOtpVerifying}
                    otpCountdown={otpCountdown}
                    canResendOtp={canResendOtp}
                    handleSendOtp={handleSendOtp}
                    handleVerifyOtp={handleVerifyOtp}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2-wrapper"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <Step2Personal
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={onNextStep}
                    onBack={onPreviousStep}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3-wrapper"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <Step3Profile
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={onNextStep}
                    onBack={onPreviousStep}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4-wrapper"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <Step4Confirmation
                    formData={formData}
                    updateFormData={updateFormData}
                    onBack={onPreviousStep}
                    onGoToStep={onGoToStep}
                    onFinalSubmit={handleFinalSubmit}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Security Footer Note */}
          <div className="pt-6 mt-6 border-t border-[#E2E8F0] text-center text-xs font-semibold text-[#94A3B8]">
            Nubpack Campus Network • 256-bit encrypted student verification
          </div>
        </div>
      </div>
    </div>
  );
}
