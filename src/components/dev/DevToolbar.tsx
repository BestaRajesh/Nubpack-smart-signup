import { useState } from 'react';
import { mockConfig } from '../../services/mockApi';
import { AppView, StepNumber } from '../../types/signup';
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ChevronUp,
  Bug
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface DevToolbarProps {
  currentView: AppView;
  currentStep: StepNumber;
  onSetView: (view: AppView) => void;
  onGoToStep: (step: StepNumber) => void;
  onFillSampleData: () => void;
  onResetData: () => void;
  viewportMode: 'responsive' | 'mobile' | 'tablet';
  onSetViewportMode: (mode: 'responsive' | 'mobile' | 'tablet') => void;
}

export function DevToolbar({
  currentView,
  currentStep,
  onSetView,
  onGoToStep,
  onFillSampleData,
  onResetData,
  viewportMode,
  onSetViewportMode
}: DevToolbarProps) {
  const { info, warning, success } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [forceOtpFail, setForceOtpFail] = useState(mockConfig.forceOtpFailure);
  const [forceSubmitFail, setForceSubmitFail] = useState(mockConfig.forceSubmitFailure);

  const toggleOtpFailure = () => {
    mockConfig.forceOtpFailure = !forceOtpFail;
    setForceOtpFail(!forceOtpFail);
    if (!forceOtpFail) {
      warning('Simulate OTP Failure is now ENABLED', 'Testing Mode');
    } else {
      info('Simulate OTP Failure is now DISABLED (OTP 123456 will pass)', 'Testing Mode');
    }
  };

  const toggleSubmitFailure = () => {
    mockConfig.forceSubmitFailure = !forceSubmitFail;
    setForceSubmitFail(!forceSubmitFail);
    if (!forceSubmitFail) {
      warning('Simulate Final Submit Failure is now ENABLED', 'Testing Mode');
    } else {
      info('Simulate Final Submit Failure is now DISABLED', 'Testing Mode');
    }
  };

  const handleFastFill = () => {
    onFillSampleData();
    success('Sample student data loaded into wizard form!', 'Auto-Fill Success');
  };

  return (
    <div className="fixed top-4 right-4 z-50 select-none text-left" id="evaluator-test-toolbar">
      {/* Floating Toggle Button */}
      <button
        type="button"
        id="dev-toolbar-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border-2 border-[#E2E8F0] text-[#0F172A] hover:border-[#5E2EEF] shadow-lg text-xs font-bold transition-all cursor-pointer"
      >
        <Wrench className="w-3.5 h-3.5 text-[#5E2EEF]" />
        <span>Evaluator Tools</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#64748B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />}
      </button>

      {/* Expanded Control Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 p-5 rounded-3xl bg-white border-2 border-[#E2E8F0] shadow-2xl text-xs text-[#0F172A] space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
              <Bug className="w-4 h-4 text-[#5E2EEF]" />
              <span>Assessment Testing Suite</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#5E2EEF]/10 text-[#5E2EEF] border border-[#5E2EEF]/20">
              Demo Active
            </span>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Quick Testing Helpers
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="dev-autofill-btn"
                onClick={handleFastFill}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#5E2EEF] hover:bg-[#4C24D1] text-white font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill Form</span>
              </button>

              <button
                type="button"
                id="dev-reset-btn"
                onClick={() => {
                  onResetData();
                  onSetView('landing');
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-rose-50 hover:text-rose-600 border border-[#E2E8F0] text-[#64748B] font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          {/* Simulated API Error Injections */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Simulate API Errors
            </span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] cursor-pointer">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Force OTP Verification Error</span>
                </span>
                <input
                  type="checkbox"
                  checked={forceOtpFail}
                  onChange={toggleOtpFailure}
                  className="rounded border-[#CBD5E1] bg-white text-[#5E2EEF] focus:ring-[#5E2EEF] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] cursor-pointer">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Force Final Submit Network Error</span>
                </span>
                <input
                  type="checkbox"
                  checked={forceSubmitFail}
                  onChange={toggleSubmitFailure}
                  className="rounded border-[#CBD5E1] bg-white text-[#5E2EEF] focus:ring-[#5E2EEF] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Navigation Direct Jump */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Page & Step Navigation
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onSetView('landing')}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs ${
                  currentView === 'landing'
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Landing
              </button>
              <button
                type="button"
                onClick={() => onSetView('terms')}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs ${
                  currentView === 'terms'
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => {
                  onSetView('signup');
                  onGoToStep(1);
                }}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs ${
                  currentView === 'signup' && currentStep === 1
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Step 1
              </button>
              <button
                type="button"
                onClick={() => {
                  onSetView('signup');
                  onGoToStep(2);
                }}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs ${
                  currentView === 'signup' && currentStep === 2
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Step 2
              </button>
              <button
                type="button"
                onClick={() => {
                  onSetView('signup');
                  onGoToStep(3);
                }}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs ${
                  currentView === 'signup' && currentStep === 3
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Step 3
              </button>
              <button
                type="button"
                onClick={() => {
                  onSetView('signup');
                  onGoToStep(4);
                }}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs ${
                  currentView === 'signup' && currentStep === 4
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Step 4
              </button>
              <button
                type="button"
                onClick={() => onSetView('success')}
                className={`px-2 py-1.5 rounded-xl border text-center font-bold text-xs col-span-2 ${
                  currentView === 'success'
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                Success Pass
              </button>
            </div>
          </div>

          {/* Viewport Frame Mode */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Device Frame Simulator
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onSetViewportMode('responsive')}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-bold ${
                  viewportMode === 'responsive'
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Fluid</span>
              </button>
              <button
                type="button"
                onClick={() => onSetViewportMode('tablet')}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-bold ${
                  viewportMode === 'tablet'
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => onSetViewportMode('mobile')}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl border text-xs font-bold ${
                  viewportMode === 'mobile'
                    ? 'bg-[#5E2EEF] text-white border-[#5E2EEF]'
                    : 'bg-[#F1F5F9] text-[#64748B] border-transparent hover:bg-[#E2E8F0]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
