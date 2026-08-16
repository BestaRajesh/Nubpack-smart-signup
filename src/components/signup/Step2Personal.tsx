import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2PersonalSchema, Step2PersonalValues } from '../../schemas/signupSchema';
import { SignupFormData } from '../../types/signup';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AVATAR_PRESETS } from '../../data/locations';
import { User, Calendar, Phone, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Step2PersonalProps {
  formData: SignupFormData;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRONOUN_OPTIONS: ('He/Him' | 'She/Her' | 'They/Them' | 'Prefer not to say' | 'Other')[] = [
  'He/Him',
  'She/Her',
  'They/Them',
  'Prefer not to say',
  'Other'
];

export function Step2Personal({
  formData,
  updateFormData,
  onNext,
  onBack
}: Step2PersonalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(formData.avatarId || 'avatar-1');
  const [selectedPronoun, setSelectedPronoun] = useState<string>(formData.pronouns || 'He/Him');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<Step2PersonalValues>({
    resolver: zodResolver(step2PersonalSchema),
    defaultValues: {
      fullName: formData.fullName || '',
      age: formData.age ?? null,
      pronouns: (formData.pronouns as Step2PersonalValues['pronouns']) || 'He/Him',
      customPronouns: formData.customPronouns || '',
      phoneNumber: formData.phoneNumber || '',
      avatarId: formData.avatarId || 'avatar-1'
    },
    mode: 'onTouched'
  });

  useEffect(() => {
    reset({
      fullName: formData.fullName || '',
      age: formData.age ?? null,
      pronouns: (formData.pronouns as Step2PersonalValues['pronouns']) || 'He/Him',
      customPronouns: formData.customPronouns || '',
      phoneNumber: formData.phoneNumber || '',
      avatarId: formData.avatarId || 'avatar-1'
    });
    if (formData.avatarId) setSelectedAvatar(formData.avatarId);
    if (formData.pronouns) setSelectedPronoun(formData.pronouns);
  }, [formData.fullName, formData.age, formData.pronouns, formData.customPronouns, formData.phoneNumber, formData.avatarId, reset]);

  const currentName = watch('fullName') || '';
  const currentAge = watch('age');

  // Check if under 18 explicitly
  const isUnder18 = currentAge !== null && currentAge !== undefined && typeof currentAge === 'number' && currentAge < 18 && currentAge > 0;
  const isAgeValid = currentAge !== null && currentAge !== undefined && typeof currentAge === 'number' && currentAge >= 18 && currentAge <= 120;

  const onSubmit: SubmitHandler<Step2PersonalValues> = (data) => {
    updateFormData({
      fullName: data.fullName.trim(),
      age: Number(data.age),
      pronouns: data.pronouns,
      customPronouns: data.customPronouns?.trim() || '',
      phoneNumber: data.phoneNumber?.trim() || '',
      avatarId: selectedAvatar
    });
    onNext();
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 text-left w-full"
      id="step-2-form"
    >
      {/* Step Heading */}
      <div>
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          Tell us about yourself
        </h2>
        <p className="text-sm text-[#64748B] font-medium leading-relaxed">
          Please provide your legal name and information as it appears on your student ID.
        </p>
      </div>

      {/* Avatar Selection Grid */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
          <span>Choose Your Campus Avatar <span className="text-rose-500">*</span></span>
          <span className="text-[#5E2EEF] font-bold text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 8 Styles
          </span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" id="avatar-selection-grid">
          {AVATAR_PRESETS.map((av) => {
            const isSelected = selectedAvatar === av.id;
            return (
              <button
                key={av.id}
                type="button"
                id={`avatar-option-${av.id}`}
                onClick={() => {
                  setSelectedAvatar(av.id);
                  setValue('avatarId', av.id, { shouldValidate: true });
                  updateFormData({ avatarId: av.id });
                }}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#5E2EEF]/10 border-[#5E2EEF] shadow-md shadow-[#5E2EEF]/15 scale-105'
                    : 'bg-[#F1F5F9] border-transparent hover:border-[#CBD5E1] hover:bg-white'
                }`}
                aria-label={`Select avatar ${av.name}`}
              >
                <span className="text-2xl select-none">{av.emoji}</span>
                <span className="text-[10px] text-[#0F172A] font-bold mt-1 truncate max-w-full">
                  {av.name.split(' ')[0]}
                </span>
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#5E2EEF] text-white flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.avatarId && (
          <p className="text-xs text-rose-500 font-semibold">{errors.avatarId.message}</p>
        )}
      </div>

      {/* Full Name & Age Inputs in Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            id="signup-fullname-input"
            label="Full Name"
            placeholder="e.g. Alexander J. Wright"
            leftIcon={<User className="w-4 h-4 text-[#64748B]" />}
            maxLength={60}
            showCharCount
            currentLength={currentName.length}
            error={errors.fullName?.message}
            required
            {...register('fullName')}
            onChange={(e) => {
              setValue('fullName', e.target.value, { shouldValidate: true });
              updateFormData({ fullName: e.target.value });
            }}
          />
        </div>

        <div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="signup-age-input" className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Age <span className="text-rose-500">*</span>
              </label>
              {isAgeValid && (
                <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded font-black uppercase">
                  Verified
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="signup-age-input"
                type="number"
                min={1}
                max={120}
                placeholder="e.g. 20"
                className={`w-full px-4 py-3.5 bg-[#F1F5F9] border-2 font-semibold text-[#0F172A] rounded-2xl outline-none transition-all min-h-[50px] ${
                  errors.age
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-transparent focus:border-[#5E2EEF] focus:bg-white'
                }`}
                {...register('age', { valueAsNumber: true })}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  setValue('age', val, { shouldValidate: true });
                  updateFormData({ age: val });
                }}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            {errors.age && (
              <p className="text-xs font-semibold text-rose-500 mt-0.5">{errors.age.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Under 18 Explicit Alert Banner */}
      {isUnder18 && (
        <div id="under-18-error-banner" className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-rose-950 block">Age Eligibility Notice:</strong>
            You must be 18 or older to continue. Nubpack is restricted to verified adult college students.
          </div>
        </div>
      )}

      {/* Pronouns Selection Chips */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          Preferred Pronouns <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="pronouns-options-grid">
          {PRONOUN_OPTIONS.map((p) => {
            const isSelected = selectedPronoun === p;
            return (
              <button
                key={p}
                type="button"
                id={`pronoun-chip-${p.toLowerCase().replace(/[^a-z]/g, '-')}`}
                onClick={() => {
                  setSelectedPronoun(p);
                  setValue('pronouns', p, { shouldValidate: true });
                  updateFormData({ pronouns: p });
                }}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all duration-200 text-center cursor-pointer ${
                  isSelected
                    ? 'border-[#5E2EEF] bg-[#5E2EEF]/10 text-[#5E2EEF] shadow-sm'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
        {errors.pronouns && (
          <p className="text-xs font-semibold text-rose-500">{errors.pronouns.message}</p>
        )}

        {/* Custom Pronouns input if "Other" is picked */}
        {selectedPronoun === 'Other' && (
          <div className="mt-2 animate-fadeIn">
            <Input
              id="custom-pronouns-input"
              label="Specify Custom Pronouns"
              placeholder="e.g. Ze/Zir or Any"
              required
              error={errors.customPronouns?.message}
              {...register('customPronouns')}
              onChange={(e) => {
                setValue('customPronouns', e.target.value, { shouldValidate: true });
                updateFormData({ customPronouns: e.target.value });
              }}
            />
          </div>
        )}
      </div>

      {/* Optional Phone Number */}
      <Input
        id="signup-phone-input"
        label="Mobile Number (Optional)"
        type="tel"
        placeholder="e.g. 9876543210 (10 digits)"
        leftIcon={<Phone className="w-4 h-4 text-[#64748B]" />}
        error={errors.phoneNumber?.message}
        helperText="Used for campus emergency alerts and peer study pack notifications."
        {...register('phoneNumber')}
        onChange={(e) => {
          setValue('phoneNumber', e.target.value, { shouldValidate: true });
          updateFormData({ phoneNumber: e.target.value });
        }}
      />

      {/* Navigation actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          id="step-2-back-btn"
          type="button"
          variant="secondary"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        <Button
          id="step-2-continue-btn"
          type="submit"
          disabled={Boolean(isUnder18)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Academic Info
        </Button>
      </div>
    </motion.form>
  );
}
