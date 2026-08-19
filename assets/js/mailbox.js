// ========================================
// LOVE LETTERS APP - ShimmerOS (THEME-AWARE)
// ========================================

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const writeView = document.getElementById('writeView');
const readView = document.getElementById('readView');
const newLetterBtn = document.getElementById('newLetterBtn');
const savedLettersList = document.getElementById('savedLettersList');
const lettersCount = document.getElementById('lettersCount');

// Write View Elements
const letterPaper = document.getElementById('letterPaper');
const letterRecipient = document.getElementById('letterRecipient');
const letterDate = document.getElementById('letterDate');
const letterContent = document.getElementById('letterContent');
const letterSignature = document.getElementById('letterSignature');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Read View Elements
const envelopeContainer = document.getElementById('envelopeContainer');
const openedLetter = document.getElementById('openedLetter');
const envelopeTo = document.getElementById('envelopeTo');
const sealLetter = document.getElementById('sealLetter');
const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
const letterRecipientRead = document.getElementById('letterRecipientRead');
const letterDateRead = document.getElementById('letterDateRead');
const letterContentRead = document.getElementById('letterContentRead');
const letterSignatureRead = document.getElementById('letterSignatureRead');
const letterPaperRead = document.getElementById('letterPaperRead');
const deleteBtn = document.getElementById('deleteBtn');
const closeLetterBtn = document.getElementById('closeLetterBtn');

// State
let letters = [];
let currentLetterId = null;
let currentTheme = 'vintage';

// ========================================
// GET CSS VARIABLE (FETCH FROM THEME)
// ========================================
function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

// ========================================
// GET CURRENT THEME COLORS
// ========================================
function getThemeColors() {
  return {
    primary: getCSSVariable('--color-primary'),
    primaryLight: getCSSVariable('--color-primary-light'),
    primaryLighter: getCSSVariable('--color-primary-lighter'),
    primaryDark: getCSSVariable('--color-primary-dark'),
    bgStart: getCSSVariable('--bg-gradient-start'),
    bgMid: getCSSVariable('--bg-gradient-mid'),
    bgEnd: getCSSVariable('--bg-gradient-end'),
    widgetBg: getCSSVariable('--widget-bg'),
    widgetBorder: getCSSVariable('--widget-border'),
    textDark: getCSSVariable('--text-dark'),
    textDarkMuted: getCSSVariable('--text-dark-muted')
  };
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
  loadLetters();
  updateLettersList();
  updateTime();
  setInterval(updateTime, 1000);
  attachEventListeners();
  setCurrentDate();
  
  // Listen for theme changes
  window.addEventListener('themeChanged', handleThemeChange);
}

// ========================================
// HANDLE THEME CHANGE
// ========================================
function handleThemeChange(event) {
  console.log('Theme changed to:', event.detail.theme);
  
  // Refresh letter list with new colors
  updateLettersList();
  
  // Update current views with new colors
  if (! readView.classList.contains('hidden')) {
    // Refresh read view with new theme colors
    const letter = letters.find(l => l.id === currentLetterId);
    if (letter) {
      applyThemeToReadView(letter);
    }
  }
}

// ========================================
// UPDATE TIME IN MENU BAR
// ========================================
function updateTime() {
  const now = new Date();
  const options = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  };
  const timeString = now.toLocaleString('en-US', options);
  const menuTime = document.getElementById('menuTime');
  if (menuTime) {
    menuTime.textContent = timeString;
  }
}

// ========================================
// SET CURRENT DATE
// ========================================
function setCurrentDate() {
  const now = new Date();
  const options = { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  };
  const dateString = now.toLocaleDateString('en-US', options);
  letterDate.textContent = dateString;
}

// ========================================
// LOCAL STORAGE FUNCTIONS
// ========================================
function loadLetters() {
  const stored = localStorage.getItem('ShimmerOS_loveLetters');
  if (stored) {
    letters = JSON.parse(stored);
  }
}

function saveLetters() {
  localStorage.setItem('ShimmerOS_loveLetters', JSON.stringify(letters));
}

