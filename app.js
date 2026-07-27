/* LEGENDVERSE CORE EXPERIENCE ENGINE (Rithika S)
   Multi-layer Canvas Parallax, Web Speech Narration, Interactive Modals, Rating/Like System
*/

// Global Application State
let legendverseData = JSON.parse(JSON.stringify(DEFAULT_LEGENDVERSE_DATA));
let isDataLoaded = false;

// Save current state back to Firestore
function saveState() {
  if (typeof db !== 'undefined') {
    db.collection('portfolio').doc('main').set(legendverseData)
      .catch(err => console.error("Error saving state to Firestore: ", err));
  }
}

// Real-time synchronization with Firestore
function initFirestoreSync() {
  if (typeof db === 'undefined') {
    console.error("Firebase is not initialized.");
    renderAllSections();
    return;
  }
  
  const docRef = db.collection('portfolio').doc('main');
  let unsubscribe = null;

  const startListening = () => {
    if (unsubscribe) unsubscribe();
    unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        legendverseData = doc.data();
        isDataLoaded = true;
        renderAllSections();
      } else {
        docRef.set(legendverseData).catch(err => console.error(err));
      }
    }, (error) => {
      console.error("Error listening to real-time updates: ", error);
      if (!isDataLoaded) {
        renderAllSections();
      }
    });
  };

  docRef.get().then((doc) => {
    if (doc.exists) {
      legendverseData = doc.data();
      isDataLoaded = true;
      renderAllSections();
    } else {
      docRef.set(legendverseData).catch(e => console.error(e));
      isDataLoaded = true;
      renderAllSections();
    }
    startListening();
  }).catch(err => {
    console.error("Initial get failed:", err);
    if (!isDataLoaded) {
      renderAllSections();
    }
    
    if (typeof auth !== 'undefined') {
      auth.onAuthStateChanged((user) => {
        if (user) {
          startListening();
        }
      });
    }
  });
}

// Mouse coordinates state for parallax
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
  mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Toast Notification Helper
function showToast(message, icon = 'fa-circle-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  // Trigger voice loading immediately
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
  
  initFirestoreSync();
  initBackgroundCanvas();
  initIntroSequence();
  initNavigation();
  initFooterInteractions();
  initModalListeners();
});

/* ==================== 1. BACKGROUND CANVAS PARALLAX ==================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Floating ambient light nodes
  const nodes = Array.from({ length: 35 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    alpha: Math.random() * 0.4 + 0.1,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    depth: Math.random() * 0.8 + 0.2
  }));

  function animate() {
    // Smooth lerp mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Soft Ambient Gradient Light Rays
    const gradX = canvas.width / 2 + mouse.x * 120;
    const gradY = canvas.height / 3 + mouse.y * 120;
    const gradient = ctx.createRadialGradient(gradX, gradY, 50, gradX, gradY, canvas.width * 0.7);
    gradient.addColorStop(0, 'rgba(79, 209, 197, 0.08)');
    gradient.addColorStop(0.5, 'rgba(16, 35, 62, 0.15)');
    gradient.addColorStop(1, 'rgba(8, 17, 31, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw floating particles with depth parallax
    nodes.forEach(node => {
      node.x += node.speedX;
      node.y += node.speedY;

      if (node.x < 0) node.x = canvas.width;
      if (node.x > canvas.width) node.x = 0;
      if (node.y < 0) node.y = canvas.height;
      if (node.y > canvas.height) node.y = 0;

      const parallaxX = node.x + mouse.x * 40 * node.depth;
      const parallaxY = node.y + mouse.y * 40 * node.depth;

      ctx.beginPath();
      ctx.arc(parallaxX, parallaxY, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 209, 197, ${node.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==================== 2. CINEMATIC LOADING INTRO ==================== */
