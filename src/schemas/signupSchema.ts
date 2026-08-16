import { z } from 'zod';
import { STATE_CITIES_DATA } from '../data/locations';

// Step 1: Email Schema
export const step1EmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email address cannot exceed 100 characters')
});

// Step 1: OTP Schema
export const step1OtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers')
});

const PRONOUN_VALUES = ['He/Him', 'She/Her', 'They/Them', 'Prefer not to say', 'Other'] as const;

// Step 2: Personal Information Schema
export const step2PersonalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name should only contain letters, spaces, and standard punctuation')
    .refine((val) => val.trim().length >= 2, 'Name cannot be empty or spaces only'),
  age: z
    .number()
    .nullable()
    .refine((val) => val !== null && !isNaN(val), 'Age is required')
    .refine((val) => val === null || val >= 18, 'You must be 18 or older to continue.')
    .refine((val) => val === null || val <= 120, 'Please enter a valid age (maximum 120)'),
  pronouns: z.enum(PRONOUN_VALUES),
  customPronouns: z.string().optional(),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')), {
      message: 'Please enter a valid 10-digit mobile number'
    }),
  avatarId: z.string().min(1, 'Please select a profile avatar')
}).refine((data) => {
  if (data.pronouns === 'Other') {
    return !!data.customPronouns && data.customPronouns.trim().length > 0;
  }
  return true;
}, {
  message: 'Please specify your pronouns',
  path: ['customPronouns']
});

// Step 3: Campus & Academic Information Schema
export const step3ProfileSchema = z.object({
  state: z.string().trim().min(1, 'Please select your State'),
  city: z.string().trim().min(1, 'Please select your City'),
  college: z.string().trim().min(1, 'Please select your College / University'),
  customCollege: z.string().optional(),
  degree: z.string().trim().min(1, 'Please select your Degree program'),
  graduationYear: z.string().trim().min(1, 'Please select your Graduation Year'),
  studentIdCardNumber: z.string().trim().max(30, 'Student ID cannot exceed 30 characters').optional()
}).superRefine((data, ctx) => {
  // Validate city belongs to state
  if (data.state && STATE_CITIES_DATA[data.state]) {
    const validCities = STATE_CITIES_DATA[data.state];
    if (!validCities.includes(data.city)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please select a valid city in ${data.state}`,
        path: ['city']
      });
    }
  }

  // Validate custom college if "Other" selected
  if (data.college && data.college.includes('Other')) {
    if (!data.customCollege || data.customCollege.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter your College name',
        path: ['customCollege']
      });
    }
  }
});

// Step 4: Final Profile & Interests Schema
export const step4ConfirmationSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(150, 'Bio cannot exceed 150 characters'),
  interests: z
    .array(z.string())
    .min(2, 'Select at least 2 campus interests to join your packs')
    .max(8, 'You can select up to 8 interests'),
  acceptedEthics: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that your profile information is accurate to continue'
  })
});

// Full Complete Signup Schema
export const fullSignupSchema = step1EmailSchema
  .extend(step2PersonalSchema.shape)
  .extend(step3ProfileSchema.shape)
  .extend(step4ConfirmationSchema.shape);

export type Step1EmailValues = z.infer<typeof step1EmailSchema>;
export type Step1OtpValues = z.infer<typeof step1OtpSchema>;
export type Step2PersonalValues = z.infer<typeof step2PersonalSchema>;
export type Step3ProfileValues = z.infer<typeof step3ProfileSchema>;
export type Step4ConfirmationValues = z.infer<typeof step4ConfirmationSchema>;
export type FullSignupValues = z.infer<typeof fullSignupSchema>;
