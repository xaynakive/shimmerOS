// Update menu time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute:  '2-digit',
        hour12: true 
    });
    document.getElementById('menuTime').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

let allEntries = [];

// Load memoir data
async function loadMemoirData() {
    try {
        const response = await fetch('../../assets/data/memoir_entries.json');
        const data = await response.json();
        
        allEntries = data.entries;
        
        // Display stats
        displayStats(data.entries);
        
        // Display mood overview
        displayMoodOverview(data.entries);
        
        // Display tags
        displayTags(data.entries);
        
        // Display entries grid
        displayEntries(data.entries);
        
    } catch (error) {
        console.error('Error loading memoir data:', error);
        alert('Failed to load diary entries! ');
    }
}

function displayStats(entries) {
    document.getElementById('totalEntries').textContent = entries.length;
    
    // Count entries this month
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthCount = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === thisMonth && entryDate.getFullYear() === thisYear;
    }).length;
    
    document.getElementById('thisMonth').textContent = thisMonthCount;
}

function displayMoodOverview(entries) {
    const container = document.getElementById('moodList');
    const moodEmojis = {
        'anxious': '😰',
        'accomplished': '✨',
        'reflective': '🤔',
        'hopeful':  '🌟',
        'exhausted': '😴',
        'chaotic': '🌪️'
    };
    
    container.innerHTML = entries.slice(0, 5).map(entry => `
        <div class="mood-item">
            <span class="mood-emoji">${moodEmojis[entry.mood.split(' ')[0]] || '💭'}</span>
            <span class="mood-text">${entry.mood}</span>
        </div>
    `).join('');
}

function displayTags(entries) {
    const allTags = new Set();
    entries.forEach(entry => {
        entry.tags.forEach(tag => allTags.add(tag));
    });
    
    const container = document.getElementById('tagsContainer');
    container.innerHTML = Array.from(allTags).map(tag => `
        <span class="tag-item" onclick="filterByTag('${tag}')">${tag}</span>
    `).join('');
}

function displayEntries(entries) {
    const container = document.getElementById('entriesGrid');
    container.innerHTML = entries.map(entry => `
        <div class="entry-card" onclick="showEntryDetail(${entry.id})">
            <div class="entry-header">
                <span class="entry-date">${formatDate(entry.date)}</span>
                <span class="entry-mood-badge">${entry.mood}</span>
            </div>
            
            <h4 class="entry-title">${entry.title}</h4>
            
            <p class="entry-preview">${entry.content}</p>
            
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="entry-tag">#${tag}</span>`).join('')}
            </div>
            
            <div class="entry-feelings">
                ${Object.entries(entry.feelings).slice(0, 4).map(([feeling, value]) => `
                    <div class="feeling-item">
                        <span>${feeling}</span>
                        <div class="feeling-bar">
                            <div class="feeling-fill" style="width: ${value * 10}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function showEntryDetail(entryId) {
    const entry = allEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    const panel = document.getElementById('detailPanel');
    panel.innerHTML = `
        <div class="detail-content">
            <div class="detail-header">
                <div class="detail-date-mood">
                    <span class="detail-date">${formatDate(entry.date)} • ${entry.time}</span>
                    <span class="detail-mood">${entry.mood}</span>
                </div>
                <h2 class="detail-title">${entry.title}</h2>
            </div>
            
            <div class="detail-body">${entry.content}</div>
            
            <div class="detail-tags">
                ${entry.tags.map(tag => `<span class="detail-tag">#${tag}</span>`).join('')}
            </div>
            
            <div class="detail-feelings">
                <h4 class="feelings-title">emotional breakdown</h4>
                <div class="feelings-grid">
                    ${Object.entries(entry.feelings).map(([feeling, value]) => `
                        <div class="feeling-row">
                            <span class="feeling-name">${feeling}</span>
                            <div class="feeling-value">
                                <div class="feeling-progress">
                                    <div class="feeling-progress-fill" style="width: ${value * 10}%"></div>
                                </div>
                                <span class="feeling-number">${value}/10</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Mobile:  show panel
    panel.classList.add('active');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function filterByTag(tag) {
    const filtered = allEntries.filter(entry => entry.tags.includes(tag));
    displayEntries(filtered);
}

// Mood filter
document.addEventListener('DOMContentLoaded', () => {
    const moodFilter = document.getElementById('moodFilter');
    if (moodFilter) {
        moodFilter.addEventListener('change', (e) => {
            if (e.target.value === 'all') {
                displayEntries(allEntries);
            } else {
                const filtered = allEntries.filter(entry => 
                    entry.mood.toLowerCase().includes(e.target.value)
                );
                displayEntries(filtered);
            }
        });
    }
});

// Load data on page load
loadMemoirData();