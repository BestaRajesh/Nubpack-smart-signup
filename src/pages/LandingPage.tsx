import { NubpackLogo } from '../components/ui/NubpackLogo';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStartSignup: () => void;
  onViewTerms: () => void;
}

export function LandingPage({ onStartSignup, onViewTerms }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      {/* Geometric Background Accents */}
      <div className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <NubpackLogo size="md" variant="dark" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="nav-terms-link-btn"
            onClick={onViewTerms}
            className="text-xs sm:text-sm font-bold text-[#64748B] hover:text-[#0F172A] px-3.5 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#5E2EEF]" />
            <span className="hidden sm:inline">Terms & Guidelines</span>
            <span className="sm:hidden">Terms</span>
          </button>

          <Button
            id="nav-get-started-btn"
            size="sm"
            onClick={onStartSignup}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Join Nubpack
          </Button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 my-auto flex flex-col items-center text-center">
        {/* Verification Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#5E2EEF]/10 border border-[#5E2EEF]/20 text-[#5E2EEF] mb-6 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Fall 2025 Campus Onboarding Open</span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#64748B]">50+ Universities Verified</span>
        </motion.div>

        {/* Hero Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl leading-[1.1] mb-6"
        >
          Find Your Pack.{' '}
          <span className="text-[#5E2EEF]">
            Rule Your Campus.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#64748B] max-w-2xl leading-relaxed mb-8 font-medium"
        >
          Experience the next generation of verified student networking, study circles, and campus club collaboration with precision and security.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-12"
        >
          <Button
            id="hero-start-signup-btn"
            size="lg"
            onClick={onStartSignup}
            className="w-full sm:w-auto text-base px-8 py-4 font-bold shadow-xl shadow-[#5E2EEF]/20"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Create Your Student Pack
          </Button>

          <Button
            id="hero-view-terms-btn"
            variant="secondary"
            size="lg"
            onClick={onViewTerms}
            className="w-full sm:w-auto text-base px-6 py-4"
            leftIcon={<ShieldCheck className="w-5 h-5 text-[#5E2EEF]" />}
          >
            Read Community Code
          </Button>
        </motion.div>

        {/* Feature Highlights Bento Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-left"
        >
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#5E2EEF]/40 transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-[#5E2EEF]/10 text-[#5E2EEF] flex items-center justify-center mb-4 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">100% Verified Students</h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Strict college email & OTP authentication guarantees a spam-free, real campus network.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#5E2EEF]/40 transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-[#5E2EEF]/10 text-[#5E2EEF] flex items-center justify-center mb-4 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Campus & Club Packs</h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Connect by university, graduation batch, branch major, hackathons, and niche student interests.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#5E2EEF]/40 transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-[#5E2EEF]/10 text-[#5E2EEF] flex items-center justify-center mb-4 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Peer Resource Sharing</h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Access semester study guides, exam notes, campus events, and project mentorship.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#64748B]">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Nubpack Inc.</span>
          <span>•</span>
          <span>College Student Network</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onViewTerms}
            className="hover:text-[#5E2EEF] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onViewTerms}
            className="hover:text-[#5E2EEF] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <span className="text-[#10B981] font-bold">App Version 2.4.0</span>
        </div>
      </footer>
    </div>
  );
}
