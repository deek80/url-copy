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

export {success, failure};
