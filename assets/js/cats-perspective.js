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

// Update current date
function updateDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
}
updateDate();

// Load today's data
async function loadTodayData() {
    try {
        // Fetch cat logs
        const response = await fetch('../../assets/data/cat_logs.json');
        const data = await response.json();
        
        // Get today's log (first entry is most recent)
        const today = data.logs[0];
        
        // Update stats
        document.getElementById('todayMood').textContent = today.mood;
        document.getElementById('todayEnergy').textContent = `${today.energy}/10`;
        document.getElementById('todaySleep').textContent = `${today.sleep.hours} hrs`;
        document.getElementById('todayStress').textContent = `${today.academic.stress_level}/10`;
        
        // Display meals
        displayMeals(today.meals);
        
        // Display activities
        displayActivities(today.activities);
        
        // Display symptoms
        displaySymptoms(today.symptoms);
        
        // Display academic info
        displayAcademic(today.academic);
        
        // Display notes
        document.getElementById('notesContent').innerHTML = `<p>${today.notes}</p>`;
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load today\'s data.Make sure cat_logs.json exists! ');
    }
}

function displayMeals(meals) {
    const container = document.getElementById('mealsList');
    container.innerHTML = meals.map(meal => `
        <div class="meal-item">
            <span class="meal-time">${meal.time}</span>
            <span class="meal-food">${meal.food}</span>
            <span class="meal-notes">${meal.notes}</span>
        </div>
    `).join('');
}

function displayActivities(activities) {
    const container = document.getElementById('activitiesList');
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <span class="activity-time">${activity.time}</span>
            <span class="activity-name">${activity.activity}</span>
            <span class="activity-mood">mood: ${activity.mood}</span>
        </div>
    `).join('');
}

function displaySymptoms(symptoms) {
    const container = document.getElementById('symptomsList');
    if (symptoms.length === 0) {
        container.innerHTML = '<p class="loading-text">no health issues today!  🎉</p>';
        return;
    }
    container.innerHTML = symptoms.map(symptom => `
        <div class="symptom-item">
            <span class="symptom-type">${symptom.type}</span>
            <span class="symptom-severity">severity: ${symptom.severity}</span>
            <span class="symptom-cause">${symptom.cause}</span>
        </div>
    `).join('');
}

function displayAcademic(academic) {
    const container = document.getElementById('academicInfo');
    container.innerHTML = `
        <div class="academic-stat">
            <span class="academic-label">completed</span>
            <span class="academic-value">${academic.assignments_completed}</span>
        </div>
        <div class="academic-stat">
            <span class="academic-label">pending</span>
            <span class="academic-value">${academic.assignments_pending}</span>
        </div>
        <div class="academic-stat">
            <span class="academic-label">stress level</span>
            <span class="academic-value">${academic.stress_level}/10</span>
        </div>
    `;
}

// Load data on page load
loadTodayData();