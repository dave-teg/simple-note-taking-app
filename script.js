const form = document.querySelector("[data-note-form]");
const input = document.getElementById("noteInput");
const noteTemplate = document.querySelector("[data-single-note]");
const modalTemplate = document.querySelector("[data-modal-overlay]");
const noteDisplay = document.querySelector("[data-note-display]");
const closeNote = document.querySelector("[data-close-note]");
const errMsg = document.querySelector("[data-err-msg]");
let noteIndex = 0;

input.addEventListener("keydown", e => {
  if(e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  }
})

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.replace(/[ \t]{2,}/g, ' ').trim();
  console.log(text)
  if(text.length > 3) {
    addNoteItems(text);
  } else {
    errMsg.classList.remove("none");
    return;
  }

  if(!errMsg.classList.contains("none")) {
    errMsg.classList.add("none");
  }
  form.reset();
});



const addNoteItems = (note) => {
  const singleNote = noteTemplate.content.cloneNode(true);
  singleNote.querySelector("[data-note-title]").textContent = `Note ${++noteIndex}`
  singleNote.querySelector("[data-note-text]").textContent = note;
  noteDisplay.append(singleNote);
  saveNotes();
}

noteDisplay.addEventListener("click", e => {
  if(e.target.matches("i")){
    e.target.parentElement.parentElement.remove();
    saveNotes();

    //check if there are no notes and reset the note index if there is none
    const notes = Array.from(noteDisplay.children).filter((note) => {
      return note.classList.contains("note")
    });
    if(notes.length == 0) noteIndex = 0;
  }

  if(e.target.matches("[data-view-btn]")) {
    const modal = modalTemplate.content.cloneNode(true);
    const note = e.target.parentElement;
    const text = note.querySelector("[data-note-text]").textContent;
    modal.querySelector("[data-modal-text]").textContent = text;
    noteDisplay.append(modal);
  }

  if(e.target.matches(".fas.fa-times")){
    const overlay = document.querySelector("[data-overlay]");
    overlay.remove();
  }
});


const saveNotes = () => {
  const notes = Array.from(noteDisplay.children).filter((note) => {
    return note.classList.contains("note")
  })

  const noteList = notes.map((note) => {
    return {
      text: note.querySelector("[data-note-text]").textContent
    }
  })
  localStorage.setItem("noteList", JSON.stringify(noteList));
}

const loadNotes = () => {
  let notes = localStorage.getItem("noteList") || [];
  notes = JSON.parse(notes);
  notes.forEach((note) => {
    const text = note.text;
    addNoteItems(text);
  })
}

loadNotes()