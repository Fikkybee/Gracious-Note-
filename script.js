document.addEventListener("DOMContentLoaded", function() {
    const newNoteBtn = document.getElementById("newNoteBtn");
    const modal = document.getElementById("noteModal");
    const closeModal = document.querySelector(".close");
    const saveNoteBtn = document.getElementById("saveNote");
    const notesList = document.getElementById("notesList");
    const searchInput = document.getElementById("search");
    const filterStatus = document.getElementById("filterStatus");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let editIndex = null;

    newNoteBtn.addEventListener("click", () => {
        modal.style.display = "block";
        resetForm();
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    saveNoteBtn.addEventListener("click", () => {
        const title = document.getElementById("noteTitle").value.trim();
        const category = document.getElementById("noteCategory").value;
        const status = document.getElementById("noteStatus").value;
        const content = document.getElementById("noteContent").value.trim();
        const time = new Date().toLocaleString();

        if (!title || !content) {
            alert("Title and content are required!");
            return;
        }

        const noteData = { title, category, status, content, time };

        if (editIndex !== null) {
            notes[editIndex] = noteData;
        } else {
            notes.push(noteData);
        }

        localStorage.setItem("notes", JSON.stringify(notes));
        modal.style.display = "none";
        loadNotes();
    });

    function loadNotes() {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            if (filterStatus.value !== "All" && filterStatus.value !== note.status) return;

            const row = document.createElement("tr");
            row.classList.add(note.status.toLowerCase());

            row.innerHTML = `
                <td>${note.title}</td>
                <td>${note.time}</td>
                <td>${note.category}</td>
                <td>${note.status}</td>
                <td class="actions">
                    <i class="fas fa-edit" onclick="editNote(${index})"></i>
                    <i class="fas fa-trash" onclick="deleteNote(${index})"></i>
                </td>
            `;

            notesList.appendChild(row);
        });
    }

window.editNote = (index) => {
    editIndex = index;
    const note = notes[index];
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteCategory").value = note.category;
    document.getElementById("noteStatus").value = note.status;
    document.getElementById("noteContent").value = note.content;
    modal.style.display = "block";
};

window.deleteNote = (index) => {
    if (confirm("Are you sure you want to delete this note?")) {
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
        alert("Note Delected");
    }
};

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.children[0].textContent.toLowerCase().includes(searchTerm) ? "" : "none";
    });
});

function resetForm() {
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteCategory").value = "Work";
    document.getElementById("noteStatus").value = "Active";
    document.getElementById("noteContent").value = "";
    editIndex = null;
}

filterStatus.addEventListener("change", loadNotes);
   loadNotes();
});