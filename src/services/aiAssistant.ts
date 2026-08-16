import { AIRequest, AIResponse, AssistantContext } from '../types/assistant';

// Simulated realistic typing delay for human-like interactive feel
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Main AI Assistant Service Abstraction.
 * In frontend-only demo mode, it evaluates live context, validation state,
 * and user intents with context-aware responses.
 *
 * If a backend server is available in the future, it can securely proxy to an LLM endpoint.
 */
export async function askAssistant(request: AIRequest): Promise<AIResponse> {
  // Add a natural conversational delay
  await simulateDelay(600);

  const { message, context } = request;
  const rawQuery = (message || '').trim();
  const query = rawQuery.toLowerCase();

  // 1. SAFETY & PRIVACY FILTER
  if (
    query.includes('what is my otp') ||
    query.includes('show my otp') ||
    query.includes('give me the otp') ||
    query.includes('tell me the code') ||
    query.includes('reveal otp') ||
    query.includes('what is the verification code')
  ) {
    return {
      message:
        "🔒 For your security and privacy, I don't store or read your private verification codes. Please check your email inbox for the 6-digit code or click 'Resend Code' if you need a fresh one."
    };
  }

  if (query.includes('password') || query.includes('credit card') || query.includes('bank')) {
    return {
      message:
        "🛡️ Nubpack will never ask for your password or financial credentials in this assistant. Please keep your personal credentials safe."
    };
  }

  // 2. CONTEXT-SPECIFIC INTENT EVALUATION

  // --- Step 4 / Form Status Check ("Check my form", "Why can't I continue?", "What's missing?") ---
  if (
    query.includes('check my form') ||
    query.includes("what's missing") ||
    query.includes('what is missing') ||
    query.includes('why cannot i continue') ||
    query.includes("why can't i continue") ||
    query.includes('why cant i continue') ||
    query.includes('why is button disabled') ||
    query.includes('check my fields')
  ) {
    return evaluateFormStatus(context);
  }

  // --- Page: Landing ---
  if (context.currentPage === 'landing') {
    if (query.includes('how does signup work') || query.includes('how it works') || query.includes('steps')) {
      return {
        message:
          "Here is how the 4-step Nubpack verification works:\n\n1. **Email & OTP**: Verify your student or institutional email.\n2. **Personal Details**: Choose your avatar, enter your name & age (18+).\n3. **Academic Profile**: Select your state, city, college & degree.\n4. **Interests & Confirmation**: Pick your campus interests and review your pass.\n\nClick **'Start Signup'** to begin!",
        suggestions: ['Start signup', 'What information do I need?']
      };
    }
    if (query.includes('what information') || query.includes('what do i need') || query.includes('requirements')) {
      return {
        message:
          "To complete your registration, you'll need:\n• A valid student/institutional email\n• Your college name & location (State & City)\n• Your graduation year & degree\n• Must be 18 or older to participate.",
        suggestions: ['Start signup', 'How does signup work?']
      };
    }
    if (query.includes('start signup') || query.includes('begin') || query.includes('join')) {
      return {
        message: "Ready to get started! Click the **'Join Nubpack'** or **'Create Your Student Pack'** button on the screen to review terms and start.",
        suggestions: ['How does signup work?', 'What information do I need?']
      };
    }
  }

  // --- Page: Terms & Conditions ---
  if (context.currentPage === 'terms') {
    if (
      query.includes('what am i agreeing to') ||
      query.includes('explain these terms') ||
      query.includes('explain terms') ||
      query.includes('summary') ||
      query.includes('t&c')
    ) {
      return {
        message:
          "Here is a plain-language summary of what you are agreeing to:\n\n1. **Authentic Student Status**: You confirm that your student status and profile information are truthful.\n2. **Community Code**: Respectful collaboration with no harassment or spam in student packs.\n3. **Privacy & Data Security**: Your academic data is used solely to verify student eligibility and connect you with campus opportunities.\n\n*Note: I can explain these terms in simpler language, but this isn't legal advice.*",
        suggestions: ['What happens if I do not accept?', 'How do I continue?']
      };
    }
    if (query.includes('not accept') || query.includes("don't accept") || query.includes('decline')) {
      return {
        message:
          "Accepting the terms is required to issue your verified digital student pack and access college-exclusive perks. If you decline, you can return to the landing page at any time without saving data.",
        suggestions: ['Explain these terms', 'How do I continue?']
      };
    }
  }

  // --- Page: Signup -> Step 1 (Email & OTP) ---
  if (context.currentPage === 'signup' && context.currentStep === 1) {
    if (
      query.includes('where do i find my otp') ||
      query.includes('did not receive otp') ||
      query.includes("didn't receive otp") ||
      query.includes('otp not received') ||
      query.includes('no code')
    ) {
      return {
        message:
          "Your verification code should arrive through the configured verification channel. Enter it into the six-digit verification fields above.\n\nIf you haven't received it yet, wait for the countdown timer to finish and click **'Resend Code'**.",
        suggestions: ["OTP isn't working", 'What email should I use?']
      };
    }

    if (
      query.includes("otp isn't working") ||
      query.includes('otp is not working') ||
      query.includes('invalid otp') ||
      query.includes('code failed') ||
      query.includes('wrong code')
    ) {
      return {
        message:
          "If your code isn't verifying, try these steps:\n• Ensure all 6 numeric digits are entered completely.\n• Make sure the code hasn't expired.\n• If you requested multiple codes, enter the newest one.\n• In testing/demo mode, you can use the **'Demo: 123456 (Auto-fill)'** button.",
        suggestions: ["Didn't receive OTP", 'What email should I use?']
      };
    }

    if (query.includes('what email') || query.includes('which email') || query.includes('college email')) {
      return {
        message:
          "You can use any valid email address (e.g., `alex@campus.edu` or `student@gmail.com`). Institutional domains like `.edu` or `.ac.in` receive automatic campus recognition badges!",
        suggestions: ['Why is my email invalid?', 'Help me complete this step']
      };
    }

    if (query.includes('invalid') || query.includes('error') || query.includes('why is my email invalid')) {
      if (context.validationErrors.email) {
        return {
          message: `Your email format needs adjustment: ${context.validationErrors.email}. Make sure it includes an '@' symbol and a valid domain name like name@example.com.`
        };
      }
      return {
        message: "Please ensure your email follows standard format: `username@domain.com` without extra spaces or special characters."
      };
    }
  }

  // --- Page: Signup -> Step 2 (Personal Info) ---
  if (context.currentPage === 'signup' && context.currentStep === 2) {
    if (query.includes('pronoun') || query.includes('what is pronouns') || query.includes('what are pronouns')) {
      return {
        message:
          "Pronouns are words commonly used to refer to someone, such as **He/Him**, **She/Her**, or **They/Them**. Select the option that best represents your preference, or choose **'Other'** to enter your own custom pronouns.",
        suggestions: ['Why cannot I enter 17?', 'Check my fields']
      };
    }

    if (
      query.includes('17') ||
      query.includes('under 18') ||
      query.includes('age requirement') ||
      query.includes('why age') ||
      query.includes('why 18') ||
      query.includes('why cannot i enter 17') ||
      query.includes("why can't i enter 17")
    ) {
      return {
        message:
          "This signup flow is restricted to users who are **18 or older**, so an age under 18 cannot continue. Please ensure your entered age accurately reflects your eligibility.",
        suggestions: ['What does this field mean?', 'Check my fields']
      };
    }

    if (query.includes('avatar') || query.includes('picture') || query.includes('photo')) {
      return {
        message:
          "You can click on any of the 8 campus avatar illustrations to represent your student profile badge. You can change your avatar later anytime from your profile settings.",
        suggestions: ['What is pronouns?', 'Check my fields']
      };
    }

    if (query.includes('phone') || query.includes('mobile')) {
      return {
        message:
          "Phone number is optional. If provided, enter a valid 10-digit mobile number for emergency pack alerts and campus event notifications.",
        suggestions: ['Check my fields', 'Help with this step']
      };
    }
  }

  // --- Page: Signup -> Step 3 (Academic & Profile) ---
  if (context.currentPage === 'signup' && context.currentStep === 3) {
    if (
      query.includes('city empty') ||
      query.includes('why is my city empty') ||
      query.includes('no cities') ||
      query.includes('city disabled')
    ) {
      return {
        message:
          "Choose your **State / Region** first. The city list is dynamically filtered based on the selected state. Once a state is chosen, valid cities for that region will appear in the dropdown.",
        suggestions: ['What if my college is not listed?', 'Check my fields']
      };
    }

    if (query.includes('college not listed') || query.includes('not listed') || query.includes('other college') || query.includes('custom college')) {
      return {
        message:
          "If your institution is not in the dropdown, select **'Other / Enter Custom College'** at the bottom of the list. A text input will appear allowing you to type your college name directly.",
        suggestions: ['Why is my city empty?', 'Check my fields']
      };
    }

    if (query.includes('student id') || query.includes('roll number') || query.includes('card number')) {
      return {
        message:
          "Student ID Card Number is optional. If your institution issued a student roll/ID badge (e.g. `CS-2026-042`), adding it helps accelerate campus verification perks.",
        suggestions: ['Check my fields', 'Help with this step']
      };
    }
  }

  // --- Page: Signup -> Step 4 (Confirmation & Ethics) ---
  if (context.currentPage === 'signup' && context.currentStep === 4) {
    if (query.includes('interest') || query.includes('how many interests') || query.includes('minimum')) {
      return {
        message:
          "Please select **at least 2 campus interests** (such as Tech & Coding, Hackathons, Gaming, Startups, Design). This connects you to relevant student hubs and hackathon teams.",
        suggestions: ['Check my form', "What's missing?"]
      };
    }

    if (query.includes('ethics') || query.includes('code of ethics') || query.includes('checkbox')) {
      return {
        message:
          "The Student Code of Ethics checkbox confirms that the details provided are accurate and that you will maintain respectful peer conduct within Nubpack.",
        suggestions: ['Check my form', 'What happens after submission?']
      };
    }

    if (query.includes('after submission') || query.includes('what happens next') || query.includes('what next')) {
      return {
        message:
          "Upon submitting, your account will be activated and a unique **Digital Student Pass (e.g., NUB-2025-XXXX)** with QR verification will be generated immediately!",
        suggestions: ['Check my form', "What's missing?"]
      };
    }
  }

  // --- Page: Success Page ---
  if (context.currentPage === 'success') {
    return {
      message:
        "🎉 Congratulations! Your Nubpack Student Pass is active and verified. You can copy your Student ID, download your credential pass, or explore campus packs.",
      suggestions: ['How do I access student perks?', 'Start a new signup']
    };
  }

  // --- GENERAL / FALLBACK KNOWLEDGE BASE ---
  return generateIntelligentFallback(query, context);
}