function initIntroSequence() {
  const loadingBar = document.getElementById('loading-bar');
  const loadingText = document.getElementById('loading-text');
  const enterBtn = document.getElementById('enter-btn');
  const introOverlay = document.getElementById('intro-overlay');
  const fallbackCanvas = document.getElementById('intro-video-canvas');

  // Animate Canvas Fallback for Video Card
  if (fallbackCanvas) {
    const fCtx = fallbackCanvas.getContext('2d');
    fallbackCanvas.width = 600;
    fallbackCanvas.height = 240;
    let angle = 0;
    function drawFallback() {
      fCtx.clearRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
      angle += 0.02;
      const cx = fallbackCanvas.width / 2;
      const cy = fallbackCanvas.height / 2;
      fCtx.beginPath();
      fCtx.arc(cx, cy, 80 + Math.sin(angle) * 10, 0, Math.PI * 2);
      fCtx.strokeStyle = 'rgba(79, 209, 197, 0.2)';
      fCtx.lineWidth = 2;
      fCtx.stroke();
      requestAnimationFrame(drawFallback);
    }
    drawFallback();
  }

  // Loading Progress Bar Animation
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (loadingText) loadingText.textContent = "Platform Ready.";
      if (enterBtn) {
        enterBtn.classList.remove('disabled');
        enterBtn.removeAttribute('disabled');
      }
    }
    if (loadingBar) loadingBar.style.width = `${progress}%`;
  }, 120);

  // Voice Welcome Button in Intro Card
  const voiceWelcomeBtn = document.getElementById('voice-welcome-btn');
  if (voiceWelcomeBtn) {
    voiceWelcomeBtn.addEventListener('click', () => {
      speakText(legendverseData.introVideo.speechScript || "Welcome to LegendVerse!");
    });
  }

  // Enter LegendVerse Transition
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      window.speechSynthesis?.cancel(); // stop speech if playing
      introOverlay.classList.add('hidden');
      showToast('Welcome to LegendVerse Exhibition Platform');
    });
  }
}

/* ==================== 3. WEB SPEECH API SYNTHESIZER ==================== */
let speechUtterance = null;
function speakText(text, btnElement = null) {
  if (!('speechSynthesis' in window)) {
    showToast('Speech synthesis not supported in this browser.', 'fa-triangle-exclamation');
    return;
  }

  // If already speaking, stop it
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btnElement) {
      btnElement.classList.remove('playing');
      const icon = btnElement.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-volume-high';
    }
    return;
  }

  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.rate = 1.0;
  speechUtterance.pitch = 0.85;

  // Try selecting a smooth natural English voice, preferring female voices
  let voices = window.speechSynthesis.getVoices();
  
  // Priority 1: Premium Natural/Online Female Voices (Extremely fluent and professional)
  let selectedVoice = voices.find(v => v.lang.includes('en') && /natural|online/i.test(v.name) && /female|aria|jenny|sonia|samantha/i.test(v.name));
  
  // Priority 2: Standard Female Voices
  if (!selectedVoice) {
    selectedVoice = voices.find(v => 
      v.lang.includes('en') && 
      (/female|zira|samantha|victoria|hazel|catherine|susan|lisa/i.test(v.name) || v.name === 'Google US English')
    );
  }
  
  if (!selectedVoice) {
    // fallback to any english voice if female voice not found
    selectedVoice = voices.find(v => v.lang.includes('en'));
  }
  if (selectedVoice) speechUtterance.voice = selectedVoice;

  if (btnElement) {
    btnElement.classList.add('playing');
    const icon = btnElement.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-volume-xmark';
  }

  speechUtterance.onend = () => {
    if (btnElement) {
      btnElement.classList.remove('playing');
      const icon = btnElement.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-volume-high';
    }
  };

  speechUtterance.onerror = () => {
    if (btnElement) btnElement.classList.remove('playing');
  };

  window.speechSynthesis.speak(speechUtterance);
}

/* ==================== 4. NAVIGATION & ACTIVE SCROLL-SPY ==================== */
function initNavigation() {
  const header = document.getElementById('main-header');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 150;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
    document.querySelectorAll('.mobile-link').forEach(ml => {
      ml.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    });
  }
}

/* ==================== 5. SECTION RENDERERS ==================== */
function renderAllSections() {
  renderHeroAndOwnerInfo();
  renderTimeline();
  renderAbilities();
  renderProjects('All');
  renderCertificates('All');
  renderAchievements();
  renderEvolution();
  renderPassions();
}

