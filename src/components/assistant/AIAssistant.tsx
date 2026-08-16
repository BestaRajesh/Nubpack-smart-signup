import React from 'react';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { AssistantButton } from './AssistantButton';
import { AssistantPanel } from './AssistantPanel';
import { AppView, StepNumber, SignupFormData } from '../../types/signup';

interface AIAssistantProps {
  currentView: AppView;
  currentStep: StepNumber;
  formData: SignupFormData;
  onNavigateToStep?: (step: StepNumber) => void;
  onStartSignup?: () => void;
}

export function AIAssistant({
  currentView,
  currentStep,
  formData,
  onNavigateToStep,
  onStartSignup
}: AIAssistantProps) {
  const {
    isOpen,
    toggleAssistant,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    quickActions,
    clearMessages,
    liveContext
  } = useAIAssistant(currentView, currentStep, formData, onNavigateToStep, onStartSignup);

  return (
    <div id="nubpack-ai-assistant-root">
      {/* Floating Action Trigger Button */}
      <AssistantButton
        isOpen={isOpen}
        onClick={toggleAssistant}
        hasUnread={messages.length === 1 && !isOpen}
      />

      {/* Floating Context-Aware Chat Panel */}
      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        quickActions={quickActions}
        onSendMessage={sendMessage}
        onClearMessages={clearMessages}
        liveContext={liveContext}
      />
    </div>
  );
}
