import React from 'react';
import { QuickActionItem } from '../../types/assistant';
import { Sparkles } from 'lucide-react';

interface QuickActionsProps {
  actions: QuickActionItem[];
  onSelectAction: (query: string) => void;
  disabled?: boolean;
}

export function QuickActions({ actions, onSelectAction, disabled }: QuickActionsProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 py-1" id="assistant-quick-actions-container">
      <div className="flex items-center gap-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-1">
        <Sparkles className="w-3 h-3 text-[#5E2EEF]" />
        <span>Suggested Questions</span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectAction(act.query)}
            className="shrink-0 text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#5E2EEF]/5 hover:text-[#5E2EEF] border border-[#E2E8F0] hover:border-[#5E2EEF]/40 px-3 py-1.5 rounded-xl transition-all duration-150 shadow-2xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}
