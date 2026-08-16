import { AppView, StepNumber, SignupFormData } from './signup';

export type MessageSender = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  suggestions?: string[];
  isError?: boolean;
  action?: {
    label: string;
    type: 'navigate' | 'fill' | 'check_form';
    target?: string;
  };
}

export interface AssistantContext {
  currentStep: StepNumber;
  currentPage: AppView;
  signupData: Partial<Omit<SignupFormData, 'otp'>>; // Security: OTP is never passed into AI context
  validationErrors: Record<string, string>;
  isOtpSent?: boolean;
  isOtpVerified?: boolean;
}

export interface AIRequest {
  message: string;
  context: AssistantContext;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  action?: {
    label: string;
    type: 'navigate' | 'fill' | 'check_form';
    target?: string;
  };
}

export interface QuickActionItem {
  id: string;
  label: string;
  query: string;
  category?: string;
}
