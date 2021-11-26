// this function is run in the current tab
async function copy(tab) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([`<a href="${tab.url}">${tab.title}</a>`], {
          type: "text/html",
        }),
        "text/plain": new Blob([tab.url], {type: "text/plain"}),
      }),
    ]);
    chrome.runtime.sendMessage({tab, copied: true});
  } catch ({message}) {
    chrome.runtime.sendMessage({tab, copied: false, message});
  }
}

// the remaining code is run only in the extension service worker
const clear = tabId =>
  setTimeout(() => chrome.action.setBadgeText({text: "", tabId}), 1100);

function success(tabId) {
  chrome.action.setBadgeBackgroundColor({color: "green", tabId});
  chrome.action.setBadgeText({text: "✓", tabId});
  clear(tabId);
}

function failure(tabId) {
  chrome.action.setBadgeBackgroundColor({color: "red", tabId});
  chrome.action.setBadgeText({text: "✕", tabId});
  clear(tabId);
}

chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript(
    {
      target: {tabId: tab.id},
      func: copy,
      args: [tab],
    },
    () => {
      const error = chrome.runtime.lastError; // can't run this in chrome:// urls
      if (error) {
        failure(tab.id);
        console.error("Failed to copy url:", error.message);
      }
    }
  );
});

chrome.runtime.onMessage.addListener(({tab, copied, message}) => {
  if (copied) {
    success(tab.id);
  } else {
    failure(tab.id);
    console.error("Failed to copy url:", message);
  }
});
