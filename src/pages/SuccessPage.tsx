import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SignupFormData } from '../types/signup';
import { AVATAR_PRESETS, CAMPUS_INTERESTS_LIST } from '../data/locations';
import { NubpackLogo } from '../components/ui/NubpackLogo';
import { Button } from '../components/ui/Button';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  Building,
  MapPin,
  GraduationCap,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '../context/ToastContext';

interface SuccessPageProps {
  formData: SignupFormData;
  studentId: string | null;
  onReset: () => void;
}

export function SuccessPage({
  formData,
  studentId,
  onReset
}: SuccessPageProps) {
  const { success } = useToast();

  useEffect(() => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#5E2EEF', '#7C3AED', '#A855F7']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#3B82F6', '#10B981', '#F59E0B']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
    } catch {
      // ignore
    }
  }, []);

  const avatar = AVATAR_PRESETS.find((a) => a.id === formData.avatarId) || AVATAR_PRESETS[0];
  const displayCollege = formData.customCollege || formData.college || 'University Campus';
  const displayId = studentId || 'NUB-2025-8842';

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Nubpack Campus ID',
          text: `Joined ${displayCollege} on Nubpack! My Student Pack ID is ${displayId}.`
        })
        .catch(() => {});
    } else {
      success('Copied Pack ID to clipboard!', 'Share Nubpack');
    }
  };

  const handleDownload = () => {
    success('Student Pack Pass downloaded to your device!', 'ID Pass Exported');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-[#F8FAFC] text-[#0F172A] py-8 px-4 sm:px-6">
      {/* Background Geometric Accents */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pb-4">
        <NubpackLogo size="md" variant="dark" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            Active Student Account
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center text-center">
        {/* Celebration Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#5E2EEF] flex items-center justify-center text-white shadow-2xl shadow-[#5E2EEF]/30 mb-6"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2"
        >
          Welcome to Nubpack, {formData.fullName || 'Student'}! 🎓
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base text-[#64748B] font-medium max-w-md mb-8 leading-relaxed"
        >
          Your campus pack has been verified and registered. You now have full access to study groups, campus notes, and student discussions.
        </motion.p>

        {/* Digital Student ID Pass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full rounded-3xl bg-white border border-[#E2E8F0] shadow-xl p-6 sm:p-8 text-left relative overflow-hidden mb-8"
          id="student-id-card-pass"
        >
          {/* Card Accent Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#5E2EEF]" />

          {/* Top Row: Logo & Student ID */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <NubpackLogo size="sm" showText={true} variant="dark" />
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#64748B] block uppercase font-bold tracking-wider">Pack Pass ID</span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-[#5E2EEF] bg-[#5E2EEF]/10 px-3 py-1 rounded-xl border border-[#5E2EEF]/20">
                {displayId}
              </span>
            </div>
          </div>

          {/* User Bio Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-3xl shadow-sm shrink-0">
                {avatar.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#0F172A] leading-tight">
                    {formData.fullName || 'Student Name'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#5E2EEF]/10 text-[#5E2EEF]">
                    {formData.pronouns || 'They/Them'}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] font-semibold font-mono mt-0.5">
                  {formData.email}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-[#10B981] font-bold mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Verified Campus Member
                </div>
              </div>
            </div>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs mb-4 font-medium">
            <div className="flex items-center gap-2.5 text-[#0F172A]">
              <Building className="w-4 h-4 text-[#5E2EEF] shrink-0" />
              <span className="truncate font-semibold">{displayCollege}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#0F172A]">
              <MapPin className="w-4 h-4 text-[#5E2EEF] shrink-0" />
              <span>{formData.city || 'City'}, {formData.state || 'State'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#0F172A] sm:col-span-2">
              <GraduationCap className="w-4 h-4 text-[#5E2EEF] shrink-0" />
              <span className="truncate font-semibold">
                {formData.degree || 'Degree'} • Class of {formData.graduationYear || '2026'}
              </span>
            </div>
          </div>

          {/* Interests Pill Tags */}
          {formData.interests && formData.interests.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#64748B] font-bold mr-1 uppercase">Packs:</span>
              {formData.interests.map((intId) => {
                const item = CAMPUS_INTERESTS_LIST.find((i) => i.id === intId);
                return (
                  <span
                    key={intId}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#5E2EEF]/10 text-[#5E2EEF]"
                  >
                    #{item?.label || intId}
                  </span>
                );
              })}
            </div>
          )}

          {/* Barcode Strip Graphic */}
          <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B] font-mono font-semibold">
            <span>OFFICIAL NUBPACK STUDENT CREDENTIAL</span>
            <div className="flex gap-0.5 h-3">
              {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 2, 3, 5, 1, 4, 2, 6].map((w, i) => (
                <span
                  key={i}
                  className="bg-[#0F172A] inline-block h-full"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
        >
          <Button
            id="success-download-card-btn"
            variant="secondary"
            size="md"
            onClick={handleDownload}
            className="w-full sm:w-auto"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Pack Pass
          </Button>

          <Button
            id="success-share-btn"
            variant="secondary"
            size="md"
            onClick={handleShare}
            className="w-full sm:w-auto"
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share Campus ID
          </Button>

          <Button
            id="success-start-new-btn"
            variant="primary"
            size="md"
            onClick={onReset}
            className="w-full sm:w-auto"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Register Another Student
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
