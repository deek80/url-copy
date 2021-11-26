const clear = tabId => setTimeout(() => chrome.action.setBadgeText({text: "", tabId}), 1500);

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

async function copy(title, url) {
  try {
    const html = new Blob([`<a href="${url}">${title}</a>`], {type:"text/html"});
    const text = new Blob([`${title}: ${url}`], {type:"text/plain"});
    await navigator.clipboard.write([
      new ClipboardItem({
        [html.type]: html,
        [text.type]: text
      })
    ]);
    return true
  } catch(err) {
    console.error(err.name, err.message);
    return false
  }
}

chrome.action.onClicked.addListener(tab => {
  tab.id % 2 ? success(tab.id) : failure(tab.id);
  chrome.scripting.executeScript(
    {
      target: {tabId: tab.id},
      func: copy,
      args: [tab.title, tab.url]
    },
    result => {
      console.log("success?", result);
    }
  )
});
