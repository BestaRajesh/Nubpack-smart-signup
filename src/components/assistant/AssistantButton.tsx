import React from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AssistantButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export function AssistantButton({ isOpen, onClick, hasUnread }: AssistantButtonProps) {
  return (
    <motion.button
      type="button"
      id="ai-assistant-toggle-btn"
      onClick={onClick}
      aria-label={isOpen ? 'Close AI signup assistant' : 'Open AI signup assistant'}
      aria-expanded={isOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl transition-colors duration-200 cursor-pointer select-none ${
        isOpen
          ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] border-2 border-white/20'
          : 'bg-[#5E2EEF] text-white hover:bg-[#4D24C7] border-2 border-white shadow-[#5E2EEF]/30'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <Bot className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#5E2EEF] animate-ping" />
            )}
          </>
        )}
      </div>

      <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
        {isOpen ? 'Close Assistant' : 'AI Signup Helper'}
      </span>

      {!isOpen && (
        <span className="hidden md:flex items-center justify-center p-1 rounded-full bg-white/20">
          <Sparkles className="w-3 h-3 text-amber-300" />
        </span>
      )}
    </motion.button>
  );
}
