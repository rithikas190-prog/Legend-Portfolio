// LegendVerse Initial Data Store for Rithika S
const DEFAULT_LEGENDVERSE_DATA = {
  owner: {
    name: "Rithika S",
    title: "Computer Science Engineering Student & Creative Innovator",
    college: "SRIT Coimbatore",
    department: "B.Tech Computer Science Engineering",
    year: "2nd Year Engineering",
    bio: "I am Rithika S, a 2nd year Computer Science Engineering student at SRIT Coimbatore. I am passionate about technology, creativity, digital experiences and building innovative solutions.",
    extendedStory: "Driven by a curiosity for how algorithms shape human experience, I specialize in modern software architecture, artificial intelligence applications, and high-performance interactive media. My journey at SRIT Coimbatore focuses on mastering computational fundamentals while pioneering intuitive, high-craft user interfaces.",
    education: [
      {
        institution: "SRIT Coimbatore (Sri Ramakrishna Institute of Technology)",
        degree: "B.Tech in Computer Science and Engineering",
        period: "2024 - 2028 (Currently in 2nd Year)",
        grade: "CGPA: 9.2 / 10.0",
        description: "Specializing in Data Structures, AI Algorithms, Database Systems, and Web Engineering."
      },
      {
        institution: "Higher Secondary Education",
        degree: "Computer Science & Mathematics Stream",
        period: "2022 - 2024",
        grade: "Distinction - 95.4%",
        description: "Focus on Mathematics, Physics, Chemistry, and Python Programming."
      }
    ],
    timeline: [
      { year: "2024", title: "Enrolled in SRIT Coimbatore", detail: "Commenced B.Tech in CSE with a vision for luxury tech interfaces." },
      { year: "2025", title: "AI & Full Stack Innovations", detail: "Built neural web tools, interactive games, and automated workflow agents." },
      { year: "2026", title: "LegendVerse Platform Launch", detail: "Architected luxury career platform, winning technical hackathons." }
    ],
    futureGoals: [
      "Master Advanced Generative AI & Autonomous Agent Architectures",
      "Contribute to High-Impact Open Source Ecosystems",
      "Publish Research Paper on Human-Computer Interaction & Web Graphics",
      "Secure Engineering Internship at a Top Tier Technology Firm"
    ],
    avatarUrl: "rithika_avatar.jpg",
    resumeUrl: "#resume-modal",
    email: "rithika.s@srit.ac.in",
    github: "https://github.com/rithika-s",
    linkedin: "https://linkedin.com/in/rithika-s",
    instagram: "https://instagram.com/rithika.s.code"
  },
  introVideo: {
    title: "Welcome to LegendVerse - Introduction by Rithika S",
    description: "A glimpse into my engineering journey, vision for interactive media, and passion for creative technology at SRIT Coimbatore.",
    posterUrl: "intro_video_poster.jpg",
    videoUrl: "", // Blank defaults to luxury cinematic canvas video presentation
    speechScript: "Hi! Welcome to LegendVerse. I am Rithika S, a second-year Computer Science Engineering student at SRIT Coimbatore. I build modern AI applications, high-performance web systems, and interactive digital experiences. Explore my journey, skills, and creations!"
  },
  stats: {
    views: 1420,
    likes: 384,
    ratings: [5, 5, 5, 4, 5, 5, 5, 5, 4, 5]
  },
  technicalSkills: [
    {
      id: "tech-1",
      title: "Programming",
      category: "Technical",
      icon: "code",
      level: 92,
      description: "Fluent in Python, JavaScript (ES6+), C++, and Java with expertise in clean architectural patterns.",
      proof: {
        type: "code",
        title: "Algorithmic Efficiency & DSA Solutions",
        content: "Implemented custom Graph Search, Dynamic Programming, and Data Structure suites in C++ and Python.",
        link: "https://github.com/rithika-s"
      }
    },
    {
      id: "tech-2",
      title: "Artificial Intelligence",
      category: "Technical",
      icon: "brain",
      level: 88,
      description: "Prompt engineering, Neural Networks, PyTorch, OpenAI API, and Gemini API integration.",
      proof: {
        type: "certificate",
        title: "AI & Machine Learning Foundations",
        content: "Completed deep learning specialization with hands-on computer vision and NLP projects.",
        link: "https://github.com/rithika-s/ai-projects"
      }
    },
    {
      id: "tech-3",
      title: "App Development",
      category: "Technical",
      icon: "smartphone",
      level: 85,
      description: "Cross-platform mobile applications using Flutter and React Native with responsive UI components.",
      proof: {
        type: "screenshot",
        title: "Campus Connect Mobile App",
        content: "Built real-time student utility app for SRIT Coimbatore with Firebase integration.",
        link: "https://github.com/rithika-s/campus-app"
      }
    },
    {
      id: "tech-4",
      title: "Web Development",
      category: "Technical",
      icon: "layout",
      level: 95,
      description: "Luxury frontend interfaces, HTML5 Canvas, WebGL, CSS Glassmorphism, and dynamic state engines.",
      proof: {
        type: "demo",
        title: "LegendVerse Architecture",
        content: "Architected award-winning interactive exhibition platform with zero external UI bloat.",
        link: "#"
      }
    },
    {
      id: "tech-5",
      title: "Video Editing",
      category: "Technical",
      icon: "film",
      level: 90,
      description: "Cinematic color grading, motion graphics, audio sync, and Adobe Premiere / DaVinci Resolve workflows.",
      proof: {
        type: "media",
        title: "SRIT Tech Fest Official Trailer",
        content: "Edited and scored promotional video for college national tech event.",
        link: "#"
      }
    },
    {
      id: "tech-6",
      title: "3D Animation",
      category: "Technical",
      icon: "box",
      level: 82,
      description: "3D modeling in Blender, camera tracking, glass reflection shaders, and lighting setups.",
      proof: {
        type: "media",
        title: "Architectural Glass Renders",
        content: "Rendered interactive 3D product visualizations and luxury museum models.",
        link: "#"
      }
    },
    {
      id: "tech-7",
      title: "Photography",
      category: "Technical",
      icon: "camera",
      level: 86,
      description: "Architectural photography, lighting contrast control, macro framing, and RAW photo processing.",
      proof: {
        type: "media",
        title: "SRIT Campus Architecture Series",
        content: "Featured photo gallery capturing structural shadows and geometric light.",
        link: "#"
      }
    },
    {
      id: "tech-8",
      title: "Database Management",
      category: "Technical",
      icon: "database",
      level: 89,
      description: "SQL query optimization, PostgreSQL, MongoDB schema design, and IndexedDB/LocalStorage data persistence.",
      proof: {
        type: "code",
        title: "High-Concurrency Student Records DB",
        content: "Designed normalized relational schema with optimized indexing for quick retrieval.",
        link: "#"
      }
    }
  ],
  softSkills: [
    {
      id: "soft-1",
      title: "Leadership",
      icon: "compass",
      description: "Team Lead for SRIT Hackathon projects; guiding peer developers from idea execution to final pitch.",
      proof: "Led a 4-person engineering team to winning 1st runner-up in Regional Tech Symposium."
    },
    {
      id: "soft-2",
      title: "Communication",
      icon: "message-square",
      description: "Articulate tech speaker and presenter, delivering seminars on AI and modern Web UX.",
      proof: "Delivered technical talk on 'The Future of Web Graphics' at SRIT Computer Society."
    },
    {
      id: "soft-3",
      title: "Creativity",
      icon: "sparkles",
      description: "Blending computational rigor with high-end luxury aesthetics to create unforgettable digital products.",
      proof: "Conceptualized and designed LegendVerse signature glass visual identity."
    },
    {
      id: "soft-4",
      title: "Problem Solving",
      icon: "cpu",
      description: "Methodical approach to algorithm optimization, debugging complex runtime state, and modular coding.",
      proof: "Solved over 200+ algorithmic problems across LeetCode & HackerRank platforms."
    },
    {
      id: "soft-5",
      title: "Teamwork",
      icon: "users",
      description: "Fostering collaborative git workflows, constructive code reviews, and positive peer encouragement.",
      proof: "Active participant in SRIT Open Source Society & Code Collaboratives."
    },
    {
      id: "soft-6",
      title: "Time Management",
      icon: "clock",
      description: "Balancing high academic performance (9.2 CGPA) with creative projects and campus leadership roles.",
      proof: "Consistently delivered all engineering projects ahead of deadlines."
    },
    {
      id: "soft-7",
      title: "Adaptability",
      icon: "zap",
      description: "Rapidly picking up novel technology stacks, API frameworks, and paradigm shifts in AI/Web3.",
      proof: "Learned WebGL canvas parallax rendering and Web Speech API in under 48 hours."
    },
    {
      id: "soft-8",
      title: "Event Management",
      icon: "calendar",
      description: "Co-organized department workshops, technical coding contests, and guest lecture sessions at SRIT.",
      proof: "Coordinated SRIT Annual CSE Tech Fest with 300+ active student participants."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "LegendVerse Exhibition Platform",
      category: "Websites",
      shortDesc: "Award-winning luxury personal brand exhibition and career platform with real-time CMS.",
      introduction: "LegendVerse is a next-generation interactive portfolio designed for Rithika S, featuring custom canvas parallax graphics, glass reflections, speech narration, and owner content management.",
      purpose: "Provide a luxury, future-ready personal brand platform that expands alongside career milestones.",
      technologies: ["JavaScript ES6+", "HTML5 Canvas", "CSS Glassmorphism", "Web Speech API", "LocalStorage CMS"],
      features: [
        "Interactive mouse parallax background with light rays & fog layers",
        "Cinematic video intro player with glass presentation modal",
        "Museum-style certificate viewer with voice explanations & zoom",
        "Full owner admin dashboard with secure login & JSON backup export/import"
      ],
      status: "Completed & Operational",
      demoUrl: "#",
      githubUrl: "https://github.com/rithika-s/legendverse",
      imageUrl: "intro_video_poster.jpg",
      protectedNote: "Some project details are protected for privacy purposes."
    },
    {
      id: "proj-2",
      name: "Neural Vision Diagnostic AI",
      category: "AI Projects",
      shortDesc: "Convolutional neural network for real-time visual feature detection and classification.",
      introduction: "An artificial intelligence model developed to analyze high-resolution imagery for automated anomaly detection in industrial engineering components.",
      purpose: "Automate quality assurance checking using computer vision and deep learning.",
      technologies: ["Python", "PyTorch", "OpenCV", "Flask", "Tailwind UI"],
      features: [
        "Sub-100ms inference time for high-resolution images",
        "Interactive heatmaps highlighting neural attention areas",
        "Exportable PDF diagnostic reports for quality control engineers"
      ],
      status: "Active Research Prototype",
      demoUrl: "https://github.com/rithika-s/neural-vision",
      githubUrl: "https://github.com/rithika-s/neural-vision",
      imageUrl: "rithika_avatar.jpg",
      protectedNote: "Proprietary model weights protected under academic privacy guidelines."
    },
    {
      id: "proj-3",
      name: "ChronoRealm 3D Web Experience",
      category: "Games",
      shortDesc: "Browser-based 3D architectural exploration game with procedural lighting.",
      introduction: "An atmospheric WebGL interactive world where users navigate digital museum halls to unlock historical computing milestones.",
      purpose: "Combine game mechanics with educational technology history in a stunning 3D environment.",
      technologies: ["Three.js", "WebGL", "Web Audio API", "JavaScript"],
      features: [
        "Spatial audio acoustics reacting to player position",
        "Dynamic glass refraction and floor reflections",
        "Optimized 60 FPS performance on desktop and mobile browsers"
      ],
      status: "V2.0 Released",
      demoUrl: "https://github.com/rithika-s/chronorealm",
      githubUrl: "https://github.com/rithika-s/chronorealm",
      imageUrl: "intro_video_poster.jpg",
      protectedNote: "3D assets compressed for web distribution."
    },
    {
      id: "proj-4",
      name: "SRIT Campus Companion App",
      category: "Apps",
      shortDesc: "All-in-one mobile utility app for SRIT Coimbatore students and faculty.",
      introduction: "A mobile application providing real-time timetable updates, attendance tracking, lab resource bookings, and event notifications.",
      purpose: "Streamline campus life and academic communication for 2000+ students at SRIT Coimbatore.",
      technologies: ["Flutter", "Dart", "Firebase Firestore", "REST API"],
      features: [
        "Push notifications for assignment deadlines & exam schedules",
        "Offline-first sync mode for lecture note access",
        "Role-based authentication for students, faculty, and admins"
      ],
      status: "Deployed in Campus Beta",
      demoUrl: "https://github.com/rithika-s/srit-companion",
      githubUrl: "https://github.com/rithika-s/srit-companion",
      imageUrl: "rithika_avatar.jpg",
      protectedNote: "Campus database connection credentials restricted."
    },
    {
      id: "proj-5",
      name: "Aura Cinematic Motion Studio",
      category: "Creative Projects",
      shortDesc: "Motion graphics reel and 3D visual storytelling exhibition.",
      introduction: "A showcase of high-craft 3D animations, architectural renders, and video edits crafted for technology brand launches.",
      purpose: "Explore the intersection of digital art, sound design, and modern brand communication.",
      technologies: ["Blender 3D", "Adobe After Effects", "DaVinci Resolve", "Sound Synthesis"],
      features: [
        "Architectural light simulation with raytracing",
        "Custom sound design and synchronized visual cues",
        "4K render exports for digital signage exhibition"
      ],
      status: "Featured Portfolio Work",
      demoUrl: "https://github.com/rithika-s/aura-motion",
      githubUrl: "https://github.com/rithika-s/aura-motion",
      imageUrl: "intro_video_poster.jpg",
      protectedNote: "High-resolution RAW master files available upon request."
    }
  ],
  certificates: [
    {
      id: "cert-1",
      title: "Honor Certificate in Full-Stack Software Engineering",
      category: "Engineering & Code",
      issuer: "National Technical Excellence Forum",
      date: "2025",
      grade: "Grade A+ (Top 1%)",
      speechText: "Certificate of Honor in Full-Stack Software Engineering awarded to Rithika S for outstanding proficiency in modern web architecture and data systems.",
      description: "Demonstrated mastery in building scalable web applications, RESTful services, and modern frontend frameworks.",
      imageUrl: "intro_video_poster.jpg",
      downloadUrl: "#"
    },
    {
      id: "cert-2",
      title: "Artificial Intelligence & Neural Networks Specialist",
      category: "AI & Data",
      issuer: "Global AI Skill Alliance",
      date: "2025",
      grade: "Distinction",
      speechText: "Artificial Intelligence Specialist certification awarded to Rithika S for mastery in neural networks, computer vision, and model deployment.",
      description: "Comprehensive certification covering supervised learning, computer vision architectures, and AI model optimization.",
      imageUrl: "rithika_avatar.jpg",
      downloadUrl: "#"
    },
    {
      id: "cert-3",
      title: "SRIT Coimbatore Academic Excellence Award",
      category: "Engineering & Code",
      issuer: "SRIT Coimbatore Department of CSE",
      date: "2024",
      grade: "1st Rank in Department",
      speechText: "Academic Excellence Award presented to Rithika S by SRIT Coimbatore for achieving top academic standing in Computer Science Engineering.",
      description: "Recognized for top academic performance (9.2 CGPA) and leadership in student technical projects.",
      imageUrl: "intro_video_poster.jpg",
      downloadUrl: "#"
    },
    {
      id: "cert-4",
      title: "UI/UX & Architectural Digital Design Specialist",
      category: "Design & Media",
      issuer: "International Design Guild",
      date: "2025",
      grade: "Certified Master",
      speechText: "UI UX and Digital Design Specialist certification awarded to Rithika S for high-craft interface design and luxury digital aesthetics.",
      description: "Certification focused on human-centered design, micro-interactions, motion graphics, and luxury brand design systems.",
      imageUrl: "rithika_avatar.jpg",
      downloadUrl: "#"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Runner Up - National Smart Hackathon 2025",
      category: "Hackathons",
      date: "February 2025",
      location: "Coimbatore Tech Hub",
      description: "Built an AI-driven emergency response coordinator app in 36 non-stop hours leading a team of 4 CSE students from SRIT Coimbatore.",
      imageUrl: "intro_video_poster.jpg"
    },
    {
      id: "ach-2",
      title: "SRIT Inter-College Athletics Championship",
      category: "Sports",
      date: "January 2025",
      location: "SRIT Sports Complex",
      description: "Won Gold Medal in 400m Track & Relay Sprint, representing the Computer Science Engineering Department.",
      imageUrl: "rithika_avatar.jpg"
    },
    {
      id: "ach-3",
      title: "Best Creative Innovation Project Award",
      category: "Certificates",
      date: "November 2024",
      location: "SRIT Annual Expo",
      description: "Awarded 1st place among 50+ student teams for creating an interactive glassmorphic web visualization tool.",
      imageUrl: "intro_video_poster.jpg"
    }
  ],
  currentlyLearning: {
    technologies: [
      { name: "Next.js 15 & React Server Components", level: 85 },
      { name: "WebGL 2.0 & Three.js Shaders", level: 80 },
      { name: "PyTorch & Transformers Library", level: 78 },
      { name: "Docker & Cloud Native Infrastructure", level: 75 }
    ],
    improvingSkills: [
      "Advanced System Design & Microservices",
      "Human-Computer Interaction (HCI) Motion Physics",
      "AI Prompt Optimization & Retrieval-Augmented Generation",
      "Public Speaking & Keynote Presentation Craft"
    ],
    currentProjects: [
      "LegendVerse CMS Platform Enhancement",
      "SRIT Automated Lab Equipment Scheduler",
      "Generative Code Assistant for Student Developers"
    ]
  },
  passions: [
    {
      title: "Creative Technology & Web Art",
      icon: "palette",
      description: "Exploring where code transforms into emotion—creating smooth 60fps canvas animations, glass light physics, and interactive storytelling."
    },
    {
      title: "Architectural Photography",
      icon: "camera",
      description: "Capturing geometric lines, play of shadows, and modern architectural spaces around Coimbatore and beyond."
    },
    {
      title: "Tech Peer Mentorship",
      icon: "users",
      description: "Guiding junior engineering students in programming fundamentals, Git version control, and UI design best practices."
    }
  ],
  mediaGallery: []
};
