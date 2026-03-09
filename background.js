const tabState = {};
const HVI_MENU_ID = "HelpViewerCtxHelpGet";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: HVI_MENU_ID,
    title: "❔",
    contexts: ["all"]
    //, documentUrlPatterns: ["<all_urls>"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    chrome.contextMenus.update(HVI_MENU_ID, { visible: false });
  });
});

function fetchHelpFileWithRetry(tabId, attempt = 0) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      world: "MAIN",
      func: () => window.hvHelpFile || null
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.warn("executeScript error:", chrome.runtime.lastError.message);
        return;
      }

      const helpFile = results?.[0]?.result;
      console.log("helpFile - try : ", attempt, " :", helpFile);

      if (!helpFile && attempt < 10) {
        setTimeout(() => fetchHelpFileWithRetry(tabId, attempt + 1), 300);
        return;
      }

      if (!tabState[tabId]) tabState[tabId] = {};
      tabState[tabId].helpFile = helpFile || null;

      chrome.contextMenus.update(HVI_MENU_ID, { visible: !!helpFile });
    }
  );
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "requestHelpFile" && sender.tab) {
    fetchHelpFileWithRetry(sender.tab.id);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;

  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.id) return;
    fetchHelpFileWithRetry(tab.id);
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== HVI_MENU_ID) return;
  if (!tab || !tab.id) return;

  const state = tabState[tab.id] || {};
  const helpFile = state.helpFile;
  if (!helpFile) return;

  chrome.tabs.sendMessage(tab.id, { type: "getElementInfo" }, (elemInfo) => {
    if (chrome.runtime.lastError || !elemInfo) {
      console.warn("Not any element info found:", chrome.runtime.lastError?.message);
      return;
    }

    let elementId = elemInfo.id?.replace(/\|/g, '-') || 'noid';
    let urlSplits = '';
    if (helpFile.routing) {
      urlSplits = (tab.url ? tab.url.split('?')[0]?.split('/') : []).filter(x => x).slice(1);
      elementId = urlSplits.join('-')?.replace(/\:|\./g, '-') + '-' + elementId;
    }

    const baseUrl = helpFile.viewer || 'https://helpviewer.github.io/index.html';
    const filePath = helpFile.file || '';
  
    const targetUrl = baseUrl +
      "?d=" + encodeURIComponent(filePath) +
      "&p=" + encodeURIComponent(String(elementId)) + ".md";
  
    chrome.tabs.create({ url: targetUrl });

  });

});