/**
 * Evaluates live form status and validation state to give precise guidance.
 */
function evaluateFormStatus(context: AssistantContext): AIResponse {
  const { currentStep, currentPage, validationErrors, signupData, isOtpVerified } = context;

  if (currentPage === 'landing') {
    return {
      message: "You are currently on the **Landing Page**. Click **'Create Your Student Pack'** or **'Join Nubpack'** to start!",
      suggestions: ['How does signup work?', 'What information do I need?']
    };
  }

  if (currentPage === 'terms') {
    return {
      message: "You are on the **Terms & Conditions** screen. Please review the terms, check the agreement box, and click **'Accept & Start Signup'**.",
      suggestions: ['Explain these terms', 'What am I agreeing to?']
    };
  }

  // Active validation error breakdown
  const errorKeys = Object.keys(validationErrors);
  if (errorKeys.length > 0) {
    const errorList = errorKeys
      .map((key, idx) => `${idx + 1}. **${formatFieldName(key)}**: ${validationErrors[key]}`)
      .join('\n');

    return {
      message: `I found ${errorKeys.length === 1 ? 'one issue' : `${errorKeys.length} items`} preventing you from continuing:\n\n${errorList}\n\nPlease update the highlighted fields and try again!`,
      suggestions: ['Help me complete this step', 'What does this field mean?']
    };
  }

  // Step specific readiness checks
  if (currentStep === 1) {
    if (!isOtpVerified) {
      if (!signupData.email) {
        return {
          message: "You need to enter your email address and click **'Send Verification Code'** to receive your 6-digit OTP.",
          suggestions: ['What email should I use?']
        };
      }
      return {
        message: "You have requested a verification code. Enter the 6-digit code in the boxes above, or click **'Demo: 123456 (Auto-fill)'** to verify.",
        suggestions: ["Didn't receive OTP", "OTP isn't working"]
      };
    }
    return {
      message: "✅ Email is successfully verified! Click **'Continue to Personal Details'** to proceed.",
      suggestions: ['What information is next?']
    };
  }

  if (currentStep === 2) {
    if (!signupData.fullName) {
      return { message: "Please enter your **Full Name** (at least 2 characters) to continue." };
    }
    if (signupData.age === null || signupData.age === undefined) {
      return { message: "Please enter your **Age** (must be 18 or older)." };
    }
    if (signupData.age < 18) {
      return { message: "⚠️ Nubpack registration requires you to be **18 or older**." };
    }
    return {
      message: "✅ Personal details look great! Click **'Continue to Academic Info'** to proceed to Step 3.",
      suggestions: ['What is next?']
    };
  }

  if (currentStep === 3) {
    if (!signupData.state) return { message: "Please select your **State / Region** first to view available cities." };
    if (!signupData.city) return { message: "Please select your **City** from the list." };
    if (!signupData.college) return { message: "Please choose your **College / University**." };
    if (!signupData.degree) return { message: "Please select your **Degree program**." };
    return {
      message: "✅ Academic profile is complete! Click **'Continue to Final Review'** to advance to Step 4.",
      suggestions: ['What is in the final step?']
    };
  }

  if (currentStep === 4) {
    const interestsCount = signupData.interests?.length || 0;
    if (interestsCount < 2) {
      return {
        message: `You currently have **${interestsCount}** interest selected. Please select at least **2 campus interests**.`
      };
    }
    if (!signupData.acceptedEthics) {
      return {
        message: "Please check the **Student Code of Ethics** confirmation checkbox at the bottom before submitting."
      };
    }
    return {
      message: "🎉 Your form is 100% complete and valid! Click **'Complete Signup & Launch Pack'** to generate your official Student Pass.",
      suggestions: ['What happens after submission?']
    };
  }

  return {
    message: "Your signup is progressing smoothly! Let me know if you need assistance with any specific field."
  };
}

