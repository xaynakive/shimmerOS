// ================================
// HOMESCREEN.JS - ShimmerOS
// ================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// ================================
// TIME & DATE FUNCTIONS
// ================================

function updateMenuTime() {
    const now = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' };
    const timeString = now.toLocaleDateString('en-US', options);
    document.getElementById('menuTime').textContent = timeString;
}

// ================================
// CALENDAR FUNCTIONS
// ================================

function generateCalendar(month, year) {
    const now = new Date();
    const today = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    
    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    
    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    const startDay = firstDay === 0 ? 6 :  firstDay - 1;
    
    for (let i = startDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(day);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        
        if (i === today && month === todayMonth && year === todayYear) {
            day.classList.add('today');
        }
        
        day.textContent = i;
        calendarDays.appendChild(day);
    }
    
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarDays.appendChild(day);
    }
}

function initCalendarNav() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }
}

// ================================
// WEATHER FUNCTIONS
// ================================

const swissCities = {
    'Zürich': { lat:  47.3769, lon: 8.5417 },
    'Geneva': { lat: 46.2044, lon: 6.1432 },
    'Bern': { lat: 46.9480, lon: 7.4474 },
    'Basel': { lat: 47.5596, lon: 7.5886 },
    'Lugano': { lat: 46.0569, lon: 8.9511 },
    'Lausanne': { lat: 46.5197, lon: 6.6323 },
    'St.Gallen': { lat: 47.4245, lon: 9.3767 },
    'Lucerne': { lat: 46.8182, lon: 8.2275 }
};

let currentCity = 'Zürich';

function getWeatherEmoji(code) {
    const weatherCodes = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '❄️', 77: '🌨️',
        80: '🌦️', 81: '🌧️', 82: '⛈️',
        85: '🌨️', 86: '❄️',
        95: '⛈️', 96: '⛈️', 99: '⛈️'
    };
    return weatherCodes[code] || '☁️';
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
        45: 'Foggy', 48: 'Foggy',
        51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
        61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
        71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow',
        80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Rain',
        85: 'Snow Showers', 86: 'Heavy Snow',
        95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
    };
    return descriptions[code] || 'Cloudy';
}

