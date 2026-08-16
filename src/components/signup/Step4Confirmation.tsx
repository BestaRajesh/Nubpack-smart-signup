import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step4ConfirmationSchema, Step4ConfirmationValues } from '../../schemas/signupSchema';
import { SignupFormData, StepNumber } from '../../types/signup';
import { CAMPUS_INTERESTS_LIST, AVATAR_PRESETS } from '../../data/locations';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Edit3,
  ShieldCheck,
  Building,
  MapPin,
  Check,
  Layers,
  Code,
  Rocket,
  Cpu,
  Music,
  Gamepad2,
  Trophy,
  Camera,
  BookOpen,
  Heart,
  Bot,
  Palette
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '../../context/ToastContext';

interface Step4ConfirmationProps {
  formData: SignupFormData;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  onBack: () => void;
  onGoToStep: (step: StepNumber) => void;
  onFinalSubmit: () => Promise<{ success: boolean; studentId: string; user: SignupFormData } | undefined>;
  isLoading: boolean;
  errorMessage: string | null;
}

const interestIconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-3.5 h-3.5" />,
  Rocket: <Rocket className="w-3.5 h-3.5" />,
  Cpu: <Cpu className="w-3.5 h-3.5" />,
  Music: <Music className="w-3.5 h-3.5" />,
  Gamepad2: <Gamepad2 className="w-3.5 h-3.5" />,
  Trophy: <Trophy className="w-3.5 h-3.5" />,
  Camera: <Camera className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Heart: <Heart className="w-3.5 h-3.5" />,
  Bot: <Bot className="w-3.5 h-3.5" />,
  Palette: <Palette className="w-3.5 h-3.5" />
};