/**
 * Intelligent contextual fallback handler.
 */
function generateIntelligentFallback(query: string, context: AssistantContext): AIResponse {
  if (query.includes('help') || query.includes('guide') || query.includes('what to do')) {
    return evaluateFormStatus(context);
  }

  if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
    return {
      message: `Hello! I'm your **Nubpack Signup Assistant**. I'm here to help you navigate through Step ${context.currentStep} of your registration. How can I help you today?`,
      suggestions: ['Why cannot I continue?', 'Check my form', 'Help with this step']
    };
  }

  if (query.includes('who are you') || query.includes('what are you')) {
    return {
      message:
        "I'm the **AI Signup Assistant** built directly into Nubpack. I monitor your active form step and validation state to help you onboard without friction.",
      suggestions: ['Check my form', 'How does signup work?']
    };
  }

  return {
    message: `I'm here to help with your registration at **Step ${context.currentStep}**. You can ask me about required fields, validation errors, institution selection, or click one of the quick actions below!`,
    suggestions: ['Check my form', 'Why cannot I continue?', 'Help with this step']
  };
}

function formatFieldName(fieldName: string): string {
  const map: Record<string, string> = {
    email: 'Student Email',
    otp: 'Verification Code',
    fullName: 'Full Name',
    age: 'Age (18+)',
    pronouns: 'Preferred Pronouns',
    customPronouns: 'Custom Pronouns',
    phoneNumber: 'Phone Number',
    avatarId: 'Profile Avatar',
    state: 'State / Region',
    city: 'City',
    college: 'College / University',
    customCollege: 'College Name',
    degree: 'Degree Program',
    graduationYear: 'Graduation Year',
    studentIdCardNumber: 'Student ID Card',
    bio: 'Campus Bio',
    interests: 'Campus Interests',
    acceptedEthics: 'Student Code of Ethics'
  };
  return map[fieldName] || fieldName;
}
