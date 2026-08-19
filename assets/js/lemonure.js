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

// Load Lemonure data
async function loadLemonureData() {
    try {
        const response = await fetch('../../assets/data/lemonure_data.json');
        const data = await response.json();
        
        // Display feed
        displayFeed(data.feed);
        
        // Display trending
        displayTrending(data.trending_tags);
        
        // Display notifications
        displayNotifications(data.notifications);
        
        // Display wellbeing stats
        displayWellbeing(data.wellbeing);
        
    } catch (error) {
        console.error('Error loading Lemonure data:', error);
        alert('Failed to load feed data! ');
    }
}

// Avatar lookup — add a line per user; anyone not listed gets the hamster
const avatars = {
    '@xaynakive': '../../assets/imgs/userdata/pfp.png',
    '@meow': '../../assets/imgs/userdata/meow.jpg',
    '@breeze': '../../assets/imgs/userdata/hamster.gif',
    '@catcoder': '../../assets/imgs/userdata/catcoder.jpg',
    '@sundayaroundnoon': '../../assets/imgs/userdata/sunday.jpg',
    '@him': '../../assets/imgs/userdata/him.jpg',
};

function displayFeed(posts) {
    const container = document.getElementById('feedContainer');
    container.innerHTML = posts.map(post => {
        const avatarSrc = avatars[post.username] || '../../assets/imgs/userdata/hamster.gif';
        return `
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar"><img src="${avatarSrc}" style="width: 40px; height: 40px; border-radius: 50%;"></div>
                <div class="post-author">
                    <div class="post-name">${post.author}</div>
                    <div class="post-username">${post.username} • ${post.timestamp}</div>
                </div>
            </div>

            <div class="post-content">${post.content}</div>

            ${post.tags ? `
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
                </div>
            ` : ''}

            <div class="post-actions">
                <div class="post-action">
                    <span class="post-action-icon">💙</span>
                    <span>${post.likes}</span>
                </div>
                <div class="post-action">
                    <span class="post-action-icon">💬</span>
                    <span>${post.comments}</span>
                </div>
                <div class="post-action">
                    <span class="post-action-icon">🔄</span>
                </div>
                <div class="post-action">
                    <span class="post-action-icon">📌</span>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function displayTrending(tags) {
    const container = document.getElementById('trendingList');
    container.innerHTML = tags.slice(0, 6).map((tag, index) => `
        <div class="trending-item">
            <div class="trending-tag">${tag}</div>
            <div class="trending-count">${Math.floor(Math.random() * 500) + 100} posts</div>
        </div>
    `).join('');
}

function displayNotifications(notifications) {
    const container = document.getElementById('notificationsList');
    container.innerHTML = notifications.map(notif => `
        <div class="notif-item">
            <span class="notif-user">${notif.user}</span>
            <span class="notif-action"> ${notif.content}</span>
            <span class="notif-time">${notif.time}</span>
        </div>
    `).join('');
}

function displayWellbeing(wellbeing) {
    document.getElementById('timeToday').textContent = wellbeing.time_today;
    document.getElementById('wellbeingStatus').textContent = wellbeing.reminder;
    
    // Calculate percentage
    const timeMinutes = parseTimeToMinutes(wellbeing.time_today);
    const limitMinutes = parseTimeToMinutes(wellbeing.time_limit);
    const percentage = (timeMinutes / limitMinutes) * 100;
    
    document.getElementById('wellbeingBar').style.width = `${Math.min(percentage, 100)}%`;
}

function parseTimeToMinutes(timeString) {
    const matches = timeString.match(/(\d+)\s*hours?\s*(\d+)?\s*minutes?/);
    if (matches) {
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        return hours * 60 + minutes;
    }
    return 0;
}

// Load data on page load
loadLemonureData();