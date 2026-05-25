let courseData = {};
let currentSubjects = []; 
let currentFilter = 'All'; 

// Fetch the ECE database
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        courseData = data;
    })
    .catch(error => console.error('Error loading database:', error));

// Open the Modal and Load Data
function loadSemester(semesterName) {
    const modalTitle = document.getElementById('modal-title');
    
    // Set title and reset controls
    modalTitle.innerText = semesterName;
    document.getElementById('search-bar').value = ''; 
    currentFilter = 'All'; 
    updateFilterButtons();

    // Grab the subjects for this semester
    if (courseData[semesterName]) {
        currentSubjects = courseData[semesterName];
        renderSubjects(); // Draw the cards
    } else {
        currentSubjects = [];
        document.getElementById('subject-container').innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">Content for this semester is currently unavailable.</p>';
    }

    // Show the modal
    document.getElementById('semester-modal').style.display = 'block';
}

// Change Filter State (Triggered by ALL, THEORY, LABS buttons)
function setFilter(type) {
    currentFilter = type;
    updateFilterButtons();
    renderSubjects(); // Redraw cards based on new filter
}

// Update the Green Active Button visually
function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toUpperCase() === currentFilter.toUpperCase() ||
           (btn.innerText.toUpperCase() === 'LABS' && currentFilter === 'Lab')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Triggered every time a user types in the search bar
function filterData() {
    renderSubjects();
}

// The Rendering Engine (Draws the cards based on filters & search)
function renderSubjects() {
    const container = document.getElementById('subject-container');
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    container.innerHTML = '';

    // Filter the subjects array
    let filtered = currentSubjects.filter(subject => {
        let matchesType = (currentFilter === 'All') || (subject.type === currentFilter);
        let matchesSearch = subject.name.toLowerCase().includes(searchQuery);
        return matchesType && matchesSearch;
    });

    // If nothing matches
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">No subjects match your search.</p>';
        return;
    }

    // Draw the filtered cards
    filtered.forEach(subject => {
        // Format the badge text (e.g., "TH | 4 Credits")
        let badgeType = subject.type === "Theory" ? "TH" : "PR";
        
        let cardHTML = `
            <div class="subject-card">
                <div class="subject-header">
                    <h3>${subject.name}</h3>
                    <span class="credit-badge">${badgeType} | ${subject.credits} Credits</span>
                </div>
                <div class="resource-links">
        `;

        if (subject.type === "Theory") {
            cardHTML += `
                <a href="${subject.notesLink}" target="_blank" class="resource-btn">📝 Notes</a>
                <a href="${subject.pyqLink}" target="_blank" class="resource-btn">🎯 PYQs</a>
                <a href="${subject.assignmentLink}" target="_blank" class="resource-btn">✍️ Assignments</a>
            `;
        } else if (subject.type === "Lab") {
            cardHTML += `
                <a href="${subject.manualLink}" target="_blank" class="resource-btn">📘 Manual</a>
                <a href="${subject.journalLink}" target="_blank" class="resource-btn">📓 Journal</a>
            `;
        }

        cardHTML += `</div></div>`;
        container.innerHTML += cardHTML;
    });
}

// Close the Modal
function closeModal() {
    document.getElementById('semester-modal').style.display = 'none';
}

// Close the modal if user clicks the dark background outside the box
window.onclick = function(event) {
    let modal = document.getElementById('semester-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
