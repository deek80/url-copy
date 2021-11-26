// These functions will be executed in the active tab using chrome.scripting.executeScript

const _newCopy = async (plain, html) => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": new Blob([plain], {type: "text/plain"}),
        "text/html": new Blob([html], {type: "text/html"}),
      }),
    ]);
    return true;
  } catch {
    return false;
  }
};

const _oldCopy = (plain, html) => {
  const onCopy = e => {
    e.preventDefault();
    document.removeEventListener("copy", onCopy, true);
    e.clipboardData.clearData();
    e.clipboardData.setData("text/plain", plain);
    e.clipboardData.setData("text/html", html);
    console.log("copied!");
  };
  document.addEventListener("copy", onCopy, true);
  return document.execCommand("copy");
};

const copy = async (plain, html) => {
  const copied = navigator.clipboard
    ? await _newCopy(plain, html)
    : _oldCopy(plain, html);
  chrome.runtime.sendMessage(copied);
};

export {copy};
