import React from 'react';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="flex items-start gap-2.5 my-2 self-start max-w-[85%]"
      id="assistant-typing-indicator"
    >
      <div className="w-7 h-7 rounded-xl bg-[#5E2EEF]/10 border border-[#5E2EEF]/20 text-[#5E2EEF] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <Bot className="w-3.5 h-3.5" />
      </div>

      <div className="bg-white border border-[#E2E8F0] px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-1.5">
        <span className="text-xs font-semibold text-[#64748B] mr-1">AI Assistant</span>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-[#5E2EEF]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-[#5E2EEF]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-[#5E2EEF]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
