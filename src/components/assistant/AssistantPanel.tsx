import React, { useState, useRef, useEffect } from 'react';
import { AssistantMessage, QuickActionItem, AssistantContext } from '../../types/assistant';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickActions } from './QuickActions';
import { Bot, Send, Trash2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AssistantMessage[];
  isTyping: boolean;
  quickActions: QuickActionItem[];
  onSendMessage: (text: string) => void;
  onClearMessages: () => void;
  liveContext: AssistantContext;
}

export function AssistantPanel({
  isOpen,
  onClose,
  messages,
  isTyping,
  quickActions,
  onSendMessage,
  onClearMessages,
  liveContext
}: AssistantPanelProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages update or typing indicator appears
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getStepBadge = () => {
    if (liveContext.currentPage === 'landing') return 'Landing Guide';
    if (liveContext.currentPage === 'terms') return 'Terms Review';
    if (liveContext.currentPage === 'success') return 'Verified';
    return `Step ${liveContext.currentStep} of 4`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="ai-assistant-panel"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[520px] max-h-[80vh] flex flex-col bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden text-left"
          role="dialog"
          aria-label="AI Signup Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#0F172A] text-white border-b border-[#1E293B] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#5E2EEF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">AI Signup Guide</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5E2EEF]/40 text-[#C4B5FD] border border-[#5E2EEF]/50">
                    {getStepBadge()}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] flex items-center gap-1 font-medium">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Context-Aware Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onClearMessages}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Clear chat messages"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close assistant"
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close assistant panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            className="flex-1 p-3.5 sm:p-4 overflow-y-auto bg-[#F8FAFC]/50 space-y-1 scroll-smooth"
            id="assistant-messages-list"
          >
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSelectSuggestion={(sug) => onSendMessage(sug)}
              />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3.5 py-1.5 bg-[#F1F5F9]/60 border-t border-[#E2E8F0] shrink-0">
            <QuickActions
              actions={quickActions}
              onSelectAction={(query) => onSendMessage(query)}
              disabled={isTyping}
            />
          </div>

          {/* Input Box & Security Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#E2E8F0] shrink-0 flex flex-col gap-1.5"
            id="assistant-input-form"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                id="assistant-query-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this step, errors, or requirements..."
                disabled={isTyping}
                maxLength={250}
                aria-label="Type your question for the signup assistant"
                className="w-full text-xs sm:text-sm pl-3.5 pr-10 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#5E2EEF] focus:bg-white focus:outline-none transition-all"
              />
              <button
                type="submit"
                id="assistant-send-btn"
                disabled={!inputText.trim() || isTyping}
                aria-label="Send message"
                className="absolute right-1.5 p-1.5 rounded-lg bg-[#5E2EEF] text-white hover:bg-[#4D24C7] disabled:opacity-40 disabled:hover:bg-[#5E2EEF] transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] px-1 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                Privacy Protected: OTPs and secrets are never shared.
              </span>
              <span>{inputText.length}/250</span>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
