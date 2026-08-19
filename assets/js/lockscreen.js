function updateClock() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('dateDisplay').textContent = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

function unlock() {
  window.location.href = 'login/index.html';
}

updateClock();
setInterval(updateClock, 1000);

document.getElementById('unlockButton').addEventListener('click', unlock);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    unlock();
  }
});