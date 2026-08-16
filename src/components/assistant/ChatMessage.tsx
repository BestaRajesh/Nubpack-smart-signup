import React from 'react';
import { AssistantMessage } from '../../types/assistant';
import { Bot, User, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessageProps {
  key?: React.Key;
  message: AssistantMessage;
  onSelectSuggestion?: (query: string) => void;
}

export function ChatMessage({ message, onSelectSuggestion }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const isError = message.isError;

  // Simple, clean markdown rendering for bold, lists, and inline code
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, i) => {
          if (!line.trim()) {
            return <div key={i} className="h-1" />;
          }

          // Bullet points
          if (line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')) {
            const content = line.trim().substring(1).trim();
            return (
              <div key={i} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#5E2EEF] font-bold text-xs mt-0.5">•</span>
                <span>{renderInlineStyles(content)}</span>
              </div>
            );
          }

          // Numbered lists e.g. 1.
          const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
          if (numberedMatch) {
            return (
              <div key={i} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#5E2EEF] font-bold text-xs mt-0.5">{numberedMatch[1]}.</span>
                <span>{renderInlineStyles(numberedMatch[2])}</span>
              </div>
            );
          }

          return <p key={i}>{renderInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (content: string) => {
    // Split by bold (**text**) and code (`code`)
    const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-[#0F172A]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded-md bg-[#F1F5F9] font-mono text-[11px] text-[#5E2EEF] font-semibold border border-[#E2E8F0]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const timeFormatted = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col gap-1 my-2 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`flex items-start gap-2 max-w-[88%] sm:max-w-[82%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar icon */}
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
            isUser
              ? 'bg-[#5E2EEF] text-white'
              : isError
              ? 'bg-rose-100 text-rose-600 border border-rose-200'
              : 'bg-[#5E2EEF]/10 border border-[#5E2EEF]/20 text-[#5E2EEF]'
          }`}
        >
          {isUser ? <User className="w-3.5 h-3.5" /> : isError ? <AlertCircle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-left shadow-xs ${
            isUser
              ? 'bg-[#5E2EEF] text-white rounded-tr-xs'
              : isError
              ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
              : 'bg-white border border-[#E2E8F0] text-[#1E293B] rounded-tl-xs'
          }`}
        >
          {!isUser && (
            <div className="flex items-center justify-between gap-3 mb-1 pb-1 border-b border-[#F1F5F9]">
              <span className="text-[11px] font-bold text-[#5E2EEF]">
                {isError ? 'Assistant Notice' : 'Nubpack AI Guide'}
              </span>
              <span className="text-[10px] text-[#94A3B8] font-medium">{timeFormatted}</span>
            </div>
          )}

          {renderFormattedText(message.text)}

          {isUser && (
            <span className="text-[10px] text-white/70 block text-right mt-1 font-medium">{timeFormatted}</span>
          )}
        </div>
      </div>

      {/* Suggested Follow-up Actions */}
      {message.suggestions && message.suggestions.length > 0 && onSelectSuggestion && (
        <div className="flex flex-wrap gap-1.5 mt-1 ml-9">
          {message.suggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion(sug)}
              className="text-[11px] font-medium text-[#5E2EEF] bg-[#5E2EEF]/5 hover:bg-[#5E2EEF]/10 border border-[#5E2EEF]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
