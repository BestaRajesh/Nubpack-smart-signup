import { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { useSignupWizard } from './hooks/useSignupWizard';
import { AppView, StepNumber } from './types/signup';
import { LandingPage } from './pages/LandingPage';
import { TermsPage } from './pages/TermsPage';
import { SignupPage } from './pages/SignupPage';
import { SuccessPage } from './pages/SuccessPage';
import { DevToolbar } from './components/dev/DevToolbar';
import { AIAssistant } from './components/assistant/AIAssistant';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [viewportMode, setViewportMode] = useState<'responsive' | 'mobile' | 'tablet'>('responsive');

  const {
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
    handleFinalSubmit
  } = useSignupWizard();

  useEffect(() => {
    if (submissionStatus === 'success') {
      setCurrentView('success');
    }
  }, [submissionStatus]);

  const handleStartSignup = () => {
    setCurrentView('terms');
  };

  const handleAcceptTerms = () => {
    setCurrentView('signup');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleResetFlow = () => {
    resetWizard();
    setCurrentView('landing');
  };

  const handleGoToStep = (step: StepNumber) => {
    goToStep(step);
  };

  const viewportClasses = {
    responsive: 'w-full min-h-screen',
    tablet: 'w-full max-w-[768px] min-h-[900px] my-8 mx-auto rounded-[32px] border-4 border-[#CBD5E1] shadow-2xl overflow-hidden bg-white',
    mobile: 'w-full max-w-[390px] min-h-[844px] my-8 mx-auto rounded-[44px] border-8 border-[#CBD5E1] shadow-2xl overflow-hidden bg-white'
  };

  return (
    <div className={`min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col items-center justify-start ${viewportMode !== 'responsive' ? 'py-6 px-4 bg-[#E2E8F0]/40' : ''}`}>
      {/* Dev & Assessment Toolbar */}
      <DevToolbar
        currentView={currentView}
        currentStep={currentStep}
        onSetView={(view) => setCurrentView(view)}
        onGoToStep={handleGoToStep}
        onFillSampleData={() => {
          fillSampleData();
          if (currentView === 'landing' || currentView === 'terms') {
            setCurrentView('signup');
          }
        }}
        onResetData={handleResetFlow}
        viewportMode={viewportMode}
        onSetViewportMode={setViewportMode}
      />

      {/* Main View Shell */}
      <div className={`${viewportClasses[viewportMode]} relative transition-all duration-300`}>
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="view-landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <LandingPage
                onStartSignup={handleStartSignup}
                onViewTerms={() => setCurrentView('terms')}
              />
            </motion.div>
          )}

          {currentView === 'terms' && (
            <motion.div
              key="view-terms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <TermsPage
                onAcceptTerms={handleAcceptTerms}
                onBackToLanding={handleBackToLanding}
              />
            </motion.div>
          )}

          {currentView === 'signup' && (
            <motion.div
              key="view-signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              <SignupPage
                currentStep={currentStep}
                formData={formData}
                isLoading={isLoading}
                isSaving={isSaving}
                lastSavedAt={lastSavedAt}
                otpCountdown={otpCountdown}
                canResendOtp={canResendOtp}
                isOtpSending={isOtpSending}
                isOtpVerifying={isOtpVerifying}
                errorMessage={errorMessage}
                updateFormData={updateFormData}
                onNextStep={nextStep}
                onPreviousStep={previousStep}
                onGoToStep={handleGoToStep}
                onReset={resetWizard}
                onExitToLanding={handleBackToLanding}
                handleSendOtp={handleSendOtp}
                handleVerifyOtp={handleVerifyOtp}
                handleFinalSubmit={handleFinalSubmit}
              />
            </motion.div>
          )}

          {currentView === 'success' && (
            <motion.div
              key="view-success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <SuccessPage
                formData={formData}
                studentId={generatedStudentId}
                onReset={handleResetFlow}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Context-Aware Floating AI Signup Assistant */}
      <AIAssistant
        currentView={currentView}
        currentStep={currentStep}
        formData={formData}
        onNavigateToStep={handleGoToStep}
        onStartSignup={handleStartSignup}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
