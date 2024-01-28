// Define variables for common elements across pages
const note_input = document.querySelector("input");
const date_input = document.querySelector(".schedule-date");
const add_btn = document.querySelector(".add-task-button");
const notes_list_body = document.querySelector(".notes-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

// Initialize notes from local storage or an empty array
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Event listener for DOMContentLoaded event
window.addEventListener("DOMContentLoaded", () => {
    // Check if the page is the main dashboard
    if (document.title === "Main Page | ThoughtBubble") {
        showAllNotes();
        if (!notes.length) {
            displayNotes([]);
        }
    }
});

// Function to generate a random unique ID
function getRandomId() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

// Function to add a new note
function addNote() {
    let note = {
        id: getRandomId(),
        note: note_input.value,
        dueDate: date_input.value || "", // Handle empty due date
        completed: false,
        status: "pending",
    };
    notes.push(note);
}

// Event listener for keyup event on note_input
note_input.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 && note_input.value.length > 0) {
        addNote();
        saveToLocalStorage();
        note_input.value = "";
        // Check if the page is the main dashboard
        if (document.title === "Main Page | ThoughtBubble") {
            showAllNotes();
        }
    }
});

// Event listener for click event on add_btn
add_btn.addEventListener("click", () => {
    if (note_input.value === "") {
        showAlertMessage("Please enter a note", "error");
    } else {
        addNote();
        saveToLocalStorage();
        // Check if the page is the main dashboard
        if (document.title === "Main Page | ThoughtBubble") {
            showAllNotes();
        }
        note_input.value = "";
        date_input.value = "";
        showAlertMessage("Note added successfully", "success");
    }
});

// Event listener for click event on delete_all_btn
if (delete_all_btn) {
    delete_all_btn.addEventListener("click", clearAllNotes);
}

// Function to display all notes
function showAllNotes() {
    notes_list_body.innerHTML = "";
    if (notes.length === 0) {
        notes_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No note found</td></tr>`;
        return;
    }

    notes.forEach((note) => {
        notes_list_body.innerHTML += `
            <tr class="note-item" data-id="${note.id}">
                <td>${note.note}</td>
                <td>${note.dueDate || "No due date"}</td>
                <td>${note.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editNote('${note.id}')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${note.id}')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteNote('${note.id}')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Function to save notes to local storage
function saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Function to show an alert message
function showAlertMessage(message, type) {
    let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
    alert_message.innerHTML = alert_box;
    alert_message.classList.remove("hide");
    alert_message.classList.add("show");
    setTimeout(() => {
        alert_message.classList.remove("show");
        alert_message.classList.add("hide");
    }, 3000);
}

// Function to delete a note
function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    saveToLocalStorage();
    showAlertMessage("Note deleted successfully", "success");
    showAllNotes();
}

// Function to edit a note
function editNote(id) {
    let note = notes.find((note) => note.id === id);
    note_input.value = note.note;
    date_input.value = note.dueDate || "";
    notes = notes.filter((note) => note.id !== id);
    add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";

    // Update the event listener for the add button
    add_btn.removeEventListener("click", addNote);
    add_btn.addEventListener("click", () => {
        if (note_input.value === "") {
            showAlertMessage("Please enter a note", "error");
        } else {
            note.note = note_input.value;
            note.dueDate = date_input.value || "";
            notes.push(note);
            saveToLocalStorage();
            showAllNotes();
            note_input.value = "";
            date_input.value = "";
            add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
            showAlertMessage("Note updated successfully", "success");
        }
    });
}

// Function to clear all notes
function clearAllNotes() {
    if (notes.length > 0) {
        notes = [];
        saveToLocalStorage();
        showAlertMessage("All notes cleared successfully", "success");
        showAllNotes();
    } else {
        showAlertMessage("No notes to clear", "error");
    }
}

// Function to toggle the status of a note
function toggleStatus(id) {
    let note = notes.find((note) => note.id === id);
    note.completed = !note.completed;
    note.status = note.completed ? "completed" : "pending";
    saveToLocalStorage();
    showAllNotes();
}
