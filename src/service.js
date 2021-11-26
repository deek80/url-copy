import {copy} from "./content";
import {success, failure} from "./notification";

chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: copy,
    args: [tab.url, `<a href="${tab.url}">${tab.title}</a>`],
  });
});

chrome.runtime.onMessage.addListener((copied, sender) => {
  copied ? success(sender.tab.id) : failure(sender.tab.id);
});
