// 1. Create a variable to hold your database
let vaultData = {};

// 2. Fetch the data.json file as soon as the website loads
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        vaultData = data;
        console.log("Database loaded successfully!");
    })
    .catch(error => console.error("Error loading database:", error));

// 3. The new upgraded Modal function
function openModal(semesterName) {
    const modal = document.getElementById("vaultModal");
    const title = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modal-body"); // The empty container we just made

    // Set the title
    title.innerText = semesterName + " VAULT";

    // Clear any old data out of the modal before opening it
    modalBody.innerHTML = "";

    // Check if we actually wrote data for this semester in our JSON file
    if (vaultData[semesterName]) {
        const subjects = vaultData[semesterName];

        // Loop through every subject and build the HTML automatically
        subjects.forEach(subject => {
            
            // Build the top half of the card
            let cardHTML = `
                <div class="subject-card">
                    <div class="subject-header">
                        <h4>${subject.name}</h4>
                        <span class="credit-badge ${subject.type === 'Lab' ? 'lab-badge' : ''}">${subject.type === 'Theory' ? 'TH' : 'PR'} | ${subject.credits} Credits</span>
                    </div>
                    <div class="resource-grid">
            `;

            // If it's a Theory subject, give it the 3 Theory buttons
            if (subject.type === "Theory") {
                cardHTML += `
                    <a href="${subject.notesLink}" target="_blank" class="resource-btn txt-green">📝 Notes</a>
                    <a href="${subject.pyqLink}" target="_blank" class="resource-btn txt-blue">🎯 PYQs</a>
                    <a href="${subject.assignmentLink}" target="_blank" class="resource-btn txt-orange">✍️ Assignments</a>
                `;
            } 
            // If it's a Lab subject, give it the 2 Lab buttons
            else if (subject.type === "Lab") {
                cardHTML += `
                    <a href="${subject.manualLink}" target="_blank" class="resource-btn txt-green">🧪 Lab Manual</a>
                    <a href="${subject.journalLink}" target="_blank" class="resource-btn txt-blue">📘 Journal Files</a>
                `;
            }

            // Close the bottom half of the card
            cardHTML += `
                    </div>
                </div>
            `;

            // Inject the finished card into the screen
            modalBody.innerHTML += cardHTML;
        });
    } else {
        // If someone clicks Semester 2, but we haven't added it to JSON yet, show this cool message:
        modalBody.innerHTML = `<p style="text-align: center; color: #94a3b8; font-family: 'Rajdhani', sans-serif; font-size: 18px; padding: 30px;">[ DATA STREAM CURRENTLY COMPILING ]</p>`;
    }

    // Finally, show the modal
    modal.classList.add("active");
}

function closeModal() {
    const modal = document.getElementById("vaultModal");
    modal.classList.remove("active");
}

window.onclick = function(event) {
    const modal = document.getElementById("vaultModal");
    if (event.target == modal) {
        closeModal();
    }
}
