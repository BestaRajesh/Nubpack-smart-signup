import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AssistantMessage, AssistantContext, QuickActionItem } from '../types/assistant';
import { askAssistant } from '../services/aiAssistant';
import { AppView, StepNumber, SignupFormData } from '../types/signup';
import { buildAssistantContext } from '../utils/assistantContext';

export function useAIAssistant(
  currentView: AppView,
  currentStep: StepNumber,
  formData: SignupFormData,
  onNavigateToStep?: (step: StepNumber) => void,
  onStartSignup?: () => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial welcome message tailored to current context
  const getInitialMessage = useCallback((view: AppView, step: StepNumber): AssistantMessage => {
    let welcomeText = "Hi! I'm your **AI Signup Assistant**. I'm here to help you navigate through your registration smoothly.";
    let suggestions: string[] = [];

    if (view === 'landing') {
      welcomeText = "Hi! I can help you understand the signup process and guide you through each step.";
      suggestions = ['How does signup work?', 'What information do I need?', 'Start signup'];
    } else if (view === 'terms') {
      welcomeText = "Welcome to the Terms & Conditions review. I can explain any agreement points in simple language.";
      suggestions = ['What am I agreeing to?', 'Can you explain these terms?', "What happens if I don't accept?"];
    } else if (view === 'signup') {
      if (step === 1) {
        welcomeText = "Let's get your student email verified. Institutional emails (.edu, .ac.in) unlock instant recognition badges!";
        suggestions = ['What email should I use?', 'Why is my email invalid?', 'Help me complete this step'];
      } else if (step === 2) {
        welcomeText = "Step 2: Personal Information. You can choose a campus avatar, set your name, pronouns, and age (18+).";
        suggestions = ['What is pronouns?', "Why can't I enter 17?", 'Check my fields'];
      } else if (step === 3) {
        welcomeText = "Step 3: Campus & Academic Info. Select your state first to view cities and colleges in your region.";
        suggestions = ['Why is my city empty?', 'What if my college is not listed?', 'Check my fields'];
      } else if (step === 4) {
        welcomeText = "Step 4: Final Confirmation. Select at least 2 campus interests and confirm your student ethics pledge.";
        suggestions = ['Check my form', "What's missing?", 'What happens after submission?'];
      }
    } else if (view === 'success') {
      welcomeText = "Congratulations on activating your Nubpack Student Pass! Let me know if you have questions about your perks.";
      suggestions = ['What happens after submission?', 'How do I access student perks?'];
    }

    return {
      id: `welcome-${Date.now()}`,
      sender: 'assistant',
      text: welcomeText,
      timestamp: Date.now(),
      suggestions
    };
  }, []);

  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    getInitialMessage(currentView, currentStep)
  ]);

  // Track previous step/view to optionally add helpful proactive greeting when user changes screen
  const prevContextRef = useRef<{ view: AppView; step: StepNumber }>({
    view: currentView,
    step: currentStep
  });

  useEffect(() => {
    if (
      prevContextRef.current.view !== currentView ||
      prevContextRef.current.step !== currentStep
    ) {
      prevContextRef.current = { view: currentView, step: currentStep };
      
      // Update quick greeting if chat is fresh or empty
      setMessages((prev) => {
        if (prev.length <= 2) {
          return [getInitialMessage(currentView, currentStep)];
        }
        return prev;
      });
    }
  }, [currentView, currentStep, getInitialMessage]);

  // Compute live assistant context
  const liveContext: AssistantContext = useMemo(() => {
    return buildAssistantContext(currentView, currentStep, formData);
  }, [currentView, currentStep, formData]);

  // Contextual quick actions list for the current view & step
  const quickActions: QuickActionItem[] = useMemo(() => {
    if (currentView === 'landing') {
      return [
        { id: 'l1', label: 'How does signup work?', query: 'How does signup work?' },
        { id: 'l2', label: 'What information do I need?', query: 'What information do I need?' },
        { id: 'l3', label: 'Start signup', query: 'Start signup' }
      ];
    }
    if (currentView === 'terms') {
      return [
        { id: 't1', label: 'What am I agreeing to?', query: 'What am I agreeing to?' },
        { id: 't2', label: 'Can you explain these terms?', query: 'Can you explain these terms?' },
        { id: 't3', label: "What happens if I don't accept?", query: "What happens if I don't accept?" }
      ];
    }
    if (currentView === 'signup') {
      if (currentStep === 1) {
        if (formData.otpVerified) {
          return [
            { id: 's1_v', label: 'Check my form', query: 'Check my form' },
            { id: 's1_next', label: 'What is in Step 2?', query: 'What information is next?' }
          ];
        }
        if (formData.email && !formData.otpVerified) {
          return [
            { id: 's1_otp1', label: "Didn't receive OTP", query: "Where do I find my OTP?" },
            { id: 's1_otp2', label: "OTP isn't working", query: "My OTP isn't working" },
            { id: 's1_otp3', label: 'How do I verify?', query: 'How do I verify my code?' }
          ];
        }
        return [
          { id: 's1_1', label: 'What email should I use?', query: 'What email should I use?' },
          { id: 's1_2', label: 'Why is my email invalid?', query: 'Why is my email invalid?' },
          { id: 's1_3', label: 'Help me complete this step', query: 'Check my form' }
        ];
      }

      if (currentStep === 2) {
        return [
          { id: 's2_1', label: 'What is pronouns?', query: 'What is pronouns?' },
          { id: 's2_2', label: "Why can't I enter 17?", query: "Why can't I enter 17?" },
          { id: 's2_3', label: 'Check my fields', query: 'Check my fields' }
        ];
      }

      if (currentStep === 3) {
        return [
          { id: 's3_1', label: 'Why is my city empty?', query: 'Why is my city empty?' },
          { id: 's3_2', label: 'College not listed?', query: 'What if my college is not listed?' },
          { id: 's3_3', label: 'Check my fields', query: 'Check my fields' }
        ];
      }

      if (currentStep === 4) {
        return [
          { id: 's4_1', label: 'Check my form', query: 'Check my form' },
          { id: 's4_2', label: "What's missing?", query: "What's missing from my form?" },
          { id: 's4_3', label: 'What happens after submission?', query: 'What happens after submission?' }
        ];
      }
    }

    return [
      { id: 'gen1', label: 'Check my form', query: 'Check my form' },
      { id: 'gen2', label: 'Help with this step', query: 'Help me complete this step' }
    ];
  }, [currentView, currentStep, formData.email, formData.otpVerified]);

  const sendMessage = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText || isTyping) return;

      const userMessage: AssistantMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: cleanText,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);

      // Handle direct navigation actions if requested by user in terms/landing
      if (cleanText.toLowerCase() === 'start signup' && onStartSignup) {
        onStartSignup();
      }

      try {
        const response = await askAssistant({
          message: cleanText,
          context: liveContext
        });

        const assistantMessage: AssistantMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: response.message,
          timestamp: Date.now(),
          suggestions: response.suggestions,
          action: response.action
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        const fallbackMsg =
          "I'm having trouble responding right now. You can continue the signup using the form above.";
        setError(fallbackMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: fallbackMsg,
            timestamp: Date.now(),
            isError: true,
            suggestions: ['Try again', 'Check my form']
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, liveContext, onStartSignup]
  );

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([getInitialMessage(currentView, currentStep)]);
    setError(null);
  }, [getInitialMessage, currentView, currentStep]);

  return {
    isOpen,
    setIsOpen,
    toggleAssistant,
    messages,
    isTyping,
    error,
    sendMessage,
    quickActions,
    clearMessages,
    liveContext
  };
}
