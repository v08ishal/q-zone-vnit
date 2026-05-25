let courseData = {};
let currentSubjects = []; // Holds data for the currently open semester
let currentFilter = 'All'; // Tracks which button is active (All, Theory, Lab)

// 1. Fetch the data from your JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        courseData = data;
    })
    .catch(error => console.error('Error loading database:', error));

// 2. Open the Modal and Load Data
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
        document.getElementById('subject-container').innerHTML = '<p style="color: #94a3b8;">Content for this semester is currently unavailable.</p>';
    }

    // Show the modal
    document.getElementById('semester-modal').style.display = 'block';
}

// 3. Change Filter State (Triggered by ALL, THEORY, LABS buttons)
function setFilter(type) {
    currentFilter = type;
    updateFilterButtons();
    renderSubjects(); // Redraw cards based on new filter
}

// 4. Update the Green Active Button
function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        // Match button text to current filter
        if (btn.innerText.toUpperCase() === currentFilter.toUpperCase() ||
           (btn.innerText.toUpperCase() === 'LABS' && currentFilter === 'Lab')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 5. Triggered every time a user types in the search bar
function filterData() {
    renderSubjects();
}

// 6. The Master Rendering Engine (Draws the cards based on filters)
function renderSubjects() {
    const container = document.getElementById('subject-container');
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    container.innerHTML = '';

    // Filter the subjects array
    let filtered = currentSubjects.filter(subject => {
        // Check if it matches the Category Button (Theory/Lab)
        let matchesType = (currentFilter === 'All') || (subject.type === currentFilter);
        
        // Check if it matches the Search Bar text
        let matchesSearch = subject.name.toLowerCase().includes(searchQuery);

        return matchesType && matchesSearch;
    });

    // If nothing matches, show a message
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8;">No subjects match your search.</p>';
        return;
    }

    // Draw the filtered cards
    filtered.forEach(subject => {
        let cardHTML = `
            <div class="subject-card">
                <div class="subject-header">
                    <h3>${subject.name}</h3>
                    <span class="credit-badge">${subject.credits} Credits | ${subject.type}</span>
                </div>
                <div class="resource-links">
        `;

        if (subject.type === "Theory") {
            cardHTML += `
                <a href="${subject.notesLink}" target="_blank" class="resource-btn">📝 Notes</a>
                <a href="${subject.pyqLink}" target="_blank" class="resource-btn">📄 PYQs</a>
                <a href="${subject.assignmentLink}" target="_blank" class="resource-btn">📋 Assign</a>
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

// 7. Close the Modal
function closeModal() {
    document.getElementById('semester-modal').style.display = 'none';
}

// 8. Close the modal if user clicks outside the box
window.onclick = function(event) {
    let modal = document.getElementById('semester-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
