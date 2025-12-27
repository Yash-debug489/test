const chat = document.getElementById("chat");

function renderInstant(msg) {
  const row = document.createElement("div");
  row.className = `row ${msg.side}`;
  const box = document.createElement("div");
  box.className = "msg";
  msg.html ? box.innerHTML = msg.text : box.textContent = msg.text;
  row.appendChild(box);
  chat.appendChild(row);
}

async function playChat(endIndex) {
  const start = Number(localStorage.getItem("chatIndex") || 0);

  for (let i = 0; i < start; i++) renderInstant(CHAT[i]);

  for (let i = start; i < endIndex; i++) {
    await typeMessage(CHAT[i].text, CHAT[i].side, CHAT[i].html);
  }

  localStorage.setItem("chatIndex", endIndex);
}

function enableProfileClick(url) {
  const p = document.getElementById("profileTrigger");
  p.classList.add("clickable");
  p.onclick = () => location.href = url;
}

function disableProfileClick() {
  const p = document.getElementById("profileTrigger");
  p.classList.remove("clickable");
  p.onclick = null;
}