// 5A. Hero & Owner Info
function renderHeroAndOwnerInfo() {
  const o = legendverseData.owner;
  const v = legendverseData.introVideo;

  // Hero Elements
  const heroPoster = document.getElementById('hero-poster-img');
  const heroVideo = document.getElementById('hero-video-player');
  const heroOverlay = document.getElementById('hero-media-overlay');
  
  if (heroPoster) {
    heroPoster.src = v.posterUrl || 'intro_video_poster.jpg';
  }
  
  if (heroVideo) {
    if (v.videoUrl && v.videoUrl.trim() !== '') {
      heroVideo.src = v.videoUrl;
      heroVideo.poster = v.posterUrl || 'intro_video_poster.jpg';
      heroVideo.style.display = 'block';
      if (heroPoster) heroPoster.style.display = 'none';
      if (heroOverlay) {
        heroOverlay.style.display = 'flex';
        heroOverlay.style.opacity = '1';
      }
    } else {
      heroVideo.style.display = 'none';
      heroVideo.src = '';
      if (heroPoster) heroPoster.style.display = 'block';
      if (heroOverlay) {
        heroOverlay.style.display = 'flex';
        heroOverlay.style.opacity = '1';
      }
    }
  }

  const heroTitle = document.getElementById('hero-video-title');
  if (heroTitle) heroTitle.textContent = v.title;
  const heroDesc = document.getElementById('hero-video-desc');
  if (heroDesc) heroDesc.textContent = v.description;

  // Origin Elements
  const originAvatar = document.getElementById('origin-avatar-img');
  if (originAvatar) originAvatar.src = o.avatarUrl || 'rithika_avatar.jpg';
  const infoCollege = document.getElementById('info-college');
  if (infoCollege) infoCollege.textContent = o.college;
  const infoDept = document.getElementById('info-dept');
  if (infoDept) infoDept.textContent = o.department;
  const infoYear = document.getElementById('info-year');
  if (infoYear) infoYear.textContent = o.year;
  const storyExt = document.getElementById('origin-extended-story');
  if (storyExt) storyExt.textContent = o.extendedStory;

  // Contact Elements
  const emailVal = document.getElementById('contact-email-val');
  if (emailVal) emailVal.textContent = o.email;
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) emailLink.href = `mailto:${o.email}`;

  // Metrics
  updateMetricsDisplay();

  // Listen button for Story
  const listenBtn = document.getElementById('origin-listen-btn');
  if (listenBtn) {
    listenBtn.onclick = () => {
      // Force cancel any stuck speech before starting new one
      window.speechSynthesis?.cancel();
      const fullText = `Hi, I am ${o.name || 'Rithika S'}. ${o.bio || ''} ${o.extendedStory || ''}`;
      setTimeout(() => speakText(fullText, listenBtn), 50); // slight delay to ensure cancel resolves
    };
  }
}

function updateMetricsDisplay() {
  const stats = legendverseData.stats;
  const viewsEl = document.getElementById('metric-views');
  const likesEl = document.getElementById('metric-likes');
  const ratingEl = document.getElementById('metric-rating');
  const likeCountEl = document.getElementById('like-count');

  if (viewsEl) viewsEl.textContent = `${stats.views.toLocaleString()}+`;
  if (likesEl) likesEl.textContent = stats.likes;
  if (likeCountEl) likeCountEl.textContent = `${stats.likes} Likes`;

  const avg = stats.ratings.length ? (stats.ratings.reduce((a,b)=>a+b,0)/stats.ratings.length).toFixed(1) : "5.0";
  if (ratingEl) ratingEl.textContent = `${avg} ★`;

  // Update CMS stats if present
  const cmsViews = document.getElementById('cms-total-views');
  const cmsLikes = document.getElementById('cms-total-likes');
  const cmsRating = document.getElementById('cms-avg-rating');
  if (cmsViews) cmsViews.textContent = stats.views;
  if (cmsLikes) cmsLikes.textContent = stats.likes;
  if (cmsRating) cmsRating.textContent = `${avg} / 5.0`;
}

