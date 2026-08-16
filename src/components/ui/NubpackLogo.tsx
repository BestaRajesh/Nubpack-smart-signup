interface NubpackLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'dark' | 'light' | 'whiteOnPurple';
  className?: string;
}

export function NubpackLogo({
  size = 'md',
  showText = true,
  variant = 'dark',
  className = ''
}: NubpackLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl'
  };

  const diamondSizes = {
    sm: 'w-3.5 h-3.5 rounded-[3px]',
    md: 'w-5 h-5 rounded-[4px]',
    lg: 'w-6 h-6 rounded-[5px]',
    xl: 'w-8 h-8 rounded-[6px]'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const isWhite = variant === 'whiteOnPurple';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} id="nubpack-brand-logo">
      {/* Geometric Icon Box */}
      <div
        className={`flex items-center justify-center shrink-0 transition-all ${iconSizes[size]} ${
          isWhite
            ? 'bg-white shadow-md'
            : 'bg-[#5E2EEF] shadow-md shadow-[#5E2EEF]/20'
        }`}
      >
        {/* Rotated Geometric Diamond */}
        <div
          className={`rotate-45 transition-transform ${diamondSizes[size]} ${
            isWhite ? 'bg-[#5E2EEF]' : 'bg-white'
          }`}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isWhite ? 'text-white' : 'text-[#0F172A]'
            }`}
          >
            nub<span className={isWhite ? 'text-white/90' : 'text-[#5E2EEF]'}>pack</span>
          </span>
        </div>
      )}
    </div>
  );
}
