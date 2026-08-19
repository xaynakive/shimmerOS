// Update menu time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour:  'numeric', 
        minute:  '2-digit',
        hour12: true 
    });
    const timeEl = document.getElementById('menuTime');
    if (timeEl) timeEl.textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// ===== LOAD CONTEXT DATA FOR SIDEBAR =====
let contextData = {
    catLogs:   null,
    memoirEntries: null,
    lemonureData: null,
    Echoura: null,
    userProfile: null
};

async function loadAllContext() {
    console.log('🔄 Loading context data for sidebar...');
    
    try {
        const [catLogs, memoir, lemonure, Echoura, profile] = await Promise.all([
            fetch('../../assets/data/cat_logs.json').then(r => r.json()).catch(() => null),
            fetch('../../assets/data/memoir_entries.json').then(r => r.json()).catch(() => null),
            fetch('../../assets/data/lemonure_data.json').then(r => r.json()).catch(() => null),
            fetch('../../assets/data/echoura_assignments.json').then(r => r.json()).catch(() => null),
            fetch('../../assets/data/user_profile.json').then(r => r.json()).catch(() => null)
        ]);
        
        contextData = { 
            catLogs, 
            memoirEntries: memoir, 
            lemonureData: lemonure, 
            Echoura, 
            userProfile: profile 
        };
        
        console.log('✅ Context loaded');
        updateContextStats();
        
    } catch (error) {
        console.error('❌ Error loading context:', error);
    }
}

function updateContextStats() {
    const catLogsCount = contextData.catLogs?.logs?.length || 0;
    const entriesCount = contextData.memoirEntries?.entries?.length || 0;
    const postsCount = contextData.lemonureData?.feed?.length || 0;
    
    let assignmentsCount = 0;
    if (contextData.Echoura?.courses) {
        contextData.Echoura.courses.forEach(course => {
            assignmentsCount += course.assignments?.length || 0;
        });
    }
    
    const logsEl = document.getElementById('contextLogs');
    const entriesEl = document.getElementById('contextEntries');
    const assignmentsEl = document.getElementById('contextAssignments');
    const postsEl = document.getElementById('contextPosts');
    
    if (logsEl) logsEl.textContent = `${catLogsCount} days`;
    if (entriesEl) entriesEl.textContent = `${entriesCount} entries`;
    if (assignmentsEl) assignmentsEl.textContent = `${assignmentsCount} total`;
    if (postsEl) postsEl.textContent = `${postsCount} posts`;
}

// Initialize
loadAllContext();

console.log('🤖 Breeze AI ready with Botpress iframe!   💙✨');