// 5B. Timeline Renderer
function renderTimeline() {
  const container = document.getElementById('education-timeline');
  if (!container) return;
  const timeline = legendverseData.owner.timeline || [];
  container.innerHTML = timeline.map(item => `
    <div class="timeline-item">
      <span class="timeline-year">${item.year}</span>
      <h5 class="timeline-title">${item.title}</h5>
      <p class="timeline-desc">${item.detail}</p>
    </div>
  `).join('');
}

// 5C. Abilities Renderer (Technical & Soft)
function renderAbilities() {
  const techGrid = document.getElementById('tech-abilities-grid');
  const softGrid = document.getElementById('soft-abilities-grid');

  if (techGrid) {
    techGrid.innerHTML = legendverseData.technicalSkills.map(skill => `
      <div class="ability-card glass-card">
        <div class="ability-header">
          <div class="ability-icon"><i class="fa-solid fa-${skill.icon || 'code'}"></i></div>
          <span class="ability-badge">Level: ${skill.level}%</span>
        </div>
        <div>
          <h3 class="ability-title">${skill.title}</h3>
          <p class="ability-desc">${skill.description}</p>
        </div>
        <div class="ability-footer">
          <button class="btn-proof" onclick="openProofModal('${skill.id}', 'tech')">
            <span>View Proof</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  if (softGrid) {
    softGrid.innerHTML = legendverseData.softSkills.map(skill => `
      <div class="ability-card glass-card">
        <div class="ability-header">
          <div class="ability-icon"><i class="fa-solid fa-${skill.icon || 'brain'}"></i></div>
          <span class="ability-badge">Soft Skill</span>
        </div>
        <div>
          <h3 class="ability-title">${skill.title}</h3>
          <p class="ability-desc">${skill.description}</p>
        </div>
        <div class="ability-footer">
          <button class="btn-proof" onclick="openProofModal('${skill.id}', 'soft')">
            <span>View Evidence</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Ability Category Tab Switcher Listener
  document.querySelectorAll('[data-ability-cat]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-ability-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-ability-cat');
      if (cat === 'technical') {
        techGrid.classList.remove('hidden');
        techGrid.classList.add('active');
        softGrid.classList.add('hidden');
      } else {
        softGrid.classList.remove('hidden');
        softGrid.classList.add('active');
        techGrid.classList.add('hidden');
      }
    });
  });
}

// 5D. Projects Gallery Renderer
function renderProjects(filterCategory = 'All') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = filterCategory === 'All'
    ? legendverseData.projects
    : legendverseData.projects.filter(p => p.category === filterCategory);

  grid.innerHTML = filtered.map(proj => `
    <div class="project-card" onclick="openProjectModal('${proj.id}')">
      <div class="project-thumb">
        <img src="${proj.imageUrl || 'intro_video_poster.jpg'}" alt="${proj.name}">
        <span class="project-cat-badge">${proj.category}</span>
      </div>
      <div class="project-content">
        <h3 class="project-name">${proj.name}</h3>
        <p class="project-short">${proj.shortDesc}</p>
        <div class="project-card-footer">
          <span>Explore Details</span>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </div>
  `).join('');

  // Filter Buttons Event Listeners
  document.querySelectorAll('#project-filter-tabs .filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#project-filter-tabs .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    };
  });
}