// ========================================
// UPDATE LETTERS LIST IN SIDEBAR
// ========================================
function updateLettersList() {
  savedLettersList.innerHTML = '';
  
  if (letters.length === 0) {
    lettersCount.textContent = 'No letters yet';
  } else {
    lettersCount.textContent = `${letters.length} ${letters.length === 1 ?  'letter' : 'letters'} saved`;
  }

  // Sort by date (newest first)
  const sortedLetters = [...letters].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  sortedLetters.forEach(letter => {
    const letterItem = document.createElement('div');
    letterItem.className = 'letter-item';
    letterItem.onclick = () => openLetter(letter.id);

    const to = document.createElement('div');
    to.className = 'letter-item-to';
    to.textContent = letter.recipient || 'Untitled Letter';

    const date = document.createElement('div');
    date.className = 'letter-item-date';
    date.textContent = formatDate(letter.timestamp);

    const preview = document.createElement('div');
    preview.className = 'letter-item-preview';
    preview.textContent = letter.content.substring(0, 50) + (letter.content.length > 50 ? '...' : '');

    letterItem.appendChild(to);
    letterItem.appendChild(date);
    letterItem.appendChild(preview);
    savedLettersList.appendChild(letterItem);
  });
}

// ========================================
// FORMAT DATE
// ========================================
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ========================================
// SHOW/HIDE VIEWS
// ========================================
function showWelcome() {
  welcomeScreen.classList.remove('hidden');
  writeView.classList.add('hidden');
  readView.classList.add('hidden');
}

function showWriteView() {
  welcomeScreen.classList.add('hidden');
  writeView.classList.remove('hidden');
  readView.classList.add('hidden');
  clearWriteForm();
  setCurrentDate();
}

function showReadView() {
  welcomeScreen.classList.add('hidden');
  writeView.classList.add('hidden');
  readView.classList.remove('hidden');
}

// ========================================
// CLEAR WRITE FORM
// ========================================
function clearWriteForm() {
  letterRecipient.value = '';
  letterContent.value = '';
  letterSignature.value = '';
  currentTheme = 'vintage';
  letterPaper.className = 'letter-paper vintage';
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.theme === 'vintage') {
      btn.classList.add('active');
    }
  });
}

// ========================================
// SAVE LETTER
// ========================================
function saveLetter() {
  const recipient = letterRecipient.value.trim();
  const content = letterContent.value.trim();
  const signature = letterSignature.value.trim();

  if (!content) {
    alert('Please write something in your letter!  💌');
    return;
  }

  const letter = {
    id: Date.now(),
    recipient: recipient || 'My Dearest',
    content: content,
    signature: signature || 'Anonymous',
    theme: currentTheme,
    date: letterDate.textContent,
    timestamp: new Date().toISOString()
  };

  letters.push(letter);
  saveLetters();
  updateLettersList();
  
  // Get current theme colors for success animation
  const colors = getThemeColors();
  
  // Show success animation
  saveBtn.textContent = '✓ Saved! ';
  saveBtn.style.background = `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`;
  
  setTimeout(() => {
    saveBtn.innerHTML = '<span class="btn-icon">💌</span> Seal & Save Letter';
    saveBtn.style.background = '';
    showWelcome();
  }, 1000);
}

// ========================================
// OPEN LETTER FOR READING
// ========================================
function openLetter(id) {
  const letter = letters.find(l => l.id === id);
  if (!letter) return;

  currentLetterId = id;
  showReadView();

  // Set envelope content
  envelopeTo.textContent = `To: ${letter.recipient}`;
  sealLetter.textContent = letter.signature.charAt(0).toUpperCase();

  // Set opened letter content
  letterRecipientRead.textContent = `To: ${letter.recipient}`;
  letterDateRead.textContent = letter.date;
  letterContentRead.textContent = letter.content;
  letterSignatureRead.textContent = letter.signature;

  // Apply theme to opened letter
  applyThemeToReadView(letter);

  // Reset to envelope view
  envelopeContainer.classList.remove('hidden');
  openedLetter.classList.add('hidden');
  document.querySelector('.envelope').classList.remove('opening');
}

// ========================================
// APPLY THEME TO READ VIEW (WITH CSS VARIABLES)
// ========================================
function applyThemeToReadView(letter) {
  const colors = getThemeColors();
  
  letterPaperRead.className = `letter-paper-read ${letter.theme}`;
  
  // Use theme colors dynamically
  const themeBackgrounds = {
    vintage: `linear-gradient(to bottom, #fef9f0 0%, #fef5eb 100%)`,
    floral: `linear-gradient(to bottom, #f8f5ff 0%, #f0ebff 100%)`,
    lavender: `linear-gradient(to bottom, ${colors.bgEnd} 0%, rgba(214, 216, 255, 0.3) 100%)`,
    rose: `linear-gradient(to bottom, #fff5f8 0%, rgba(198, 201, 255, 0.2) 100%)`
  };
  
  const themeBorders = {
    vintage:  `2px solid ${colors.primaryLight}`,
    floral: `2px solid ${colors.primaryLighter}`,
    lavender: `2px solid ${colors.primary}`,
    rose: `2px solid ${colors.primaryLight}`
  };
  
  letterPaperRead.style.background = themeBackgrounds[letter.theme] || themeBackgrounds.vintage;
  letterPaperRead.style.border = themeBorders[letter.theme] || themeBorders.vintage;
}

