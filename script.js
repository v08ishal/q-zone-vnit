let courseData = {};

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        courseData = data;
    })
    .catch(error => console.error('Error loading database:', error));

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
    } else {
        container.innerHTML = '<p style="color: #94a3b8;">Content for this semester is currently unavailable.</p>';
    }

    document.getElementById('semester-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('semester-modal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('semester-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
