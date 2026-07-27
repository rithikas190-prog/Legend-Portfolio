/* LEGENDVERSE OWNER ADMIN DASHBOARD & CMS ENGINE
   Secure Login, Real-time CRUD, Media Upload, Full Profile Management
*/

let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initCMSTabs();
  // initJSONExportImport() // Remove or keep if needed later
});

/* ==================== 1. ADMIN AUTHENTICATION ==================== */
function initAdminAuth() {
  const triggerBtn = document.getElementById('admin-trigger-btn');
  const footerLink = document.getElementById('footer-admin-link');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
      if (user) {
        isAuthenticated = true;
        const badge = document.querySelector('.owner-badge');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Logged in as ${user.email}`;
      } else {
        isAuthenticated = false;
      }
    });
  }

  if (triggerBtn) triggerBtn.onclick = () => openAdminFlow();
  if (footerLink) footerLink.onclick = () => openAdminFlow();

  function openAdminFlow() {
    if (isAuthenticated) {
      openModal('admin-modal');
      renderCMSTab('projects');
    } else {
      openModal('login-modal');
    }
  }

  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('admin-email').value;
      const passInput = document.getElementById('admin-password').value;
      const errorMsg = document.getElementById('login-error-msg');
      const submitBtn = document.getElementById('admin-login-submit-btn');

      if (typeof auth === 'undefined') {
        if (errorMsg) errorMsg.textContent = "Firebase is not initialized. Please configure firebase-config.js.";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

      auth.signInWithEmailAndPassword(emailInput, passInput)
        .then((userCredential) => {
          isAuthenticated = true;
          loginForm.reset();
          if (errorMsg) errorMsg.textContent = "";
          closeModal('login-modal');
          showToast("Owner Login Verified. Welcome back!");
          openModal('admin-modal');
          renderCMSTab('projects');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login to Dashboard';
        })
        .catch((error) => {
          if (errorMsg) errorMsg.textContent = error.message;
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login to Dashboard';
        });
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      if (typeof auth !== 'undefined') {
        auth.signOut().then(() => {
          isAuthenticated = false;
          closeModal('admin-modal');
          showToast("Logged out of Admin Dashboard.");
        }).catch((error) => console.error("Logout error", error));
      } else {
        isAuthenticated = false;
        closeModal('admin-modal');
        showToast("Logged out (Offline).");
      }
    };
  }
}

/* ==================== 2. CMS TABS SWITCHER ==================== */
function initCMSTabs() {
  document.querySelectorAll('.cms-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.cms-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCMSTab(tab.getAttribute('data-cms-tab'));
    };
  });
}

function renderCMSTab(tabName) {
  const area = document.getElementById('cms-content-area');
  if (!area) return;
  switch (tabName) {
    case 'projects':      renderProjectsCMS(area); break;
    case 'certificates':  renderCertificatesCMS(area); break;
    case 'abilities':     renderAbilitiesCMS(area); break;
    case 'achievements':  renderAchievementsCMS(area); break;
    case 'video':         renderVideoCMS(area); break;
    case 'about':         renderAboutCMS(area); break;
    case 'contact':       renderContactCMS(area); break;
    case 'evolution':     renderEvolutionCMS(area); break;
    case 'media':         renderMediaCMS(area); break;
    case 'profile':       renderProfileCMS(area); break;
    default:              renderProjectsCMS(area);
  }
}

/* ==================== SHARED HELPERS ==================== */
function cmsInputStyle() {
  return 'width:100%; padding:0.6rem 0.75rem; background:#08111F; border:1px solid var(--border-glass); color:#FFF; border-radius:8px; font-size:0.9rem;';
}

function cmsLabel(text) {
  return `<label style="display:block; color:var(--text-secondary); font-size:0.82rem; margin-bottom:0.3rem;">${text}</label>`;
}

function cmsFormGroup(label, inputHtml) {
  return `<div style="margin-bottom:1rem;">${cmsLabel(label)}${inputHtml}</div>`;
}

async function uploadToCloudinary(file) {
  const isVideo = file.type.startsWith('video/');
  const endpoint = isVideo 
    ? 'https://api.cloudinary.com/v1_1/tflryfre/video/upload' 
    : 'https://api.cloudinary.com/v1_1/tflryfre/image/upload';
    
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'portfolio-upload');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

function cmsUploadField(id, accept, label) {
  return `<div class="cms-upload-field" style="margin-bottom:1rem;">
    ${cmsLabel(label)}
    <label class="cms-upload-label" for="${id}">
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <span>Click to upload or drag & drop</span>
      <small>${accept.replace(/\./g, '').toUpperCase().replace(/,/g, ' / ')}</small>
    </label>
    <input type="file" id="${id}" accept="${accept}" style="display:none;">
    <div id="${id}-preview" class="cms-upload-preview"></div>
  </div>`;
}

/* ==================== 3. PROJECTS CMS ==================== */
function renderProjectsCMS(container) {
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-cubes"></i> Manage Projects (${legendverseData.projects.length})</h3>
      <button class="btn btn-primary btn-sm" onclick="showAddProjectForm()"><i class="fa-solid fa-plus"></i> Add Project</button>
    </div>
    <div id="cms-project-form-container"></div>
    <div class="cms-list" id="cms-project-list">
      ${legendverseData.projects.map(p => `
        <div class="cms-list-item">
          <div class="cms-item-thumb">
            <img src="${p.imageUrl || 'intro_video_poster.jpg'}" alt="${p.name}" onerror="this.src='intro_video_poster.jpg'">
          </div>
          <div class="cms-item-info">
            <strong>${p.name}</strong>
            <span class="cms-badge">${p.category}</span>
            <p>${p.shortDesc}</p>
          </div>
          <div class="cms-item-actions">
            <button class="btn btn-secondary btn-sm" onclick="editProject('${p.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`).join('')}
    </div>`;
}

window.showAddProjectForm = function(projToEdit = null) {
  const formDiv = document.getElementById('cms-project-form-container');
  const isEdit = !!projToEdit;
  const featuresVal = (projToEdit?.features || []).join('\n');

  formDiv.innerHTML = `
    <div class="cms-form-panel">
      <h4>${isEdit ? '<i class="fa-solid fa-pen"></i> Edit Project' : '<i class="fa-solid fa-plus"></i> Add New Project'}</h4>
      <form id="project-crud-form">
        <div class="cms-grid-2">
          ${cmsFormGroup('Project Name', `<input type="text" id="p-name" value="${projToEdit?.name || ''}" required style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('Category', `<select id="p-cat" style="${cmsInputStyle()}">
            <option value="Websites" ${projToEdit?.category === 'Websites' ? 'selected' : ''}>Websites</option>
            <option value="Games" ${projToEdit?.category === 'Games' ? 'selected' : ''}>Games</option>
            <option value="Apps" ${projToEdit?.category === 'Apps' ? 'selected' : ''}>Apps</option>
            <option value="AI Projects" ${projToEdit?.category === 'AI Projects' ? 'selected' : ''}>AI Projects</option>
            <option value="Creative Projects" ${projToEdit?.category === 'Creative Projects' ? 'selected' : ''}>Creative Projects</option>
          </select>`)}
        </div>
        ${cmsFormGroup('Short Description', `<input type="text" id="p-short" value="${projToEdit?.shortDesc || ''}" required style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Introduction / Purpose', `<textarea id="p-intro" rows="3" style="${cmsInputStyle()}">${projToEdit?.introduction || ''}</textarea>`)}
        ${cmsFormGroup('Key Features (one per line)', `<textarea id="p-features" rows="4" style="${cmsInputStyle()}">${featuresVal}</textarea>`)}
        <div class="cms-grid-2">
          ${cmsFormGroup('Technologies (comma separated)', `<input type="text" id="p-tech" value="${(projToEdit?.technologies || []).join(', ')}" style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('Status', `<input type="text" id="p-status" value="${projToEdit?.status || 'Active Portfolio Item'}" style="${cmsInputStyle()}">`)}
        </div>
        <div class="cms-grid-2">
          ${cmsFormGroup('GitHub URL', `<input type="text" id="p-github" value="${projToEdit?.githubUrl || ''}" style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('Demo / Live URL', `<input type="text" id="p-demo" value="${projToEdit?.demoUrl || ''}" style="${cmsInputStyle()}">`)}
        </div>
        ${cmsUploadField('p-img-upload', '.jpg,.jpeg,.png,.gif,.webp', 'Project Image (upload file)')}
        ${cmsFormGroup('— OR — Image URL / File Name', `<input type="text" id="p-img" value="${projToEdit?.imageUrl || ''}" placeholder="intro_video_poster.jpg" style="${cmsInputStyle()}">`)}
        <div id="p-current-img" style="margin-bottom:1rem;">${projToEdit?.imageUrl ? `<img src="${projToEdit.imageUrl}" style="height:80px; border-radius:8px; border:1px solid var(--border-glass);" onerror="this.style.display='none'">` : ''}</div>
        <div class="cms-form-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('cms-project-form-container').innerHTML=''">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-floppy-disk"></i> Save Project</button>
        </div>
      </form>
    </div>`;

  // Image upload preview
  const imgUpload = document.getElementById('p-img-upload');
  const imgPreview = document.getElementById('p-img-upload-preview');
  if (imgUpload) {
    imgUpload.addEventListener('change', async () => {
      const file = imgUpload.files[0];
      if (!file) return;
      
      const submitBtn = document.querySelector('#project-crud-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (imgPreview) imgPreview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        document.getElementById('p-img').value = secureUrl;
        if (imgPreview) imgPreview.innerHTML = `<img src="${secureUrl}" style="height:80px; border-radius:8px; margin-top:0.5rem;">`;
      } catch (err) {
        if (imgPreview) imgPreview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Image upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.getElementById('project-crud-form').onsubmit = (e) => {
    e.preventDefault();
    const imgVal = document.getElementById('p-img').value.trim() || 'intro_video_poster.jpg';
    const newProj = {
      id: isEdit ? projToEdit.id : `proj-${Date.now()}`,
      name: document.getElementById('p-name').value,
      category: document.getElementById('p-cat').value,
      shortDesc: document.getElementById('p-short').value,
      introduction: document.getElementById('p-intro').value,
      features: document.getElementById('p-features').value.split('\n').map(s => s.trim()).filter(Boolean),
      technologies: document.getElementById('p-tech').value.split(',').map(s => s.trim()).filter(Boolean),
      status: document.getElementById('p-status').value,
      githubUrl: document.getElementById('p-github').value,
      demoUrl: document.getElementById('p-demo').value,
      imageUrl: imgVal,
      purpose: document.getElementById('p-intro').value,
      protectedNote: "Some project details are protected for privacy purposes."
    };
    if (isEdit) {
      const idx = legendverseData.projects.findIndex(p => p.id === projToEdit.id);
      if (idx !== -1) legendverseData.projects[idx] = newProj;
    } else {
      legendverseData.projects.unshift(newProj);
    }
    saveState(); renderAllSections();
    showToast(`Project "${newProj.name}" saved!`);
    renderProjectsCMS(document.getElementById('cms-content-area'));
  };
};

window.editProject = function(id) {
  const p = legendverseData.projects.find(x => x.id === id);
  if (p) { showAddProjectForm(p); document.getElementById('cms-project-form-container').scrollIntoView({ behavior: 'smooth' }); }
};
window.deleteProject = function(id) {
  if (confirm("Delete this project?")) {
    legendverseData.projects = legendverseData.projects.filter(x => x.id !== id);
    saveState(); renderAllSections(); showToast("Project deleted.");
    renderProjectsCMS(document.getElementById('cms-content-area'));
  }
};

/* ==================== 4. CERTIFICATES CMS ==================== */
function renderCertificatesCMS(container) {
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-certificate"></i> Certificate Museum (${legendverseData.certificates.length})</h3>
      <button class="btn btn-primary btn-sm" onclick="showAddCertForm()"><i class="fa-solid fa-plus"></i> Add Certificate</button>
    </div>
    <div id="cms-cert-form-container"></div>
    <div class="cms-list">
      ${legendverseData.certificates.map(c => `
        <div class="cms-list-item">
          <div class="cms-item-thumb">
            <img src="${c.imageUrl || 'intro_video_poster.jpg'}" alt="${c.title}" onerror="this.src='intro_video_poster.jpg'">
          </div>
          <div class="cms-item-info">
            <strong>${c.title}</strong>
            <span class="cms-badge">${c.category}</span>
            <p>${c.issuer} &bull; ${c.date}</p>
          </div>
          <div class="cms-item-actions">
            <button class="btn btn-secondary btn-sm" onclick="editCert('${c.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCert('${c.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`).join('')}
    </div>`;
}

window.showAddCertForm = function(certToEdit = null) {
  const container = document.getElementById('cms-cert-form-container');
  const isEdit = !!certToEdit;

  container.innerHTML = `
    <div class="cms-form-panel">
      <h4>${isEdit ? '<i class="fa-solid fa-pen"></i> Edit Certificate' : '<i class="fa-solid fa-plus"></i> Add Certificate'}</h4>
      <form id="cert-crud-form">
        ${cmsFormGroup('Certificate Title', `<input type="text" id="c-title" value="${certToEdit?.title || ''}" required style="${cmsInputStyle()}">`)}
        <div class="cms-grid-2">
          ${cmsFormGroup('Issuing Organization', `<input type="text" id="c-issuer" value="${certToEdit?.issuer || ''}" required style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('Year Issued', `<input type="text" id="c-date" value="${certToEdit?.date || new Date().getFullYear()}" style="${cmsInputStyle()}">`)}
        </div>
        <div class="cms-grid-2">
          ${cmsFormGroup('Category', `<select id="c-cat" style="${cmsInputStyle()}">
            <option value="Engineering & Code" ${certToEdit?.category === 'Engineering & Code' ? 'selected' : ''}>Engineering & Code</option>
            <option value="AI & Data" ${certToEdit?.category === 'AI & Data' ? 'selected' : ''}>AI & Data</option>
            <option value="Design & Media" ${certToEdit?.category === 'Design & Media' ? 'selected' : ''}>Design & Media</option>
          </select>`)}
          ${cmsFormGroup('Grade / Distinction', `<input type="text" id="c-grade" value="${certToEdit?.grade || ''}" style="${cmsInputStyle()}">`)}
        </div>
        ${cmsFormGroup('Description', `<textarea id="c-desc" rows="2" style="${cmsInputStyle()}">${certToEdit?.description || ''}</textarea>`)}
        ${cmsFormGroup('Voice Explanation Script', `<textarea id="c-speech" rows="2" style="${cmsInputStyle()}">${certToEdit?.speechText || ''}</textarea>`)}
        ${cmsUploadField('c-img-upload', '.jpg,.jpeg,.png,.gif,.webp,.pdf', 'Certificate Image / PDF (upload)')}
        ${cmsFormGroup('— OR — Image URL / File Name', `<input type="text" id="c-img" value="${certToEdit?.imageUrl || ''}" placeholder="intro_video_poster.jpg" style="${cmsInputStyle()}">`)}
        <div id="c-current-img" style="margin-bottom:1rem;">${certToEdit?.imageUrl ? `<img src="${certToEdit.imageUrl}" style="height:80px; border-radius:8px; border:1px solid var(--border-glass);" onerror="this.style.display='none'">` : ''}</div>
        <div class="cms-form-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('cms-cert-form-container').innerHTML=''">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-floppy-disk"></i> Save Certificate</button>
        </div>
      </form>
    </div>`;

  const imgUpload = document.getElementById('c-img-upload');
  if (imgUpload) {
    imgUpload.addEventListener('change', async () => {
      const file = imgUpload.files[0];
      if (!file) return;
      
      const submitBtn = document.querySelector('#cert-crud-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const imgPreview = document.getElementById('c-img-upload-preview');
      if (imgPreview) imgPreview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        document.getElementById('c-img').value = secureUrl;
        if (imgPreview) imgPreview.innerHTML = `<img src="${secureUrl}" style="height:80px; border-radius:8px; margin-top:0.5rem;">`;
      } catch (err) {
        if (imgPreview) imgPreview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.getElementById('cert-crud-form').onsubmit = (e) => {
    e.preventDefault();
    const newCert = {
      id: isEdit ? certToEdit.id : `cert-${Date.now()}`,
      title: document.getElementById('c-title').value,
      issuer: document.getElementById('c-issuer').value,
      date: document.getElementById('c-date').value,
      category: document.getElementById('c-cat').value,
      grade: document.getElementById('c-grade').value,
      description: document.getElementById('c-desc').value,
      speechText: document.getElementById('c-speech').value,
      imageUrl: document.getElementById('c-img').value.trim() || 'intro_video_poster.jpg',
      downloadUrl: "#"
    };
    if (isEdit) {
      const idx = legendverseData.certificates.findIndex(c => c.id === certToEdit.id);
      if (idx !== -1) legendverseData.certificates[idx] = newCert;
    } else {
      legendverseData.certificates.unshift(newCert);
    }
    saveState(); renderAllSections(); showToast("Certificate saved!");
    renderCertificatesCMS(document.getElementById('cms-content-area'));
  };
};

window.editCert = function(id) {
  const c = legendverseData.certificates.find(x => x.id === id);
  if (c) { showAddCertForm(c); document.getElementById('cms-cert-form-container').scrollIntoView({ behavior: 'smooth' }); }
};
window.deleteCert = function(id) {
  if (confirm("Delete this certificate?")) {
    legendverseData.certificates = legendverseData.certificates.filter(c => c.id !== id);
    saveState(); renderAllSections(); showToast("Certificate deleted.");
    renderCertificatesCMS(document.getElementById('cms-content-area'));
  }
};

/* ==================== 5. ABILITIES CMS (FULL CRUD) ==================== */
function renderAbilitiesCMS(container) {
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-bolt"></i> Abilities Manager</h3>
    </div>

    <!-- Technical Skills -->
    <div class="cms-subsection">
      <div class="cms-subsection-header">
        <h4><i class="fa-solid fa-microchip"></i> Technical Skills (${legendverseData.technicalSkills.length})</h4>
        <button class="btn btn-primary btn-sm" onclick="showAddSkillForm('tech')"><i class="fa-solid fa-plus"></i> Add Technical Skill</button>
      </div>
      <div id="cms-tech-skill-form"></div>
      <div class="cms-list" id="cms-tech-list">
        ${legendverseData.technicalSkills.map(s => `
          <div class="cms-list-item">
            <div class="cms-skill-icon"><i class="fa-solid fa-${s.icon || 'code'}"></i></div>
            <div class="cms-item-info">
              <strong>${s.title}</strong>
              <div class="cms-skill-bar"><div style="width:${s.level}%; height:4px; background:var(--accent-primary); border-radius:2px;"></div></div>
              <p>${s.level}% &bull; ${s.description.substring(0, 60)}...</p>
            </div>
            <div class="cms-item-actions">
              <button class="btn btn-secondary btn-sm" onclick="editSkill('${s.id}','tech')"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteSkill('${s.id}','tech')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Soft Skills -->
    <div class="cms-subsection" style="margin-top:2rem;">
      <div class="cms-subsection-header">
        <h4><i class="fa-solid fa-brain"></i> Soft Skills (${legendverseData.softSkills.length})</h4>
        <button class="btn btn-primary btn-sm" onclick="showAddSkillForm('soft')"><i class="fa-solid fa-plus"></i> Add Soft Skill</button>
      </div>
      <div id="cms-soft-skill-form"></div>
      <div class="cms-list" id="cms-soft-list">
        ${legendverseData.softSkills.map(s => `
          <div class="cms-list-item">
            <div class="cms-skill-icon"><i class="fa-solid fa-${s.icon || 'brain'}"></i></div>
            <div class="cms-item-info">
              <strong>${s.title}</strong>
              <p>${s.description.substring(0, 70)}...</p>
            </div>
            <div class="cms-item-actions">
              <button class="btn btn-secondary btn-sm" onclick="editSkill('${s.id}','soft')"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteSkill('${s.id}','soft')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

window.showAddSkillForm = function(type, skillToEdit = null) {
  const formContainerId = type === 'tech' ? 'cms-tech-skill-form' : 'cms-soft-skill-form';
  const formDiv = document.getElementById(formContainerId);
  const isEdit = !!skillToEdit;
  const isTech = type === 'tech';

  formDiv.innerHTML = `
    <div class="cms-form-panel">
      <h4>${isEdit ? 'Edit' : 'Add'} ${isTech ? 'Technical' : 'Soft'} Skill</h4>
      <form id="skill-crud-form-${type}">
        <div class="cms-grid-2">
          ${cmsFormGroup('Skill Title', `<input type="text" id="sk-title-${type}" value="${skillToEdit?.title || ''}" required style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('FontAwesome Icon Name', `<input type="text" id="sk-icon-${type}" value="${skillToEdit?.icon || 'star'}" placeholder="code, brain, camera..." style="${cmsInputStyle()}">`)}
        </div>
        ${isTech ? `<div class="cms-grid-2">
          ${cmsFormGroup('Proficiency Level (0–100)', `<input type="number" id="sk-level-${type}" min="0" max="100" value="${skillToEdit?.level || 80}" style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('Category', `<input type="text" id="sk-cat-${type}" value="${skillToEdit?.category || 'Technical'}" style="${cmsInputStyle()}">`)}
        </div>` : ''}
        ${cmsFormGroup('Description', `<textarea id="sk-desc-${type}" rows="2" style="${cmsInputStyle()}">${skillToEdit?.description || ''}</textarea>`)}
        ${isTech ? `
        <div class="cms-grid-2">
          ${cmsFormGroup('Proof Title', `<input type="text" id="sk-proof-title-${type}" value="${skillToEdit?.proof?.title || ''}" style="${cmsInputStyle()}">`)}
          ${cmsFormGroup('Proof Link / URL', `<input type="text" id="sk-proof-link-${type}" value="${skillToEdit?.proof?.link || ''}" style="${cmsInputStyle()}">`)}
        </div>
        ${cmsFormGroup('Proof Description', `<textarea id="sk-proof-content-${type}" rows="2" style="${cmsInputStyle()}">${skillToEdit?.proof?.content || ''}</textarea>`)}
        ` : cmsFormGroup('Proof / Evidence Statement', `<textarea id="sk-proof-${type}" rows="2" style="${cmsInputStyle()}">${skillToEdit?.proof || ''}</textarea>`)}
        <div class="cms-form-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('${formContainerId}').innerHTML=''">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-floppy-disk"></i> Save Skill</button>
        </div>
      </form>
    </div>`;

  document.getElementById(`skill-crud-form-${type}`).onsubmit = (e) => {
    e.preventDefault();
    let newSkill;
    if (isTech) {
      newSkill = {
        id: isEdit ? skillToEdit.id : `tech-${Date.now()}`,
        title: document.getElementById(`sk-title-${type}`).value,
        icon: document.getElementById(`sk-icon-${type}`).value || 'code',
        level: parseInt(document.getElementById(`sk-level-${type}`).value) || 80,
        category: document.getElementById(`sk-cat-${type}`).value || 'Technical',
        description: document.getElementById(`sk-desc-${type}`).value,
        proof: {
          type: 'code',
          title: document.getElementById(`sk-proof-title-${type}`).value,
          content: document.getElementById(`sk-proof-content-${type}`).value,
          link: document.getElementById(`sk-proof-link-${type}`).value
        }
      };
      if (isEdit) {
        const idx = legendverseData.technicalSkills.findIndex(s => s.id === skillToEdit.id);
        if (idx !== -1) legendverseData.technicalSkills[idx] = newSkill;
      } else { legendverseData.technicalSkills.push(newSkill); }
    } else {
      newSkill = {
        id: isEdit ? skillToEdit.id : `soft-${Date.now()}`,
        title: document.getElementById(`sk-title-${type}`).value,
        icon: document.getElementById(`sk-icon-${type}`).value || 'brain',
        description: document.getElementById(`sk-desc-${type}`).value,
        proof: document.getElementById(`sk-proof-${type}`).value
      };
      if (isEdit) {
        const idx = legendverseData.softSkills.findIndex(s => s.id === skillToEdit.id);
        if (idx !== -1) legendverseData.softSkills[idx] = newSkill;
      } else { legendverseData.softSkills.push(newSkill); }
    }
    saveState(); renderAllSections(); showToast("Skill saved!");
    renderAbilitiesCMS(document.getElementById('cms-content-area'));
  };
};

window.editSkill = function(id, type) {
  const list = type === 'tech' ? legendverseData.technicalSkills : legendverseData.softSkills;
  const skill = list.find(s => s.id === id);
  if (skill) { showAddSkillForm(type, skill); }
};

window.deleteSkill = function(id, type) {
  if (confirm("Delete this skill?")) {
    if (type === 'tech') { legendverseData.technicalSkills = legendverseData.technicalSkills.filter(s => s.id !== id); }
    else { legendverseData.softSkills = legendverseData.softSkills.filter(s => s.id !== id); }
    saveState(); renderAllSections(); showToast("Skill deleted.");
    renderAbilitiesCMS(document.getElementById('cms-content-area'));
  }
};

/* ==================== 6. ACHIEVEMENTS CMS (FULL CRUD) ==================== */
function renderAchievementsCMS(container) {
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-trophy"></i> Achievements Manager (${legendverseData.achievements.length})</h3>
      <button class="btn btn-primary btn-sm" onclick="showAddAchievementForm()"><i class="fa-solid fa-plus"></i> Add Achievement</button>
    </div>
    <div id="cms-ach-form-container"></div>
    <div class="cms-list">
      ${legendverseData.achievements.map(a => `
        <div class="cms-list-item">
          <div class="cms-skill-icon" style="background:rgba(255,193,7,0.12); color:#F6C90E;">
            <i class="fa-solid fa-trophy"></i>
          </div>
          <div class="cms-item-info">
            <strong>${a.title}</strong>
            <span class="cms-badge">${a.category}</span>
            <p>${a.date} &bull; ${a.location || ''}</p>
          </div>
          <div class="cms-item-actions">
            <button class="btn btn-secondary btn-sm" onclick="editAchievement('${a.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteAchievement('${a.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`).join('')}
    </div>`;
}

window.showAddAchievementForm = function(achToEdit = null) {
  const formDiv = document.getElementById('cms-ach-form-container');
  const isEdit = !!achToEdit;

  formDiv.innerHTML = `
    <div class="cms-form-panel">
      <h4>${isEdit ? '<i class="fa-solid fa-pen"></i> Edit Achievement' : '<i class="fa-solid fa-plus"></i> Add Achievement'}</h4>
      <form id="ach-crud-form">
        ${cmsFormGroup('Achievement Title', `<input type="text" id="a-title" value="${achToEdit?.title || ''}" required style="${cmsInputStyle()}">`)}
        <div class="cms-grid-2">
          ${cmsFormGroup('Category', `<select id="a-cat" style="${cmsInputStyle()}">
            <option value="Hackathons" ${achToEdit?.category === 'Hackathons' ? 'selected' : ''}>Hackathons</option>
            <option value="Sports" ${achToEdit?.category === 'Sports' ? 'selected' : ''}>Sports</option>
            <option value="Certificates" ${achToEdit?.category === 'Certificates' ? 'selected' : ''}>Certificates</option>
            <option value="Academic" ${achToEdit?.category === 'Academic' ? 'selected' : ''}>Academic</option>
            <option value="Leadership" ${achToEdit?.category === 'Leadership' ? 'selected' : ''}>Leadership</option>
          </select>`)}
          ${cmsFormGroup('Date (e.g. January 2025)', `<input type="text" id="a-date" value="${achToEdit?.date || ''}" style="${cmsInputStyle()}">`)}
        </div>
        ${cmsFormGroup('Location / Event', `<input type="text" id="a-location" value="${achToEdit?.location || ''}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Description', `<textarea id="a-desc" rows="3" style="${cmsInputStyle()}">${achToEdit?.description || ''}</textarea>`)}
        ${cmsUploadField('a-img-upload', '.jpg,.jpeg,.png,.gif,.webp', 'Achievement Image (optional)')}
        ${cmsFormGroup('— OR — Image URL', `<input type="text" id="a-img" value="${achToEdit?.imageUrl || ''}" style="${cmsInputStyle()}">`)}
        <div class="cms-form-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('cms-ach-form-container').innerHTML=''">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-floppy-disk"></i> Save Achievement</button>
        </div>
      </form>
    </div>`;

  const imgUpload = document.getElementById('a-img-upload');
  if (imgUpload) {
    imgUpload.addEventListener('change', async () => {
      const file = imgUpload.files[0];
      if (!file) return;
      
      const submitBtn = document.querySelector('#ach-crud-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const imgPreview = document.getElementById('a-img-upload-preview');
      if (imgPreview) imgPreview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        document.getElementById('a-img').value = secureUrl;
        if (imgPreview) imgPreview.innerHTML = `<img src="${secureUrl}" style="height:70px; border-radius:8px; margin-top:0.5rem;">`;
      } catch (err) {
        if (imgPreview) imgPreview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.getElementById('ach-crud-form').onsubmit = (e) => {
    e.preventDefault();
    const newAch = {
      id: isEdit ? achToEdit.id : `ach-${Date.now()}`,
      title: document.getElementById('a-title').value,
      category: document.getElementById('a-cat').value,
      date: document.getElementById('a-date').value,
      location: document.getElementById('a-location').value,
      description: document.getElementById('a-desc').value,
      imageUrl: document.getElementById('a-img').value.trim() || 'intro_video_poster.jpg'
    };
    if (isEdit) {
      const idx = legendverseData.achievements.findIndex(a => a.id === achToEdit.id);
      if (idx !== -1) legendverseData.achievements[idx] = newAch;
    } else { legendverseData.achievements.push(newAch); }
    saveState(); renderAllSections(); showToast("Achievement saved!");
    renderAchievementsCMS(document.getElementById('cms-content-area'));
  };
};

window.editAchievement = function(id) {
  const a = legendverseData.achievements.find(x => x.id === id);
  if (a) { showAddAchievementForm(a); document.getElementById('cms-ach-form-container').scrollIntoView({ behavior: 'smooth' }); }
};

window.deleteAchievement = function(id) {
  if (confirm("Delete this achievement?")) {
    legendverseData.achievements = legendverseData.achievements.filter(a => a.id !== id);
    saveState(); renderAllSections(); showToast("Achievement deleted.");
    renderAchievementsCMS(document.getElementById('cms-content-area'));
  }
};

/* ==================== 7. INTRO VIDEO CMS ==================== */
function renderVideoCMS(container) {
  const v = legendverseData.introVideo;
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-film"></i> Intro Video Manager</h3>
    </div>
    <form id="video-cms-form" class="cms-form-standalone">
      ${cmsFormGroup('Video Presentation Title', `<input type="text" id="v-title" value="${v.title}" required style="${cmsInputStyle()}">`)}
      ${cmsFormGroup('Video Description', `<input type="text" id="v-desc" value="${v.description}" required style="${cmsInputStyle()}">`)}
      ${cmsUploadField('v-poster-upload', '.jpg,.jpeg,.png,.webp', 'Poster Image (upload)')}
      ${cmsFormGroup('— OR — Poster Image URL / File Name', `<input type="text" id="v-poster" value="${v.posterUrl}" style="${cmsInputStyle()}">`)}
      <div style="margin-bottom:1rem;">${v.posterUrl ? `<img src="${v.posterUrl}" style="height:80px; border-radius:8px; border:1px solid var(--border-glass); margin-top:0.5rem;" onerror="this.style.display='none'">` : ''}</div>
      ${cmsUploadField('v-video-upload', '.mp4,.webm,.ogg', 'Upload MP4 Video File')}
      ${cmsFormGroup('— OR — MP4 Video URL (leave blank for luxury canvas)', `<input type="text" id="v-url" value="${v.videoUrl || ''}" style="${cmsInputStyle()}">`)}
      ${cmsFormGroup('Voice Welcome Script', `<textarea id="v-script" rows="3" style="${cmsInputStyle()}">${v.speechScript || ''}</textarea>`)}
      <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Save Video Settings</button>
    </form>`;

  const posterUpload = document.getElementById('v-poster-upload');
  if (posterUpload) {
    posterUpload.addEventListener('change', async () => {
      const file = posterUpload.files[0];
      if (!file) return;
      
      const submitBtn = document.querySelector('#video-cms-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const imgPreview = document.getElementById('v-poster-upload-preview');
      if (imgPreview) imgPreview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading Poster...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        document.getElementById('v-poster').value = secureUrl;
        if (imgPreview) imgPreview.innerHTML = `<img src="${secureUrl}" style="height:80px; border-radius:8px; margin-top:0.5rem;">`;
      } catch (err) {
        if (imgPreview) imgPreview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Poster upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
  const videoUpload = document.getElementById('v-video-upload');
  if (videoUpload) {
    videoUpload.addEventListener('change', async () => {
      const file = videoUpload.files[0];
      if (!file) return;
      
      const submitBtn = document.querySelector('#video-cms-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const vidPreview = document.getElementById('v-video-upload-preview');
      if (vidPreview) vidPreview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading Video...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        document.getElementById('v-url').value = secureUrl;
        if (vidPreview) vidPreview.innerHTML = `<span style="color:var(--accent-primary); font-size:0.85rem;"><i class="fa-solid fa-check-circle"></i> Video uploaded: ${file.name}</span>`;
      } catch (err) {
        if (vidPreview) vidPreview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Video upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.getElementById('video-cms-form').onsubmit = (e) => {
    e.preventDefault();
    legendverseData.introVideo.title = document.getElementById('v-title').value;
    legendverseData.introVideo.description = document.getElementById('v-desc').value;
    legendverseData.introVideo.posterUrl = document.getElementById('v-poster').value;
    legendverseData.introVideo.videoUrl = document.getElementById('v-url').value;
    legendverseData.introVideo.speechScript = document.getElementById('v-script').value;
    saveState(); renderAllSections(); showToast("Intro Video settings updated!");
  };
}

/* ==================== 8. ABOUT ME CMS (FULL FIELDS) ==================== */
function renderAboutCMS(container) {
  const o = legendverseData.owner;
  const goalsText = (o.futureGoals || []).join('\n');
  const tlText = (o.timeline || []).map(t => `${t.year}|${t.title}|${t.detail}`).join('\n');

  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-user-pen"></i> About Me Editor</h3>
    </div>
    <form id="about-cms-form" class="cms-form-standalone">

      <div class="cms-form-group-title"><i class="fa-solid fa-id-card"></i> Identity & Profile</div>
      <div class="cms-grid-2">
        ${cmsFormGroup('Full Name', `<input type="text" id="o-name" value="${o.name}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Professional Title', `<input type="text" id="o-title" value="${o.title || ''}" style="${cmsInputStyle()}">`)}
      </div>
      <div class="cms-grid-3">
        ${cmsFormGroup('College / University', `<input type="text" id="o-college" value="${o.college}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Department', `<input type="text" id="o-dept" value="${o.department || ''}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Academic Year', `<input type="text" id="o-year" value="${o.year || ''}" style="${cmsInputStyle()}">`)}
      </div>

      <div class="cms-form-group-title" style="margin-top:1.5rem;"><i class="fa-solid fa-quote-left"></i> Bio & Story</div>
      ${cmsFormGroup('Short Bio (Hero Quote)', `<textarea id="o-bio" rows="3" style="${cmsInputStyle()}">${o.bio}</textarea>`)}
      ${cmsFormGroup('Extended Story Paragraph', `<textarea id="o-extended" rows="4" style="${cmsInputStyle()}">${o.extendedStory || ''}</textarea>`)}

      <div class="cms-form-group-title" style="margin-top:1.5rem;"><i class="fa-solid fa-image"></i> Avatar Photo</div>
      ${cmsUploadField('o-avatar-upload', '.jpg,.jpeg,.png,.webp', 'Upload Profile Photo')}
      ${cmsFormGroup('— OR — Avatar Image URL / File Name', `<input type="text" id="o-avatar" value="${o.avatarUrl || 'rithika_avatar.jpg'}" style="${cmsInputStyle()}">`)}
      <div style="margin-bottom:1.5rem;">${o.avatarUrl ? `<img src="${o.avatarUrl}" style="height:80px; width:80px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary); margin-top:0.5rem;" onerror="this.style.display='none'">` : ''}</div>

      <div class="cms-form-group-title"><i class="fa-solid fa-share-nodes"></i> Social & Contact Links</div>
      <div class="cms-grid-2">
        ${cmsFormGroup('Official Email', `<input type="email" id="o-email" value="${o.email}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('GitHub URL', `<input type="text" id="o-github" value="${o.github}" style="${cmsInputStyle()}">`)}
      </div>
      <div class="cms-grid-2">
        ${cmsFormGroup('LinkedIn URL', `<input type="text" id="o-linkedin" value="${o.linkedin || ''}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Instagram URL', `<input type="text" id="o-instagram" value="${o.instagram || ''}" style="${cmsInputStyle()}">`)}
      </div>

      <div class="cms-form-group-title" style="margin-top:1.5rem;"><i class="fa-solid fa-bullseye"></i> Future Goals</div>
      ${cmsFormGroup('Future Goals (one per line)', `<textarea id="o-goals" rows="5" style="${cmsInputStyle()}">${goalsText}</textarea>`)}

      <div class="cms-form-group-title" style="margin-top:1.5rem;"><i class="fa-solid fa-timeline"></i> Timeline Milestones</div>
      <p style="color:var(--text-secondary); font-size:0.82rem; margin-bottom:0.75rem;">Format each line as: <code style="color:var(--accent-primary);">YEAR|Title|Description</code></p>
      ${cmsFormGroup('Timeline Items', `<textarea id="o-timeline" rows="5" style="${cmsInputStyle()}">${tlText}</textarea>`)}

      <button type="submit" class="btn btn-primary" style="margin-top:1rem;"><i class="fa-solid fa-floppy-disk"></i> Save All About Me Changes</button>
    </form>`;

  const avatarUpload = document.getElementById('o-avatar-upload');
  if (avatarUpload) {
    avatarUpload.addEventListener('change', async () => {
      const file = avatarUpload.files[0];
      if (!file) return;
      
      const submitBtn = document.querySelector('#about-cms-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const imgPreview = document.getElementById('o-avatar-upload-preview');
      if (imgPreview) imgPreview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        document.getElementById('o-avatar').value = secureUrl;
        if (imgPreview) imgPreview.innerHTML = `<img src="${secureUrl}" style="height:80px; width:80px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary); margin-top:0.5rem;">`;
      } catch (err) {
        if (imgPreview) imgPreview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Avatar upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.getElementById('about-cms-form').onsubmit = (e) => {
    e.preventDefault();
    legendverseData.owner.name = document.getElementById('o-name').value;
    legendverseData.owner.title = document.getElementById('o-title').value;
    legendverseData.owner.college = document.getElementById('o-college').value;
    legendverseData.owner.department = document.getElementById('o-dept').value;
    legendverseData.owner.year = document.getElementById('o-year').value;
    legendverseData.owner.bio = document.getElementById('o-bio').value;
    legendverseData.owner.extendedStory = document.getElementById('o-extended').value;
    legendverseData.owner.avatarUrl = document.getElementById('o-avatar').value.trim() || 'rithika_avatar.jpg';
    legendverseData.owner.email = document.getElementById('o-email').value;
    legendverseData.owner.github = document.getElementById('o-github').value;
    legendverseData.owner.linkedin = document.getElementById('o-linkedin').value;
    legendverseData.owner.instagram = document.getElementById('o-instagram').value;
    legendverseData.owner.futureGoals = document.getElementById('o-goals').value.split('\n').map(s => s.trim()).filter(Boolean);
    legendverseData.owner.timeline = document.getElementById('o-timeline').value.split('\n').map(line => {
      const parts = line.split('|');
      return { year: (parts[0] || '').trim(), title: (parts[1] || '').trim(), detail: (parts[2] || '').trim() };
    }).filter(t => t.year);
    saveState(); renderAllSections(); showToast("About Me updated successfully!");
  };
}

/* ==================== 9. CONTACT CMS ==================== */
function renderContactCMS(container) {
  const o = legendverseData.owner;
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-address-book"></i> Contact Channels</h3>
    </div>
    <form id="contact-cms-form" class="cms-form-standalone">
      <div class="cms-grid-2">
        ${cmsFormGroup('Official Email', `<input type="email" id="oc-email" value="${o.email}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('GitHub Profile URL', `<input type="text" id="oc-github" value="${o.github}" style="${cmsInputStyle()}">`)}
      </div>
      <div class="cms-grid-2">
        ${cmsFormGroup('LinkedIn URL', `<input type="text" id="oc-linkedin" value="${o.linkedin || ''}" style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Instagram URL', `<input type="text" id="oc-instagram" value="${o.instagram || ''}" style="${cmsInputStyle()}">`)}
      </div>
      <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Update Contact Channels</button>
    </form>`;

  document.getElementById('contact-cms-form').onsubmit = (e) => {
    e.preventDefault();
    legendverseData.owner.email = document.getElementById('oc-email').value;
    legendverseData.owner.github = document.getElementById('oc-github').value;
    legendverseData.owner.linkedin = document.getElementById('oc-linkedin').value;
    legendverseData.owner.instagram = document.getElementById('oc-instagram').value;
    saveState(); renderAllSections(); showToast("Contact channels updated!");
  };
}

/* ==================== 10. EVOLUTION / LEARNING CMS ==================== */
function renderEvolutionCMS(container) {
  const ev = legendverseData.currentlyLearning || {};
  const techText = (ev.technologies || []).map(t => `${t.name}|${t.level}`).join('\n');
  const improvingText = (ev.improvingSkills || []).join('\n');
  const currentProjText = (ev.currentProjects || []).join('\n');

  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-rocket"></i> Evolution & Learning Roadmap</h3>
    </div>
    <form id="evolution-cms-form" class="cms-form-standalone">
      <div class="cms-form-group-title"><i class="fa-solid fa-chart-bar"></i> Currently Learning Technologies</div>
      <p style="color:var(--text-secondary); font-size:0.82rem; margin-bottom:0.75rem;">Format: <code style="color:var(--accent-primary);">Technology Name|Level(0-100)</code> — one per line</p>
      ${cmsFormGroup('Technologies with Progress', `<textarea id="ev-tech" rows="6" style="${cmsInputStyle()}">${techText}</textarea>`)}

      <div class="cms-form-group-title" style="margin-top:1.5rem;"><i class="fa-solid fa-arrow-trend-up"></i> Skills Currently Improving</div>
      ${cmsFormGroup('Skills (one per line)', `<textarea id="ev-improving" rows="5" style="${cmsInputStyle()}">${improvingText}</textarea>`)}

      <div class="cms-form-group-title" style="margin-top:1.5rem;"><i class="fa-solid fa-gears"></i> Current Active Projects</div>
      ${cmsFormGroup('Projects (one per line)', `<textarea id="ev-projects" rows="4" style="${cmsInputStyle()}">${currentProjText}</textarea>`)}

      <button type="submit" class="btn btn-primary" style="margin-top:1rem;"><i class="fa-solid fa-floppy-disk"></i> Save Evolution Data</button>
    </form>`;

  document.getElementById('evolution-cms-form').onsubmit = (e) => {
    e.preventDefault();
    if (!legendverseData.currentlyLearning) legendverseData.currentlyLearning = {};
    legendverseData.currentlyLearning.technologies = document.getElementById('ev-tech').value
      .split('\n').map(line => {
        const parts = line.split('|');
        return { name: (parts[0] || '').trim(), level: parseInt(parts[1]) || 70 };
      }).filter(t => t.name);
    legendverseData.currentlyLearning.improvingSkills = document.getElementById('ev-improving').value.split('\n').map(s => s.trim()).filter(Boolean);
    legendverseData.currentlyLearning.currentProjects = document.getElementById('ev-projects').value.split('\n').map(s => s.trim()).filter(Boolean);
    saveState(); renderAllSections(); showToast("Evolution roadmap updated!");
  };
}

/* ==================== 11. MEDIA GALLERY CMS ==================== */
function renderMediaCMS(container) {
  if (!legendverseData.mediaGallery) legendverseData.mediaGallery = [];
  const gallery = legendverseData.mediaGallery;

  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-photo-film"></i> Media Gallery (${gallery.length} items)</h3>
    </div>
    <div class="cms-form-panel" style="margin-bottom:2rem;">
      <h4><i class="fa-solid fa-cloud-arrow-up"></i> Upload Media</h4>
      <form id="media-upload-form">
        ${cmsFormGroup('Media Title / Caption', `<input type="text" id="m-title" placeholder="e.g. SRIT Campus Photography" required style="${cmsInputStyle()}">`)}
        ${cmsFormGroup('Category / Tag', `<input type="text" id="m-tag" placeholder="Photography, Video, 3D Art..." style="${cmsInputStyle()}">`)}
        ${cmsUploadField('m-file-upload', '.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm', 'Upload Image or Video')}
        <div class="cms-form-actions">
          <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-cloud-arrow-up"></i> Upload to Gallery</button>
        </div>
      </form>
    </div>

    <div class="cms-media-grid" id="cms-media-grid">
      ${gallery.length === 0 ? `<div class="cms-empty-state"><i class="fa-solid fa-photo-film"></i><p>No media uploaded yet. Upload images and videos above.</p></div>` :
        gallery.map((item, idx) => `
          <div class="cms-media-card">
            ${item.type === 'video'
              ? `<video src="${item.url}" style="width:100%; height:140px; object-fit:cover; border-radius:10px 10px 0 0;" muted></video>`
              : `<img src="${item.url}" alt="${item.title}" style="width:100%; height:140px; object-fit:cover; border-radius:10px 10px 0 0;" onerror="this.style.background='#10233E'">`}
            <div class="cms-media-info">
              <strong>${item.title}</strong>
              <span class="cms-badge">${item.tag || 'Media'}</span>
            </div>
            <button class="btn btn-danger btn-sm" style="width:100%; border-radius:0 0 10px 10px;" onclick="deleteMedia(${idx})">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>`).join('')}
    </div>`;

  const fileUpload = document.getElementById('m-file-upload');
  if (fileUpload) {
    fileUpload.addEventListener('change', async () => {
      const file = fileUpload.files[0];
      if (!file) return;
      const preview = document.getElementById('m-file-upload-preview');
      const isVideo = file.type.startsWith('video/');
      
      const submitBtn = document.querySelector('#media-upload-form button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (preview) preview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</span>`;
      fileUpload.removeAttribute('data-secure-url');
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        fileUpload.setAttribute('data-secure-url', secureUrl);
        if (preview) {
          preview.innerHTML = isVideo
            ? `<video src="${secureUrl}" style="height:80px; border-radius:8px; margin-top:0.5rem;" controls muted></video>`
            : `<img src="${secureUrl}" style="height:80px; border-radius:8px; margin-top:0.5rem;">`;
        }
      } catch (err) {
        if (preview) preview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Upload failed", "fa-triangle-exclamation");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.getElementById('media-upload-form').onsubmit = (e) => {
    e.preventDefault();
    const fileUpload = document.getElementById('m-file-upload');
    const secureUrl = fileUpload.getAttribute('data-secure-url');
    if (!secureUrl) { showToast("Please wait for upload to finish or select a file.", "fa-triangle-exclamation"); return; }
    
    const file = fileUpload.files[0];
    const isVideo = file && file.type.startsWith('video/');
    
    const newItem = {
      title: document.getElementById('m-title').value,
      tag: document.getElementById('m-tag').value || 'Media',
      url: secureUrl,
      type: isVideo ? 'video' : 'image',
      uploadedAt: new Date().toLocaleDateString()
    };
    legendverseData.mediaGallery.unshift(newItem);
    saveState(); showToast("Media uploaded to gallery!");
    renderMediaCMS(document.getElementById('cms-content-area'));
  };
}

window.deleteMedia = function(idx) {
  if (confirm("Remove this media item?")) {
    legendverseData.mediaGallery.splice(idx, 1);
    saveState(); showToast("Media removed.");
    renderMediaCMS(document.getElementById('cms-content-area'));
  }
};

/* ==================== 12. PROFILE & PIN CMS ==================== */
function renderProfileCMS(container) {
  const o = legendverseData.owner;
  container.innerHTML = `
    <div class="cms-section-header">
      <h3><i class="fa-solid fa-shield-halved"></i> Profile & Security Settings</h3>
    </div>

    <!-- Avatar Quick Update -->
    <div class="cms-form-panel" style="margin-bottom:1.5rem;">
      <h4><i class="fa-solid fa-circle-user"></i> Profile Photo</h4>
      <div style="display:flex; align-items:center; gap:1.5rem; margin-bottom:1rem;">
        <img id="profile-avatar-preview" src="${o.avatarUrl || 'rithika_avatar.jpg'}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary);" onerror="this.src='rithika_avatar.jpg'">
        <div>
          <p style="color:#FFF; font-size:1rem; font-weight:600;">${o.name}</p>
          <p style="color:var(--text-secondary); font-size:0.85rem;">${o.title || ''}</p>
        </div>
      </div>
      ${cmsUploadField('prof-avatar-upload', '.jpg,.jpeg,.png,.webp', 'Update Profile Photo')}
      <button class="btn btn-primary btn-sm" id="save-avatar-btn" style="margin-top:0.5rem;"><i class="fa-solid fa-floppy-disk"></i> Save Photo</button>
    </div>


    <!-- Data Management -->
    <div class="cms-form-panel" style="margin-top:1.5rem;">
      <h4><i class="fa-solid fa-database"></i> Data Management</h4>
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">Export a full backup of your portfolio data as JSON, or restore from a previous backup.</p>
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button class="btn btn-secondary" id="export-json-btn"><i class="fa-solid fa-file-arrow-down"></i> Export JSON Backup</button>
        <label class="btn btn-outline" style="cursor:pointer;">
          <i class="fa-solid fa-file-arrow-up"></i> Import JSON Backup
          <input type="file" id="import-json-input" accept=".json" style="display:none;">
        </label>
      </div>
      <div style="margin-top:1.5rem; padding:1rem; background:rgba(229,62,62,0.08); border:1px solid rgba(229,62,62,0.3); border-radius:12px;">
        <p style="color:#E53E3E; font-size:0.85rem; margin-bottom:0.75rem;"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Danger Zone</strong> — Reset all portfolio data to factory defaults.</p>
        <button class="btn btn-danger btn-sm" onclick="resetPortfolioData()"><i class="fa-solid fa-rotate-left"></i> Reset to Defaults</button>
      </div>
    </div>`;

  // Avatar upload handler
  const avatarUpload = document.getElementById('prof-avatar-upload');
  if (avatarUpload) {
    avatarUpload.addEventListener('change', async () => {
      const file = avatarUpload.files[0];
      if (!file) return;
      
      const saveBtn = document.getElementById('save-avatar-btn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading...`;
      }
      const preview = document.getElementById('prof-avatar-upload-preview');
      if (preview) preview.innerHTML = `<span style="color:var(--accent-primary);"><i class="fa-solid fa-spinner fa-spin"></i> Uploading...</span>`;
      
      try {
        const secureUrl = await uploadToCloudinary(file);
        if (preview) preview.innerHTML = `<img src="${secureUrl}" style="height:80px; width:80px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary); margin-top:0.5rem;">`;
        document.getElementById('profile-avatar-preview').src = secureUrl;
        if (saveBtn) saveBtn.setAttribute('data-url', secureUrl);
      } catch (err) {
        if (preview) preview.innerHTML = `<span style="color:#E53E3E;"><i class="fa-solid fa-triangle-exclamation"></i> Upload failed</span>`;
        showToast("Upload failed", "fa-triangle-exclamation");
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Photo`;
        }
      }
    });
  }
  document.getElementById('save-avatar-btn').onclick = () => {
    const url = document.getElementById('save-avatar-btn').getAttribute('data-url');
    if (!url) { showToast("Please select and upload a photo first.", "fa-triangle-exclamation"); return; }
    legendverseData.owner.avatarUrl = url;
    saveState(); renderAllSections(); showToast("Profile photo updated!");
  };



  // Attach export/import after render
  initJSONExportImport();
}

window.resetPortfolioData = function() {
  if (confirm("Reset ALL portfolio data to defaults? This cannot be undone.")) {
    if (confirm("Are you absolutely sure? All your changes will be lost.")) {
      legendverseData = JSON.parse(JSON.stringify(DEFAULT_LEGENDVERSE_DATA));
      saveState(); renderAllSections();
      showToast("Portfolio reset to defaults.");
      renderProfileCMS(document.getElementById('cms-content-area'));
    }
  }
};

/* ==================== 13. JSON EXPORT & IMPORT ==================== */
function initJSONExportImport() {
  const exportBtn = document.getElementById('export-json-btn');
  const importInput = document.getElementById('import-json-input');

  if (exportBtn) {
    exportBtn.onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(legendverseData, null, 2));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `legendverse_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast("Portfolio backup exported!");
    };
  }

  if (importInput) {
    importInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        if (imported && imported.owner && imported.projects) {
          legendverseData = imported;
          saveState(); renderAllSections();
          showToast("Portfolio restored from JSON backup!");
          renderCMSTab('projects');
        } else { alert("Invalid backup file format."); }
      } catch(err) { alert("Error parsing JSON file."); }
    };
  }
}
