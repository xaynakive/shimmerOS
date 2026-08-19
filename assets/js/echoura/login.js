// Update menu time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute:  '2-digit',
        hour12: true 
    });
    const timeEl = document.getElementById('menuTime');
    if (timeEl) timeEl.textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    
    // Correct credentials
    const CORRECT_ID = 'AR-08-26-42069';
    const CORRECT_PASS = 'catcatcat';
    
    if (studentId === CORRECT_ID && password === CORRECT_PASS) {
        // Store session
        localStorage.setItem('echoura_logged_in', 'true');
        localStorage.setItem('echoura_student_id', studentId);
        
        // Success animation
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.textContent = 'logging in...';
        loginBtn.style.background = 'var(--color-primary-dark)';
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    } else {
        // Error
        alert('❌ invalid credentials!   \n\nhint: check the form hint below');
        
        // Shake animation
        const form = document.querySelector('.login-form');
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform:  translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
