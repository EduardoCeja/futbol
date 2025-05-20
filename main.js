// main.js
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const db         = window.firebase.db;
const matchesCol = collection(db, "matches");
const tbody      = document.querySelector("#matchesTable tbody");

const addForm     = document.getElementById("addMatchForm");
const editForm    = document.getElementById("editMatchForm");
const searchInput = document.getElementById("searchByDate");
const editMatchId = document.getElementById("editMatchId");

// Render y filtro
function renderMatches(snapshot) {
  tbody.innerHTML = "";
  const filterDate = searchInput.value;
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (!filterDate || data.date === filterDate) {
      const tr = document.createElement("tr");
      tr.dataset.id = docSnap.id;
      tr.innerHTML = `
        <td>${data.date}</td>
        <td>${data.teamA}</td>
        <td>${data.scoreA} – ${data.scoreB}</td>
        <td>${data.teamB}</td>
        <td>
          <button class="btn btn-sm btn-warning edit-btn">✎</button>
          <button class="btn btn-sm btn-danger delete-btn">🗑</button>
        </td>`;
      tbody.appendChild(tr);
    }
  });
}

// 1) Lectura en tiempo real
onSnapshot(matchesCol, snapshot => renderMatches(snapshot));

// 2) Filtrado
searchInput.addEventListener("input", async () => {
  const snap = await matchesCol.get();
  renderMatches({ forEach: fn => snap.docs.forEach(fn) });
});

// 3) Agregar partido
addForm.addEventListener("submit", async e => {
  e.preventDefault();
  const date   = document.getElementById("matchDate").value;
  const teamA  = document.getElementById("teamA").value.trim();
  const teamB  = document.getElementById("teamB").value.trim();
  const scoreA = Number(document.getElementById("scoreA").value);
  const scoreB = Number(document.getElementById("scoreB").value);
  await addDoc(matchesCol, {
    date,
    teamA,
    teamB,
    scoreA,
    scoreB,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  bootstrap.Modal.getInstance(document.getElementById("addMatchModal")).hide();
  addForm.reset();
});

// 4) Delegación editar/eliminar
tbody.addEventListener("click", async e => {
  const tr  = e.target.closest("tr");
  const id  = tr.dataset.id;
  if (e.target.classList.contains("delete-btn")) {
    await deleteDoc(doc(db, "matches", id));
  }
  if (e.target.classList.contains("edit-btn")) {
    const snap = await doc(db, "matches", id).get();
    const data = snap.data();
    editMatchId.value               = id;
    document.getElementById("editDate").value   = data.date;
    document.getElementById("editTeamA").value  = data.teamA;
    document.getElementById("editTeamB").value  = data.teamB;
    document.getElementById("editScoreA").value = data.scoreA;
    document.getElementById("editScoreB").value = data.scoreB;
    new bootstrap.Modal(document.getElementById("editMatchModal")).show();
  }
});

// 5) Guardar edición
editForm.addEventListener("submit", async e => {
  e.preventDefault();
  const id  = editMatchId.value;
  const ref = doc(db, "matches", id);
  await updateDoc(ref, {
    date:   document.getElementById("editDate").value,
    teamA:  document.getElementById("editTeamA").value.trim(),
    teamB:  document.getElementById("editTeamB").value.trim(),
    scoreA: Number(document.getElementById("editScoreA").value),
    scoreB: Number(document.getElementById("editScoreB").value),
    updatedAt: new Date().toISOString()
  });
  bootstrap.Modal.getInstance(document.getElementById("editMatchModal")).hide();
});
