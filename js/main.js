const note_input = document.querySelector("input");
const date_input = document.querySelector(".schedule-date"); // added date input
const add_btn = document.querySelector(".add-task-button");
const notes_list_body = document.querySelector(".notes-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

window.addEventListener("DOMContentLoaded", () => {
  showAllNotes();
  if (!notes.length) {
    displayNotes([]);
  }
});

//get random unique id
function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addNote(note_input, date_input) {
  let note = {
    id: getRandomId(),
    note: note_input.value,
    dueDate: date_input.value, // added due date
    completed: false,
    status: "pending", // adding initial status as 'pending'
  };
  notes.push(note);
}

note_input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && note_input.value.length > 0) {
    addNote(note_input, date_input); // Added date input
    saveToLocalStorage();
    note_input.value = "";
    showAllNotes();
  }
});

add_btn.addEventListener("click", () => {
  if (note_input.value === "") {
    showAlertMessage("Please enter a note", "error");
  } else {
    addNote(note_input, date_input); // Added date input
    saveToLocalStorage();
    showAllNotes();
    note_input.value = "";
    date_input.value = ""; // Added date input
    showAlertMessage("Note added successfully", "success");
  }
});

delete_all_btn.addEventListener("click", clearAllNotes);

//show all notes
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
                    <button class="btn btn-warning btn-sm" onclick="editNote('${
                      note.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      note.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteNote('${
                      note.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}

//save notes to local storage
function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

//show alert message
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

//delete note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveToLocalStorage();
  showAlertMessage("Note deleted successfully", "success");
  showAllNotes();
}

//edit note
function editNote(id) {
  let note = notes.find((note) => note.id === id);
  note_input.value = note.note;
  date_input.value = note.dueDate || ""; // Set the due date input
  notes = notes.filter((note) => note.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";

  // Update the event listener for the add button
  add_btn.removeEventListener("click", addNote);
  add_btn.addEventListener("click", () => {
    // Check if the note input is empty
    if (note_input.value === "") {
      showAlertMessage("Please enter a note", "error");
    } else {
      note.note = note_input.value;
      note.dueDate = date_input.value || ""; // Update the due date
      notes.push(note);
      saveToLocalStorage();
      showAllNotes();
      note_input.value = "";
      date_input.value = ""; // Clear the due date input
      add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
      showAlertMessage("Note updated successfully", "success");
    }
  });
}

//clear all notes
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

function toggleStatus(id) {
  let note = notes.find((note) => note.id === id);
  note.completed = !note.completed;
  note.status = note.completed ? "completed" : "pending"; // Update the status
  saveToLocalStorage();
  showAllNotes();
}

function filterNotes(status) {
  let filteredNotes;
  switch (status) {
    case "all":
      filteredNotes = notes;
      break;
    case "pending":
      filteredNotes = notes.filter((note) => !note.completed);
      break;
    case "completed":
      filteredNotes = notes.filter((note) => note.completed);
      break;
  }
  displayNotes(filteredNotes);
}

function displayNotes(notesArray) {
  notes_list_body.innerHTML = "";
  if (notesArray.length === 0) {
    notes_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No note found</td></tr>`;
    return;
  }
  notesArray.forEach((note) => {
    notes_list_body.innerHTML += `
            <tr class="note-item" data-id="${note.id}">
                <td>${note.note}</td>
                <td>${note.dueDate || "No due date"}</td>
                <td>${note.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editNote('${
                      note.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      note.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteNote('${
                      note.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}
