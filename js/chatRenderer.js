const chat = document.getElementById("chat");
const typingSound = document.getElementById("typingSound");
const sendSound = document.getElementById("sendSound");

sendSound.volume = 0.4;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
function rand(min,max){ return Math.random()*(max-min)+min; }

/* ---------- AUDIO UNLOCK ---------- */
let audioUnlocked = false;

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function unlockAudio() {
  if (audioUnlocked) return;

  audioCtx.resume().then(() => {
    audioUnlocked = true;
  }).catch(() => {});
}

document.body.addEventListener("click", unlockAudio, { once: true });

/* ---------- SYNTHETIC TYPING SOUND ---------- */
function playTypingClick() {
  if (!audioUnlocked) return;

  const now = audioCtx.currentTime;

  // noise burst
  const bufferSize = audioCtx.sampleRate * 0.03;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 250);
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const osc = audioCtx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = 140 + Math.random() * 40;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  noise.connect(gain);
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(now);
  osc.start(now);

  noise.stop(now + 0.04);
  osc.stop(now + 0.04);
}

/* ---------- INSTANT RENDER ---------- */
function renderInstant(msg) {
  const row = document.createElement("div");
  row.className = `row ${msg.side}`;
  const box = document.createElement("div");
  box.className = "msg";
  box.innerHTML = msg.html ? msg.text : msg.text.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  row.appendChild(box);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

/* ---------- TYPING DOTS ---------- */
function showTyping(side){
  const row = document.createElement("div");
  row.className = `row ${side}`;
  const box = document.createElement("div");
  box.className = "typing";
  box.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  row.appendChild(box);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return row;
}

/* ---------- TYPE MESSAGE ---------- */
async function typeMessage(text, side, html=false){
  const row = document.createElement("div");
  row.className = `row ${side}`;
  const msg = document.createElement("div");
  msg.className = "msg";
  row.appendChild(msg);
  chat.appendChild(row);

  let buffer = "";

  for (let ch of text) {
    buffer += ch;
    html ? msg.innerHTML = buffer : msg.textContent = buffer;
    chat.scrollTop = chat.scrollHeight;

    playTypingClick();

    if (".,!?".includes(ch)) await sleep(rand(400,650));
    else if ("😂😌💞👉👈😳".includes(ch)) await sleep(rand(550,850));
    else await sleep(rand(70,140));
  }

  sendSound.currentTime = 0;
  sendSound.play();
}

/* ---------- CHAT PLAYER ---------- */
async function playChat(startIndex, endIndex) {
  for (let i = 0; i < startIndex; i++) {
    renderInstant(CHAT[i]);
  }

  for (let i = startIndex; i < endIndex; i++) {
    if (CHAT[i].side === "right") {
      const t = showTyping("right");
      await sleep(rand(900,1200));
      t.remove();
    }

    await typeMessage(CHAT[i].text, CHAT[i].side, CHAT[i].html || false);

    if (i === endIndex - 1) {
      showEndButton();
    }
  }

  localStorage.setItem("chatIndex", endIndex);
}

/* ---------- PROFILE CONTROL ---------- */
function enableProfileClick(url = "profile.html") {
  const p = document.getElementById("profileTrigger");
  if (!p) return;
  p.classList.add("clickable");
  p.onclick = () => location.href = url;
}

function disableProfileClick() {
  const p = document.getElementById("profileTrigger");
  if (!p) return;
  p.classList.remove("clickable");
  p.onclick = null;
}

function showEndButton() {
  const btn = document.getElementById("endButton");
  if (btn) btn.style.display = "block";
}
