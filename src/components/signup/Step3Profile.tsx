import React, { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3ProfileSchema, Step3ProfileValues } from '../../schemas/signupSchema';
import { SignupFormData } from '../../types/signup';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  STATE_CITIES_DATA,
  POPULAR_COLLEGES_BY_STATE,
  DEGREES_LIST,
  GRADUATION_YEARS
} from '../../data/locations';
import { School, MapPin, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface Step3ProfileProps {
  formData: SignupFormData;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Profile({
  formData,
  updateFormData,
  onNext,
  onBack
}: Step3ProfileProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<Step3ProfileValues>({
    resolver: zodResolver(step3ProfileSchema),
    defaultValues: {
      state: formData.state || '',
      city: formData.city || '',
      college: formData.college || '',
      customCollege: formData.customCollege || '',
      degree: formData.degree || '',
      graduationYear: formData.graduationYear || '2026',
      studentIdCardNumber: formData.studentIdCardNumber || ''
    },
    mode: 'onTouched'
  });

  useEffect(() => {
    reset({
      state: formData.state || '',
      city: formData.city || '',
      college: formData.college || '',
      customCollege: formData.customCollege || '',
      degree: formData.degree || '',
      graduationYear: formData.graduationYear || '2026',
      studentIdCardNumber: formData.studentIdCardNumber || ''
    });
  }, [formData.state, formData.city, formData.college, formData.customCollege, formData.degree, formData.graduationYear, formData.studentIdCardNumber, reset]);

  const selectedState = watch('state');
  const selectedCollege = watch('college');

  const stateOptions = useMemo(() => {
    return Object.keys(STATE_CITIES_DATA);
  }, []);

  const cityOptions = useMemo(() => {
    if (!selectedState || !STATE_CITIES_DATA[selectedState]) {
      return [];
    }
    return STATE_CITIES_DATA[selectedState];
  }, [selectedState]);

  const collegeOptions = useMemo(() => {
    if (selectedState && POPULAR_COLLEGES_BY_STATE[selectedState]) {
      return POPULAR_COLLEGES_BY_STATE[selectedState];
    }
    return [
      'Indian Institute of Technology (IIT)',
      'National Institute of Technology (NIT)',
      'Birla Institute of Technology and Science (BITS)',
      'Delhi University / State University',
      'Other / Enter Custom College'
    ];
  }, [selectedState]);

  const isCustomCollege = selectedCollege && selectedCollege.includes('Other');

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setValue('state', newState, { shouldValidate: true });
    setValue('city', '', { shouldValidate: false });
    setValue('college', '', { shouldValidate: false });
    setValue('customCollege', '');
    
    // Clear validation errors for city to prevent stale error messages
    clearErrors('city');
    clearErrors('college');
    clearErrors('customCollege');
    
    updateFormData({
      state: newState,
      city: '',
      college: '',
      customCollege: ''
    });
  };

  const onSubmit = (data: Step3ProfileValues) => {
    updateFormData({
      state: data.state,
      city: data.city,
      college: data.college,
      customCollege: data.customCollege?.trim() || '',
      degree: data.degree,
      graduationYear: data.graduationYear,
      studentIdCardNumber: data.studentIdCardNumber?.trim() || ''
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
      id="step-3-form"
    >
      {/* Step Heading */}
      <div>
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          Where do you study?
        </h2>
        <p className="text-sm text-[#64748B] font-medium leading-relaxed">
          Connect with peers from your campus, batchmates from your degree, and regional college networks.
        </p>
      </div>

      {/* State & City in 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="signup-state-select"
          label="State / Region"
          options={stateOptions}
          placeholder="Select State"
          error={errors.state?.message}
          required
          {...register('state')}
          onChange={handleStateChange}
        />

        <Select
          id="signup-city-select"
          label="City / Campus Location"
          options={cityOptions}
          placeholder={selectedState ? `Select City in ${selectedState}` : 'First select State'}
          disabled={!selectedState || cityOptions.length === 0}
          error={errors.city?.message}
          helperText={
            !selectedState
              ? 'Select a State first to view available cities.'
              : undefined
          }
          required
          {...register('city')}
          onChange={(e) => {
            setValue('city', e.target.value, { shouldValidate: true });
            updateFormData({ city: e.target.value });
          }}
        />
      </div>

      {/* College Selection */}
      <div className="flex flex-col gap-3">
        <Select
          id="signup-college-select"
          label="College / University"
          options={collegeOptions}
          placeholder="Select your Institution"
          error={errors.college?.message}
          helperText="Select from top universities in your state or choose 'Other' to type your institution."
          required
          {...register('college')}
          onChange={(e) => {
            setValue('college', e.target.value, { shouldValidate: true });
            updateFormData({ college: e.target.value });
          }}
        />

        {isCustomCollege && (
          <div className="animate-fadeIn">
            <Input
              id="signup-custom-college-input"
              label="Enter College / Institute Full Name"
              placeholder="e.g. Anurag University, Hyderabad"
              leftIcon={<School className="w-4 h-4 text-[#64748B]" />}
              error={errors.customCollege?.message}
              required
              {...register('customCollege')}
              onChange={(e) => {
                setValue('customCollege', e.target.value, { shouldValidate: true });
                updateFormData({ customCollege: e.target.value });
              }}
            />
          </div>
        )}
      </div>

      {/* Degree & Graduation Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="signup-degree-select"
          label="Degree / Major"
          options={DEGREES_LIST}
          placeholder="Select Degree Program"
          error={errors.degree?.message}
          required
          {...register('degree')}
          onChange={(e) => {
            setValue('degree', e.target.value, { shouldValidate: true });
            updateFormData({ degree: e.target.value });
          }}
        />

        <Select
          id="signup-gradyear-select"
          label="Graduation Year"
          options={GRADUATION_YEARS}
          placeholder="Select Expected Year"
          error={errors.graduationYear?.message}
          required
          {...register('graduationYear')}
          onChange={(e) => {
            setValue('graduationYear', e.target.value, { shouldValidate: true });
            updateFormData({ graduationYear: e.target.value });
          }}
        />
      </div>

      {/* Student ID Card / Roll Number (Optional) */}
      <Input
        id="signup-studentid-input"
        label="Student Roll No / ID Card (Optional)"
        placeholder="e.g. 21BCE1024"
        leftIcon={<GraduationCap className="w-4 h-4 text-[#64748B]" />}
        error={errors.studentIdCardNumber?.message}
        helperText="Used to attach verified campus notes and club officer privileges."
        {...register('studentIdCardNumber')}
        onChange={(e) => {
          setValue('studentIdCardNumber', e.target.value, { shouldValidate: true });
          updateFormData({ studentIdCardNumber: e.target.value });
        }}
      />

      {/* Campus Location hint badge */}
      {selectedState && (
        <div className="p-4 rounded-2xl bg-[#5E2EEF]/5 border border-[#5E2EEF]/15 flex items-center gap-3 text-xs text-[#0F172A] font-medium">
          <MapPin className="w-4 h-4 text-[#5E2EEF] shrink-0" />
          <span>
            You will be automatically added to the <strong className="text-[#5E2EEF]">{selectedState} Student Pack</strong> and local campus chapters.
          </span>
        </div>
      )}

      {/* Navigation actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          id="step-3-back-btn"
          type="button"
          variant="secondary"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        <Button
          id="step-3-continue-btn"
          type="submit"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Final Review
        </Button>
      </div>
    </motion.form>
  );
}
