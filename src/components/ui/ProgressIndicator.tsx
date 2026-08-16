import { Check } from 'lucide-react';
import { StepNumber } from '../../types/signup';

interface ProgressIndicatorProps {
  currentStep: StepNumber;
  totalSteps?: number;
  onStepClick?: (step: StepNumber) => void;
  completedSteps?: StepNumber[];
}

export const STEP_LABELS: Record<StepNumber, { title: string; subtitle: string }> = {
  1: { title: 'Verification', subtitle: 'Email & OTP' },
  2: { title: 'Personal', subtitle: 'Name & Age' },
  3: { title: 'Academic', subtitle: 'College & City' },
  4: { title: 'Review', subtitle: 'Packs & Submit' }
};

export function ProgressIndicator({
  currentStep,
  totalSteps = 4,
  onStepClick
}: ProgressIndicatorProps) {
  const steps: StepNumber[] = [1, 2, 3, 4];

  return (
    <div className="w-full mb-8 select-none" id="signup-progress-bar">
      {/* Geometric Balance Pill Bar Track */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((step) => {
          const isActiveOrPast = step <= currentStep;
          const isCurrent = step === currentStep;
          return (
            <div
              key={`pill-${step}`}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#5E2EEF]'
                  : isActiveOrPast
                  ? 'bg-[#5E2EEF]/70'
                  : 'bg-[#E2E8F0]'
              }`}
            />
          );
        })}
      </div>

      {/* Top Status Label */}
      <div className="flex items-center justify-between text-xs mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#5E2EEF] uppercase tracking-wider">
            Step {currentStep} of {totalSteps} — {STEP_LABELS[currentStep].title}
          </span>
        </div>
        <span className="text-[#64748B] font-mono text-xs font-semibold">
          {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}%
        </span>
      </div>

      {/* Interactive Step Nodes */}
      <div className="relative flex items-center justify-between pt-1">
        {/* Background track line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#E2E8F0] -z-0" />

        {/* Active line */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#5E2EEF] transition-all duration-500 ease-out -z-0"
          style={{
            width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - ${
              currentStep === 1 ? '0px' : '8px'
            })`
          }}
        />

        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const canClick = isCompleted && onStepClick;

          return (
            <div
              key={step}
              className="flex flex-col items-center group relative z-10"
            >
              <button
                type="button"
                id={`step-indicator-node-${step}`}
                disabled={!canClick}
                onClick={() => canClick && onStepClick(step)}
                aria-label={`Go to Step ${step}: ${STEP_LABELS[step].title}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/25 hover:scale-105 cursor-pointer ring-4 ring-white'
                    : isCurrent
                    ? 'bg-[#5E2EEF] text-white shadow-lg shadow-[#5E2EEF]/30 ring-4 ring-[#5E2EEF]/15 scale-110'
                    : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] ring-4 ring-white'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{step}</span>
                )}
              </button>

              {/* Step title label under node (visible on medium screens) */}
              <div className="absolute top-10 hidden md:flex flex-col items-center text-center w-24">
                <span
                  className={`text-[11px] font-bold leading-tight ${
                    isCurrent
                      ? 'text-[#0F172A]'
                      : isCompleted
                      ? 'text-[#64748B]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {STEP_LABELS[step].title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block h-3" />
    </div>
  );
}