async function fetchWeather(city = currentCity) {
    try {
        const coords = swissCities[city];
        if (!coords) return;
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Zurich&forecast_days=1`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        updateCurrentWeather(city, data);
        updateHourlyForecast(data);
        
    } catch (error) {
        console.error('Weather fetch failed:', error);
    }
}

function updateCurrentWeather(city, data) {
    const locationEl = document.getElementById('weatherLocation');
    const tempEl = document.getElementById('weatherTemp');
    const iconEl = document.getElementById('weatherIcon');
    const conditionEl = document.getElementById('weatherCondition');
    const highEl = document.getElementById('weatherHigh');
    const lowEl = document.getElementById('weatherLow');
    
    if (! locationEl || !tempEl) return;
    
    locationEl.textContent = "Shimmerwhere";
    tempEl.textContent = `${Math.round(data.current.temperature_2m)}°`;
    iconEl.textContent = getWeatherEmoji(data.current.weather_code);
    conditionEl.textContent = getWeatherDescription(data.current.weather_code);
    highEl.textContent = Math.round(data.daily.temperature_2m_max[0]);
    lowEl.textContent = Math.round(data.daily.temperature_2m_min[0]);
}

function updateHourlyForecast(data) {
    const hourlyContainer = document.getElementById('weatherHourly');
    if (!hourlyContainer) return;
    
    hourlyContainer.innerHTML = '';
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < 6; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex >= 24) break;
        
        const temp = Math.round(data.hourly.temperature_2m[hourIndex]);
        const weatherCode = data.hourly.weather_code[hourIndex];
        const emoji = getWeatherEmoji(weatherCode);
        const timeLabel = i === 0 ? 'NOW' : hourIndex.toString().padStart(2, '0');
        
        const hourDiv = document.createElement('div');
        hourDiv.className = 'weather-hour';
        hourDiv.innerHTML = `
            <div class="hour-time">${timeLabel}</div>
            <div class="hour-icon">${emoji}</div>
            <div class="hour-temp">${temp}°</div>
        `;
        hourlyContainer.appendChild(hourDiv);
    }
}

// ========================================
// THEME SYSTEM
// ========================================

const THEME_NAMES = {
    'lavender-light': 'Lavender',
    'lavender-dark': 'Lavender Dark',
    'rose-light': 'Rose',
    'rose-dark': 'Rose Dark',
    'blush-light': 'Blush',
    'blush-dark': 'Blush Dark',
    'pearl-light': 'Pearl',
    'pearl-dark': 'Pearl Dark',
    'sky-light': 'Sky',
    'sky-dark': 'Sky Dark',
    'sage-light': 'Sage',
    'sage-dark': 'Sage Dark',
    'void-light': 'Void',
    'void-dark': 'Void Dark'
};

// ========================================
// UPDATE IMAGES WHEN THEME CHANGES
// ========================================
function updateThemeImages(themeId) {
    const [color] = themeId.split('-');
    const themePath = `../assets/imgs/userdata/themes/${color}`;
    const fallbackPath = `../assets/imgs/userdata/themes/lavender`;
    
    function loadImageWithFallback(imgElement, basePath, filename) {
        const formats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
        let formatIndex = 0;
        
        function tryNextFormat() {
            if (formatIndex >= formats.length) {
                if (basePath !== fallbackPath) {
                    loadImageWithFallback(imgElement, fallbackPath, filename);
                }
                return;
            }
            
            const format = formats[formatIndex];
            const newSrc = `${basePath}/${filename}.${format}`;
            
            const testImg = new Image();
            testImg.onload = () => {
                imgElement.src = newSrc;
            };
            testImg.onerror = () => {
                formatIndex++;
                tryNextFormat();
            };
            testImg.src = newSrc;
        }
        
        tryNextFormat();
    }
    
    const polaroid1 = document.querySelector('.polaroid:nth-child(1) img');
    if (polaroid1) loadImageWithFallback(polaroid1, themePath, 'p1');
    
    const polaroid2 = document.querySelector('.polaroid:nth-child(2) img');
    if (polaroid2) loadImageWithFallback(polaroid2, themePath, 'p2');
    
    const photoWidget = document.querySelector('.photo-widget-large img');
    if (photoWidget) loadImageWithFallback(photoWidget, themePath, 'sq');
    
    const topDecor = document.querySelector('.flower-cluster:nth-child(2) img');
    if (topDecor) loadImageWithFallback(topDecor, themePath, 'top');
    
    const bottomDecor = document.querySelector('.flower-cluster:nth-child(3) img');
    if (bottomDecor) loadImageWithFallback(bottomDecor, themePath, 'bottom');
}

// ========================================
// UPDATE VINYL ICONS WHEN THEME CHANGES
// ========================================
function updateVinylIcons(themeId) {
    const [color] = themeId.split('-');
    
    const themeVinyls = [
        { id: 'icon-cats-perspective', filename: `${color}_vinyl.png` },
        { id: 'icon-calculator', filename: `${color}_vinyl.png` },
        { id: 'icon-Echoura', filename: `${color}_vinyl.png` },
        { id: 'icon-lemonure', filename: `${color}_vinyl.png` },
        { id: 'icon-mailbox', filename: `${color}_vinyl.png` },
        { id: 'icon-scrapbook', filename: `${color}_vinyl.png` },
        { id: 'dock-breeze', filename: `${color}_vinyl.png` },
        { id: 'dock-memoir', filename: `${color}_vinyl.png` },
        { id: 'dock-scrapbook', filename: `${color}_vinyl.png` },
        { id: 'dock-lemonure', filename: `${color}_vinyl.png` },
        { id: 'dock-home', filename:  `${color}_home.png` }
    ];
    
    const fixedVinyls = [
        { id:  'dock-settings', path: '../assets/imgs/home-icons/settings.png' },
        { id: 'dock-lock', path: '../assets/imgs/home-icons/lock.png' }
    ];
    
    const vinylPath = `../assets/imgs/userdata/themes/${color}`;
    
    themeVinyls.forEach(vinyl => {
        const imgElement = document.getElementById(vinyl.id);
        if (imgElement) {
            imgElement.src = `${vinylPath}/${vinyl. filename}`;
        }
    });
    
    fixedVinyls.forEach(vinyl => {
        const imgElement = document. getElementById(vinyl.id);
        if (imgElement) {
            imgElement.src = vinyl.path;
        }
    });
}

function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ShimmerOS_theme', themeId);
    
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.theme === themeId) {
            card.classList.add('active');
        }
    });
    
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.checked = themeId.includes('-dark');
    }
    
    const themeName = document.getElementById('currentThemeName');
    if (themeName) {
        themeName.textContent = THEME_NAMES[themeId] || themeId;
    }
    
    updateThemeImages(themeId);
    updateVinylIcons(themeId);
}

function closeModal() {
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    updateMenuTime();
    generateCalendar(currentMonth, currentYear);
    initCalendarNav();
    fetchWeather(currentCity);
    
    const savedTheme = localStorage.getItem('ShimmerOS_theme') || 'lavender-light';
    applyTheme(savedTheme);
    
    setInterval(updateMenuTime, 60000);
    setInterval(() => fetchWeather(currentCity), 10 * 60 * 1000);
    
    const closeBtn = document.getElementById('closeSettings');
    if (closeBtn) closeBtn.onclick = closeModal;
    
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };
    }
    
    document.querySelectorAll('.theme-card').forEach(card => {
        card.onclick = () => applyTheme(card.dataset.theme);
    });
    
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.onchange = () => {
            const currentTheme = localStorage.getItem('ShimmerOS_theme') || 'lavender-light';
            const [color] = currentTheme.split('-');
            const newMode = darkToggle.checked ? 'dark' : 'light';
            applyTheme(`${color}-${newMode}`);
        };
    }
    
    document.onkeydown = (e) => {
        if (e.key === 'Escape') closeModal();
    };
});