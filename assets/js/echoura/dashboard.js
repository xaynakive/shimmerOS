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

// Check if logged in
function checkAuth() {
    const loggedIn = localStorage.getItem('echoura_logged_in');
    if (! loggedIn) {
        window.location.href = 'index.html';
    }
}
checkAuth();

// Logout
function logout() {
    localStorage.removeItem('echoura_logged_in');
    localStorage.removeItem('echoura_student_id');
    window.location.href = 'index.html';
}

// Section navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`section-${sectionName}`).classList.add('active');
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
}

// Load dashboard data
let coursesData = [];
let allAssignments = [];

async function loadDashboardData() {
    try {
        const response = await fetch('../../assets/data/echoura_assignments.json');
        const data = await response.json();
        
        coursesData = data.courses;
        
        // Flatten all assignments
        allAssignments = [];
        data.courses.forEach(course => {
            course.assignments.forEach(assignment => {
                allAssignments.push({
                    ...assignment,
                    courseName: course.name,
                    courseCode: course.code
                });
            });
        });
        
        // Display overview
        displayOverview(data);
        
        // Display courses
        displayCourses(data.courses);
        
        // Display all assignments
        displayAllAssignments(allAssignments);
        
        // Display grades
        displayGrades(data.courses);
        
        // Display schedule (mock data for now)
        displaySchedule();
        
    } catch (error) {
        console.error('Error loading Echoura data:', error);
        alert('Failed to load dashboard data! ');
    }
}

function displayOverview(data) {
    // Stats
    document.getElementById('totalCourses').textContent = data.courses.length;
    document.getElementById('pendingAssignments').textContent = data.overall_stats.in_progress + data.overall_stats.not_started;
    document.getElementById('completedAssignments').textContent = data.overall_stats.completed;
    
    // Calculate average grade (only completed assignments)
    let totalGrade = 0;
    let gradeCount = 0;
    data.courses.forEach(course => {
        course.assignments.forEach(assignment => {
            if (assignment.grade && assignment.max_grade) {
                totalGrade += (assignment.grade / assignment.max_grade) * 100;
                gradeCount++;
            }
        });
    });
    const avgGrade = gradeCount > 0 ? Math.round(totalGrade / gradeCount) : 0;
    document.getElementById('avgGrade').textContent = avgGrade > 0 ? `${avgGrade}%` : 'N/A';
    
    // Urgent assignments (not started or due soon)
    const urgent = allAssignments.filter(a => a.status === 'not_started' || a.stress_level >= 9);
    displayUrgentAssignments(urgent);
    
    // Recent activity
    displayRecentActivity(data.courses);
}

function displayUrgentAssignments(assignments) {
    const container = document.getElementById('urgentAssignments');
    
    if (assignments.length === 0) {
        container.innerHTML = '<p class="loading-text">no urgent assignments!   great job!  🎉</p>';
        return;
    }
    
    container.innerHTML = assignments.map(assignment => `
        <div class="assignment-item">
            <div class="assignment-info">
                <h4 class="assignment-title">${assignment.title}</h4>
                <p class="assignment-meta">${assignment.courseCode} • ${assignment.status}</p>
            </div>
            <div class="assignment-due">
                due: ${formatDate(assignment.due_date)}
            </div>
        </div>
    `).join('');
}

