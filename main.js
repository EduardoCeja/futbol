// main.js
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const db           = window.firebase.db;
const matchesCol   = collection(db, "matches");
const tbody        = document.querySelector("#matchesTable tbody");
const addForm      = document.getElementById("addMatchForm");
const editForm     = document.getElementById("editMatchForm");
const searchInput  = document.getElementById("searchByDate");
const editMatchId  = document.getElementById("editMatchId");

// Devuelve HTML con tantos iconos de balón como count
function renderBalls(count) {
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `<img src="balon.png" class="balon-icon" alt="⚽">`;
  }
  return html;
}

// Renderiza todas las filas según snapshot y filtro de fecha
function renderMatches(snapshot) {
  tbody.innerHTML = "";
  const filterDate = searchInput.value;
  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    if (!filterDate || d.date === filterDate) {
      const tr = document.createElement("tr");
      tr.dataset.id = docSnap.id;
      tr.innerHTML = `
        <td>${d.date}</td>
        <td>${d.teamA}</td>
        <td>${d.scoreA}</td>
        <td>${d.scoreB}</td>
        <td class="text-center">${renderBalls(d.totalGoals)}</td>
        <td>${d.teamB}</td>
        <td>
          <button class="btn btn-sm btn-warning edit-btn">✎</button>
          <button class="btn btn-sm btn-danger delete-btn">🗑</button>
        </td>`;
      tbody.appendChild(tr);
    }
  });
}

// 1) Escucha cambios en tiempo real
onSnapshot(matchesCol, snapshot => renderMatches(snapshot));

// 2) Filtrar localmente por fecha
searchInput.addEventListener("input", async () => {
  const snap = await getDocs(matchesCol);
  renderMatches({ forEach: fn => snap.docs.forEach(fn) });
});

// 3) Crear un nuevo partido
addForm.addEventListener("submit", async e => {
  e.preventDefault();
  const date   = document.getElementById("matchDate").value;
  const teamA  = document.getElementById("teamA").value.trim();
  const teamB  = document.getElementById("teamB").value.trim();
  const scoreA = Number(document.getElementById("scoreA").value);
  const scoreB = Number(document.getElementById("scoreB").value);
  const total  = scoreA + scoreB;

  await addDoc(matchesCol, {
    date,
    teamA,
    teamB,
    scoreA,
    scoreB,
    totalGoals: total,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  bootstrap.Modal.getInstance(document.getElementById("addMatchModal")).hide();
  addForm.reset();
});

// 4) Delegación de eventos: editar y eliminar
tbody.addEventListener("click", async e => {
  const tr  = e.target.closest("tr");
  const id  = tr.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    // Elimina documento
    await deleteDoc(doc(db, "matches", id));
  }

  if (e.target.classList.contains("edit-btn")) {
    // Prepara modal de edición
    const snap = await doc(db, "matches", id).get();
    const d    = snap.data();
    editMatchId.value               = id;
    document.getElementById("editDate").value   = d.date;
    document.getElementById("editTeamA").value  = d.teamA;
    document.getElementById("editScoreA").value = d.scoreA;
    document.getElementById("editScoreB").value = d.scoreB;
    document.getElementById("editTeamB").value  = d.teamB;
    new bootstrap.Modal(document.getElementById("editMatchModal")).show();
  }
});

// 5) Guardar cambios de edición
editForm.addEventListener("submit", async e => {
  e.preventDefault();
  const id     = editMatchId.value;
  const date   = document.getElementById("editDate").value;
  const teamA  = document.getElementById("editTeamA").value.trim();
  const teamB  = document.getElementById("editTeamB").value.trim();
  const scoreA = Number(document.getElementById("editScoreA").value);
  const scoreB = Number(document.getElementById("editScoreB").value);
  const total  = scoreA + scoreB;

  const ref = doc(db, "matches", id);
  await updateDoc(ref, {
    date,
    teamA,
    teamB,
    scoreA,
    scoreB,
    totalGoals: total,
    updatedAt: new Date().toISOString()
  });

  bootstrap.Modal.getInstance(document.getElementById("editMatchModal")).hide();
});
