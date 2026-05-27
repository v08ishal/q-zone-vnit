let courseData = {};

// The Zot-Hub Style Database definition
const zotSemesters = [
    { year: "First", title: "Semester 1", subjects: 5, labs: 4, status: "Available" },
    { year: "First", title: "Semester 2", subjects: 6, labs: 3, status: "Available" },
    { year: "Second", title: "Semester 3", subjects: 6, labs: 4, status: "Available" },
    { year: "Second", title: "Semester 4", subjects: 5, labs: 3, status: "Available" },
    { year: "Third", title: "Semester 5", subjects: 0, labs: 0, status: "Coming Soon" },
    { year: "Third", title: "Semester 6", subjects: 0, labs: 0, status: "Coming Soon" },
    { year: "Final", title: "Semester 7", subjects: 0, labs: 0, status: "Coming Soon" },
    { year: "Final", title: "Semester 8", subjects: 0, labs: 0, status: "Coming Soon" }
];

// Fetch the JSON for subjects inside the modal
fetch('data.json')
    .then(response => response.json())
    .then(data => { courseData = data; })
    .catch(error => console.error('Error loading database:', error));

// 1. Build the Zot-Hub Cards on Page Load
function renderCards(filterYear) {
    const grid = document.getElementById('semester-grid');
    grid.innerHTML = '';

    zotSemesters.forEach(sem => {
        // Filter logic
        if (filterYear !== 'All' && sem.year !== filterYear) return;

        // Status Logic
        let isAvailable = sem.status === "Available";
        let statusClass = isAvailable ? "available" : "unavailable";
        let statusIcon = isAvailable ? "🔴 Available" : "⏳ Coming Soon";
        
        let cardHTML = `
            <div class="zot-card">
                <span class="zot-year">${sem.year} Year</span>
                <h3>${sem.title}</h3>
                
                <div class="zot-stats">
                    <p>📚 ${sem.subjects > 0 ? sem.subjects : '-'} Subjects</p>
                    <p>🔬 ${sem.labs > 0 ? sem.labs : '-'} Labs</p>
                    <span class="status ${statusClass}">${statusIcon}</span>
                </div>
                
                <button class="view-btn" ${!isAvailable ? 'disabled' : ''} onclick="loadSemester('${sem.title.toUpperCase()}')">
                    ${isAvailable ? 'View Details' : 'Unavailable'}
                </button>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// 2. Handle the Filter Buttons
function filterYears(year) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderCards(year);
}

// 3. The Modal Engine
function loadSemester(semesterName) {
    const container = document.getElementById('subject-container');
    document.getElementById('modal-title').innerText = semesterName;
    container.innerHTML = '';

    if (courseData[semesterName]) {
        courseData[semesterName].forEach(subject => {
            let cardHTML = `
                <div class="subject-card">
                    <div class="subject-header">
                        <h3>${subject.name}</h3>
                    </div>
                    <div class="resource-links">
            `;
            if (subject.type === "Theory") {
                cardHTML += `<a href="${subject.notesLink}" target="_blank" class="resource-btn">Notes</a>
                             <a href="${subject.pyqLink}" target="_blank" class="resource-btn">PYQs</a>`;
            } else {
                cardHTML += `<a href="${subject.manualLink}" target="_blank" class="resource-btn">Manual</a>`;
            }
            cardHTML += `</div></div>`;
            container.innerHTML += cardHTML;
        });
    } else {
        container.innerHTML = '<p style="color: #94a3b8;">Subjects currently encrypted or unavailable.</p>';
    }

    document.getElementById('semester-modal').style.display = 'block';
}

function closeModal() { document.getElementById('semester-modal').style.display = 'none'; }
window.onclick = function(e) { if (e.target == document.getElementById('semester-modal')) closeModal(); }

// Initialize
renderCards('All');
