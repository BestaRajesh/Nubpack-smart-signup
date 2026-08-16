import { useState } from 'react';
import { NubpackLogo } from '../components/ui/NubpackLogo';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Lock,
  Scale,
  Users2
} from 'lucide-react';
import { motion } from 'motion/react';

interface TermsPageProps {
  onAcceptTerms: () => void;
  onBackToLanding: () => void;
}

export function TermsPage({ onAcceptTerms, onBackToLanding }: TermsPageProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-[#F8FAFC] text-[#0F172A] py-6 px-4 sm:px-6">
      {/* Background Geometric Accents */}
      <div className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[#5E2EEF]/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#E2E8F0]">
        <button
          type="button"
          id="terms-back-btn"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#64748B] hover:text-[#0F172A] px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <NubpackLogo size="sm" showText={true} variant="dark" />
      </header>

      {/* Main Terms Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-6 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col gap-6 text-left"
        >
          {/* Top Banner */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#5E2EEF]/10 text-[#5E2EEF] border border-[#5E2EEF]/20 mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Official Student Code & Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Nubpack Terms & Community Guidelines
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1.5 leading-relaxed">
              Effective for all enrolled university students, alumni, and campus community packs.
            </p>
          </div>

          {/* Scrollable Terms Content Box */}
          <div
            className="h-[360px] sm:h-[420px] overflow-y-auto p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] leading-relaxed space-y-6 select-text"
            tabIndex={0}
            aria-label="Terms of Service Agreement Text"
          >
            {/* Section 1 */}
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#5E2EEF]" />
                1. Student Eligibility & Verification
              </h3>
              <p className="text-[#64748B] font-medium">
                Nubpack is exclusively designed for college and university students. By creating an account, you affirm that you are at least 18 years of age and currently enrolled in or affiliated with a recognized higher education institution. All accounts undergo OTP and email verification to ensure safety and prevent spam bots.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Users2 className="w-4 h-4 text-[#5E2EEF]" />
                2. Community Conduct & Safe Campus Space
              </h3>
              <p className="text-[#64748B] font-medium">
                Nubpack operates on a zero-tolerance policy regarding harassment, hate speech, bullying, discrimination, hate symbols, or academic misconduct. Campus packs are collaborative spaces for learning, clubs, campus events, and mutual support. Any violation will result in immediate suspension and notification to campus authorities if required.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#10B981]" />
                3. Privacy, Data Protection & Anonymity
              </h3>
              <p className="text-[#64748B] font-medium">
                Your privacy is paramount. Nubpack does not sell your personal data, phone numbers, or academic credentials to third-party marketing brokers. When posting in anonymous campus confessionals or peer doubt-solving packs, your identity is cryptographically salted and anonymized from peer users.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                4. Academic Resource Sharing & Intellectual Property
              </h3>
              <p className="text-[#64748B] font-medium">
                Users are encouraged to share lecture notes, hackathon resources, and project tips. You represent that any content uploaded is either your own original work or permissible under fair educational use guidelines. Do not upload copyrighted commercial textbooks or unreleased exam answer keys.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                5. Account Termination & Enforcement
              </h3>
              <p className="text-[#64748B] font-medium">
                Nubpack reserves the right to terminate or freeze accounts that violate safety rules, provide falsified enrollment credentials, or participate in malicious exploitation of the platform or its community members.
              </p>
            </section>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label
              htmlFor="agree-terms-checkbox"
              className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors cursor-pointer select-none"
            >
              <input
                id="agree-terms-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#CBD5E1] bg-white text-[#5E2EEF] focus:ring-[#5E2EEF] cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                I have read and agree to the <strong className="text-[#5E2EEF]">Nubpack Terms of Service</strong>, <strong className="text-[#5E2EEF]">Privacy Policy</strong>, and student community safety rules.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button
              id="terms-decline-btn"
              variant="ghost"
              onClick={onBackToLanding}
              className="w-full sm:w-auto"
            >
              Decline & Return Home
            </Button>

            <Button
              id="terms-accept-continue-btn"
              size="lg"
              onClick={onAcceptTerms}
              disabled={!agreed}
              className="w-full sm:w-auto px-8"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Accept & Start Signup
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
