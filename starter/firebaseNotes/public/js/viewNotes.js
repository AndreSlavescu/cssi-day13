let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    }
};

const createCard = (note, noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div>
                    <footer class"card-footer">
                        <a 
                            href="#" 
                            class="card-footer-item" 
                            onclick="editNote('${noteId}')">
                        Edit
                        </a>
                        <a 
                            href="#" 
                            class="card-footer-item" 
                            onclick="deleteNote('${noteId}')">
                        Delete
                        </a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (noteId) => {
    console.log("delete");
    firebase.database().ref(`users/${googleUser.uid}/${noteId}`).remove();
};

const editNote = (noteId) => {
    const editNoteModel = document.querySelector("#editNoteModal")
    editNoteModel.classList.add('is-active');
}

const closeModal = () => {
    const editNoteModel = document.querySelector("#editNoteModal")
    editNoteModel.classList.remove('is-active');
}

const saveEditedNote = () => {
  const noteId = document.querySelector('#editNodeModal').value;
  const noteTitle = document.querySelector('#editTitleInput');
  noteTitle.value = note.title;
  const noteText = document.querySelector('#editTextInput');
  noteTitle.value = note.text;
  const noteEdits = {
    title: noteTitle,
    text: noteText
  };
  firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
  closeModal();
}