export function Step4Confirmation({
  formData,
  updateFormData,
  onBack,
  onGoToStep,
  onFinalSubmit,
  isLoading,
  errorMessage
}: Step4ConfirmationProps) {
  const { error: toastError } = useToast();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    formData.interests || []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<Step4ConfirmationValues>({
    resolver: zodResolver(step4ConfirmationSchema),
    defaultValues: {
      bio: formData.bio || '',
      interests: formData.interests || [],
      acceptedEthics: formData.acceptedEthics || false
    },
    mode: 'onTouched'
  });

  useEffect(() => {
    reset({
      bio: formData.bio || '',
      interests: formData.interests || [],
      acceptedEthics: formData.acceptedEthics || false
    });
    if (formData.interests) {
      setSelectedInterests(formData.interests);
    }
  }, [formData.bio, formData.interests, formData.acceptedEthics, reset]);

  const currentBio = watch('bio') || '';
  const currentAcceptedEthics = watch('acceptedEthics');

  const toggleInterest = (interestId: string) => {
    let next: string[];
    if (selectedInterests.includes(interestId)) {
      next = selectedInterests.filter((id) => id !== interestId);
    } else {
      if (selectedInterests.length >= 8) return;
      next = [...selectedInterests, interestId];
    }
    setSelectedInterests(next);
    setValue('interests', next, { shouldValidate: true });
    updateFormData({ interests: next });
  };

  const currentAvatar = AVATAR_PRESETS.find((a) => a.id === formData.avatarId) || AVATAR_PRESETS[0];
  const collegeDisplay = formData.customCollege || formData.college || 'Not specified';

  const onSubmit: SubmitHandler<Step4ConfirmationValues> = async (data) => {
    if (isLoading) return;

    updateFormData({
      bio: data.bio.trim(),
      interests: data.interests,
      acceptedEthics: data.acceptedEthics
    });

    try {
      await onFinalSubmit();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please check network.';
      toastError(msg, 'Signup Error');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 text-left w-full"
      id="step-4-form"
    >
      {/* Step Heading */}
      <div>
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          Customize your pack interests
        </h2>
        <p className="text-sm text-[#64748B] font-medium leading-relaxed">
          Select what you love to get customized peer study circles, club updates, and campus events.
        </p>
      </div>

      {errorMessage && (
        <Alert type="error" title="Submission Issue" id="step-4-error-alert">
          {errorMessage}
        </Alert>
      )}

      {/* Campus Interests Multi-Select Grid */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Choose Your Interests <span className="text-rose-500">* (Min 2)</span>
          </label>
          <span className="text-xs text-[#5E2EEF] font-bold font-mono">
            {selectedInterests.length}/8 selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="interests-selection-grid">
          {CAMPUS_INTERESTS_LIST.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                id={`interest-card-${item.id}`}
                onClick={() => toggleInterest(item.id)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#5E2EEF]/10 border-[#5E2EEF] text-[#5E2EEF] shadow-sm font-bold'
                    : 'bg-[#F1F5F9] border-transparent text-[#64748B] hover:border-[#CBD5E1] hover:bg-white font-semibold'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#5E2EEF] text-white'
                      : 'bg-white text-[#64748B] shadow-xs'
                  }`}
                >
                  {interestIconMap[item.icon] || <Layers className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs block truncate leading-tight">
                    {item.label}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#5E2EEF] text-white flex items-center justify-center shrink-0 shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.interests && (
          <p className="text-xs font-semibold text-rose-500">{errors.interests.message}</p>
        )}
      </div>

      {/* Short Bio / Status */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="signup-bio-input" className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Campus Tagline / Bio (Optional)
          </label>
          <span className="text-[11px] text-[#94A3B8] font-mono font-semibold">
            {currentBio.length}/150
          </span>
        </div>
        <textarea
          id="signup-bio-input"
          rows={2}
          maxLength={150}
          placeholder="e.g. CS Sophomore passionate about AI, hackathons, and campus photography!"
          className="w-full bg-[#F1F5F9] text-[#0F172A] font-semibold placeholder:text-[#94A3B8] rounded-2xl text-sm transition-all duration-200 border-2 border-transparent hover:border-[#CBD5E1] focus:border-[#5E2EEF] focus:bg-white p-3.5 outline-none resize-none"
          {...register('bio')}
          onChange={(e) => {
            setValue('bio', e.target.value);
            updateFormData({ bio: e.target.value });
          }}
        />
        {errors.bio && (
          <p className="text-xs font-semibold text-rose-500">{errors.bio.message}</p>
        )}
      </div>

      {/* Complete Profile Review Summary Card */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm" id="profile-review-card">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Profile Preview & Summary</span>
          </div>
          <span className="text-[11px] text-[#10B981] font-bold bg-[#10B981]/10 px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
            Ready to Activate
          </span>
        </div>

        {/* User preview header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-2xl">
              {currentAvatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#0F172A] leading-tight">
                  {formData.fullName || 'Student Name'}
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#5E2EEF]/10 text-[#5E2EEF]">
                  {formData.pronouns || 'They/Them'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-semibold mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                {formData.email} • {formData.age ? `${formData.age} yrs` : 'Age set'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="review-edit-step2-btn"
            disabled={isLoading}
            onClick={() => onGoToStep(2)}
            className="text-xs text-[#5E2EEF] hover:underline font-bold flex items-center gap-1 p-1 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit Personal Information"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* Academic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3.5 rounded-2xl border border-[#E2E8F0] mb-3 font-medium">
          <div className="flex items-center gap-2 text-[#0F172A]">
            <Building className="w-3.5 h-3.5 text-[#5E2EEF] shrink-0" />
            <span className="truncate">{collegeDisplay}</span>
          </div>
          <div className="flex items-center gap-2 text-[#0F172A]">
            <MapPin className="w-3.5 h-3.5 text-[#5E2EEF] shrink-0" />
            <span>{formData.city || 'City'}, {formData.state || 'State'}</span>
          </div>
          <div className="flex items-center gap-2 text-[#64748B] sm:col-span-2">
            <span className="text-[#5E2EEF] font-bold">Degree:</span>
            <span className="truncate text-[#0F172A] font-semibold">{formData.degree || 'Degree'} (Class of {formData.graduationYear || '2026'})</span>
          </div>
        </div>

        {/* Selected Interests tags */}
        {selectedInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedInterests.map((intId) => {
              const item = CAMPUS_INTERESTS_LIST.find((i) => i.id === intId);
              return (
                <span
                  key={intId}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#5E2EEF]/10 text-[#5E2EEF]"
                >
                  #{item?.label || intId}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Ethics and Student Declaration Checkbox */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-ethics-checkbox"
          className={`flex items-start gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] transition-colors select-none ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:border-[#CBD5E1] cursor-pointer'
          }`}
        >
          <input
            id="signup-ethics-checkbox"
            type="checkbox"
            disabled={isLoading}
            checked={currentAcceptedEthics}
            className="w-4 h-4 mt-0.5 rounded border-[#CBD5E1] bg-white text-[#5E2EEF] focus:ring-[#5E2EEF] cursor-pointer disabled:cursor-not-allowed"
            {...register('acceptedEthics')}
            onChange={(e) => {
              setValue('acceptedEthics', e.target.checked, { shouldValidate: true });
              updateFormData({ acceptedEthics: e.target.checked });
            }}
          />
          <div className="text-xs text-[#0F172A] font-medium leading-relaxed">
            I confirm that I am a college student and all submitted information is accurate. I agree to uphold the{' '}
            <strong className="text-[#5E2EEF] font-bold">Nubpack Student Code of Ethics</strong>, respectful community guidelines, and academic integrity.
          </div>
        </label>
        {errors.acceptedEthics && (
          <p className="text-xs font-semibold text-rose-500 mt-1 pl-1">{errors.acceptedEthics.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          id="step-4-back-btn"
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={isLoading}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        <Button
          id="final-submit-signup-btn"
          type="submit"
          size="lg"
          isLoading={isLoading}
          loadingText="Creating Nubpack Account..."
          disabled={!currentAcceptedEthics || selectedInterests.length < 2 || isLoading}
          className="px-8 font-bold shadow-xl shadow-[#5E2EEF]/20"
          rightIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Complete Signup & Launch Pack
        </Button>
      </div>
    </motion.form>
  );
}
