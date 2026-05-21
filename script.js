function openModal(semesterName) {
    const modal = document.getElementById("vaultModal");
    const title = document.getElementById("modalTitle");
    title.innerText = semesterName + " VAULT";
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