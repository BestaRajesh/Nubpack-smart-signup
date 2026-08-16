export interface StateCitiesMap {
  [stateName: string]: string[];
}

export const STATE_CITIES_DATA: StateCitiesMap = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Tirupati",
    "Kakinada",
    "Rajahmundry",
    "Anantapur",
    "Kadapa"
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Khammam",
    "Karimnagar",
    "Ramagundam",
    "Mahbubnagar",
    "Nalgonda"
  ],
  "Karnataka": [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi-Dharwad",
    "Belagavi",
    "Davangere",
    "Ballari",
    "Manipal"
  ],
  "Maharashtra": [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Navi Mumbai",
    "Solapur",
    "Kolhapur"
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Vellore",
    "Erode"
  ],
  "Delhi NCR": [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "Noida",
    "Gurugram",
    "Ghaziabad",
    "Faridabad"
  ],
  "Kerala": [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Kollam",
    "Thrissur",
    "Alappuzha",
    "Kannur"
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Gandhinagar"
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Kharagpur"
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Varanasi",
    "Agra",
    "Prayagraj",
    "Meerut",
    "Greater Noida"
  ]
};

export const POPULAR_COLLEGES_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Andhra University, Visakhapatnam",
    "KL University, Vaddeswaram",
    "Sri Venkateswara University, Tirupati",
    "GITAM University, Visakhapatnam",
    "IIT Tirupati",
    "NIT Andhra Pradesh, Tadepalligudem",
    "Vignan's University, Guntur",
    "Other / Enter Custom College"
  ],
  "Telangana": [
    "Osmania University, Hyderabad",
    "IIT Hyderabad",
    "BITS Pilani Hyderabad Campus",
    "JNTU Hyderabad",
    "IIIT Hyderabad",
    "CBIT Hyderabad",
    "VNR VJIET, Hyderabad",
    "Other / Enter Custom College"
  ],
  "Karnataka": [
    "Indian Institute of Science (IISc), Bengaluru",
    "RV College of Engineering, Bengaluru",
    "PES University, Bengaluru",
    "BMS College of Engineering, Bengaluru",
    "Manipal Academy of Higher Education (MAHE)",
    "NITK Surathkal",
    "Christ University, Bengaluru",
    "Other / Enter Custom College"
  ],
  "Maharashtra": [
    "IIT Bombay, Mumbai",
    "COEP Technological University, Pune",
    "VJTI, Mumbai",
    "Symbiosis International University, Pune",
    "MIT World Peace University, Pune",
    "St. Xavier's College, Mumbai",
    "NMIMS, Mumbai",
    "Other / Enter Custom College"
  ],
  "Tamil Nadu": [
    "IIT Madras, Chennai",
    "Anna University, Chennai",
    "NIT Trichy",
    "VIT University, Vellore",
    "PSG College of Technology, Coimbatore",
    "Loyola College, Chennai",
    "SRM Institute of Science and Technology",
    "Other / Enter Custom College"
  ],
  "Delhi NCR": [
    "IIT Delhi",
    "Delhi University (DU)",
    "DTU (Delhi Technological University)",
    "NSUT Delhi",
    "Jawaharlal Nehru University (JNU)",
    "Ashoka University, Sonipat",
    "Amity University, Noida",
    "Other / Enter Custom College"
  ],
  "Kerala": [
    "NIT Calicut",
    "College of Engineering Trivandrum (CET)",
    "IIT Palakkad",
    "CUSAT, Kochi",
    "Model Engineering College, Kochi",
    "Other / Enter Custom College"
  ],
  "Gujarat": [
    "IIT Gandhinagar",
    "SVNIT Surat",
    "DA-IICT, Gandhinagar",
    "Nirma University, Ahmedabad",
    "IIM Ahmedabad",
    "Other / Enter Custom College"
  ],
  "West Bengal": [
    "IIT Kharagpur",
    "Jadavpur University, Kolkata",
    "IIEST Shibpur",
    "St. Xavier's College, Kolkata",
    "Presidency University, Kolkata",
    "Other / Enter Custom College"
  ],
  "Uttar Pradesh": [
    "IIT Kanpur",
    "IIT BHU, Varanasi",
    "MNNIT Allahabad",
    "Aligarh Muslim University (AMU)",
    "Jaypee Institute of Information Technology (JIIT)",
    "Other / Enter Custom College"
  ]
};

export const DEGREES_LIST = [
  "B.Tech / B.E. Computer Science",
  "B.Tech / B.E. Electrical / Mechanical / Civil",
  "B.Tech / B.E. AI & Data Science",
  "B.Sc. Computer Science / IT / Stats",
  "B.Com / B.B.A / Finance",
  "B.A. Arts / Humanities / Literature",
  "B.Des / Design & Animation",
  "M.Tech / M.E. Postgraduate",
  "M.B.A / Management",
  "M.Sc / Postgraduate Sciences",
  "MBBS / Medical / Pharmacy",
  "Law (LLB / BA-LLB)",
  "Other Degree Program"
];

export const GRADUATION_YEARS = [
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030"
];

export const CAMPUS_INTERESTS_LIST = [
  { id: "tech", label: "Tech & Coding", icon: "Code", color: "from-blue-500 to-indigo-600" },
  { id: "startups", label: "Startups & E-Cell", icon: "Rocket", color: "from-purple-500 to-pink-600" },
  { id: "hackathons", label: "Hackathons", icon: "Cpu", color: "from-emerald-500 to-teal-600" },
  { id: "music", label: "Music & Band", icon: "Music", color: "from-amber-500 to-orange-600" },
  { id: "gaming", label: "Gaming & Esports", icon: "Gamepad2", color: "from-red-500 to-rose-600" },
  { id: "sports", label: "Sports & Fitness", icon: "Trophy", color: "from-green-500 to-emerald-600" },
  { id: "photography", label: "Photography & Media", icon: "Camera", color: "from-cyan-500 to-blue-600" },
  { id: "drama", label: "Drama & Culturals", icon: "Sparkles", color: "from-fuchsia-500 to-purple-600" },
  { id: "literature", label: "Debate & Lit Club", icon: "BookOpen", color: "from-yellow-500 to-amber-600" },
  { id: "social", label: "NGO & Community", icon: "Heart", color: "from-pink-500 to-rose-600" },
  { id: "ai", label: "AI & Machine Learning", icon: "Bot", color: "from-violet-500 to-indigo-600" },
  { id: "design", label: "UI/UX & Graphic Design", icon: "Palette", color: "from-teal-500 to-cyan-600" }
];

export const AVATAR_PRESETS = [
  { id: "avatar-1", emoji: "🦊", name: "Cyber Fox", bg: "bg-indigo-600" },
  { id: "avatar-2", emoji: "⚡", name: "Volt Student", bg: "bg-amber-500" },
  { id: "avatar-3", emoji: "🚀", name: "Innovator", bg: "bg-purple-600" },
  { id: "avatar-4", emoji: "🎯", name: "Achiever", bg: "bg-emerald-600" },
  { id: "avatar-5", emoji: "🎨", name: "Creator", bg: "bg-rose-500" },
  { id: "avatar-6", emoji: "🎧", name: "Beat Maker", bg: "bg-cyan-600" },
  { id: "avatar-7", emoji: "🦁", name: "Pack Leader", bg: "bg-orange-500" },
  { id: "avatar-8", emoji: "🌟", name: "Campus Star", bg: "bg-fuchsia-600" }
];
