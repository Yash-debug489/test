const qr = document.getElementById("quickReplyOverlay");

// watch chat for "Wanna see it??"
const observer = new MutationObserver(() => {
  if (chat.innerText.includes("Wanna see it??")) {
    qr.style.display = "flex";
    observer.disconnect();
  }
});

observer.observe(chat, { childList: true, subtree: true });

// hide replies on click
qr.onclick = () => {
  qr.style.display = "none";
};



disableProfileClick();
playChat(0, 10);  // page1 messages