function displayRecentActivity(courses) {
    const container = document.getElementById('activityTimeline');
    
    const activities = [];
    courses.forEach(course => {
        course.assignments.forEach(assignment => {
            if (assignment.status === 'completed') {
                activities.push({
                    type: 'completed',
                    title: `Completed ${assignment.title}`,
                    course: course.code,
                    date: assignment.due_date,
                    grade: assignment.grade ?  `${assignment.grade}/${assignment.max_grade}` : null
                });
            } else if (assignment.status === 'in_progress') {
                activities.push({
                    type: 'progress',
                    title: `Working on ${assignment.title}`,
                    course: course.code,
                    completion: assignment.completion
                });
            }
        });
    });
    
    container.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.type === 'completed' ? '✅' : '📝'}</div>
            <div class="activity-content">
                <p class="activity-title">${activity.title}</p>
                <p class="activity-meta">${activity.course}${activity.grade ? ` • Grade: ${activity.grade}` : ''}</p>
                ${activity.completion ? `<div class="activity-progress">${activity.completion}% complete</div>` : ''}
            </div>
        </div>
    `).join('') || '<p class="loading-text">no recent activity</p>';
}

function displayCourses(courses) {
    const container = document.getElementById('coursesGrid');
    
    container.innerHTML = courses.map(course => {
        const totalAssignments = course.assignments.length;
        const completedAssignments = course.assignments.filter(a => a.status === 'completed').length;
        
        return `
            <div class="course-card">
                <div class="course-header">
                    <span class="course-code">${course.code}</span>
                    <span class="course-status">active</span>
                </div>
                <h4 class="course-name">${course.name}</h4>
                <div class="course-stats">
                    <span>📝 ${totalAssignments} assignments</span>
                    <span>✅ ${completedAssignments} completed</span>
                </div>
            </div>
        `;
    }).join('');
}

function displayAllAssignments(assignments) {
    const container = document.getElementById('assignmentsDetailed');
    
    container.innerHTML = assignments.map(assignment => {
        const statusColor = {
            'completed': 'var(--color-primary)',
            'in_progress': '#ffa500',
            'not_started': '#ff4444'
        };
        
        return `
            <div class="assignment-card" style="border-left-color: ${statusColor[assignment.status]}">
                <div class="assignment-header">
                    <div>
                        <h4 class="assignment-title">${assignment.title}</h4>
                        <p class="assignment-course">${assignment.courseCode} - ${assignment.courseName}</p>
                    </div>
                    <div class="assignment-status-badge" style="background: ${statusColor[assignment.status]}">
                        ${assignment.status.replace('_', ' ')}
                    </div>
                </div>
                
                <div class="assignment-details">
                    <div class="detail-row">
                        <span class="detail-label">due date:</span>
                        <span class="detail-value">${formatDate(assignment.due_date)}</span>
                    </div>
                    ${assignment.completion !== undefined ? `
                        <div class="detail-row">
                            <span class="detail-label">progress:</span>
                            <span class="detail-value">${assignment.completion}%</span>
                        </div>
                    ` : ''}
                    ${assignment.grade ?  `
                        <div class="detail-row">
                            <span class="detail-label">grade:</span>
                            <span class="detail-value">${assignment.grade}/${assignment.max_grade}</span>
                        </div>
                    ` : ''}
                    ${assignment.time_spent ? `
                        <div class="detail-row">
                            <span class="detail-label">time spent:</span>
                            <span class="detail-value">${assignment.time_spent}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${assignment.notes ? `
                    <div class="assignment-notes">
                        <strong>notes:</strong> ${assignment.notes}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function displayGrades(courses) {
    const container = document.getElementById('gradesContainer');
    
    container.innerHTML = courses.map(course => {
        const completedAssignments = course.assignments.filter(a => a.status === 'completed' && a.grade);
        
        if (completedAssignments.length === 0) {
            return `
                <div class="grade-card">
                    <h4 class="grade-course">${course.code} - ${course.name}</h4>
                    <p class="loading-text">no grades yet</p>
                </div>
            `;
        }
        
        const totalGrade = completedAssignments.reduce((sum, a) => sum + (a.grade / a.max_grade) * 100, 0);
        const avgGrade = Math.round(totalGrade / completedAssignments.length);
        
        return `
            <div class="grade-card">
                <div class="grade-header">
                    <div>
                        <h4 class="grade-course">${course.code}</h4>
                        <p class="grade-course-name">${course.name}</p>
                    </div>
                    <div class="grade-avg">
                        <span class="grade-number">${avgGrade}%</span>
                        <span class="grade-label">average</span>
                    </div>
                </div>
                
                <div class="grades-list">
                    ${completedAssignments.map(assignment => {
                        const percentage = Math.round((assignment.grade / assignment.max_grade) * 100);
                        return `
                            <div class="grade-item">
                                <span class="grade-assignment">${assignment.title}</span>
                                <span class="grade-score">${assignment.grade}/${assignment.max_grade} (${percentage}%)</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function displaySchedule() {
    const container = document.getElementById('scheduleTable');
    
    // Mock schedule data (you can expand this with real data)
    const schedule = {
        'Monday': [
            { time: '9:00 AM', course: 'Web Technologies', room: 'Room 301' },
            { time: '11:00 AM', course: 'Database Systems', room: 'Room 205' }
        ],
        'Tuesday':  [
            { time: '10:00 AM', course: 'Artificial Intelligence', room: 'Lab 2' },
            { time: '2:00 PM', course: 'Database Systems Lab', room: 'Lab 1' }
        ],
        'Wednesday': [
            { time: '9:00 AM', course: 'Web Technologies', room: 'Room 301' }
        ],
        'Thursday':  [
            { time: '10:00 AM', course: 'Artificial Intelligence', room: 'Lab 2' },
            { time: '11:00 AM', course: 'Database Systems', room: 'Room 205' }
        ],
        'Friday': [
            { time: '9:00 AM', course: 'CS Lab', room: 'Lab 2' }
        ]
    };
    
    container.innerHTML = `
        <div class="schedule-grid">
            ${Object.entries(schedule).map(([day, classes]) => `
                <div class="schedule-day">
                    <h4 class="day-name">${day}</h4>
                    <div class="day-classes">
                        ${classes.map(cls => `
                            <div class="class-item">
                                <span class="class-time">${cls.time}</span>
                                <span class="class-name">${cls.course}</span>
                                <span class="class-room">${cls.room}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function filterAssignments(filter) {
    let filtered = [];
    
    if (filter === 'all') {
        filtered = allAssignments;
    } else if (filter === 'pending') {
        filtered = allAssignments.filter(a => a.status === 'in_progress' || a.status === 'not_started');
    } else if (filter === 'completed') {
        filtered = allAssignments.filter(a => a.status === 'completed');
    }
    
    displayAllAssignments(filtered);
    
    // Update tab styling
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Additional CSS for new elements
const additionalStyles = `
    .assignment-card {
        background: var(--widget-glass);
        border: 1px solid var(--widget-border);
        border-left: 3px solid var(--color-primary);
        border-radius: 12px;
        padding: 20px;
        margin-bottom:  16px;
    }
    
    .assignment-header {
        display: flex;
        justify-content: space-between;
        align-items:  start;
        margin-bottom: 16px;
    }
    
    .assignment-course {
        font-size: 12px;
        color: var(--text-muted);
        margin:  4px 0 0 0;
    }
    
    .assignment-status-badge {
        padding: 6px 12px;
        border-radius: 8px;
        color: white;
        font-size: 11px;
        font-weight:  600;
        text-transform: uppercase;
    }
    
    .assignment-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom:  12px;
    }
    
    .detail-row {
        font-size: 12px;
    }
    
    .detail-label {
        color: var(--text-muted);
        margin-right: 6px;
    }
    
    .detail-value {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .assignment-notes {
        font-size: 12px;
        color: var(--text-secondary);
        padding-top: 12px;
        border-top: 1px solid var(--widget-border);
    }
    
    .grade-card {
        background: var(--widget-glass);
        border: 1px solid var(--widget-border);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
    }
    
    .grade-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom:  1px solid var(--widget-border);
    }
    
    .grade-course {
        font-size: 16px;
        font-weight:  600;
        color: var(--text-primary);
        margin: 0 0 4px 0;
    }
    
    .grade-course-name {
        font-size: 12px;
        color: var(--text-muted);
        margin: 0;
    }
    
    .grade-avg {
        text-align: center;
    }
    
    .grade-number {
        display: block;
        font-size: 32px;
        font-weight:  700;
        color: var(--color-primary-light);
    }
    
    .grade-label {
        font-size:  11px;
        color: var(--text-muted);
        text-transform: lowercase;
    }
    
    .grades-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .grade-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        font-size: 13px;
    }
    
    .grade-assignment {
        color: var(--text-secondary);
    }
    
    .grade-score {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .schedule-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
    }
    
    .schedule-day {
        background: var(--widget-glass);
        border: 1px solid var(--widget-border);
        border-radius: 12px;
        padding: 16px;
    }
    
    .day-name {
        font-size:  14px;
        font-weight: 600;
        color: var(--color-primary-light);
        margin: 0 0 12px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .day-classes {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .class-item {
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .class-time {
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 600;
    }
    
    .class-name {
        font-size: 13px;
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .class-room {
        font-size: 11px;
        color: var(--text-muted);
    }
    
    .activity-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    .activity-icon {
        font-size: 20px;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-title {
        font-size: 13px;
        color: var(--text-primary);
        font-weight: 600;
        margin: 0 0 4px 0;
    }
    
    .activity-meta {
        font-size: 11px;
        color: var(--text-muted);
        margin: 0;
    }
    
    .activity-progress {
        font-size: 11px;
        color: var(--color-primary-light);
        margin-top: 4px;
    }
`;

const styleEl = document.createElement('style');
styleEl.textContent = additionalStyles;
document.head.appendChild(styleEl);

// Load data on page load
loadDashboardData();
