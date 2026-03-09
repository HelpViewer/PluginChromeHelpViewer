if (document.readyState === "complete") {
  chrome.runtime.sendMessage({ type: "requestHelpFile" });
} else {
  window.addEventListener("load", () => {
    chrome.runtime.sendMessage({ type: "requestHelpFile" });
  });
}

let lastContextTarget = null;

document.addEventListener("contextmenu", (evt) => {
  lastContextTarget = evt.target;
}, true);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getElementInfo") {
    if (!lastContextTarget) {
      sendResponse(null);
      return;
    }
    sendResponse({
      id: lastContextTarget.id || null,
      tag: lastContextTarget.tagName,
      href: lastContextTarget.href || null
    });
  }
  return true;
});
