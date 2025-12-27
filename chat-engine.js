<script>
const chatBox = document.getElementById("chat");

function addBubble(msg) {
  const div = document.createElement("div");
  div.className = `bubble ${msg.from}`;
  div.innerHTML = msg.text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function preloadMessages(upto) {
  for (let i = 0; i < upto; i++) addBubble(chatMessages[i]);
}

async function typeMessages(fromIndex) {
  for (let i = fromIndex; i < chatMessages.length; i++) {
    await new Promise(r => setTimeout(r, 900));
    addBubble(chatMessages[i]);
  }
}
</script>
