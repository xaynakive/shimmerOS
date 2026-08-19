// ========================================
// LOGIN - ShimmerOS
// ========================================

const passwordInput = document.getElementById('password');
const CORRECT_PASSWORD = 'hazeycat'; // Change this!

function checkLogin() {
  const password = passwordInput.value;
  
    if (password === CORRECT_PASSWORD) {
    loginStatus.textContent = 'Welcome back.';
    window.location.href = '../home/index.html';
  } else {
    const container = document.querySelector('.password-container');
    container.classList.add('shake');
    passwordInput.value = '';
    loginStatus.textContent = 'That password did not match. Use the hint if you need it.';
    passwordInput.setAttribute('aria-invalid', 'true');
    passwordInput.focus();
    
    setTimeout(() => {
      container.classList.remove('shake');
    }, 400);
  }
}

// Enter key to login
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkLogin();
  }
});

// Auto-focus
setTimeout(() => {
  passwordInput.focus();
}, 300);

// Hint button (optional)
const hintBtn = document.querySelector('.hint-btn');
if (hintBtn) {
  hintBtn.onclick = () => {
    loginStatus.textContent = 'Hint: the demo password is hazeycat.';
    passwordInput.focus();
  };
}