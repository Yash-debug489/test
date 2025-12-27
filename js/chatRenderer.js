function renderInstant(msg) {
  const row = document.createElement("div");
  row.className = `row ${msg.side}`;
  const box = document.createElement("div");
  box.className = "msg";
  if (msg.html) box.innerHTML = msg.text;
  else box.textContent = msg.text;
  row.appendChild(box);
  chat.appendChild(row);
}

async function playChat(endIndex) {
  const start = Number(localStorage.getItem("chatIndex") || 0);

  // render old instantly
  for (let i = 0; i < start; i++) {
    renderInstant(CHAT[i]);
  }

  // type new messages
  for (let i = start; i < endIndex; i++) {
    await typeMessage(CHAT[i].text, CHAT[i].side, CHAT[i].html);
  }

  localStorage.setItem("chatIndex", endIndex);
}
