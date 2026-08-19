// ========================================
// ShimmerOS THEME SYSTEM
// ========================================

// Available themes
const THEMES = [
  { id: 'lavender-light', name: 'Lavender', mode: 'light', emoji: '💜' },
  { id:  'lavender-dark', name: 'Lavender', mode: 'dark', emoji: '💜' },
  { id: 'sapphire-light', name: 'Sapphire', mode:  'light', emoji: '💙' },
  { id: 'sapphire-dark', name: 'Sapphire', mode: 'dark', emoji:  '💙' },
  { id: 'forest-light', name: 'Forest', mode: 'light', emoji: '💚' },
  { id:  'forest-dark', name:  'Forest', mode: 'dark', emoji: '💚' },
  { id: 'pookie-light', name: 'Pookie', mode: 'light', emoji: '💕' },
  { id:  'pookie-dark', name: 'Pookie', mode: 'dark', emoji: '💕' },
  { id: 'sunset-light', name: 'Sunset', mode: 'light', emoji: '🌅' },
  { id: 'sunset-dark', name: 'Sunset', mode: 'dark', emoji: '🌅' },
  { id: 'lemon-light', name: 'Lemon', mode: 'light', emoji: '🍋' },
  { id: 'lemon-dark', name: 'Lemon', mode: 'dark', emoji: '🍋' },
  { id:  'diamond-light', name: 'Diamond', mode: 'light', emoji: '💎' },
  { id: 'diamond-dark', name: 'Diamond', mode: 'dark', emoji: '💎' },
  { id: 'purple-light', name: 'Purple Dream', mode: 'light', emoji: '🔮' },
  { id:  'purple-dark', name:  'Purple Dream', mode: 'dark', emoji: '🔮' },
  { id:  'rose-light', name:  'Rose', mode: 'light', emoji: '🌹' },
  { id: 'rose-dark', name: 'Rose', mode: 'dark', emoji: '🌹' },
  { id: 'periwinkle-light', name: 'Periwinkle', mode: 'light', emoji: '🦋' },
  { id:  'periwinkle-dark', name: 'Periwinkle', mode: 'dark', emoji: '🦋' },
];

// Get current theme
function getCurrentTheme() {
  return localStorage.getItem('ShimmerOS_theme') || 'lavender-light';
}

// Set theme
function setTheme(themeId) {
  document. documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('ShimmerOS_theme', themeId);
  
  // Trigger custom event for apps to react
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }));
}

// Toggle dark mode (keep same color, switch light/dark)
function toggleDarkMode() {
  const current = getCurrentTheme();
  const parts = current.split('-');
  const color = parts[0];
  const currentMode = parts[1];
  const newMode = currentMode === 'light' ? 'dark' :  'light';
  const newTheme = `${color}-${newMode}`;
  
  setTheme(newTheme);
}