// ========================================
// GET THEME STYLES (DEPRECATED - USING CSS VARS NOW)
// ========================================
function getThemeBackground(theme) {
  const colors = getThemeColors();
  
  const themes = {
    vintage: 'linear-gradient(to bottom, #fef9f0 0%, #fef5eb 100%)',
    floral: 'linear-gradient(to bottom, #f8f5ff 0%, #f0ebff 100%)',
    lavender: `linear-gradient(to bottom, ${colors.bgEnd} 0%, rgba(214, 216, 255, 0.3) 100%)`,
    rose: 'linear-gradient(to bottom, #fff5f8 0%, rgba(198, 201, 255, 0.2) 100%)'
  };
  return themes[theme] || themes.vintage;
}

function getThemeBorder(theme) {
  const colors = getThemeColors();
  
  const borders = {
    vintage: `2px solid ${colors.primaryLight}`,
    floral: `2px solid ${colors.primaryLighter}`,
    lavender: `2px solid ${colors.primary}`,
    rose: `2px solid ${colors.primaryLight}`
  };
  return borders[theme] || borders.vintage;
}

// ========================================
// OPEN ENVELOPE ANIMATION
// ========================================
function openEnvelope() {
  const envelope = document.querySelector('.envelope');
  envelope.classList.add('opening');

  setTimeout(() => {
    envelopeContainer.classList.add('hidden');
    openedLetter.classList.remove('hidden');
  }, 600);
}

// ========================================
// DELETE LETTER
// ========================================
function deleteLetter() {
  if (!currentLetterId) return;

  const confirmed = confirm('Are you sure you want to delete this letter?  This cannot be undone.💔');
  
  if (confirmed) {
    letters = letters.filter(l => l.id !== currentLetterId);
    saveLetters();
    updateLettersList();
    currentLetterId = null;
    
    if (letters.length === 0) {
      showWelcome();
    } else {
      showWelcome();
    }
  }
}

// ========================================
// CHANGE PAPER THEME
// ========================================
function changeTheme(theme) {
  currentTheme = theme;
  letterPaper.className = `letter-paper ${theme}`;
  
  // Update active button
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    }
  });
}

// ========================================
// EVENT LISTENERS
// ========================================
function attachEventListeners() {
  // New Letter Button
  newLetterBtn.addEventListener('click', showWriteView);

  // Save Button
  saveBtn.addEventListener('click', saveLetter);

  // Cancel Button
  cancelBtn.addEventListener('click', () => {
    if (letterContent.value.trim()) {
      const confirmed = confirm('Are you sure?   Your unsaved letter will be lost.💔');
      if (confirmed) {
        showWelcome();
      }
    } else {
      showWelcome();
    }
  });

  // Theme Buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeTheme(btn.dataset.theme);
    });
  });

  // Open Envelope Button
  openEnvelopeBtn.addEventListener('click', openEnvelope);

  // Delete Button
  deleteBtn.addEventListener('click', deleteLetter);

  // Close Letter Button
  closeLetterBtn.addEventListener('click', () => {
    showWelcome();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (! writeView.classList.contains('hidden')) {
        saveLetter();
      }
    }
    
    // Escape to cancel/close
    if (e.key === 'Escape') {
      if (!writeView.classList.contains('hidden')) {
        cancelBtn.click();
      } else if (! readView.classList.contains('hidden')) {
        closeLetterBtn.click();
      }
    }
  });

  // Auto-save draft every 30 seconds (optional)
  setInterval(() => {
    if (! writeView.classList.contains('hidden') && letterContent.value.trim()) {
      console.log('Auto-saving draft...');
      // You could implement draft saving here
    }
  }, 30000);
}

// ========================================
// START APP
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Show welcome or write view based on letters
  if (letters.length === 0) {
    showWelcome();
  } else {
    showWelcome();
  }
});