// 5E. Certificates & Achievements Renderer
function renderCertificates(filterCat = 'All') {
  const certGrid = document.getElementById('certificates-grid');
  if (!certGrid) return;

  const filtered = filterCat === 'All'
    ? legendverseData.certificates
    : legendverseData.certificates.filter(c => c.category === filterCat);

  certGrid.innerHTML = filtered.map(cert => `
    <div class="cert-card">
      <div class="cert-preview-wrapper">
        <img src="${cert.imageUrl || 'intro_video_poster.jpg'}" alt="${cert.title}">
      </div>
      <div class="cert-body">
        <h3 class="cert-title">${cert.title}</h3>
        <p class="cert-issuer">${cert.issuer} • ${cert.date}</p>
        <div class="cert-actions">
          <button class="btn btn-secondary btn-sm full-width" onclick="openCertModal('${cert.id}')">
            <i class="fa-solid fa-expand"></i> Fullscreen & Voice
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Cert Filter Buttons
  document.querySelectorAll('#cert-filter-bar .sub-filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#cert-filter-bar .sub-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCertificates(btn.getAttribute('data-cert-cat'));
    };
  });
}

function renderAchievements() {
  const achGrid = document.getElementById('achievements-grid');
  if (!achGrid) return;

  achGrid.innerHTML = legendverseData.achievements.map(ach => `
    <div class="ach-card glass-card">
      <span class="ach-tag">${ach.category} • ${ach.date}</span>
      <h3 class="ach-title">${ach.title}</h3>
      <p class="ach-desc">${ach.description}</p>
      <div style="margin-top: 1rem;">
        <button class="btn btn-outline btn-sm" onclick="openProofModal('${ach.id}', 'ach')">
          <i class="fa-solid fa-eye"></i> View Proof
        </button>
      </div>
    </div>
  `).join('');

  // Milestone Tab Switcher (Certificates vs Achievements)
  document.querySelectorAll('[data-milestone-tab]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('[data-milestone-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-milestone-tab');
      if (tab === 'certificates') {
        document.getElementById('certificates-panel').classList.remove('hidden');
        document.getElementById('achievements-panel').classList.add('hidden');
      } else {
        document.getElementById('achievements-panel').classList.remove('hidden');
        document.getElementById('certificates-panel').classList.add('hidden');
      }
    };
  });
}

// 5F. Evolution & Passions
function renderEvolution() {
  const ev = legendverseData.currentlyLearning;
  const techList = document.getElementById('currently-learning-list');
  const skillsList = document.getElementById('skills-improving-list');
  const projList = document.getElementById('current-projects-list');
  const goalsList = document.getElementById('future-goals-list');

  if (techList) {
    techList.innerHTML = ev.technologies.map(t => `
      <div class="prog-item">
        <div class="prog-item-header">
          <span>${t.name}</span>
          <span>${t.level}%</span>
        </div>
        <div class="prog-bar">
          <div class="prog-fill" style="width: ${t.level}%;"></div>
        </div>
      </div>
    `).join('');
  }

  if (skillsList) {
    skillsList.innerHTML = ev.improvingSkills.map(s => `<li>${s}</li>`).join('');
  }
  if (projList) {
    projList.innerHTML = ev.currentProjects.map(p => `<li>${p}</li>`).join('');
  }
  if (goalsList) {
    goalsList.innerHTML = legendverseData.owner.futureGoals.map(g => `<li>${g}</li>`).join('');
  }
}

function renderPassions() {
  const grid = document.getElementById('passions-grid');
  if (!grid) return;
  grid.innerHTML = legendverseData.passions.map(pas => `
    <div class="passion-card glass-card">
      <div class="passion-icon"><i class="fa-solid fa-${pas.icon || 'sparkles'}"></i></div>
      <h3 class="passion-title">${pas.title}</h3>
      <p class="passion-desc">${pas.description}</p>
    </div>
  `).join('');
}

/* ==================== 6. FOOTER & INTERACTION CONTROLLERS ==================== */
function initFooterInteractions() {
  // Star Rating System
  const stars = document.querySelectorAll('#star-rating i');
  const feedback = document.getElementById('rating-feedback');

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      const rating = index + 1;
      legendverseData.stats.ratings.push(rating);
      saveState();
      updateMetricsDisplay();

      stars.forEach((s, idx) => {
        if (idx <= index) {
          s.className = 'fa-solid fa-star active';
        } else {
          s.className = 'fa-regular fa-star';
        }
      });
      if (feedback) feedback.textContent = `Thank you for rating ${rating} Stars!`;
      showToast(`Rated ${rating} Stars. Thank you!`);
    });
  });

  // Heart Like Button
  const likeBtn = document.getElementById('like-btn');
  const heartIcon = document.getElementById('like-heart-icon');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      legendverseData.stats.likes += 1;
      saveState();
      updateMetricsDisplay();

      likeBtn.classList.add('liked');
      if (heartIcon) heartIcon.className = 'fa-solid fa-heart';
      showToast('Thank you for liking LegendVerse!');
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      showToast(`Thank you ${name}! Your message has been dispatched to Rithika S.`);
      contactForm.reset();
    });
  }

  // Resume Download Triggers
  const resumeBtns = [document.getElementById('hero-resume-btn'), document.getElementById('connect-download-resume-btn')];
  resumeBtns.forEach(btn => {
    if (btn) btn.onclick = () => openModal('resume-modal');
  });

  const actualDownloadBtn = document.getElementById('download-actual-resume-btn');
  if (actualDownloadBtn) {
    actualDownloadBtn.onclick = () => {
      showToast('Resume downloaded successfully.');
    };
  }

  // Video Play Triggers
  const heroVideo = document.getElementById('hero-video-player');
  const playVideoBtns = [document.getElementById('hero-play-video-btn'), document.getElementById('hero-media-play-icon')];
  
  playVideoBtns.forEach(b => {
    if (b) b.onclick = () => {
      if (heroVideo && heroVideo.src && !heroVideo.src.endsWith(window.location.host + '/') && heroVideo.style.display !== 'none') {
        if (heroVideo.paused) {
          window.speechSynthesis?.cancel(); // Stop any narration
          heroVideo.muted = false; // Unmute on user interaction
          heroVideo.play().catch(e => {
            console.error("Video play failed:", e);
            showToast("Video failed to play.", "fa-triangle-exclamation");
          });
          
          const overlay = document.getElementById('hero-media-overlay');
          if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 300);
          }
          
          if (heroVideo.requestFullscreen) {
            heroVideo.requestFullscreen();
          } else if (heroVideo.webkitRequestFullscreen) { /* Safari */
            heroVideo.webkitRequestFullscreen();
          }
          showToast("Playing Video...");
        } else {
          heroVideo.pause();
        }
      } else {
        // Fallback: If no real video URL is set, play speech synthesis
        window.speechSynthesis?.cancel();
        setTimeout(() => {
          speakText(legendverseData.introVideo.speechScript || "Welcome to LegendVerse!");
          showToast("Playing Intro Presentation");
        }, 50);
      }
    };
  });
}

/* ==================== 7. MODAL CONTROLLERS ==================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
  window.speechSynthesis?.cancel();
}

function initModalListeners() {
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      window.speechSynthesis?.cancel();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('active');
        window.speechSynthesis?.cancel();
      }
    });
  });
}

// Project Detail Modal Populator
window.openProjectModal = function(projId) {
  const proj = legendverseData.projects.find(p => p.id === projId);
  if (!proj) return;

  const body = document.getElementById('project-modal-body');
  body.innerHTML = `
    <span class="badge-pill">${proj.category}</span>
    <h2 style="font-family: var(--font-heading); color:#FFF; font-size: 2rem; margin: 0.5rem 0 1rem 0;">${proj.name}</h2>
    <div style="width:100%; height:260px; border-radius:16px; overflow:hidden; margin-bottom:1.5rem;">
      <img src="${proj.imageUrl || 'intro_video_poster.jpg'}" style="width:100%; height:100%; object-fit:cover;">
    </div>
    
    <div style="display:flex; flex-direction:column; gap:1.2rem;">
      <div>
        <h4 style="color:var(--accent-primary); margin-bottom:0.3rem;">Introduction & Purpose</h4>
        <p style="color:var(--text-secondary); line-height:1.6;">${proj.introduction || proj.shortDesc}</p>
        <p style="color:var(--text-secondary); margin-top:0.5rem;"><strong>Purpose:</strong> ${proj.purpose || 'N/A'}</p>
      </div>

      <div>
        <h4 style="color:var(--accent-primary); margin-bottom:0.4rem;">Technologies Used</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
          ${(proj.technologies || []).map(t => `<span class="ability-badge" style="color:var(--accent-primary);">${t}</span>`).join('')}
        </div>
      </div>

      <div>
        <h4 style="color:var(--accent-primary); margin-bottom:0.4rem;">Key Features</h4>
        <ul class="bullet-list">
          ${(proj.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid var(--border-glass);">
        <span style="color:var(--text-muted); font-size:0.85rem;">Status: ${proj.status || 'Active'}</span>
        <div style="display:flex; gap:0.75rem;">
          <a href="${proj.githubUrl || '#'}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-brands fa-github"></i> GitHub</a>
          <a href="${proj.demoUrl || '#'}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
        </div>
      </div>

      <p style="font-size:0.78rem; color:var(--text-muted); font-style:italic;">${proj.protectedNote || 'Some project details are protected for privacy purposes.'}</p>
    </div>
  `;
  openModal('project-modal');
};

// Certificate Zoom & Voice Explanation Modal Populator
window.openCertModal = function(certId) {
  const cert = legendverseData.certificates.find(c => c.id === certId);
  if (!cert) return;

  const body = document.getElementById('cert-modal-body');
  body.innerHTML = `
    <h2 style="font-family: var(--font-heading); color:#FFF; font-size: 1.8rem; margin-bottom: 0.5rem;">${cert.title}</h2>
    <p style="color:var(--accent-primary); font-size:0.9rem; margin-bottom:1.5rem;">${cert.issuer} • Issued: ${cert.date} • ${cert.grade || ''}</p>
    
    <div style="position:relative; width:100%; height:350px; border-radius:16px; overflow:hidden; background:#000; margin-bottom:1.5rem;">
      <img id="cert-zoom-img" src="${cert.imageUrl || 'intro_video_poster.jpg'}" style="width:100%; height:100%; object-fit:contain; transition: transform 0.3s ease;">
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(8,17,31,0.6); padding:1rem 1.5rem; border-radius:16px; border:1px solid var(--border-glass);">
      <button class="btn-listen" id="cert-voice-btn">
        <i class="fa-solid fa-volume-high"></i> Listen to Voice Explanation
      </button>

      <div style="display:flex; gap:0.5rem;">
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('cert-zoom-img').style.transform = 'scale(1.3)'"><i class="fa-solid fa-magnifying-glass-plus"></i> Zoom</button>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('cert-zoom-img').style.transform = 'scale(1.0)'"><i class="fa-solid fa-rotate-left"></i> Reset</button>
        <a href="${cert.imageUrl || '#'}" download class="btn btn-primary btn-sm"><i class="fa-solid fa-download"></i> Download</a>
      </div>
    </div>

    <p style="color:var(--text-secondary); margin-top:1rem; font-size:0.95rem;">${cert.description}</p>
  `;

  openModal('cert-modal');

  const voiceBtn = document.getElementById('cert-voice-btn');
  if (voiceBtn) {
    voiceBtn.onclick = () => {
      speakText(cert.speechText || cert.description, voiceBtn);
    };
  }
};

// Proof Viewer Modal Populator (Abilities & Achievements)
window.openProofModal = function(id, type) {
  let item = null;
  if (type === 'tech') item = legendverseData.technicalSkills.find(s => s.id === id);
  else if (type === 'soft') item = legendverseData.softSkills.find(s => s.id === id);
  else if (type === 'ach') item = legendverseData.achievements.find(a => a.id === id);

  if (!item) return;

  const body = document.getElementById('proof-modal-body');
  body.innerHTML = `
    <h3 style="font-family: var(--font-heading); color:#FFF; font-size: 1.6rem; margin-bottom: 0.5rem;">Proof & Evidence Verification</h3>
    <h4 style="color:var(--accent-primary); font-size:1.1rem; margin-bottom:1rem;">${item.title}</h4>
    
    <div style="background:rgba(8,17,31,0.7); border:1px solid var(--border-glass); border-radius:16px; padding:1.5rem; margin-bottom:1.5rem;">
      <p style="color:var(--text-primary); font-size:0.95rem; line-height:1.6;">${item.proof?.content || item.proof || item.description || 'Verified evidence.'}</p>
    </div>

    ${item.proof?.link ? `<a href="${item.proof.link}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Verification Link</a>` : ''}
  `;

  openModal('proof-modal');
};
